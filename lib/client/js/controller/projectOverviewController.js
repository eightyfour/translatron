var projectOverview = require('canny').projectOverview,
    trade = require('../trade.js'),
    uiEvents = require('../uiEventManager.js');

var projectOverviewController = (function() {

    var currentParentDirectory;

    projectOverview.onParentDirectorySelected(function() {
        if (currentParentDirectory !== "/") {
            trade.getDirectory(currentParentDirectory);
        } else {
            console.log('No parent directory');
        }
    });
    projectOverview.onProjectSelected(function(projectName) {
        uiEvents.callUievent('projectSelected', projectName);
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
                projectOverview.setProjectsAndDirectories(data.projects, data.dirs);
                currentParentDirectory = data.parentDirectory;
            } else {
                console.warn('Data rcvd from server is missing expected properties ("projects", "dirs")');
            }
        }
    };
})();

module.exports = projectOverviewController;
