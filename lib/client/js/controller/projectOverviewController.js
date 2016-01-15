/**
 * Created by tfru on 15.01.16.
 */

var canny = require('canny');

/*
 - main.js registers controller with trade
 - trade uses functions from module.exports to look up callback functions
 */

module.exports = {
    /**
     *
     * @param data an object with 2 properties "projects" and "directories", each listing project/directory names.
     */
    receivedProjectsAndDirectories : function(data) {
        console.log('ProjectOverviewController.receivedProjectsAndDirectories: ' + data);
        var projectOverview = canny.projectOverview;
        if ( data.hasOwnProperty('projects') && data.hasOwnProperty('directoriess')) {
            projectOverview.setProjectsAndDirectories(data.projects, data.directories);
        } else {
            console.warn('Data rcvd from server is missing expected properties ("projects", "directories")');
        }
    }
};
