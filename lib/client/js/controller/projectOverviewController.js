var canny = require('canny');

module.exports = {
    /**
     *
     * @param data an object with 2 properties "projects" and "directories", each listing project/directory names.
     */
    receivedProjectsAndDirectories : function(data) {
        console.log('ProjectOverviewController.receivedProjectsAndDirectories: ' + data);
        if (data === false) {
            console.error("Server call failed");
        } else if (data.hasOwnProperty('projects') && data.hasOwnProperty('dirs')) {
            canny.projectOverview.setProjectsAndDirectories(data.projects, data.dirs);
        } else {
            console.warn('Data rcvd from server is missing expected properties ("projects", "dirs")');
        }
    }
};
