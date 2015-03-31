var fileEditor = require('canny').fileEditor,
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
 * TODO save the actual project and trigger the getJSON for updating the message bundles
 */
fileEditor.onFileSaved(function (data, obj) {
    console.log('fileEditorController:onFileSaved', obj);
    trade.saveFile(obj.id, data, function (success) {
        console.log('SAVE COMPLETE STATE:', success);
        var lang = getLanguageFromFileName(obj.name);
        if (lang) {
            // trigger language reload
            // currently it not possible to trigger only a specific language - need to ask for all
            trade.getJSON(currentProject);

            console.log('fileEditorControlleronFileSaved:', lang);

        } else if (/messages/.test(obj.name)) {
            // default message bundle without language
            console.log('fileEditorController:');
        } else {
            console.log('fileEditorController:');
            // no message bundle - maybe project JSON ?
        }
        toast.showMessage('Message bundle saved');
    });

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