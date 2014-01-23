/*global */
/*jslint browser: true */
var canny = require('canny');
window.domOpts = require('dom-opts');


var menuBuilder = (function () {
    "use strict";

    var domOperations = {
        addNavigationMenu: function (nodeToAppend, domValue) {
            console.log('START GENERATE MENU');
            var ul = window.domOpts.createElement('ul', 'navigationMenu'), li,
                locals = {
                    da: 'Danmark',
                    de: 'Deutschland',
                    fr: 'France',
                    nl: 'Nederland',
                    en: 'United States (Default)',
                    en_GB: 'United Kingdom',
                    sv: 'Sverige',
                    es: 'Espanol'
                }, obj, a, to, from,
                path = document.location.origin + document.location.pathname,
                bundleName = window.domOpts.params.bundle,
                fromTranslation = window.domOpts.params.from || 'de',
                toTranslation = window.domOpts.params.to;

            for (obj in locals) {
                if (locals.hasOwnProperty(obj)) {

                    li = window.domOpts.createElement('li');
                    a = window.domOpts.createElement('a');

                    if (domValue === 'from') {
                        from = obj;
                        to = toTranslation;
                    } else {
                        to = obj;
                        from = fromTranslation;
                    }
                    if (to) {
                        a.setAttribute('href', path + '?bundle=' + bundleName + '&from=' + from + "&to=" + to);
                    } else {
                        a.setAttribute('href', path + '?bundle=' + bundleName + '&from=' + from);
                    }
                    a.innerText = locals[obj];
                    a.domAppendTo(li);
                    li.domAppendTo(ul);
                }
            }

            ul.domAppendTo(nodeToAppend);

        }
    };

    return {
        add : function (node, attr) {
            domOperations.addNavigationMenu(node, attr);
        }
    };
}());


canny.add('menuBuilder', menuBuilder);
