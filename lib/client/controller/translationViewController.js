
var translationView = require("../uiModules/translationView.js");
/**
 * handle the translation overview
 * TODO before refactor base.connection and use trade
 */
var translationViewController = (function () {
    "use strict";
    var node;
    return {
        add : function (elem, attr) {
            node = elem;
        },
        ready : function () {
            console.log('translationViewController ready!');
        }
    };
}());

module.exports = translationViewController;