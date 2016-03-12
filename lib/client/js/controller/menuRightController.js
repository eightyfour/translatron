var anchorMenu = require('canny').anchorMenu;

/**
 * First just grep the id's from the view but it would be better to generate the id's from the projectData
 * TODO generate anchors from project data
 *
 * @param keys
 */
function getCategories(keys) {
    var items = [];
    [].slice.call(document.querySelectorAll('.categoryNode')).forEach(function (n) {
        var id = n.getAttribute('id');
        if (id) {
            items.push(n.getAttribute('id'))
        }
    });
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