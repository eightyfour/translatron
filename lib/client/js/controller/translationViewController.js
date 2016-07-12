
var canny = require("canny"),
    translationView = canny.translationView,
    translationViewImageUpload = canny.translationViewImageUpload,
//    translationViewHeader = require("canny").translationViewHeader,
    domOpts = require('dom-opts'),
    uiEvents = require('../uiEventManager.js'),
    events = require('../events.js'),
    trade = require('../trade.js'),
    url = require('../util/url'),
    sortByKey = function (a, b) {
        if (a.key < b.key) {return -1; }
        if (a.key > b.key) {return 1; }
        return 0;
    },
    projectConfig,
    availableLanguages = [],
    /**
     * An object (used as a set datastructure here) holding all existing keys of the project (no matter for how many
     * languages it is used). It is needed when adding a new language, see the function for addLanguage which is added
     * to uiEvents.
     * @type {{}}
     */
    existingKeys = {};

translationViewImageUpload.onUploadButton(function (id) {
    uiEvents.callUievent('showFileUpload', id);
});

translationViewImageUpload.onDeleteButton(function (id) {
    if (confirm('Delete the image for category » ' + id + ' « forever?')) {
        trade.removeImage(projectConfig.projectId, id);
    }
});

translationView.onCategoryClicked(function (id) {
    uiEvents.callUievent('anchorFocus', '#' + id);
});
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
                existingKeys[key] = undefined; // save the key
                translationView.printBundleTemplate([{key:key, value: value || ''}], language, availableLanguages, function () {});
                toast.showMessage('Auto save: "' + key + '" (success)');

                translationView.sendSuccess(key, '_value');
                // TODO not sure if this is needed
                uiEvents.callUievent('updateKey', projectId, language, key, value);
            }
        });
});
/**
 * Setup the UI events and manage the logic for them.
 *
 * TODO replace bundle with locale and refactor the calls from translationView
 */
translationView.onCreateKey(function (key, lang, value) {
    console.log('translationViewController:onSaveValue', [].slice.call(arguments));
    trade.createKey(
        projectConfig.projectId,
        lang || projectConfig.defaultLanguage,
        {
            key: key,
            value: value || undefined
        },
        function(projectId, language, key, value) {
            if (projectId === projectConfig.projectId) { // prevent applying the callback if project has been changed in the meantime
                existingKeys[key] = undefined; // save the key
                translationView.printBundleTemplate([{key:key, value: value || ''}], language, availableLanguages, function () {});
                toast.showMessage('Auto save: "' + key + '" (success)');

                translationView.sendSuccess(key, '_value');
                // TODO not sure if this is needed
                uiEvents.callUievent('updateKey', projectId, language, key, value);
            }
        });
});

