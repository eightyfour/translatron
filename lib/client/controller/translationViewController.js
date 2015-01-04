
var translationView = require("canny").translationView,
    translationViewHeader = require("canny").translationViewHeader,
    domOpts = require('dom-opts'),
    uiEvents = require('../uiEventManager.js'),
    events = require('../events.js'),
    trade = require('../trade.js'),
    sortByKey = function (a, b) {
        if (a.key < b.key) {return -1; }
        if (a.key > b.key) {return 1; }
        return 0;
    },
    projectConfig,
    availableLanguages = [],
    collectKeysMap = {}; // saves all keys which added by the getMessageBundle method

/**
 * Read the from param as default language otherwise take it from the project.json
 * @param config
 */
function saveProjectConfig(config) {
    var idx, defaultLanguage = domOpts.params.from ? domOpts.params.from : config.defaultLanguage;
    projectConfig = config;
    availableLanguages = Object.keys(projectConfig.languages);
    idx = availableLanguages.indexOf(defaultLanguage);
    if (idx !== -1 && idx !== 0) {
        // move default to the begin of the list
        availableLanguages.splice(0, 0, availableLanguages.splice(idx, 1)[0]);
    }
}

/**
 * TODO replace bundle with locale and refactor the calls from translationView
 */
translationView.onAddNewKey(function (lang, key, value, cb) {
    console.log('translationViewController:onAddNewKey', [].slice.call(arguments));
    trade.sendResource({
        bundle: projectConfig.project,
        locale: lang
    }, {
        key: key,
        value: value
    }, function (key) {
        cb(key)
    });
});

/**
 * TODO replace bundle with locale and refactor the calls from translationView
 */
translationView.onSaveValue(function (lang, key, value, cb) {
    console.log('translationViewController:onSaveValue', [].slice.call(arguments));
    trade.sendResource({
        bundle: projectConfig.project,
        locale: lang
    }, {
        key: key,
        value: value
    }, function (key) {
        cb(key)
    });
});

//translationView.onRenameKey(function (oldKey, newKey) {
//   TODO implement a rename key method
//});

// register listener function to the ui events
uiEvents.addUiEventListener({
    activateLanguage : function (lang) {
        translationViewHeader.showLang(lang);
        translationView.showLang(lang);
    },
    deActivateLanguage : function (lang) {
        translationViewHeader.hideLang(lang);
        translationView.hideLang(lang);
    },
    // TODO  don't trigger it twice for the same language
    addLanguage : function (lang) {
        availableLanguages.push(lang);
        translationView.addLanguage(Object.keys(collectKeysMap), lang);
        translationViewHeader.showLang(lang);
        translationView.showLang(lang);
    }
});

/**
 *
 */
events.addServerListener('updateKey', function (bundleObj, data) {
    collectKeysMap[data.key] = undefined; // save the key
    // TODO check if the incoming message matched with my project - if not than fix this on server side
    console.log("translationViewController:updateKey: ", bundleObj, data);
    translationView.printBundleTemplate([data], bundleObj.locale, availableLanguages, projectConfig.project);
});

module.exports = {
    getJSON : function (newProjectConfig) {
        if (!newProjectConfig.hasOwnProperty('projects')) {
            // project specific config
            console.log('translationViewController get new config', newProjectConfig);
            if (projectConfig && projectConfig.project !== newProjectConfig.project) {
                saveProjectConfig(newProjectConfig);
                translationView.clearView();
                trade.getMessageBundle(newProjectConfig.project);
            } else {
                saveProjectConfig(newProjectConfig);
                trade.getMessageBundle(newProjectConfig.project);
            }

            translationViewHeader.addLanguages(availableLanguages);
        }
    },
    /**
     * Callback implementation of the getMessageBundle
     *
     * @param obj {data: [data: [{data: string, key: string}], language: string]}
     */
    getMessageBundle : function (obj) {
        var sorted;

        console.log('getMessageBundle callback', obj);

        if (obj) {
            sorted = obj.data.sort(sortByKey);
            sorted.forEach(function (data) {
                collectKeysMap[data.key] = undefined;
            });

            // TODO projectConfig.project will be removed if the trade call moved to this controller
            translationView.printBundleTemplate(sorted, obj.language, availableLanguages);
            translationView.printCreateNewBundle(projectConfig.project, projectConfig.defaultLanguage);
        } else {
            translationView.printCreateNewBundle(projectConfig.project, projectConfig.defaultLanguage);
        }
    }
};