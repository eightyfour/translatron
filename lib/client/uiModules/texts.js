/**
 * handles all texts
 */
var texts = (function () {
    "use strict";
    var node,
        texts = {
            whiskerUpdate :  function (fc) {
               this.triggerWhiskerUpdate = fc;
            },
            triggerWhiskerUpdate : function () {},
            projectName : ''
        };

    return {
        setTexts : function (data) {
            texts.triggerWhiskerUpdate(data);
        },
        getTexts : function () {
            return texts
        },
        add : function (elem, attr) {
            node = elem;
        },
        ready : function () {
            console.log('texts ready!');
        }
    };
}());

module.exports = texts;