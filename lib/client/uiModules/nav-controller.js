/*global */
/*jslint browser: true*/

var canny = require('canny');

/**
 * E.g.: gd-module="flowControl" gd-attr="{'view' : 'viewToShow'}"
 *
 * you can activate a initial view with a anchor in the URL e.g.: yourdomain.html#viewToShow
 * Or pass a comma separated module list for activate more module #viewToShow,otherView
 *
 * TODO made it possible to summarize views with one identifier.
 * Instead of call: gdom.flowControl.show('view1', 'view2', 'view3') call gdom.flowControl.show('view').
 */
var navController = (function () {
    "use strict";

    var modViews = {
        showResourceBundleEditor : function () {
            // reload the page because the files are not synced
            location.reload();
        },
        showFileEditor : function () {
            alert('This mode is only developers. Keep in mind that the file changes you made are not synced to the other clients.');
            canny.flowControl.show('fileManager');
        },
        createNewProject : function () {
            var bundle = prompt("Please enter the Task number:");
            if (bundle) {
                location.href = '/?bundle=' + bundle;
            }
        }
    };

    return {
        mod : modViews, // part of api
        ready : function () {
            console.log('nav-controller ready event');
        },
        add : function (node, attr) {    // part of api
            if (modViews.hasOwnProperty(attr)) {
                node.setAttribute('href', '#');
                node.addEventListener('click', modViews[attr]);
            } else {
                console.log('LINK NOT IMPLEMENTED');
            }
        }
    };
}());

module.exports =  navController;