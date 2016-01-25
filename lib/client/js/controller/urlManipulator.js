var trade = require('../trade');
/**
 * TODO handle the browser back and next button and load the correct view
 */
function processAjaxData(response, urlPath){
    document.title = response.pageTitle;
    window.history.pushState({
        "html": response.html,
        "pageTitle": response.pageTitle,
        id : response.id,
        isProject : response.isProject
    },"", urlPath);
}

window.onpopstate = function (e) {
    console.log('onpopstate', location.pathname);
    console.log('onpopstate', e.state.id);
    if (e.state.isProject) {
        trade.loadProject(e.state.id, function () {
            console.error('urlManipulator:loadProject fails for projectId:', e.state.id);
        });
    } else {
        trade.getDirectory(e.state.id, function () {
            console.log('urlManipulator:getDirectory can not load project for directory name:', e.state.id);
        });
    }
}
/**
 * just the implementation of the callbacks
 *
 * @type {{getJSON: getJSON}}
 */
module.exports = {
    onLoadProject : function (data) {
        // add the project path to the URL
        if (data.project) {
            processAjaxData({
                pageTitle : data.projectId,
                html:'',
                id : data.projectId,
                isProject : true
            }, data.projectId + '.prj');
        }
    },
    getDirectory: function (data) {
        processAjaxData({
            pageTitle : 'translatron overview',
            html:'',
            id : data.currentDirectory,
            isProject : false
        }, data.currentDirectory);
    }
};