var projectOverview = require('canny').projectOverview,
    displayManager = require('canny').displayManager,
    trade = require('../trade.js'),
    uiEvents = require('../uiEventManager.js'),
    canny = require('canny'),
    toast = require('../Toast.js'),
    events = require('../events.js');

var projectOverviewController = (function() {

    var currentParentDirectory,
        currentDirectory,
        /**
         * Maps project names to projects IDs
         */
        projects,
        /**
         * Maps directory names to directory IDs
         */
        directories;

    uiEvents.addUiEventListener({
        showOverviewPage : function () {
            displayManager.show('projectsOverview');
        }
    });

    projectOverview.onParentDirectorySelected(function() {
        if (currentParentDirectory !== currentDirectory) {
            trade.getDirectory(currentParentDirectory);
        } else {
            console.log('No parent directory');
        }
    });

    projectOverview.onProjectSelected(function(projectName) {
        uiEvents.callUievent('projectSelected', projects[projectName]);
    });

    projectOverview.onDirectorySelected(function(directoryName) {
        var directoryId = directories[directoryName];
        trade.getDirectory(directoryId, function () {
            console.log('projectOverviewController:can not load project for directory name:', directoryId);
        });
    });

    projectOverview.onCreateProjectPressed(function() {
        displayManager.show('createNewProjectView');
    });

    projectOverview.onCreateDirectoryPressed(function() {
        displayManager.show('createNewDirectoryView');
    });

    projectOverview.onDeleteFolderPressed(function(dirName) {
        trade.deleteFolder(dirName, currentDirectory, function(err, dirName) {
            var toastMessage;
            if (!err) {
                projectOverview.deleteProjectListNode(dirName);
                toastMessage = 'Folder "' + dirName + '" has been deleted.';
            } else {
                toastMessage = 'There was an error: "' + err.message + '"';
            }
            toast.showMessage(toastMessage);
        });
    });

    projectOverview.onDeleteProjectPressed(function(projectName) {
        trade.deleteProject(projectName, currentDirectory, function(err, projectName) {
            var toastMessage;
            if (!err) {
                projectOverview.deleteProjectListNode(projectName);
                toastMessage = 'Project "' + projectName + '" has been deleted.';
            } else {
                toastMessage = 'There was an error: "' + err.message + '"';
            }
            toast.showMessage(toastMessage);
        });
    });

    events.addServerListener('newDirectoryCreated', function (directoryId) {
        var lastDirSepIdx = directoryId.lastIndexOf('/');
        var parentDirectory = directoryId.substring(0, lastDirSepIdx + 1);
        if (parentDirectory === currentParentDirectory) {
            var directoryName = directoryId.substring(lastDirSepIdx + 1);
            directories[directoryName] = directoryId;
            // TODO show message only if projectOverview is currently visible - but canny.flowcontrol currently does not
            // have anything to find out which view is the active one
            toast.showMessage('A new directory "' + directoryName + '" has been created by another user.');
            projectOverview.setProjectsAndDirectories(Object.keys(projects), Object.keys(directories));
        }
    });

    return {
        /**
         * Callback from the server which handles a fresh directory/projects list
         *
         * @param {{currentDirectory:string, dirs:[{name, id}], parentDirectories:[{name, id}], parentDirectory:string, projects:[{name, id}] }} data - an object with 2 properties "projects" and "directories", each listing project/directory names.
         */
        getDirectory: function (data, project) {
            console.log('ProjectOverviewController.getDirectory: ', data);
            if (data === false) {
                console.error("Server call failed");
            } else if (data.hasOwnProperty('projects') && data.hasOwnProperty('dirs')) {

                projects = {};
                data.projects.forEach(function(entry) {
                    projects[entry.name] = entry.id;
                });

                directories = {};
                data.dirs.forEach(function(entry) {
                   directories[entry.name] = entry.id;
                });

                projectOverview.setProjectsAndDirectories(Object.keys(projects), Object.keys(directories));
                currentParentDirectory = data.parentDirectory;
                currentDirectory = data.currentDirectory;

            } else {
                console.warn('Data rcvd from server is missing expected properties ("projects", "dirs")');
            }
        },
        onNewDirectoryCreated : function(data) {
            displayManager.show('projectsOverview');
            trade.getDirectory(data.directoryId, function() {
                console.log('projectOverviewController.onNewDirectoryCreated: trade callback');
            });
        }
    };
})();

module.exports = projectOverviewController;
