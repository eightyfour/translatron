var projectOverview = (function() {
    'use strict';

    var projectsListNode;
    var renderProjectsAndDirectoriesList;

    return {
        /**
         * Called from canny when registering components. The only component which we expect to be registered is
         * "projectsList".
         * @param node
         * @param vars
         */
        add: function (node, vars) {
            if (node.classList.contains('projectsList')) {
                projectsListNode = node;
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
