var createNewProject = require('canny').createNewProject,
    layoutManager = require('canny').layoutManager,
    trade = require('../trade');

var currentDirectory;

createNewProject.onCreateNewProject(function(projectName) {
    trade.createNewProject(projectName, currentDirectory);
    layoutManager.hideOverlay('createNewProjectView');
});

createNewProject.onCreateNewDirectoy(function(directoryName) {
    trade.createNewDirectory(directoryName, currentDirectory);
    layoutManager.hideOverlay('createNewDirectoryView');
});

module.exports = {
    // TODO introduce new event: onDirectoryChanged - because a "getDirectory" event does not really explain what's
    // happening here
    getDirectory : function(data) {
        currentDirectory = data.currentDirectory;
    }
};
