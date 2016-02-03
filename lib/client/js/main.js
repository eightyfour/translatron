/*global domOpts */
/*jslint browser: true */
var unicode = require('./unicode.js'),
    toast = require('./Toast.js'),
    canny = require('canny'),
    trade = require('./trade.js');

window.domOpts = window.domOpts || require('dom-opts');
// made it public - just for development
window.canny = canny;

canny.add('repeat', require('canny/mod/repeat'));
canny.add('whisker',  require('canny/mod/whisker'));
canny.add('textEditor',  require('./textEditor.js'));

canny.add('texts',                  require('./uiModules/texts.js'));
canny.add('auth',                  require('./uiModules/auth.js'));
canny.add('layoutManager',          require('./uiModules/layoutManager.js'));
canny.add('projectMainNavigation',  require('./uiModules/projectMainNavigation.js'));
canny.add('translationView',        require('./uiModules/translationView.js'));
canny.add('translationViewHeader',  require('./uiModules/translationViewHeader.js'));
canny.add('imageViewer',            require('./uiModules/imageViewer.js'));
canny.add('projectOverview',        require('./uiModules/projectOverview.js'));
canny.add('createNewProject',       require('./uiModules/createNewProject.js'));
canny.add('breadcrumb',       require('./uiModules/breadcrumb.js'));

trade.addController(require('./controller/projectMainNavigationController.js'));
trade.addController(require('./controller/pageHeaderController.js'));
trade.addController(require('./controller/translationViewController.js'));
trade.addController(require('./controller/textEditorController.js'));
trade.addController(require('./controller/urlManipulator.js'));
trade.addController(require('./controller/projectOverviewController.js'));
trade.addController(require('./controller/createNewProjectController.js'));
trade.addController(require('./controller/breadcrumbController.js'));
trade.addController(require('./controller/authController.js'));

canny.ready(function () {
    "use strict";
    // create websocket connection via trade
    trade.initialize();
});

// register on trade ready
trade.ready(function () {
    'use strict';

    console.log('TRADE READY');

    Object.keys(canny).forEach(function (key) {
        if (canny[key].hasOwnProperty("tradeReady")) {
            canny[key].tradeReady();
        }
    });

});

canny.add('flowControl', require('canny/mod/flowControl')('flowControl'));

window.canny = canny;
window.domOpts = require('dom-opts');
window.unicode = unicode;
window.toast = toast;

trade.ready(function () {
    'use strict';
    var prj = (function getProjectNameAndPathFromURL() {
        var split = location.pathname.split('/'),
            path = location.pathname,
            prjName;
        if (/\.prj/.test(split[split.length - 1])) {
            prjName = split.splice(split.length - 1)[0];
            path = split.join('/');
        }
        if (path[0] !== '/') {
            path = '/' + path;
        }
        return {
            path : path,
            projectId : prjName ? path + '/' + prjName.replace('.prj', '') : undefined};
    }());

    // ask initial for projects and sub project
    trade.getDirectory(prj.path, function (obj) {
        // if there is a project selected then trigger the initial project load
        if (prj.projectId) {
            // this is the initial call to trigger a project load - you will get
            // the project.json and all translations
            trade.loadProject(prj.projectId, function (error) {
                // callback is only called if an error occurs
                console.error('translationViewController:loadProject fails for projectId:', prj.projectId);
            });
        }
    });



    // and load the main
    // TODO this loads the actual config of the application - should be a dedicated function (e.g. getAppConfig)
    trade.getJSON(prj.path, function (projectConfig) {
        console.log('getJson:', projectConfig);
    });

});