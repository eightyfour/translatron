var anchorMenu = require('canny').anchorMenu,
    uiEvents = require('../uiEventManager');

/**
 * Nice approach but the order is different from the DOM.
 * TODO It would be better to read the elements from the DOM
 *  1. it's easier to reinitialize if a key is renamed or created new (Y)
 *  2. the order will be same as in the DOM (Y)
 *  con: we need to wait until the DOM is rendered - otherwise elements will be missing
 *
 *  We need:
 *  * DOM render success event (the translationView controller has to throw it) (so far the controller is added after the translationController it looks like that this is not an issue)
 *  * an a if anchor is clicked (in view) event ; then also focus the correct menu right element
 *  * the right menu element interact only as scroll overview - not as anchor helper as it is right now
 *
 * @param keys
 */

anchorMenu.onSelect(function (id) {
    var dom = document.getElementById(id);
    if (dom) {
        var bodyRect = document.body.getBoundingClientRect(),
            elemRect = dom.getBoundingClientRect(),
            offset = elemRect.top - bodyRect.top;
        window.scrollTo(0, offset - 60);
        uiEvents.callUievent('anchorFocus', '#' + id);
    }
});

uiEvents.addUiEventListener({
    anchorFocus : function (id) {
        anchorMenu.focusElement(id.replace('#', ''));
    }
});

module.exports = {
    /**
     * is called if the user rename key request was successful
     * @param newKey
     * @param oldKey
     */
    renameKey : function (oldKey, newKey) {
        anchorMenu.renderMenu();
    },
    removeKey : function (key) {
        anchorMenu.renderMenu();
    },
    onCreateKey : function () {
        anchorMenu.renderMenu();
    },
    onKeyCloned : function(projectId, data) {
        anchorMenu.renderMenu();
    },
    /**
     * Will be called with the complete JSON object from a specific project
     * @param projectData
     */
    onLoadProject : function (projectData) {
        anchorMenu.renderMenu();
    }
};