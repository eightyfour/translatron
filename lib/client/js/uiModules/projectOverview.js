var projectOverview = (function() {
    'use strict';

    var componentRootNode,
        renderProjectsAndDirectoriesList,
        onCreateProjectPressed = function() { console.warn('projectOverview.onCreateProjectPressed not set')},
        onParentDirectorySelected = function() {console.warn('projectOverview.onParentDirectorySelected not set')},
        onProjectSelected = function() { console.warn('projectOverview.onProjectSelected not set')},
        onDirectorySelected = function() { console.warn('projectOverview.onDirectorySelected not set')},
        onCreateDirectoryPressed = function() { console.warn('projectOverview.onCreateDirectoryPressed not set')};

    return {
        /**
         * Called from canny when registering components. The only component which we expect to be registered is
         * "projectOverviewContainer" (the root node of the component).
         * @param node
         * @param vars
         */
        add: function (node, attr) {
            if (componentRootNode === undefined) {
                componentRootNode = node;
            } else {
                console.warn('projectOverview:add multiple views detected - it should be registered only ones in the DOM!');
            }
        },
        /**
         * Called from canny on documentReady event.
         */
        ready: function() {

            var createProjectButtonNode = componentRootNode.querySelector('.js-createProjectButton');
            if (!createProjectButtonNode) {
                console.error('No child node with class "createProjectButton found inside "projectOverviewContainer"');
            } else {
                createProjectButtonNode.addEventListener('click', function(event) {
                    onCreateProjectPressed();
                });
            }

            var createFolderButtonNode = componentRootNode.querySelector('.js-createFolderButton');
            if (!createFolderButtonNode) {
                console.error('No child node with class "createFolderButton found inside "projectOverviewContainer"');
            } else {
                createFolderButtonNode.addEventListener('click', function(event) {
                    onCreateDirectoryPressed();
                });
            }

            var selectParentDirectoryButton = componentRootNode.querySelector('.js-selectParentDirectoryButton');
            if (!selectParentDirectoryButton) {
                console.error('No child node with class "selectParentDirectoryButton" found inside "projectOverviewContainer"');
            } else {
                selectParentDirectoryButton.addEventListener('click', function(event) {
                    onParentDirectorySelected();
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
            var projectsAndDirectories = [];

            if (!projectNames || !directoryNames) {
                return;
            } else if (!renderProjectsAndDirectoriesList) {
                console.error('renderProjectsAndDirectoriesList function has not been set, new list cannot be shown');
                return;
            }

            console.log('got projects', projectNames);
            console.log('got directories', directoryNames);

            projectNames.forEach(function(item) {
                projectsAndDirectories.push({
                    name : item.name,
                    dir : false,
                    openProjectListItem : function () {
                        console.log('project selected:', item.id);
                        if (onProjectSelected) {
                            onProjectSelected(item.id);
                        }
                    }
                });
            });
            directoryNames.forEach(function(item) {
                projectsAndDirectories.push({
                    name : item.name,
                    dir : true,
                    openProjectListItem : function() {
                        console.log('directory selected:', item.id);
                        if (onDirectorySelected) {
                            onDirectorySelected(item.id);
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
            onParentDirectorySelected = listener;
        },
        /**
         * Register a listener callback which will react to clicks on a project. The callback function should expect
         * one parameter which is the project name.
         * @param listener
         */
        onProjectSelected : function(listener) {
            onProjectSelected = listener;
        },
        /**
         * Register a listener callback which will react to clicks on a directory. The callback function should expect
         * one parameter which is the directory name.
         * @param listener
         */
        onDirectorySelected : function(listener) {
            onDirectorySelected = listener;
        },
        onCreateProjectPressed : function(func) {
            onCreateProjectPressed = func;
        },
        onCreateDirectoryPressed : function(func) {
            onCreateDirectoryPressed = func;
        }
    };
})();

module.exports = projectOverview;
