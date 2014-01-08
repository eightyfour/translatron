/*jslint browser: true */
var domready = require('domready'),
    trade = require('./trade.js'),
    fileEditor = require('./cannymods/fileEditor.js'),
    pathNavigation = require('./cannymods/pathNavigation.js'),
    imageViewer = require('./cannymods/imageViewer.js'),
    tabManager = require('./cannymods/tabManager.js');
window.domOpts = window.domOpts || require('dom-opts');


var canny = (function () {
    "use strict";

    var modules = {};
    // register modules with own id
    modules[pathNavigation.canny.id] = pathNavigation;
    modules[fileEditor.canny.id] = fileEditor;
    modules[imageViewer.canny.id] = imageViewer;
    modules[tabManager.canny.id] = tabManager;


    return {
        init : function () {
            var cannyChildren = [].slice.call(document.querySelectorAll('[canny]'));
            cannyChildren.forEach(function (node) {
                var attribute = node.getAttribute('canny');
                if (modules.hasOwnProperty(attribute)) {
                    modules[attribute].canny.initDom(node);
                }
            });
        },
        mod : modules
    };
}());

trade.ready(function () {
    "use strict";
    canny.init();
});


module.exports = canny;
