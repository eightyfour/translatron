/*global domOpts */
/*jslint browser: true */
var shoe = require('shoe'),
    dnode = require('dnode'),
    unicode = require('./unicode.js'),
    toast = require('./Toast.js'),
    canny = require('canny'),
    trade = require('./trade.js');

window.domOpts = window.domOpts || require('dom-opts');
// made it public - just for development
window.canny = canny;

canny.add('whisker',  require('canny/mod/whisker'));

canny.add('texts',  require('./uiModules/texts.js'));
canny.add('layoutManager',  require('./uiModules/layoutManager.js'));
canny.add('initialView',    require('./uiModules/initialView.js'));
canny.add('projectMainNavigation',  require('./uiModules/projectMainNavigation.js'));
canny.add('translationView',require('./uiModules/translationView.js'));
canny.add('translationViewHeader',require('./uiModules/translationViewHeader.js'));
canny.add('tabManager',     require('./uiModules/tabManager.js'));
canny.add('pathNavigation', require('./uiModules/pathNavigation.js'));
canny.add('fileEditor',     require('./uiModules/fileEditor.js'));
canny.add('imageViewer',    require('./uiModules/imageViewer.js'));
canny.add('messagesExportOverlay',    require('./uiModules/messagesExportOverlay.js'));

trade.addController(require('./controller/messagesExportController.js'));
trade.addController(require('./controller/initialViewController.js'));
trade.addController(require('./controller/projectMainNavigationController.js'));
trade.addController(require('./controller/pageHeaderController.js'));
trade.addController(require('./controller/translationViewController.js'));

// register on trade ready
trade.ready(function () {
    "use strict";

    console.log('TRADE READY');

    Object.keys(canny).forEach(function (key) {
        if (canny[key].hasOwnProperty("tradeReady")) {
            canny[key].tradeReady();
        }
    });

});

canny.add('flowControl', require('canny/mod/flowControlInstance')('flowControl'));

window.canny = canny;
window.domOpts = require('dom-opts');
window.unicode = unicode;
window.toast = toast;

trade.ready(function () {
    "use strict";
    // TODO remove static project name
    var projectName = domOpts.params.bundle;

    if (projectName) {
        // this is the initial call to trigger a project load - you will get
        // the project.json and all message bundle keys
        trade.getJSON(projectName, function (data) {
            console.log('Get project from request parameter bundle:', data);
        });

    }

    // and load the main
    trade.getJSON(function (projectConfig) {
        console.log('getJson:', projectConfig);
    });


    console.log('REQUEST PARAMS: ' + domOpts.params);

    // setup title read from URL
    (function () {
        var handleFooterNavigation = function () {

            var footerNav = document.getElementById('fixedNavigation');

            function removeOpen() {
                footerNav.removeEventListener('mouseover', removeOpen);
                footerNav.domRemoveClass('open');
            }

            footerNav.addEventListener('mouseover', removeOpen);
            // hide automatical
            setTimeout(removeOpen, 5000);
        };

       //  handleFooterNavigation();
    }());
});