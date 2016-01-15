/**
 * Created by tfru on 15.01.16.
 */

/*
    - is a canny module
    - will not register itself with canny
    - canny stores the components of project overview
    - canny helps uimodule to lookup components where projects, dirs must be set when controller calls
    - projectoverviewcontroller retrieves components from canny so it can call the public methods of project overview
    - public api:
        - showprojectsanddirs
            - called from callback of getJson

 */

var projectOverview = (function() {
    'use strict';

    var projectsListNode;

    return {
        add: function (node, vars) {
            if (node.classList.contains('projectsList')) {
                console.log('adding projectsList node');
                projectsListNode = node;
            }
        },
        setProjectsAndDirectories: function (projectNames, directoryNames) {
            if (!projectNames || !directoryNames || !projectsListNode) {
                return;
            }
        }
    };
})();

module.exports = projectOverview;
