/**
 * handles all texts
 */
var texts = (function () {
    'use strict';
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
            changeTexts :  function () {},
            data : {
                projectName: '',
                projectDescription: ''
            }
        };

    return {
        getLanguageNames : function (key) {return languageNames[key]},
        setTexts : function (data) {
            texts.changeTexts('msg', data);
        },
        getTexts : function (fc) {
            console.log('texts:yes text is triggered');
            texts.changeTexts = fc;
            texts.changeTexts('msg', texts.data);
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