/**
 * handle the translation overview
 * TODO before refactor base.connection and use trade
 */
var translationView = (function () {
    "use strict";
    var node;
    return {
        add : function (elem, attr) {
            node = elem;
        },
        ready : function () {
            console.log('translationView ready!');
        }
    };
}());

module.exports = translationView;