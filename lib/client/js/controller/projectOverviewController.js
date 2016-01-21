var projectOverview = require('canny').projectOverview,
    trade = require('../trade.js'),
    uiEvents = require('../uiEventManager.js');

var projectOverviewController = (function() {

    var currentParentDirectory,
        /**
         * Maps project names to projects IDs
         */
        projects,
        /**
         * Maps directory names to directory IDs
         */
        directories;

    projectOverview.onParentDirectorySelected(function() {
        if (currentParentDirectory !== "/") {
            trade.getDirectory(currentParentDirectory);
        } else {
            console.log('No parent directory');
        }
    });
    projectOverview.onProjectSelected(function(projectName) {
        var projectId = projects[projectName];
        if (!projectId) {
            console.warn('There is no id for project ' + projectName);
        }
        uiEvents.callUievent('projectSelected', projectId);
    });

    projectOverview.onDirectorySelected(function(directoryName) {
        trade.getDirectory(directoryName);
    });

    return {
        /**
         *
         * @param data an object with 2 properties "projects" and "directories", each listing project/directory names.
         */
        getDirectory: function (data) {
            console.log('ProjectOverviewController.onDirectorySelected: ' + data);
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
            } else {
                console.warn('Data rcvd from server is missing expected properties ("projects", "dirs")');
            }
        }
    };
})();

module.exports = projectOverviewController;
