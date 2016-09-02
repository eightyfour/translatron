/*global domOpts */
/*jslint browser: true */
var unicode = require('./unicode.js'),
    toast = require('./Toast.js'),
    canny = require('canny'),
    trade = require('./trade.js'),
    C = require('./CONST.js');

window.domOpts = window.domOpts || require('dom-opts');
// made it public - just for development
window.canny = canny;

canny.add('repeat',         require('canny/mod/repeat'));
canny.add('whisker',        require('canny/mod/whisker'));
canny.add('async',          require('canny/mod/async'));
canny.add('flowControl',    require('canny/mod/flowControl')('flowControl'));
canny.add('displayManager', require('./uiModules/displayManager.js'));
canny.add('textEditor',     require('./textEditor.js'));
canny.add('cookieManager',  require('canny-cookieManager-lib'));

canny.add('texts',                  require('./uiModules/texts.js'));
canny.add('auth',                   require('./uiModules/auth.js'));
canny.add('projectMainNavigation',  require('./uiModules/projectMainNavigation.js'));
canny.add('translationView',        require('./uiModules/translationView.js'));
canny.add('translationViewImageUpload', require('./uiModules/translationViewImageUpload.js'));
//canny.add('translationViewHeader',  require('./uiModules/translationViewHeader.js'));
canny.add('imageViewer',            require('./uiModules/imageViewer.js'));
canny.add('projectOverview',        require('./uiModules/projectOverview.js'));
canny.add('createNewProject',       require('./uiModules/createNewProject.js'));
canny.add('menuRight',              require('./uiModules/menuRight.js'));
canny.add('anchorMenu',             require('./uiModules/anchorMenu.js'));
canny.add('breadcrumb',             require('./uiModules/breadcrumb.js'));
canny.add('translationViewDescription', require('./uiModules/translationViewDescription.js'));
canny.add('upload',                 require('./uiModules/upload.js'));
canny.add('JMBFUploader',           require('./uiModules/JMBFUploader.js'));
canny.add('JsonImport',           require('./uiModules/JsonImport.js'));

trade.addController(require('./controller/projectMainNavigationController.js'));
trade.addController(require('./controller/pageHeaderController.js'));
trade.addController(require('./controller/translationViewController.js'));
trade.addController(require('./controller/textEditorController.js'));
trade.addController(require('./controller/urlManipulator.js'));
trade.addController(require('./controller/projectOverviewController.js'));
trade.addController(require('./controller/createNewProjectController.js'));
trade.addController(require('./controller/breadcrumbController.js'));
trade.addController(require('./controller/authController.js'));
trade.addController(require('./controller/menuRightController.js'));
trade.addController(require('./controller/uploadController.js'));
trade.addController(require('./controller/JMBFUploaderController.js'));
trade.addController(require('./controller/JsonImportController.js'));

canny.ready(function () {
    "use strict";
    // create websocket connection via trade
    trade.initialize(function (userObject) {

        canny.texts.setTexts({userName: userObject.name});

        if (userObject.isAdmin) {
            document.body.classList.add('isAdmin');
        }

        setInterval(function() {
            canny.async.doAjax({
                method: 'GET',
                path: location.protocol + '//' + location.host + '/touchSession'
            });
        }, C.SESSION.renewal_interval_in_ms);

    });
});


window.canny = canny;
window.domOpts = require('dom-opts');
window.unicode = unicode;
window.toast = toast;

// QUESTION: can it happen that the above call to trade.initialize (in canny.ready) finishes earlier than the next lines?
// i.e. the callback for trade.ready will never be executed? if yes: why not pass the callback already to trade.initialize?
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
            projectId : prjName ? path + '/' + prjName.replace('.prj', '') : undefined
        };
    }());

    // QUESTION: since this is working on the URL the application was loaded with and this URL can be either a directory URL
    // or a project URL: why can't we decide first what we actually have in the URL and then either call getDirectory
    // or loadProject? ANSWER: depends. if the URL points to a directory, we only have to do the getDirectory call.
    // if the URL is a project, two calls have to be made: one loadProject call and one extra getDirectory call for the
    // parent of the project (mainly for navigation component which needs to know the siblings of the project). But: take
    // care that this extra getDirectory must *not* change the state of the breadcrumb trail (that one should still show
    // the selected project)
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
});