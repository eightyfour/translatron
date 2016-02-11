var textEditor = require('canny').textEditor,
    trade = require('../trade.js'),
    toast = require('../Toast.js'),
    events = require('../events.js'),
    currentProjectId;
/**
 * returns the language or false
 * @param fileName
 * @returns {*}
 */
function getLanguageFromFileName(fileName) {
    var reg = /messages_(.*)\..*./g.exec(fileName);
    if (reg && reg.length === 2) {
        return reg[1];
    }
    return false;
}

/**
 * handle the change project description event in the view
 */
textEditor.onChange('changeProjectDescription', function (value, fc) {
    console.log('textEditorController:onChange', value);
    if (currentProjectId) {
        trade.saveProjectDescription(currentProjectId, value,
            function (success) {
                fc(true);
                console.log('textEditorController:onChange success result', success);
                toast.showMessage('Project description changed for project ' + currentProjectId);
            });
    } else {
        return false;
    }
});
/**
 * just the implementation of the callbacks
 *
 */
module.exports = {
    onLoadProject : function (projectData) {
        if (projectData.projectId) {
            currentProjectId = projectData.projectId;
        }
    }
};