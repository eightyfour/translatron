var canny = require('canny'),
    domOpts = require('dom-opts'),
    trade = require('../trade.js'),
    uiEvents = require('../uiEventManager.js');

canny.projectMainNavigation.onLanguageSelect(function (obj) {
    var eventName;
    if (obj.isActive) {
        eventName = obj.isInactive ? 'deActivateLanguage' : 'activateLanguage';
        uiEvents.callUievent(eventName, obj.language);
    }
    console.log('Click on language', obj);
});

canny.projectMainNavigation.onProjectSelect(function (projectName) {
    console.log('Click on project', projectName);
    trade.getJSON(projectName, function (data) {
        console.log('Get project json:', data);
    });
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
 * sometimes the specific project config is provided faster as the main project config.
 */
var callProjectInitQueue = (function () {
    var waitForMainConfigQueue = [];
    return {
        free : function () {
            waitForMainConfigQueue.forEach(function (fc) {
                fc();
            });
            waitForMainConfigQueue = null;
        },
        ready : function (fc) {
            if (waitForMainConfigQueue !== null) {
                waitForMainConfigQueue.push(fc);
            } else {
                fc();
            }
        }
   }
}());
/**
 * just the implementation of the callbacks
 * @type {{getJSON: getJSON}}
 */
module.exports = {
    getJSON : function (data) {
        console.log('projectMainNavigationController:getJSON', data);
        if (data.hasOwnProperty('projects')) {
            // main project config
                canny.projectMainNavigation.setAvailableProjects(data.projects);
                canny.projectMainNavigation.setAvailableLanguages(data.languages);
                activateLanguages(data.languages, data.defaultLanguage);

                callProjectInitQueue.free();

        } else {
            callProjectInitQueue.ready(function () {
                canny.projectMainNavigation.setActivatedProjectLanguages(data)
            });
            // project specific config
        }
    }
};