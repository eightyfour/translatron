
var translationView = require("canny").translationView,
    translationViewHeader = require("canny").translationViewHeader,
    domOpts = require('dom-opts'),
    uiEvents = require('../uiEventManager.js'),
    trade = require('../trade.js'),
    sortByKey = function (a, b) {
        if (a.key < b.key) {return -1; }
        if (a.key > b.key) {return 1; }
        return 0;
    },
    projectConfig,
    availableLanguages = [];

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
// register listener function to the ui events
uiEvents.addUiEventListener({
    activateLanguage : function (lang) {
        translationViewHeader.showLang(lang);
        translationView.showLang(lang);
    },
    deActivateLanguage : function (lang) {
        translationViewHeader.hideLang(lang);
        translationView.hideLang(lang);
    }
});

module.exports = {
    getJSON : function (projectConfig) {
        if (!projectConfig.hasOwnProperty('projects')) {
            // project specific config
            if (projectConfig !== null && projectConfig.project !== projectConfig.project) {
                console.log('translationViewController get new config', projectConfig);
                saveProjectConfig(projectConfig);
                translationView.clearView();
                trade.getMessageBundle(projectConfig.project);
            } else {
                saveProjectConfig(projectConfig);
                trade.getMessageBundle(projectConfig.project);
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
            // TODO projectConfig.project will be removed if the trade call moved to this controller
            translationView.printBundleTemplate(sorted, obj.language, availableLanguages, projectConfig.project);
//            if (bundleTo) {
//                trade.getMessageBundle(bundleTo, function (s) {
//                    var obj = JSON.parse(s);
//                    if (obj) {
//                        translationView.printBundleTranslation(obj.data);
//                    }
//                    translationView.printCreateNewBundle();
//                });
//            } else {
                translationView.printCreateNewBundle();
//            }
        } else {
            translationView.printCreateNewBundle();
        }
    }
};