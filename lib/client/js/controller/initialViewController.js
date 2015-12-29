var initialView = require('canny').initialView,
    trade = require('../trade.js'),
    uiEvents = require('../uiEventManager.js'),
    events = require('../events.js'),
    init = false;


initialView.onProjectSelected(function (prjName) {
    console.log('Click on project', prjName);
    uiEvents.callUievent('projectSelected', prjName)
});

/**
 * server event listener
 */
events.addServerListener('newProjectWasCreated', function (projectName) {
    // TODO add project bubble
});

/**
 * just the implementation of the callbacks
 *
 * @type {{getJSON: getJSON}}
 */
module.exports = {
    createNewProject : function (data) {
        // TODO add project bubble
    },
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