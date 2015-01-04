/**
 *
 */
var flag = require('./flag'),

    texts = require('./texts'),

    translationViewHeader = (function () {
        "use strict";
        var rootNode,
            fc = {
                getLangTab : function (lang) {
                    var tab = domOpts.createElement('div', null, 'tab data tpl js_' + lang),
                        langSpan = domOpts.createElement('span');
                    flag.getFlag(lang).domAppendTo(tab);
                    langSpan.innerHTML = texts.getLanguageNames(lang);
                    langSpan.domAppendTo(tab);
                    return tab
                }
            };

        return {
            showLang : function (lang) {
                // show the lang tab
                rootNode.classList.remove('c-hide_' + lang);
            },
            hideLang : function (lang) {
                rootNode.classList.add('c-hide_' + lang);
            },
            addLanguages : function (languages) {
                [].slice.call(rootNode.querySelectorAll('.tab')).forEach(function (node) {
                    rootNode.removeChild(node);
                });
                languages.forEach(function (lang) {
                    fc.getLangTab(lang).domAppendTo(rootNode);
                })
            },
            add : function (node, attr) {
                if (attr === 'main') {
                    rootNode = node;
                }
            }
        };
    }());

module.exports = translationViewHeader;