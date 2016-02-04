var canny = require('canny'),
    domOpts = require('dom-opts'),
    trade = require('../trade.js'),
    events = require('../events.js'),
    uiEvents = require('../uiEventManager.js'),
    keyValueCounter = {
        projectMap : {},
        getCountObj : function () {
            return {
                keyMap : {}, // just collect all unique keys for getting total number of existing keys
                langMap : {}   // save for each language all "valid" keys
            }
        }
    },
    projectConfig = {},
    availableLanguages = [];

canny.projectMainNavigation.onLanguageSelect(function (obj) {
    var eventName;
    if (obj.isActive) {
         eventName = obj.isInactive ? 'deActivateLanguage' : 'activateLanguage';
         uiEvents.callUievent(eventName, obj.language);
    } else {
         uiEvents.callUievent('addLanguage', obj.language);
    }
    console.log('Click on language', obj);
});

/**
 * server event listener
 */
events.addServerListener('newProjectWasCreated', function (projectName) {
    toast.showMessage('A new project with name: "' + projectName + '" was created.');
    canny.projectMainNavigation.addAvailableProjects(projectName);
});
/**
 * server event listener
 */
events.addServerListener('updateKey', function (bundleObj, data) {
    if (bundleObj.bundle === projectConfig.project) {
        updateKeyToProjectMap(bundleObj.bundle, bundleObj.locale, data.key, data.value);
        console.log('projectMainNavigationController:updateKey', bundleObj, data);
    }
});
/**
 * server event listener
 */
events.addServerListener('keyRemoved', function (bundleName, obj) {
    if (bundleName === projectConfig.project) {
        console.log('projectMainNavigationController:keyRenamed', bundleName, obj);
        // TODO update the statistics...
    }
});

/**
 * if from and to in the request disable all except the languages in the request params
 * if only from in the URL enable only from and disable all others
 * @param langs
 */
function activateLanguages(langs, defaultLanguage) {
    var from = domOpts.params.from || defaultLanguage, to = domOpts.params.to;
    if (from) {
        langs.forEach(function (lang) {
            if (lang !== from && (!to || lang !== to)) {
                uiEvents.callUievent('deActivateLanguage', lang);
            }
        });
    }
}
/**
 *
 * @param projectName
 * @param lang
 * @param key
 * @param value
 */
function saveKeyToProjectMap(projectName, lang, key, value) {

    // just collect all keys (only the unique keys are relevant)
    if (keyValueCounter.projectMap[projectName] === undefined) {
        console.log('projectMainNavigationController:saveKeyToProjectMap project name not exists:', projectName);
        keyValueCounter.projectMap[projectName] = keyValueCounter.getCountObj();
    }

    keyValueCounter.projectMap[projectName].keyMap[key] = true;
    if (keyValueCounter.projectMap[projectName].langMap[lang] === undefined) {
        keyValueCounter.projectMap[projectName].langMap[lang] = {};
    }
    // only save the keys as object if it is a valid key otherwise delete it
    if (value) {
        keyValueCounter.projectMap[projectName].langMap[lang][key] = true;
    } else if (keyValueCounter.projectMap[projectName].langMap[lang][key]) {
        // if this key exists than remove it
        delete keyValueCounter.projectMap[projectName].langMap[lang][key];
    }
}

function updateKeyToProjectMap(projectName, lang, key, value) {
    saveKeyToProjectMap(projectName, lang, key, value);
    canny.projectMainNavigation.setNumberOfTranslatedLanguageKey(Object.keys(keyValueCounter.projectMap[projectName].langMap[lang]).length, lang);
    canny.projectMainNavigation.setNumberOfTranslationMaxKeys(Object.keys(keyValueCounter.projectMap[projectName].keyMap).length);
}

// register listener function to the ui events
uiEvents.addUiEventListener({
    /**
     * the internal updateKey event - the server will not trigger the updateKey for the own client
     */
    updateKey : function (projectName, lang, key, value) {
        console.log('projectMainNavigationController:updateKey', projectName, lang, key, value);
        updateKeyToProjectMap(projectName, lang, key, value);
    },
    projectSelected : function (projectId) {
        console.log('projectMainNavigationController:projectSelected Click on project', projectId);
        trade.loadProject(projectId, function (data) {
            // callback is only called if an error occurs
            console.error('projectMainNavigationController:loadProject fails for projectId:', projectId);
        });
    },
    activateLanguage : function (lang) {
        canny.projectMainNavigation.activateLang(lang);
    },
    deActivateLanguage : function (lang) {
        canny.projectMainNavigation.deActivateLang(lang);
    },
    addLanguage : function (lang) {
        canny.projectMainNavigation.activateLang(lang);
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
 * the implementation of the callbacks
 * @type {{getJSON: getJSON}}
 */
module.exports = {
    onNewProjectCreated : function (data) {
        canny.projectMainNavigation.addAvailableProjects(data.project);
        // TODO do the same here as in onLoadProject?
    },
    /**
     * Callback implementation of the onLoadProject
     *
     * @param projectData (see project JSON file)
     */
    onLoadProject : function (projectData) {

        callProjectInitQueue.ready(function () {

            canny.projectMainNavigation.setAvailableLanguages(projectData.availableLanguages);
            // what about "activateLanguages(data.languages, data.defaultLanguage);"?

            canny.projectMainNavigation.setActivatedProjectLanguages(projectData);

            Object.keys(projectData.keys).forEach(function (lang) {
                if (Object.keys(projectData.keys[lang]).length > 0 && availableLanguages.indexOf(lang) !== -1) {

                    Object.keys(projectData.keys[lang]).forEach(function (key) {
                        saveKeyToProjectMap(projectData.project, lang, key, projectData.keys[lang][key]);
                    });

                    if (keyValueCounter.projectMap[projectData.project].langMap[lang]) {
                        console.log('projectMainNavigationController:onLoadProject ', keyValueCounter.projectMap[projectData.project].langMap[lang]);
                        console.log('projectMainNavigationController:onLoadProject maxKeys are', Object.keys(keyValueCounter.projectMap[projectData.project].keyMap).length);
                        canny.projectMainNavigation.setNumberOfTranslationMaxKeys(Object.keys(keyValueCounter.projectMap[projectData.project].keyMap).length);
                        canny.projectMainNavigation.setNumberOfTranslatedLanguageKey(Object.keys(keyValueCounter.projectMap[projectData.project].langMap[lang]).length, lang);
                        // TODO refactor this and make one call ;)
                        canny.projectMainNavigation.activateLang(lang);
                        canny.projectMainNavigation.deActivateLang(lang);
                    } else {
                        console.log('projectMainNavigationController:onLoadProject get language without any keys for locale:', lang);
                    }
                }
            });

            // reset or reinitialize or initialize the key value counter (otherwise the counter can't detect deleted keys. E.g. from the editor mode)
            keyValueCounter.projectMap[projectData.project] = keyValueCounter.getCountObj();
            // show default language as selected language in menu
            // TODO check who decides to show which language as default - and then call this event from there
            uiEvents.callUievent('activateLanguage', projectData.defaultLanguage);
        });

        // TBD this call here does not make sense, i think. all the logic in the callback above should be able to execute
        // directly now (because there are no longer 2 events (onLoadProject + getJson)
        callProjectInitQueue.free();
    },
    getDirectory: function (data) {
        if (data.projects) {
            canny.projectMainNavigation.setAvailableProjects(data.projects);
        }
    }
};