translationView.onCloneKey(function(keyId, keyName, fromCategory, toCategory) {
    trade.cloneKey(
        projectConfig.projectId,
        {
            id: keyId,
            key: keyName,
            sourceCategory: fromCategory,
            targetCategory: toCategory
        },
        function(err, projectId, data) {
            var texts;
            if (projectId === projectConfig.projectId) {
                existingKeys[data.key] = undefined;
                texts = data.values;
                for (var lang in texts) {
                    if (texts.hasOwnProperty(lang)) {
                        translationView.printBundleTemplate([{
                            key: data.key,
                            value: texts[lang] || ''
                        }], lang, availableLanguages, function () {});
                    }
                }
            }
        }
    );
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

    // Set ${ defaultLanguage } as default in case a project was just created (i.e. does not contain any keys yet)
    // TODO: Better create / add check of object to functional helper object instead ?
    availableLanguages =
        Object.keys(projectConfig.keys).length === 0 && JSON.stringify(projectConfig.keys) === JSON.stringify({}) ?
            [defaultLanguage] : Object.keys(projectConfig.keys);

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

translationView.onRemoveCategory(function (obj) {
    console.log('translationViewController:onRemoveCategory', obj, projectConfig.projectId);
    trade.removeCategory(projectConfig.projectId, obj.category);
});

translationView.onRenameCategory(function (obj) {
    console.log('translationViewController:onRenameCategory', obj, projectConfig.projectId);
    trade.renameCategory(projectConfig.projectId, obj.oldName, obj.newName);
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
        translationView.addLanguage(Object.keys(existingKeys), lang);
//        translationViewHeader.showLang(lang);
        translationView.showLang(lang);
    },
    enableEditorMode : function (enabled) {
        translationView.enableEditorMode(enabled);
    },
    fileUploaded : function (projectId, key, fileName) {
        canny.translationViewImageUpload.appendImage(projectConfig.projectId, key, fileName);
    },
    JMBFFileUploaded : function (projectId) {
        trade.loadProject(projectId, function (error) {
            // callback is only called if an error occurs
            console.error('translationViewController:loadProject fails for projectId:', prj.projectId);
        });
    },
    jsonImported : function (projectId) {
        trade.loadProject(projectId, function (error) {
            console.warn('Project with id ' + projectId + ' could not be loaded.');
            console.error(error.toString());
        });
    }
});

/**
 * server event listener
 */
events.addServerListener('keyUpdated', function () {
    // TODO more client changes are coming, we'll finish the code below then
    //if (projectId === projectConfig.projectId) {
    //    existingKeys[keyName] = undefined; // save the key // what's happening here?
    //    var data = {};
    //    data[keyName] = keyValue;
    //    translationView.printBundleTemplate([data], language, availableLanguages, projectConfig.project);
    //}
});

/**
 * server event listener
 * all users will be notified of changes
 */
events.addServerListener('onKeyCloned', function () {
    console.log('events.listener::onKeyCloned' + [].slice.call(arguments));
});

/**
 * server event listener
 */
events.addServerListener('keyDeleted', function (bundleName, obj) {
    // TODO more client changes are coming, we'll finish the code below then
    //if (bundleName === projectConfig.project) {
    //    console.log('translationViewController:keyRenamed', bundleName, obj);
    //    toast.showMessage('Key deleted!' + obj.key);
    //    translationView.markKeyAsRemoved(obj.key);
    //}
});

events.addServerListener('categoryDeleted', function (bundleName, obj) {
    console.log('events.listener::categoryDeleted' + [].slice.call(arguments));
});

events.addServerListener('categoryRenamed', function (bundleName, obj) {
    console.log('events.listener::categoryRenamed' + [].slice.call(arguments));
});

/**
 * server event listener
 */
events.addServerListener('imageRemoved', function (bundleName, categoryName) {
    if (bundleName === projectConfig.projectId) {
        toast.showMessage('Image removed for category: ' + categoryName);
        translationView.removeImage(categoryName);
    }
});

function handleNewProjectConfig (newProjectConfig) {
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

function renderProject(projectData, cb) {
    handleNewProjectConfig(projectData);

    Object.keys(projectData.keys).forEach(function (lang) {
        var sorted, datas = [];
        Object.keys(projectData.keys[lang]).forEach(function (key) {
            datas.push({key: key, value : projectData.keys[lang][key]});
        });
        sorted = datas.sort(sortByKey);

        sorted.forEach(function (data) {
            existingKeys[data.key] = undefined;
        });
        // TODO projectConfig.project will be removed if the trade call moved to this controller
        translationView.printBundleTemplate(sorted, lang, availableLanguages, cb || function () {});
    })
}

module.exports = {
    renameCategory : function (oldName, newName) {
        toast.showMessage('Renamed category ' + oldName + ' to ' + newName + '!');
        translationView.renameCategory(oldName, newName, availableLanguages);
    },
    removeCategory : function (catName) {
        toast.showMessage('Removed category ' + catName + '!');
        translationView.removeCategory(catName);
    },
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
    imageRemoved : function (categoryName) {
        toast.showMessage('Image removed for category: ' + categoryName);
        translationView.removeImage(categoryName);
    },
    /**
     * Will be called with the complete JSON object from a specific project
     * @param projectData
     */
    onLoadProject : function (projectData) {
        var anchor = url.hasAnchor() ? url.getAnchor().replace('#','') : false;

        console.log('translationViewController.onLoadProject');
        renderProject(projectData, function (viewId) {
            if (anchor) {
                if (viewId === anchor) {
                    var dom = document.getElementById(anchor);
                    // do the element exists?
                    if (dom) {
                        uiEvents.callUievent('anchorFocus', url.getAnchor());
                        setTimeout(function () {
                            var bodyRect = document.body.getBoundingClientRect(),
                                elemRect = dom.getBoundingClientRect(),
                                offset   = elemRect.top - bodyRect.top;
                            window.scrollTo(0, offset);
                        }, 1000);
                    }
                }
            }
        });
        // add the descriptions
        canny.translationViewDescription.addDescriptions(projectData.keyDescriptions);
        Object.keys(projectData.images).forEach(function (key) {
            canny.translationViewImageUpload.appendImage(projectData.projectId, key, projectData.images[key]);
        })
    },
    onNewProjectCreated : function(projectData) {
        console.log('translationViewController.onNewProjectCreated');
        renderProject(projectData);
    }
};