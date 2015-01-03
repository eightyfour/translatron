/*global domOpts */
/*jslint browser: true */
var shoe = require('shoe'),
    dnode = require('dnode'),
    unicode = require('./unicode.js'),
    toast = require('./Toast.js'),
    canny = require('canny'),
    trade = require('./trade.js');

window.domOpts = window.domOpts || require('dom-opts');

canny.add('whisker',  require('canny/mod/whisker'));

canny.add('texts',  require('./uiModules/texts.js'));
canny.add('projectMainNavigation',  require('./uiModules/projectMainNavigation.js'));
canny.add('translationView',require('./uiModules/translationView.js'));
canny.add('translationViewHeader',require('./uiModules/translationViewHeader.js'));
canny.add('tabManager',     require('./uiModules/tabManager.js'));
canny.add('pathNavigation', require('./uiModules/pathNavigation.js'));
canny.add('fileEditor',     require('./uiModules/fileEditor.js'));
canny.add('imageViewer',    require('./uiModules/imageViewer.js'));

trade.addController(require('./controller/projectMainNavigationController.js'));
trade.addController(require('./controller/pageHeaderController.js'));
trade.addController(require('./controller/translationViewController.js'));

// register on trade ready
trade.ready(function () {
    "use strict";
    trade.getJSON(function (projectConfig) {
        console.log('getJson:', projectConfig);
    });

    console.log('TRADE READY');

    Object.keys(canny).forEach(function (key) {
        if (canny[key].hasOwnProperty("tradeReady")) {
            canny[key].tradeReady();
        }
    });

});

canny.add('flowControl', require('canny/mod/flowControl'));

window.canny = canny;
window.domOpts = require('dom-opts');
window.unicode = unicode;
window.toast = toast;

trade.ready(function () {
    "use strict";

    trade.getJSON('test', function (data) {
        console.log('Get project json:', data);
    });

    // set bundle name for only notify clients with same bundle
    canny.translationView.client.broadCast.fromBundle = canny.translationView.getBundleNameFrom();
    canny.translationView.client.broadCast.toBundle  = canny.translationView.getBundleNameTo();

    trade.setupClient(canny.translationView.client, function (id) {
        canny.translationView.client.id = id;
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
            },
            handleMissingBundle = function () {
                var bundleName = domOpts.params.bundle;
                if (!bundleName) {
                    do {
                        bundleName = prompt('Enter the translation task number:');
                    } while (!bundleName);
                    location.href = "/?bundle=" + bundleName;
                }
            };

        handleMissingBundle();
        handleFooterNavigation();
    }());
});