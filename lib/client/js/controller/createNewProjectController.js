var createNewProject = require('canny').createNewProject,
    layoutManager = require('canny').layoutManager,
    trade = require('../trade');

var currentDirectory;

createNewProject.onCreateNewProject(function(projectName) {
    trade.createNewProject2(projectName, currentDirectory);
    // TBD close overlay here or in ui module? or somewhere else
    layoutManager.hideOverlay('createNewProjectView');
});

module.exports = {
    getDirectory : function(data) {
        currentDirectory = data.currentDirectory;
    }
};
