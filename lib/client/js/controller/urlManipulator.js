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

/**
 * Manipulate browser history / location with given project data
 * @param data: Project related data
 */
function applyProjectData(data, project) {
    // add the project path to the URL
    if (project.name) {
        processAjaxData({
            pageTitle : project.id,
            html:'',
            id : project.id,
            isProject : true
            // to persists the links we save the id in URL - it's not human readable but links will work forever
        }, '/' + project.id + '.prj');
    }
}

uiEvents.addUiEventListener({
    anchorFocus : function (id) {
        // set the anchor to the URL
        window.history.pushState(null, null, id)
    }
});

window.onpopstate = function (e) {
//    console.log('onpopstate', e.state.id);
    if (e.state) {
        if (e.state.isProject) {
            trade.loadProject(e.state.id, function (err) {
                if (err === false)
                    console.error('urlManipulator:loadProject fails for projectId:', e.state.id)
            })
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
    onLoadProject : applyProjectData,
    onNewProjectCreated : applyProjectData,
    getDirectory: function (data) {
        processAjaxData({
            pageTitle : 'translatron overview',
            html:'',
            id : data.currentDirectory,
            isProject : false
        }, data.currentDirectory);
    }
};