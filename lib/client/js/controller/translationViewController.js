
var translationView = require("canny").translationView,
//    translationViewHeader = require("canny").translationViewHeader,
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
    var idx,
        // the from parameter can overwrite the default language (legacy)
        defaultLanguage = domOpts.params.from ? domOpts.params.from : config.defaultLanguage;
    projectConfig = config;
    availableLanguages = Object.keys(projectConfig.languages);
    idx = availableLanguages.indexOf(defaultLanguage);
    if (idx !== -1 && idx !== 0) {
        // move default to the begin of the list (this defines the order how the translation languages are shown)
        availableLanguages.splice(0, 0, availableLanguages.splice(idx, 1)[0]);
    }
}

///**
// * TODO replace bundle with locale and refactor the calls from translationView
// * TODO this code is not called!?
// */
//translationView.onAddNewKey(function (lang, key, value, cb) {
//    console.log('translationViewController:onAddNewKey', [].slice.call(arguments));
//    alert('huhu');
//    trade.sendResource({
//        bundle: projectConfig.project,
//        locale: lang
//    }, {
//        key: key,
//        value: value
//    }, function (key) {
//        cb(key)
//    });
//});

translationView.onCreateNewProject(function (prjName, obj) {
    trade.createNewProject(prjName, obj);
});

translationView.onRenameKey(function (obj) {
    console.log('translationViewController:onRenameKey', obj, {
        bundle: projectConfig.project,
        // TODO remove the availableLanguages from here - the server should know this
        locales: availableLanguages
    });
    trade.renameKey({
        bundle: projectConfig.project,
        // TODO remove the availableLanguages from here - the server should know this
        locales: availableLanguages
    }, {
        newKey : obj.newKey,
        oldKey : obj.oldKey
    });
});

translationView.onRemoveKey(function (obj) {
    console.log('translationViewController:onRemoveKey', obj, {
        bundle: projectConfig.project,
        locales: availableLanguages
    });
    trade.removeKey({
        bundle: projectConfig.project,
        locales: availableLanguages
    }, {
        key : obj.key
    });
});

/**
 * TODO replace bundle with locale and refactor the calls from translationView
 */
translationView.onSaveValue(function (lang, key, value, cb) {
    console.log('translationViewController:onSaveValue', [].slice.call(arguments));
    trade.sendResource({
        project: projectConfig.project,
        projectId: projectConfig.projectId,
        locale: lang
    }, {
        key: key,
        value: value
    }, function (key) {
        uiEvents.callUievent('updateKey', projectConfig.project, lang, key, value);
        cb(key);
    });
});

// register listener function to the ui events
uiEvents.addUiEventListener({
    activateLanguage : function (lang) {
//        translationViewHeader.showLang(lang);
        translationView.showLang(lang);
    },
    deActivateLanguage : function (lang) {
//        translationViewHeader.hideLang(lang);
        translationView.hideLang(lang);
    },
    // TODO  don't trigger it twice for the same language
    addLanguage : function (lang) {
        availableLanguages.push(lang);
        translationView.addLanguage(Object.keys(collectKeysMap), lang);
//        translationViewHeader.showLang(lang);
        translationView.showLang(lang);
    }
});

/**
 * server event listener
 */
events.addServerListener('updateKey', function (bundleObj, data) {
    if (bundleObj.bundle === projectConfig.project) {
        collectKeysMap[data.key] = undefined; // save the key
        translationView.printBundleTemplate([data], bundleObj.locale, availableLanguages, projectConfig.project);
    }
});

/**
 * server event listener
 */
events.addServerListener('keyRemoved', function (bundleName, obj) {
    if (bundleName === projectConfig.project) {
        console.log('translationViewController:keyRenamed', bundleName, obj);
        toast.showMessage('Key deleted!' + obj.key);
        translationView.markKeyAsRemoved(obj.key);
    }
});

function handleNewProjectConfig (newProjectConfig) {
    if (!newProjectConfig.hasOwnProperty('projects')) {
        // project specific config
        console.log('translationViewController get new config', newProjectConfig);
        saveProjectConfig(newProjectConfig);
        // before there was a check do not clear the view if the actual project is the same.
        // The problem is if you remove a key in the editor view than the translation view can't
        // detect this.
        translationView.clearView();
        trade.getMessageBundle(newProjectConfig.project);

        // TODO do this in a viewController
        canny.flowControl.show('resourceBundle');
    }
}

module.exports = {
    /**
     * is called if the user rename key request was successful
     * @param newKey
     * @param oldKey
     */
    renameKey : function (newKey, oldKey) {
        toast.showMessage('Key renamed successful! From ' + oldKey + ' to ' + newKey);
    },
    removeKey : function (key) {
        toast.showMessage('Key removed successful!', key);
        translationView.removeKey(key);
    },
    /**
     * is called if the user has created successfully a new project
     * @param projectName
     */
    createNewProject : function (newProjectConfig) {
        console.log('Project was created and now switch to the view');
        // callback from create project - now show the project
        handleNewProjectConfig(newProjectConfig);
        // if the ui event is called than also the getJSON will be triggered
        uiEvents.callUievent('projectSelected', newProjectConfig.project);
    },
    /**
     * @param newProjectConfig
     */
    getJSON : function (newProjectConfig) {
        handleNewProjectConfig(newProjectConfig);
    },
    /**
     * Callback implementation of the getMessageBundle
     *
     * @param obj {data: [data: [{data: string, key: string}], language: string]}
     */
    getMessageBundle : function (obj) {
        var sorted, datas = [];

        console.log('getMessageBundle callback', obj);

        if (obj) {
            Object.keys(obj.data).forEach(function (key) {
                // transfer this in to the old format
                datas.push({key: key, value : obj.data[key]});
            })

            sorted = datas.sort(sortByKey);
            sorted.forEach(function (data) {
                collectKeysMap[data.key] = undefined;
            });

            // TODO projectConfig.project will be removed if the trade call moved to this controller
            translationView.printBundleTemplate(sorted, obj.language, availableLanguages);
        }
    }
};