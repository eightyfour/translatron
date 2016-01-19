var layoutManager = require('./layoutManager.js');

var projectOverview = (function() {
    'use strict';

    var componentRootNode,
        projectsListNode;
    var renderProjectsAndDirectoriesList;

    var parentDirectorySelectedHandler,
        projectSelectedHandler,
        directorySelectedHandler;

    return {
        /**
         * Called from canny when registering components. The only component which we expect to be registered is
         * "projectOverviewContainer" (the root node of the component).
         * @param node
         * @param vars
         */
        add: function (node, vars) {
            if (node.classList.contains('projectOverviewContainer')) {
                componentRootNode = node;
            }
        },
        /**
         * Called from canny on documentReady event.
         */
        ready: function() {
            projectsListNode = componentRootNode.querySelector('.projectsList');
            if (!projectsListNode) {
                console.error('No child node with class "projectsList" found inside "projectOverviewContainer"');
            }

            var createProjectButtonNode = componentRootNode.querySelector('.createProjectButton');
            if (!createProjectButtonNode) {
                console.error('No child node with class "createProjectButton found inside "projectOverviewContainer"');
            } else {
                createProjectButtonNode.addEventListener('click', function(event) {
                    // TODO introduce register callback function
                    console.log('createProject clicked');
                    canny.layoutManager.showOverlay('createNewProjectView');
                });
            }

            var createFolderButtonNode = componentRootNode.querySelector('.createFolderButton');
            if (!createFolderButtonNode) {
                console.error('No child node with class "createFolderButton found inside "projectOverviewContainer"');
            } else {
                createFolderButtonNode.addEventListener('click', function(event) {
                    // TODO introduce register callback function
                    console.log('createFolder clicked');
                });
            }

            var selectParentDirectoryButton = componentRootNode.querySelector('.selectParentDirectoryButton');
            if (!selectParentDirectoryButton) {
                console.error('No child node with class "selectParentDirectoryButton" found inside "projectOverviewContainer"');
            } else {
                selectParentDirectoryButton.addEventListener('click', function(event) {
                    parentDirectorySelectedHandler();
                });
            }
        },
        /**
         * Inform the ui module about the new current set of directories and projects to list. This will also trigger
         * a new rendering of the projects list with the new content.
         * @param projectNames
         * @param directoryNames
         */
        setProjectsAndDirectories: function (projectNames, directoryNames) {
            if (!projectNames || !directoryNames || !projectsListNode) {
                return;
            } else if (!renderProjectsAndDirectoriesList) {
                console.error('renderProjectsAndDirectoriesList function has not been set, new list cannot be shown');
                return;
            }

            console.log('got projects "' + projectNames + '", directories "' + directoryNames);
            var projectsAndDirectories = [];
            projectNames.forEach(function(item) {
                projectsAndDirectories.push({
                    name : item,
                    type : 'P',
                    openProjectListItem : function () {
                        console.log('project ' + item + ' selected');
                        if (projectSelectedHandler) {
                            projectSelectedHandler(item);
                        }
                    }
                });
            });
            directoryNames.forEach(function(item) {
                projectsAndDirectories.push({
                    name : item,
                    type : 'D',
                    openProjectListItem : function() {
                        console.log('directory' + item + ' selected');
                        if (directorySelectedHandler) {
                            directorySelectedHandler(item);
                        }
                    }
                });
            });

            renderProjectsAndDirectoriesList(projectsAndDirectories);
        },
        /**
         * For canny-repeat registered on the projects list, provide the function for rendering the list.
         * @param func a function which will set the list of projects and directories.
         */
        setRenderProjectsAndDirectoriesListFunction : function(func) {
            renderProjectsAndDirectoriesList = func;
        },
        /**
         * Register a listener callback which will react to "to parent directory" event.
         * @param listener
         */
        onParentDirectorySelected : function(listener) {
            parentDirectorySelectedHandler = listener;
        },
        /**
         * Register a listener callback which will react to clicks on a project. The callback function should expect
         * one parameter which is the project name.
         * @param listener
         */
        onProjectSelected : function(listener) {
            projectSelectedHandler = listener;
        },
        /**
         * Register a listener callback which will react to clicks on a directory. The callback function should expect
         * one parameter which is the directory name.
         * @param listener
         */
        onDirectorySelected : function(listener) {
            directorySelectedHandler = listener;
        }
    };
})();

module.exports = projectOverview;