var createNewProject = require('canny').createNewProject,
    layoutManager = require('canny').layoutManager,
    trade = require('../trade');

var currentDirectory;

createNewProject.onCreateNewProject(function(projectName) {
    trade.createNewProject(projectName, currentDirectory);
    layoutManager.hideOverlay('createNewProjectView');
});

module.exports = {
    // TODO introduce new event: onDirectoryChanged
    getDirectory : function(data) {
        currentDirectory = data.currentDirectory;
    }
};
