var anchorMenu = require('canny').anchorMenu,
    bundleHelper = require('../util/bundleHelper');

/**
 * Nice approach but the order is different from the DOM.
 * TODO It would be better to read the elements from the DOM
 *  1. it's easier to reinitialize if a key is renamed or created new
 *  2. the order will be same as in the DOM
 *  con: we need to wait until the DOM is rendered - otherwise elements will be missing
 *
 *  We need:
 *  * DOM render success event (the translationView controller has to throw it)
 *  * an a if anchor is clicked (in view) event ; then also focus the correct menu right element
 *  * the right menu element interact only as scroll overview - not as anchor helper as it is right now
 *
 * @param keys
 */
function getCategories(keys) {
    var items = bundleHelper.getCategoryNamesFromKeys(keys);
//    [].slice.call(document.querySelectorAll('.categoryNode')).forEach(function (n) {
//        var id = n.getAttribute('id');
//        if (id) {
//            items.push(n.getAttribute('id'))
//        }
//    });
    return items;
}

anchorMenu.onSelect(function (id) {
    var dom = document.getElementById(id);
    if (dom) {
//        var bodyRect = document.body.getBoundingClientRect(),
//            elemRect = dom.getBoundingClientRect(),
//            offset = elemRect.top - bodyRect.top;
//        window.scrollTo(0, offset);
        window.location = '#' + id;
    }
});

module.exports = {
    /**
     * is called if the user rename key request was successful
     * @param newKey
     * @param oldKey
     */
    renameKey : function (oldKey, newKey) {

    },
    removeKey : function (key) {

    },
    /**
     * Will be called with the complete JSON object from a specific project
     * @param projectData
     */
    onLoadProject : function (projectData) {
        anchorMenu.addCategories(getCategories(projectData.keys));
    }
};