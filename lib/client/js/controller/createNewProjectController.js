var createNewProject = require('canny').createNewProject,
    displayManager = require('canny').displayManager,
    trade = require('../trade');

var currentDirectory;

createNewProject.onCreateNewProject(function(projectName) {
    trade.createNewProject(projectName, currentDirectory);
    displayManager.hide('createNewProjectView');
});

createNewProject.onCreateNewDirectoy(function(directoryName) {
    trade.createNewDirectory(directoryName, currentDirectory);
    displayManager.hide('createNewDirectoryView');
});

module.exports = {
    // TODO introduce new event: onDirectoryChanged - because a "getDirectory" event does not really explain what's
    // happening here
    getDirectory : function(data) {
        currentDirectory = data.currentDirectory;
    }
};
