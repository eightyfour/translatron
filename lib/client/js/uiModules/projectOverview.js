var projectOverview = (function() {
    'use strict';

    var componentRootNode,
        projectsListNode;
    var renderProjectsAndDirectoriesList;

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
                    console.log('createProject clicked');
                });
            }

            var createFolderButtonNode = componentRootNode.querySelector('.createFolderButton');
            if (!createFolderButtonNode) {
                console.error('No child node with class "createFolderButton found inside "projectOverviewContainer"');
            } else {
                createFolderButtonNode.addEventListener('click', function(event) {
                    console.log('createFolder clicked');
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
            }
            console.log('got projects "' + projectNames + '", directories "' + directoryNames);
            var projectsAndDirectories = [];
            projectNames.forEach(function(item) {
                projectsAndDirectories.push({
                    'name' : item,
                    'type' : 'P'
                });
            });
            directoryNames.forEach(function(item) {
                projectsAndDirectories.push({
                    'name' : item,
                    'type' : 'D'
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
        }
    };
})();

module.exports = projectOverview;
