
var translationView = require("canny").translationView,
    trade = require('../trade.js'),
    sortByKey = function (a, b) {
        if (a.key < b.key) {return -1; }
        if (a.key > b.key) {return 1; }
        return 0;
    },
    projectConfig,
    availableLanguages = [];

function saveProjectConfig(config) {
    projectConfig = config;
    availableLanguages = Object.keys(projectConfig.languages);
}

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