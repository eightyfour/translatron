var canny = require('canny'),
    domOpts = require('dom-opts'),
    uiEvents = require('../uiEventManager.js');

canny.projectMainNavigation.onLanguageSelect(function (obj) {
    var eventName;
    if (obj.isActive) {
        eventName = obj.isInactive ? 'deActivateLanguage' : 'activateLanguage';
        uiEvents.callUievent(eventName, obj.language);
    }
    console.log('Click on language', obj);
});

/**
 * if from and to in the request disable all except the languages in the request params
 * @param langs
 */
function activateLanguages(langs, defaultLanguage) {
    var from = domOpts.params.from || defaultLanguage, to = domOpts.params.to;
    if (from && to) {
        langs.forEach(function (lang) {
            if (lang !== from && lang !== to) {
                uiEvents.callUievent('deActivateLanguage', lang);
            }
        });
    }
}

// register listener function to the ui events
uiEvents.addUiEventListener({
    activateLanguage : function (lang) {
        canny.projectMainNavigation.activateLang(lang);
    },
    deActivateLanguage : function (lang) {
        canny.projectMainNavigation.deActivateLang(lang);
    }
});

/**
 * just the implementation of the callbacks
 *
 * @type {{getJSON: getJSON}}
 */
module.exports = {
    getJSON : function (data) {
        if (data.hasOwnProperty('projects')) {
            // main project config
            canny.projectMainNavigation.setAvailableProjects(data.projects);
            canny.projectMainNavigation.setAvailableLanguages(data.languages);

            activateLanguages(data.languages, data.defaultLanguage);
        } else {
            canny.projectMainNavigation.setActivatedProjectLanguages(data);
            // project specific config
        }
    }
};