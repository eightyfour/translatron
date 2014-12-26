/*global domOpts */
/*jslint browser: true */
var shoe = require('shoe'),
    dnode = require('dnode'),
    unicode = require('./unicode.js'),
    toast = require('./Toast.js'),
    canny = require('canny'),
    trade = require('./trade.js');

window.domOpts = window.domOpts || require('dom-opts');
// TODO REMOVE THIS IS JUST FOR TESTING
window.trade = trade;


canny.add('navController',  require('./uiModules/nav-controller.js'));
canny.add('translationView',require('./uiModules/translationView.js'));
canny.add('menuBuilder',    require('./uiModules/menu-builder.js'));
canny.add('tabManager',     require('./uiModules/tabManager.js'));
canny.add('pathNavigation', require('./uiModules/pathNavigation.js'));
canny.add('fileEditor',     require('./uiModules/fileEditor.js'));
canny.add('imageViewer',    require('./uiModules/imageViewer.js'));

// register on trade ready
trade.ready(function () {
    "use strict";

    console.log('TRADE READY');

    Object.keys(canny).forEach(function (key) {
        if (canny[key].hasOwnProperty("tradeReady")) {
            canny[key].tradeReady();
        }
    });

    trade.getJSON('test/project.json');
});

canny.add('flowControl', require('canny/mod/flowControl'));

window.canny = canny;
window.domOpts = require('dom-opts');
window.unicode = unicode;
window.toast = toast;

trade.ready(function () {
    "use strict";
    var sortByKey = function (a, b) {
        if (a.key < b.key) {return -1; }
        if (a.key > b.key) {return 1; }
        return 0;
    },
    bundleFrom = canny.translationView.getBundleNameFrom(),
    bundleTo = canny.translationView.getBundleNameTo();

    // set bundle name for only notify clients with same bundle
    canny.translationView.client.broadCast.fromBundle = canny.translationView.getBundleNameFrom();
    canny.translationView.client.broadCast.toBundle  = canny.translationView.getBundleNameTo();

    trade.setupClient(canny.translationView.client, function (id) {
        canny.translationView.client.id = id;
    });

    if (bundleFrom) {
        trade.getMessageBundle(bundleFrom, function (s) {
            var obj = JSON.parse(s),
                sorted;
            if (obj) {
                sorted = obj.data.sort(sortByKey);
                canny.translationView.printBundleTemplate(sorted);

                if (bundleTo) {
                    trade.getMessageBundle(bundleTo, function (s) {
                        var obj = JSON.parse(s);
                        if (obj) {
                            canny.translationView.printBundleTranslation(obj.data);
                        }
                        canny.translationView.printCreateNewBundle();
                    });
                } else {
                    canny.translationView.printCreateNewBundle();
                }
            } else {
                canny.translationView.printCreateNewBundle();
            }
        });
    } else {
        console.log('Do nothing?');
    }

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
            setupTitle = function () {
                var titleTextTranslation = document.getElementById('titleTextTranslation');
                titleTextTranslation.style.display = 'none';

                // setup table title
                if (domOpts.params.bundle) {
                    document.getElementById('title').innerText = 'Task name: ' + domOpts.params.bundle;
                }
                document.getElementById('titleText').innerText = 'Text (' + canny.translationView.getFromParam() + ')';
                if (domOpts.params.to) {
                    titleTextTranslation.innerText = 'Text (' + domOpts.params.to + ')';
                    titleTextTranslation.style.display = '';
                }
            },
            handleMissingBundle = function () {
                var bundleName = domOpts.params.bundle;
                if (!bundleName) {
                    do {
                        bundleName = prompt('Enter the translation task number:');
                    } while (!bundleName);
                    location.href = "/?bundle=" + bundleName;
                } else {
                    setupTitle();
                }
            };

        handleMissingBundle();
        handleFooterNavigation();
    }());
});