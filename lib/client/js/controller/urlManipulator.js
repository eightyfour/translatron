var trade = require('../trade'),
    uiEvents = require('../uiEventManager'),
    url = require('../util/url');
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
    },"", urlPath + url.getAnchor());
}

window.onpopstate = function (e) {
    console.log('onpopstate', location.pathname);
//    console.log('onpopstate', e.state.id);
    if (e.state) {
        if (e.state.isProject) {
            trade.loadProject(e.state.id, function () {
                console.error('urlManipulator:loadProject fails for projectId:', e.state.id);
            });
        } else {
            trade.getDirectory(e.state.id, function (err) {
                if (err !== false) {
                    // TODO call the
                    uiEvents.callUievent('showOverviewPage');
                } else {
                    console.log('urlManipulator:getDirectory can not load project for directory name:', e.state.id);
                }
            });
        }
    }
}
/**
 * TODO there is a problem with activating the project view or the overview page...
 *
 * just the implementation of the callbacks
 *
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