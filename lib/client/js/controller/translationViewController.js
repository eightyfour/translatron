
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
    collectKeysMap = {}; // saves all keys which added by the onLoadProject method

/**
 * Setup the UI events and manage the logic for them.
 *
 * TODO replace bundle with locale and refactor the calls from translationView
 */
translationView.onSaveKey(function (key, lang, value) {
    console.log('translationViewController:onSaveValue', [].slice.call(arguments));
    trade.saveKey(
        projectConfig.projectId,
        lang || projectConfig.defaultLanguage,
        {
            key: key,
            value: value || undefined
        },
        function(projectId, language, key, value) {
            if (projectId === projectConfig.projectId) { // prevent applying the callback if project has been changed in the meantime
                collectKeysMap[key] = undefined; // save the key
                translationView.printBundleTemplate([{key:key, value: value || ''}], language, availableLanguages, projectId);
                toast.showMessage('Auto save: "' + key + '" (success)');

                translationView.sendSuccess(key, '_value');
                // TODO not sure if this is needed
                uiEvents.callUievent('updateKey', projectId, language, key, value);
            }
        });
});
/**
 * Read the from param as default language otherwise take it from the project.json
 * @param config
 */
function saveProjectConfig(config) {
    var idx,
        // the from parameter can overwrite the default language (legacy)
        defaultLanguage = domOpts.params.from ? domOpts.params.from : config.defaultLanguage;
    projectConfig = config;
    availableLanguages = Object.keys(projectConfig.keys);
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
    console.log('translationViewController:onRenameKey', obj, projectConfig.projectId);
    trade.renameKey(projectConfig.projectId, {
        newKey : obj.newKey,
        oldKey : obj.oldKey
    });
});

translationView.onRemoveKey(function (obj) {
    console.log('translationViewController:onRemoveKey', obj, projectConfig.projectId);
    trade.removeKey(projectConfig.projectId, obj.key);
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
        // n.b. nothing is saved here - "saving" only happens as in "store in our data structure"
        saveProjectConfig(newProjectConfig);
        // before there was a check do not clear the view if the actual project is the same.
        // The problem is if you remove a key in the editor view than the translation view can't
        // detect this.
        translationView.clearView();
        canny.flowControl.show('resourceBundle');
    }
}

function renderProject(projectData) {
    handleNewProjectConfig(projectData);

    Object.keys(projectData.keys).forEach(function (lang) {
        var sorted, datas = [];
        Object.keys(projectData.keys[lang]).forEach(function (key) {
            datas.push({key: key, value : projectData.keys[lang][key]});
        });
        sorted = datas.sort(sortByKey);
        // QUESTION: why is each entry reset?
        sorted.forEach(function (data) {
            collectKeysMap[data.key] = undefined;
        });
        // TODO projectConfig.project will be removed if the trade call moved to this controller
        translationView.printBundleTemplate(sorted, lang, availableLanguages);
    })
}

module.exports = {
    /**
     * is called if the user rename key request was successful
     * @param newKey
     * @param oldKey
     */
    renameKey : function (oldKey, newKey) {
        if (oldKey) {
            toast.showMessage('Key renamed successful! From ' + oldKey + ' to ' + newKey);
            translationView.renameKey(oldKey, newKey, availableLanguages);
        } else {
            toast.showMessage('Key renamed failed!');
        }
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
     * Will be called with the complete JSON object from a specific project
     * @param projectData
     */
    onLoadProject : function (projectData) {
        console.log('translationViewController.onLoadProject');
        renderProject(projectData);
    },
    onNewProjectCreated : function(projectData) {
        console.log('translationViewController.onNewProjectCreated');
        renderProject(projectData);
    }
};