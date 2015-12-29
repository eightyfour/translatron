var textEditor = require('canny').textEditor,
    trade = require('../trade.js'),
    toast = require('../Toast.js'),
    events = require('../events.js'),
    currentProject;
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
    if (currentProject) {
        trade.saveJSON(currentProject,
            {description : value},
            true,
            function (success) {
                fc(true);
                console.log('textEditorController:onChange success result', success);
                toast.showMessage('Project description changed for project ' + currentProject);
            });
    } else {
        return false;
    }
});
/**
 * just the implementation of the callbacks
 *
 * @type {{getJSON: getJSON}}
 */
module.exports = {
    getJSON : function (data) {
        if (data.project) {
            currentProject = data.project;
        }
    }
};