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
textEditor.onChange(function (id, value, fc) {
    console.log('textEditorController:onChange', value);
    if (currentProjectId) {
        if (!id) {
            // TODO to keep backward functionality this is the "main" project description - will be changed in future
            id = '__description';
        }
        // TODO remove the tv_ from the id
        trade.saveProjectDescription(currentProjectId, id, value, function (success) {
            if (success) {
                fc(true);
                toast.showMessage('Project description changed for project ' + currentProjectId);
            } else {
                fc(false);
            }
        });
    }
});
/**
 * just the implementation of the callbacks
 *
 */
module.exports = {
    onLoadProject : function (data, {id, name, url}) {
        if (id) currentProjectId = id
    }
};