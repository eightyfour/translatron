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

function computePathFromProjectId(projectId) {
    return projectId.substring(0, projectId.lastIndexOf('/'));
}

function computeProjectNameFromProjectId(projectId) {
    return projectId.substring(projectId.lastIndexOf('/'));
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
    projectSelected : function (projectName) {
        console.log('projectMainNavigationController:projectSelected Click on project', projectName);
        trade.getJSON(computePathFromProjectId(projectName), computeProjectNameFromProjectId(projectName), function (data) {
            console.log('Get project JSON:', data);
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
    createNewProject : function (data) {
        canny.projectMainNavigation.addAvailableProjects(data.project);
    },
    /**
     * Callback implementation of the getMessageBundle
     *
     * @param obj {data: Array[{key:'string', value: 'string'}], language: 'string', project: 'string'}
     */
    getMessageBundle : function (obj) {

        if (obj && availableLanguages.indexOf(obj.language) !== -1) {

            Object.keys(obj.data).forEach(function (key) {
                saveKeyToProjectMap(obj.project, obj.language, key, obj.data[key]);
            });

            if (keyValueCounter.projectMap[obj.project].langMap[obj.language]) {
                console.log('projectMainNavigationController:getMessageBundle ',  obj, keyValueCounter.projectMap[obj.project].langMap[obj.language]);
                console.log('projectMainNavigationController:getMessageBundle maxKeys are', Object.keys(keyValueCounter.projectMap[obj.project].keyMap).length);
                canny.projectMainNavigation.setNumberOfTranslationMaxKeys(Object.keys(keyValueCounter.projectMap[obj.project].keyMap).length);
                canny.projectMainNavigation.setNumberOfTranslatedLanguageKey(Object.keys(keyValueCounter.projectMap[obj.project].langMap[obj.language]).length, obj.language);
            } else {
                console.log('projectMainNavigationController:getMessageBundle get language without any keys for locale:', obj.language);
            }
        }
    },
    getJSON : function (data) {
        console.log('projectMainNavigationController:getJSON', data);

        if (data.hasOwnProperty('projects')) {
            // main project config
            availableLanguages = data.languages;
            canny.projectMainNavigation.setAvailableProjects(data.projects);
            canny.projectMainNavigation.setAvailableLanguages(data.languages);
            activateLanguages(data.languages, data.defaultLanguage);

            projectConfig = data;

            callProjectInitQueue.free();

        } else {
            // project specific config

            // reset or reinitialize or initialize the key value counter (otherwise the counter can't detect deleted keys. E.g. from the editor mode)
            keyValueCounter.projectMap[data.project] = keyValueCounter.getCountObj();

            callProjectInitQueue.ready(function () {
                canny.projectMainNavigation.setActivatedProjectLanguages(data)
            });
            // project specific config
        }
    }
};