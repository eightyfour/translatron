var initialView = require('canny').initialView,
    trade = require('../trade.js'),
    init = false;


initialView.onProjectSelected(function (prjName) {
    console.log('Click on project', prjName);
    trade.getJSON(prjName, function (data) {
        console.log('Get project json:', data);
    });
});
/**
 * just the implementation of the callbacks
 *
 * @type {{getJSON: getJSON}}
 */
module.exports = {
    getJSON : function (data) {
        // main project config
        if (!init && data && data.hasOwnProperty('projects')) {
            init = true;
            initialView.addProjects(data.projects);
            initialView.show();
        } else if (!data) {
            console.error('There is no project json file');
            initialView.show();
        }
    }
};