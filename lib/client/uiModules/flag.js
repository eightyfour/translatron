/**
 * handles all texts
 */
var domOpts = require('dom-opts'),
    flagMap = {
        da: 'dk',
        de: 'de',
        fr: 'fr',
        nl: 'nl',
        en: 'us',
        en_GB: 'gb',
        sv: 'se',
        es: 'es'
    };

module.exports = {
    getFlag : function (lang) {
        var flagLang = lang;
        if (flagMap.hasOwnProperty(lang)) {
            flagLang = flagMap[lang];
        }
        return domOpts.createElement('span', null, 'flag-icon flag-icon-' + flagLang);
    }
};