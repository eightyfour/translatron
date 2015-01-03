/**
 * handles all texts
 */
var texts = (function () {
    "use strict";
    var node,
        languageNames = {
            da: 'Danmark',
            de: 'Deutschland',
            fr: 'France',
            nl: 'Nederland',
            en: 'United States (Default)',
            en_GB: 'United Kingdom',
            sv: 'Sverige',
            es: 'Espanol'
        },
        texts = {
            whiskerUpdate :  function (fc) {
               this.triggerWhiskerUpdate = fc;
            },
            triggerWhiskerUpdate : function () {},
            projectName : ''
        };

    return {
        getLanguageNames : function (key) {return languageNames[key]},
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