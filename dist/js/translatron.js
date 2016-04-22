(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
var C = {
    FILE_MANAGER : {
        FILE_TYPES : {
            IMAGE : 'image',
            FILE  : 'file'
        },
        ENCODING : {
            image : 'base64',
            file : 'utf8'
        }
    }
};

module.exports = C;

}).call(this,require("+7ZJp0"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/CONST.js","/")
},{"+7ZJp0":60,"buffer":55}],2:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
/**
 * TODO fade out when maxLengthOfMessages exceeded looks not so nice
 * @param id
 * @return {Object}
 * @constructor
 */
var toast = new (function Toast(id){
    var DELAY = 4000,
    opacityFadeSteps = 0.04,
    maxLengthOfMessages = 4,
    toastNode = document.getElementById(id),
    isReadyForStartAgain = true,
    newMessage = true,
    initToast = function(){
        var rootNode = document.getElementsByTagName('body')[0];
        toastNode = document.createElement('div');
        toastNode.id = id;
        toastNode.style.cssText = "position:fixed;z-index:999;top:13px;right:10px;border-radius:5px;color:#fff;font-size:1.2em;font-weight:bold;background-color:rgba(80,110,110,0.8);padding: 0.3em 1em;"
        rootNode.appendChild(toastNode);
    },
    toast = {
        fadeOut : function(_node,_done){
            var node = _node;
            var done = _done;
            var opacity = 1;
            (function decrementOpacity(){
                if(opacity > opacityFadeSteps){
                    opacity = opacity - opacityFadeSteps;
                    node.style.opacity = opacity;
                    setTimeout(function(){
                        decrementOpacity();
                    },40);
                }else{
                    console.log('PARENT NODE:');
                    console.log(node);
                    console.log(node.parentNode);
                    if(node.parentNode != null){
                        node.parentNode.removeChild(node);
                    }
                    done();
                }
            })();
        },
        showMessage : function(msg){
            if(!toastNode){
                initToast()
            }
            toastNode.style.opacity = 1;
            var p = document.createElement('p');
            p.style.cssText = "padding:0px 10px";
            p.innerHTML = msg;
            toastNode.insertBefore(p,toastNode.firstChild);
            (function fadeOutToMuchMessages(){
                if(toastNode.childNodes.length > maxLengthOfMessages){
                    toast.fadeOut(toastNode.children[toastNode.children.length-1],function(){
                        fadeOutToMuchMessages();
                    });
                }
            })();
            var timeOut = DELAY;
            newMessage = true;
            function fadeOut(_fc){
                var fc = _fc;
                var opacity = toastNode.style.opacity;
                if(opacity > opacityFadeSteps){
                    if(newMessage) {
                        // resetMessage
                        newMessage = false;
                        timeOut = DELAY;
                        toastNode.style.opacity = 1;
                    }else {
                        opacity = opacity-opacityFadeSteps;
                        toastNode.style.opacity = opacity;
                        timeOut = 40;
                    }
                    // start timer
                    setTimeout(function(){
                        fadeOut(fc);
                    },timeOut);
                }else{
                    while( toastNode.firstChild ){
                        toastNode.removeChild( toastNode.firstChild );
                    }
                    // callback
                    fc(true);
                }
            }
            if(isReadyForStartAgain){
                isReadyForStartAgain = false;
                timeOut = DELAY;
                fadeOut(function(_b){
                    isReadyForStartAgain = true;
                });
            }
        }
    };
    return toast;
})('toast');

if(typeof module != "undefined"){
    console.log('exports');
    module.exports = toast;
}else {
    console.log('asign to global scope');
    window.toast = toast;
}
}).call(this,require("+7ZJp0"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/Toast.js","/")
},{"+7ZJp0":60,"buffer":55}],3:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
var async = require('canny/mod/async'),
    auth = require('canny').auth;

auth.onLogout(function () {
    async.doAjax({
        path : '/logout',
        onSuccess : function (response) {
            location.reload();
        }
    })
});

module.exports = {};
}).call(this,require("+7ZJp0"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/controller/authController.js","/controller")
},{"+7ZJp0":60,"buffer":55,"canny":38,"canny/mod/async":39}],4:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
var breadcrumb = require('canny').breadcrumb,
    trade = require('../trade.js'),
    uiEvents = require('../uiEventManager');

breadcrumb.onClick(function (directoryId) {
    trade.getDirectory(directoryId, function (err) {
        if (err !== false ) {
            // TODO call the
            uiEvents.callUievent('showOverviewPage');
        } else {
            console.log('breadcrumbController:getDirectory can not load project for directory name:', directoryId);
        }
    });
});

module.exports = {
    getDirectory: function (data) {
        console.log('breadcrumbController:parentDirectories', data.parentDirectories);
        breadcrumb.updateFolders(data.parentDirectories);
    }
};

}).call(this,require("+7ZJp0"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/controller/breadcrumbController.js","/controller")
},{"+7ZJp0":60,"../trade.js":17,"../uiEventManager":18,"buffer":55,"canny":38}],5:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
var createNewProject = require('canny').createNewProject,
    displayManager = require('canny').displayManager,
    trade = require('../trade');

var currentDirectory;

createNewProject.onCreateNewProject(function(projectName) {
    trade.createNewProject(projectName, currentDirectory);
    displayManager.hide('createNewProjectView');
});

createNewProject.onCreateNewDirectoy(function(directoryName) {
    trade.createNewDirectory(directoryName, currentDirectory);
    displayManager.hide('createNewDirectoryView');
});

module.exports = {
    // TODO introduce new event: onDirectoryChanged - because a "getDirectory" event does not really explain what's
    // happening here
    getDirectory : function(data) {
        currentDirectory = data.currentDirectory;
    }
};

}).call(this,require("+7ZJp0"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/controller/createNewProjectController.js","/controller")
},{"+7ZJp0":60,"../trade":17,"buffer":55,"canny":38}],6:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
var anchorMenu = require('canny').anchorMenu,
    uiEvents = require('../uiEventManager');

/**
 * Nice approach but the order is different from the DOM.
 * TODO It would be better to read the elements from the DOM
 *  1. it's easier to reinitialize if a key is renamed or created new (Y)
 *  2. the order will be same as in the DOM (Y)
 *  con: we need to wait until the DOM is rendered - otherwise elements will be missing
 *
 *  We need:
 *  * DOM render success event (the translationView controller has to throw it) (so far the controller is added after the translationController it looks like that this is not an issue)
 *  * an a if anchor is clicked (in view) event ; then also focus the correct menu right element
 *  * the right menu element interact only as scroll overview - not as anchor helper as it is right now
 *
 * @param keys
 */

anchorMenu.onSelect(function (id) {
    var dom = document.getElementById(id);
    if (dom) {
        var bodyRect = document.body.getBoundingClientRect(),
            elemRect = dom.getBoundingClientRect(),
            offset = elemRect.top - bodyRect.top;
        window.scrollTo(0, offset - 60);
        uiEvents.callUievent('anchorFocus', '#' + id);
    }
});

uiEvents.addUiEventListener({
    anchorFocus : function (id) {
        anchorMenu.focusElement(id.replace('#', ''));
    }
});

module.exports = {
    /**
     * is called if the user rename key request was successful
     * @param newKey
     * @param oldKey
     */
    renameKey : function (oldKey, newKey) {
        anchorMenu.renderMenu();
    },
    removeKey : function (key) {
        anchorMenu.renderMenu();
    },
    onCreateKey : function () {
        anchorMenu.renderMenu();
    },
    /**
     * Will be called with the complete JSON object from a specific project
     * @param projectData
     */
    onLoadProject : function (projectData) {
        anchorMenu.renderMenu();
    }
};
}).call(this,require("+7ZJp0"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/controller/menuRightController.js","/controller")
},{"+7ZJp0":60,"../uiEventManager":18,"buffer":55,"canny":38}],7:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
var canny = require('canny');

/**
 * just the implementation of the callbacks
 */

/**
 * Apply project description data to dom elements
 * @param data: Project configuration data
 */
function applyProjectData(data) {
    if (data.hasOwnProperty('project')) {
        // project specific config
        canny.texts.setTexts({projectName : data.project});
    }

    // FIXME: Categories should not be named "__description" as they would override the project description
    if (data.hasOwnProperty('keyDescriptions')) {
        // project specific config - if property is present
        canny.texts.setTexts({
            projectDescription : (data.keyDescriptions['__description'] ? data.keyDescriptions['__description'] : '')
        });
    }
}

module.exports = {
    onNewProjectCreated : applyProjectData,
    onLoadProject : applyProjectData,
    onNewDirectoryCreated : function(data) {
        canny.texts.setTexts({
            projectName : data.directoryId
        });
    }
};
}).call(this,require("+7ZJp0"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/controller/pageHeaderController.js","/controller")
},{"+7ZJp0":60,"buffer":55,"canny":38}],8:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
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

(function () {
    var editorModeEnabled = false;

    canny.projectMainNavigation.onEnableEditorMode(function () {
        console.log('projectMainNavigationController:onEnableEditorMode show JSON format in new tab.');
        uiEvents.callUievent('enableEditorMode', !editorModeEnabled);
    });
    //maybe someone else calls this too
    uiEvents.addUiEventListener({
        enableEditorMode : function (enabled) {
            editorModeEnabled = enabled;
        }
    });

}());


canny.projectMainNavigation.onShowJSON(function () {
    console.log('projectMainNavigationController:onShowJSON show JSON format in new tab.');
    window.open(
        projectConfig.projectId + '.json',
        '_blank' // <- This is what makes it open in a new window.
    );
});

canny.projectMainNavigation.onShowJMBF(function () {
    console.log('projectMainNavigationController:onShowJMBF show JMBF format in new tab.');

    var lang = window.prompt('Enter a language code. E.g.: ' +  (function () {
            var existingLanguages = [];
            Object.keys(projectConfig.keys).forEach(function (lang) {
                if (Object.keys(projectConfig.keys[lang]).length > 0) {
                    existingLanguages.push(lang)
                }
            });
            return existingLanguages;
        }()).join(', '));

    if (lang !== null) {
        window.open(
            projectConfig.projectId + '.properties' + (lang !== '' ? '?lang=' + lang : ''),
            '_blank' // <- This is what makes it open in a new window.
        );
    }
});

/**
 * server event listener
 */
events.addServerListener('newProjectWasCreated', function (projectName) {
    toast.showMessage('A new project with name: "' + projectName + '" was created.');
});
/**
 * server event listener
 */
events.addServerListener('keyUpdated', function (projectId, language, keyName, keyValue) {
    // TODO more client changes are coming, we'll finish the code below then
    //if (projectId === currentProjectId) {
    //    var projectName = projectId.substring(projectId.lastIndexOf('/') + 1);
    //    updateKeyToProjectMap(projectName, language, keyName, keyValue);
    //    console.log('projectMainNavigationController:updateKey', projectId, language, keyName, keyValue);
    //}
});
/**
 * server event listener
 */
events.addServerListener('keyDeleted', function (bundleName, obj) {
    // TODO more client changes are coming, we'll finish the code below then
    //if (bundleName === projectConfig.project) {
    //    console.log('projectMainNavigationController:keyRenamed', bundleName, obj);
    //    // TODO update the statistics...
    //}
});

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

// TODO should use projectId, not projectName
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

function computeTotalTranslationProgree(translations) {
    var totalProgress = {};
    Object.keys(translations).forEach(function(lang) {
        Object.keys(translations[lang]).forEach(function (key) {
            totalProgress[key] = undefined;
        });
    });
    return Object.keys(totalProgress).length;

}

function computeTranslationProgress(translations) {
    var progressByLanguage = {};
    Object.keys(translations).forEach(function(lang) {
        progressByLanguage[lang] = Object.keys(translations[lang]).length;
    });
    return progressByLanguage;
}

/**
 * Callback implementation of the onLoadProject & onNewProjectCreated
 * @param projectData (see project JSON file)
 */
function applyProjectData(data) {
    projectConfig = data;

    canny.projectMainNavigation.setAvailableLanguages(data.availableLanguages);

    canny.projectMainNavigation.setActivatedProjectLanguages(
        computeTotalTranslationProgree(data.keys), computeTranslationProgress(data.keys));

    Object.keys(data.keys).forEach(function (lang) {
        if (Object.keys(data.keys[lang]).length > 0 && availableLanguages.indexOf(lang) !== -1) {

            Object.keys(data.keys[lang]).forEach(function (key) {
                saveKeyToProjectMap(data.project, lang, key, data.keys[lang][key]);
            });

            if (keyValueCounter.projectMap[data.project].langMap[lang]) {
                console.log('projectMainNavigationController:onLoadProject ', keyValueCounter.projectMap[data.project].langMap[lang]);
                console.log('projectMainNavigationController:onLoadProject maxKeys are', Object.keys(keyValueCounter.projectMap[data.project].keyMap).length);
				//canny.projectMainNavigation.setNumberOfTranslationMaxKeys(Object.keys(keyValueCounter.projectMap[projectData.project].keyMap).length);
				//canny.projectMainNavigation.setNumberOfTranslatedLanguageKey(Object.keys(keyValueCounter.projectMap[projectData.project].langMap[lang]).length, lang);
                // TODO refactor this and make one call ;)
                canny.projectMainNavigation.activateLang(lang);
                canny.projectMainNavigation.deActivateLang(lang);
            } else {
                console.log('projectMainNavigationController:onLoadProject get language without any keys for locale:', lang);
            }
        }
    });

    // reset or reinitialize or initialize the key value counter (otherwise the counter can't detect deleted keys. E.g. from the editor mode)
    keyValueCounter.projectMap[data.project] = keyValueCounter.getCountObj();
    // show default language as selected language in menu
    // TODO check who decides to show which language as default - and then call this event from there
    uiEvents.callUievent('activateLanguage', data.defaultLanguage);
}

/**
 * the implementation of the callbacks
 */
module.exports = {
    onNewProjectCreated : applyProjectData,
    onLoadProject : applyProjectData
};
}).call(this,require("+7ZJp0"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/controller/projectMainNavigationController.js","/controller")
},{"+7ZJp0":60,"../events.js":14,"../trade.js":17,"../uiEventManager.js":18,"buffer":55,"canny":38,"dom-opts":54}],9:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
var projectOverview = require('canny').projectOverview,
    displayManager = require('canny').displayManager,
    trade = require('../trade.js'),
    uiEvents = require('../uiEventManager.js'),
    canny = require('canny'),
    events = require('../events.js');

var projectOverviewController = (function() {

    var currentParentDirectory,
        currentDirectory,
        /**
         * Maps project names to projects IDs
         */
        projects,
        /**
         * Maps directory names to directory IDs
         */
        directories;

    uiEvents.addUiEventListener({
        showOverviewPage : function () {
            displayManager.show('projectsOverview');
        }
    });

    projectOverview.onParentDirectorySelected(function() {
        if (currentParentDirectory !== currentDirectory) {
            trade.getDirectory(currentParentDirectory);
        } else {
            console.log('No parent directory');
        }
    });

    projectOverview.onProjectSelected(function(projectName) {
        uiEvents.callUievent('projectSelected', projects[projectName]);
    });

    projectOverview.onDirectorySelected(function(directoryName) {
        var directoryId = directories[directoryName];
        trade.getDirectory(directoryId, function () {
            console.log('projectOverviewController:can not load project for directory name:', directoryId);
        });
    });

    projectOverview.onCreateProjectPressed(function() {
        displayManager.show('createNewProjectView');
    });

    projectOverview.onCreateDirectoryPressed(function() {
        displayManager.show('createNewDirectoryView');
    });

    events.addServerListener('newDirectoryCreated', function (directoryId) {
        var lastDirSepIdx = directoryId.lastIndexOf('/');
        var parentDirectory = directoryId.substring(0, lastDirSepIdx + 1);
        if (parentDirectory === currentParentDirectory) {
            var directoryName = directoryId.substring(lastDirSepIdx + 1);
            directories[directoryName] = directoryId;
            // TODO show message only if projectOverview is currently visible - but canny.flowcontrol currently does not
            // have anything to find out which view is the active one
            toast.showMessage('A new directory "' + directoryName + '" has been created by another user.');
            projectOverview.setProjectsAndDirectories(Object.keys(projects), Object.keys(directories));
        }
    });

    return {
        /**
         *
         * @param data an object with 2 properties "projects" and "directories", each listing project/directory names.
         */
        getDirectory: function (data) {
            console.log('ProjectOverviewController.getDirectory: ' + data);
            if (data === false) {
                console.error("Server call failed");
            } else if (data.hasOwnProperty('projects') && data.hasOwnProperty('dirs')) {

                projects = {};
                data.projects.forEach(function(entry) {
                    projects[entry.name] = entry.id;
                });

                directories = {};
                data.dirs.forEach(function(entry) {
                   directories[entry.name] = entry.id;
                });

                projectOverview.setProjectsAndDirectories(Object.keys(projects), Object.keys(directories));
                currentParentDirectory = data.parentDirectory;
                currentDirectory = data.currentDirectory;

            } else {
                console.warn('Data rcvd from server is missing expected properties ("projects", "dirs")');
            }
        },
        onNewDirectoryCreated : function(data) {
            displayManager.show('projectsOverview');
            trade.getDirectory(data.directoryId, function() {
                console.log('projectOverviewController.onNewDirectoryCreated: trade callback');
            });
        }
    };
})();

module.exports = projectOverviewController;

}).call(this,require("+7ZJp0"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/controller/projectOverviewController.js","/controller")
},{"+7ZJp0":60,"../events.js":14,"../trade.js":17,"../uiEventManager.js":18,"buffer":55,"canny":38}],10:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
var textEditor = require('canny').textEditor,
    trade = require('../trade.js'),
    toast = require('../Toast.js'),
    events = require('../events.js'),
    currentProjectId;
/**
 * returns the language or false
 * @param fileName
 * @returns {*}
 */
function getLanguageFromFileName(fileName) {
    var reg = /messages_(.*)\..*./g.exec(fileName);
    if (reg && reg.length === 2) {
        return reg[1];
    }
    return false;
}

/**
 * handle the change project description event in the view
 */
textEditor.onChange(function (id, value, fc) {
    console.log('textEditorController:onChange', value);
    if (currentProjectId) {
        if (!id) {
            // TODO to keep backward functionality this is the "main" project description - will be changed in future
            id = '__description';
        }
        trade.saveProjectDescription(currentProjectId, id, value, function (success) {
            if (success) {
                fc(true);
                toast.showMessage('Project description changed for project ' + currentProjectId);
            } else {
                fc(false);
            }
        });
    }
});
/**
 * just the implementation of the callbacks
 *
 */
module.exports = {
    onLoadProject : function (projectData) {
        if (projectData.projectId) {
            currentProjectId = projectData.projectId;
        }
    }
};
}).call(this,require("+7ZJp0"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/controller/textEditorController.js","/controller")
},{"+7ZJp0":60,"../Toast.js":2,"../events.js":14,"../trade.js":17,"buffer":55,"canny":38}],11:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){

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
 */
events.addServerListener('keyDeleted', function (bundleName, obj) {
    // TODO more client changes are coming, we'll finish the code below then
    //if (bundleName === projectConfig.project) {
    //    console.log('translationViewController:keyRenamed', bundleName, obj);
    //    toast.showMessage('Key deleted!' + obj.key);
    //    translationView.markKeyAsRemoved(obj.key);
    //}
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
}).call(this,require("+7ZJp0"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/controller/translationViewController.js","/controller")
},{"+7ZJp0":60,"../events.js":14,"../trade.js":17,"../uiEventManager.js":18,"../util/url":37,"buffer":55,"canny":38,"dom-opts":54}],12:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){

/**
 * controller for the image uplaoder view - calls the server to upload a image and notifier the ui event handler
 * @type {{}}
 */
var canny = require('canny'),
    upload = canny.upload,
    displayManager = canny.displayManager,
    uiEvents = require('../uiEventManager.js'),
    uploadId,
    projectData;
/**
 * Call this for each file - will call a call back with the server answer
 * @param file
 */
function sendFile(file, directCallback) {
    var uri = '/uploadFile?projectId=' + projectData.projectId + '&key=' + uploadId + '&project=' + projectData.project,
        xhr = new XMLHttpRequest(),
        fd = new FormData();

    xhr.open("POST", uri, true);
    xhr.onreadystatechange = function() {
        var data;
        if (xhr.readyState == 4 && xhr.status == 200) {
            // Handle response.
            data = JSON.parse(xhr.responseText);
            directCallback && directCallback(data); // handle response.
            // {file: "//sub/sub1/sub1_blue_coke.jpg", name: "sub1_blue_coke.jpg", type: "image/jpg"}
            console.log(data);
            uiEvents.callUievent('fileUploaded', projectData.projectId, uploadId, data.name)
        }
    };
    fd.append('myFile', file);
    // Initiate a multipart/form-data upload
    xhr.send(fd);
}

/**
 * Save data in member variable used by further upload operations
 * @param data: Project data
 */
function applyProjectData(data) {
    projectData = data;
}

uiEvents.addUiEventListener({
    showFileUpload : function (id) {
        uploadId = id;
        displayManager.show('uploadView');
    }
});

upload.onUpload(function (file) {
    // TODO additional to the upload id we need the project ID
    console.log('uploadController:upload id: file:', uploadId, file);
    sendFile(file);
});

module.exports = {
    onNewProjectCreated : applyProjectData,
    onLoadProject : applyProjectData
};
}).call(this,require("+7ZJp0"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/controller/uploadController.js","/controller")
},{"+7ZJp0":60,"../uiEventManager.js":18,"buffer":55,"canny":38}],13:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
var trade = require('../trade'),
    uiEvents = require('../uiEventManager'),
    url = require('../util/url');
/**
 * TODO handle the browser back and next button and load the correct view
 */
function processAjaxData(response, urlPath){
    document.title = response.pageTitle;
    window.history.pushState({
        "html": response.html,
        "pageTitle": response.pageTitle,
        id : response.id,
        isProject : response.isProject
    },"", urlPath + url.getAnchor());
}

/**
 * Manipulate browser history / location with given project data
 * @param data: Project related data
 */
function applyProjectData(data) {
    // add the project path to the URL
    if (data.project) {
        processAjaxData({
            pageTitle : data.projectId,
            html:'',
            id : data.projectId,
            isProject : true
        }, data.projectId + '.prj');
    }
}

uiEvents.addUiEventListener({
    anchorFocus : function (id) {
        // set the anchor to the URL
        window.history.pushState(null,null, id)
    }
});

window.onpopstate = function (e) {
    console.log('onpopstate', location.pathname);
//    console.log('onpopstate', e.state.id);
    if (e.state) {
        if (e.state.isProject) {
            trade.loadProject(e.state.id, function () {
                console.error('urlManipulator:loadProject fails for projectId:', e.state.id);
            });
        } else {
            trade.getDirectory(e.state.id, function (err) {
                if (err !== false) {
                    // TODO call the
                    uiEvents.callUievent('showOverviewPage');
                } else {
                    console.log('urlManipulator:getDirectory can not load project for directory name:', e.state.id);
                }
            });
        }
    }
}

/**
 * TODO there is a problem with activating the project view or the overview page...
 *
 * just the implementation of the callbacks
 *
 */
module.exports = {
    onLoadProject : applyProjectData,
    onNewProjectCreated : applyProjectData,
    getDirectory: function (data) {
        processAjaxData({
            pageTitle : 'translatron overview',
            html:'',
            id : data.currentDirectory,
            isProject : false
        }, data.currentDirectory);
    }
};
}).call(this,require("+7ZJp0"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/controller/urlManipulator.js","/controller")
},{"+7ZJp0":60,"../trade":17,"../uiEventManager":18,"../util/url":37,"buffer":55}],14:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
/**
 * Created by eightyfour.
 *
 * All server events. Multiple clients can register on each event
 * and will be notified if method is called from server.
 *
 * TODO RENAME FILE
 * TODO to what? :)
 * What about "externalChangeNotifications"?
 *
 * TBD why don't we integrate this one with ui events? that would cut down on the number of components we have and we "only" (?)
 * have to do some sensible renaming of events, like renaming all events handled here by adding "external" or similar
 * (e.g. "keyUpdated" becomes "keyUpdatedExternally").
 */
var events = (function () {
    "use strict";
    var eventQueue = {},
        callQueue = function (name, args) {
            console.log('got notification for ', name, 'with payload', args);
            if (eventQueue.hasOwnProperty(name)) {
                eventQueue[name].map(function (fc) {
                    fc.apply(null, args);
                });
            }
        };
    return {
        serverEvents : {
            // TBD can be removed?
            sendFile : function () {
                callQueue('sendFile', [].slice.call(arguments));
            },
            // TBD can be removed?
            sendPathList : function () {
                callQueue('sendPathList', [].slice.call(arguments));
            },
            keyUpdated : function (projectId, language, keyName, keyValue) {
                callQueue('keyUpdated', [ projectId, language, keyName, keyValue ]);
            },
            keyRenamed : function(projectId, oldKeyName, newKeyName) {
                callQueue('keyRenamed', [ projectId, oldKeyName, newKeyName ]);
            },
            /**
             * @param bundleObj {locale: string, bundle: string}
             * @param data {oldKey:string, newKey: string}
             */
            keyDeleted : function (projectId, keyName) {
                callQueue('keyDeleted', [ projectId, keyName ]);
            },
            imageRemoved : function (projectId, categoryName) {
                callQueue('imageRemoved', [ projectId, categoryName ]);
            },
            newProjectWasCreated : function (projectId) {
                callQueue('newProjectWasCreated', [ projectId ]);
            },
            newDirectoryCreated : function (directoryId) {
                callQueue('newDirectoryCreated', [ directoryId ]);
            },
            projectDescriptionUpdated : function (projectId, id, description) {
                callQueue('projectDescriptionUpdated', [ projectId, id, description ]);
            }
        },
        addServerListener : function (name, cb) {
            if (eventQueue.hasOwnProperty(name)) {
                eventQueue[name].push(cb);
            } else {
                eventQueue[name] = [cb];
            }
        }
    };
}());

module.exports = events;
}).call(this,require("+7ZJp0"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/events.js","/")
},{"+7ZJp0":60,"buffer":55}],15:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
/*global domOpts */
/*jslint browser: true */
var unicode = require('./unicode.js'),
    toast = require('./Toast.js'),
    canny = require('canny'),
    trade = require('./trade.js');

window.domOpts = window.domOpts || require('dom-opts');
// made it public - just for development
window.canny = canny;

canny.add('repeat',         require('canny/mod/repeat'));
canny.add('whisker',        require('canny/mod/whisker'));
canny.add('flowControl',    require('canny/mod/flowControl')('flowControl'));
canny.add('displayManager', require('./uiModules/displayManager.js'));
canny.add('textEditor',     require('./textEditor.js'));

canny.add('texts',                  require('./uiModules/texts.js'));
canny.add('auth',                   require('./uiModules/auth.js'));
canny.add('projectMainNavigation',  require('./uiModules/projectMainNavigation.js'));
canny.add('translationView',        require('./uiModules/translationView.js'));
canny.add('translationViewImageUpload', require('./uiModules/translationViewImageUpload.js'));
//canny.add('translationViewHeader',  require('./uiModules/translationViewHeader.js'));
canny.add('imageViewer',            require('./uiModules/imageViewer.js'));
canny.add('projectOverview',        require('./uiModules/projectOverview.js'));
canny.add('createNewProject',       require('./uiModules/createNewProject.js'));
canny.add('menuRight',              require('./uiModules/menuRight.js'));
canny.add('anchorMenu',             require('./uiModules/anchorMenu.js'));
canny.add('breadcrumb',             require('./uiModules/breadcrumb.js'));
canny.add('translationViewDescription', require('./uiModules/translationViewDescription.js'));
canny.add('upload',                     require('./uiModules/upload.js'));

trade.addController(require('./controller/projectMainNavigationController.js'));
trade.addController(require('./controller/pageHeaderController.js'));
trade.addController(require('./controller/translationViewController.js'));
trade.addController(require('./controller/textEditorController.js'));
trade.addController(require('./controller/urlManipulator.js'));
trade.addController(require('./controller/projectOverviewController.js'));
trade.addController(require('./controller/createNewProjectController.js'));
trade.addController(require('./controller/breadcrumbController.js'));
trade.addController(require('./controller/authController.js'));
trade.addController(require('./controller/menuRightController.js'));
trade.addController(require('./controller/uploadController.js'));

canny.ready(function () {
    "use strict";
    // create websocket connection via trade
    trade.initialize();
});


window.canny = canny;
window.domOpts = require('dom-opts');
window.unicode = unicode;
window.toast = toast;

// QUESTION: can it happen that the above call to trade.initialize (in canny.ready) finishes earlier than the next lines?
// i.e. the callback for trade.ready will never be executed? if yes: why not pass the callback already to trade.initialize?
trade.ready(function () {
    'use strict';
    var prj = (function getProjectNameAndPathFromURL() {
        var split = location.pathname.split('/'),
            path = location.pathname,
            prjName;
        if (/\.prj/.test(split[split.length - 1])) {
            prjName = split.splice(split.length - 1)[0];
            path = split.join('/');
        }
        if (path[0] !== '/') {
            path = '/' + path;
        }
        return {
            path : path,
            projectId : prjName ? path + '/' + prjName.replace('.prj', '') : undefined
        };
    }());

    // QUESTION: since this is working on the URL the application was loaded with and this URL can be either a directory URL
    // or a project URL: why can't we decide first what we actually have in the URL and then either call getDirectory
    // or loadProject? ANSWER: depends. if the URL points to a directory, we only have to do the getDirectory call.
    // if the URL is a project, two calls have to be made: one loadProject call and one extra getDirectory call for the
    // parent of the project (mainly for navigation component which needs to know the siblings of the project). But: take
    // care that this extra getDirectory must *not* change the state of the breadcrumb trail (that one should still show
    // the selected project)
    trade.getDirectory(prj.path, function (obj) {
        // if there is a project selected then trigger the initial project load
        if (prj.projectId) {
            // this is the initial call to trigger a project load - you will get
            // the project.json and all translations
            trade.loadProject(prj.projectId, function (error) {
                // callback is only called if an error occurs
                console.error('translationViewController:loadProject fails for projectId:', prj.projectId);
            });
        }
    });
});
}).call(this,require("+7ZJp0"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/fake_2ba9114.js","/")
},{"+7ZJp0":60,"./Toast.js":2,"./controller/authController.js":3,"./controller/breadcrumbController.js":4,"./controller/createNewProjectController.js":5,"./controller/menuRightController.js":6,"./controller/pageHeaderController.js":7,"./controller/projectMainNavigationController.js":8,"./controller/projectOverviewController.js":9,"./controller/textEditorController.js":10,"./controller/translationViewController.js":11,"./controller/uploadController.js":12,"./controller/urlManipulator.js":13,"./textEditor.js":16,"./trade.js":17,"./uiModules/anchorMenu.js":19,"./uiModules/auth.js":20,"./uiModules/breadcrumb.js":21,"./uiModules/createNewProject.js":22,"./uiModules/displayManager.js":23,"./uiModules/imageViewer.js":25,"./uiModules/menuRight.js":27,"./uiModules/projectMainNavigation.js":29,"./uiModules/projectOverview.js":30,"./uiModules/texts.js":31,"./uiModules/translationView.js":32,"./uiModules/translationViewDescription.js":33,"./uiModules/translationViewImageUpload.js":34,"./uiModules/upload.js":35,"./unicode.js":36,"buffer":55,"canny":38,"canny/mod/flowControl":40,"canny/mod/repeat":41,"canny/mod/whisker":42,"dom-opts":54}],16:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
/**
 * textEditor
 */
(function () {
    "use strict";

    var textEditor = (function () {

        var texts = {
            originText : 'Double click to edit this text',
            editBtn : 'Edit',
            cancelBtn : 'Cancel',
            changeBtn : 'Save changes'
        },
        onChangeAllList = [];

        function callChangeList(id, value, fc) {
            onChangeAllList.forEach(function (cb) {
                return cb(id, value, fc);
            });
        }

        function editWithTextarea(node, buttonWrap, obj) {
            var open = false,
                divWrapper = document.createElement('div'),
                button = document.createElement('div'),
                cancelButton = document.createElement('div'),
                area = document.createElement('textarea'),
                jsTextN,
                id = typeof obj === 'object'? obj.id : obj;

            if (obj && obj.hasOwnProperty('placeholder')) {
                area.setAttribute('placeholder', obj.placeholder);
            }

            function close() {
                node.classList.add('textEditor-hide');
                open = false;
            }

            function edit() {
                if (!open) {
                    jsTextN = node.querySelector('.js-text');
                    open = true;
                    area.value = jsTextN.innerHTML;
                    setTimeout(function () {
                        node.classList.remove('textEditor-hide')
                    }, 100);
                }
            }

            // set classes
            cancelButton.className = 'textEditor-button textEditor-button-cancel octicon octicon-x';
            button.className = 'textEditor-button textEditor-button-change octicon octicon-check';
            area.className = 'textEditor-area';
            divWrapper.className = 'textEditor-wrap-area';
            node.classList.add('textEditor-hide');

            // register listeners
            cancelButton.addEventListener('click', close);
            button.addEventListener('click', function () {
                var val = area.value,
                    ret = callChangeList(id, val, function (success) {
                        if (success) {
                            jsTextN.innerHTML = val;
                            close();
                        } else {
                            console.warn('textEditor:toTextareaNode text not accepted! Ignore changes.');
                        }
                    });
            });
            node.addEventListener('dblclick', edit);

            // set titles
            node.setAttribute('title', texts.originText);
            cancelButton.setAttribute('title', texts.cancelBtn);
            button.setAttribute('title', texts.changeBtn);

            // append to wrapper div
            divWrapper.appendChild(area);
            buttonWrap.appendChild(cancelButton);
            buttonWrap.appendChild(button);

            // append to parent
            node.appendChild(divWrapper);

            // return click function
            return function () {
                if (!open) { // show input
                    edit();
                } else { // show text
                    close();
                }
            }
        }

        return {
            /**
             * Register a function to a specific editor.
             * If the function returns undefined than the editor expect that the passed callback
             * is called with true or false. If the method returns true the text will change.
             * If the method returns false the text is not changed.
             *
             * @param id
             * @param fc <- is called with (textValue, callbackFunction) can return undefined, false and true
             */
            onChange : function (fc) {
                onChangeAllList.push(fc);

            },
            /**
             *
             * @param node
             * @param id
             */
            add : function (node, obj) {
                var buttonWrap = document.createElement('div'),
                    editIconButton =  document.createElement('div');
                buttonWrap.className ='textEditor-buttonWrap';
                editIconButton.className = 'textEditor-button textEditor-button-edit octicon octicon-pencil';
                editIconButton.addEventListener('click', editWithTextarea(node, buttonWrap, obj));
                editIconButton.setAttribute('title', texts.editBtn);
                // append editIconButton to parent
                node.classList.add('textEditor-main-wrap');
                buttonWrap.appendChild(editIconButton);
                node.appendChild(buttonWrap);
            }
        }
    }());

    // export as module or bind to global
    if (typeof module !== 'undefined' && module.hasOwnProperty('exports')) { module.exports = textEditor; } else {canny.add('textEditor', textEditor); }

}());
}).call(this,require("+7ZJp0"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/textEditor.js","/")
},{"+7ZJp0":60,"buffer":55}],17:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
/*jslint browser: true */
/**
 * handle the connection between server and client
 */
var canny = require('canny'),
    events = require('./events.js'),
    shoe = require('shoe'),
    dnode = require('dnode'),
    stream = shoe('/trade'),
    d = dnode();

window.domOpts = window.domOpts || require('dom-opts');
/**
 * Some of the callbacks are handled via the registered controller - addController method.
 */
var trade = (function () {
    "use strict";
    // ready queue call registered call backs when trade is ready
    var cbs = [],
        server,
        registeredController = [];

    /**
     *
     * @param functionName the function to call
     * @param args an array of parameters which are passed to the function
     */
    function callController(functionName, args) {
        registeredController.forEach(function (controller) {
            if (controller.hasOwnProperty(functionName)) {
                controller[functionName].apply(null, args);
            }
        });
    }

    return {
        initialize : function () {
            d.on('remote', function (server) {
                trade.init(server);
            });
            d.pipe(stream).pipe(d);
        },
        addController : function (obj) {
            registeredController.push(obj);
        },
        /**
         * Load the whole project files with all required data (project specific json)
         * @param projectId
         * @param cb
         */
        loadProject : function (projectId, cb) {
            server.loadProject(projectId, function (returnValue) {
                var args = [].slice.call(arguments);
                if (returnValue) {
                    callController('onLoadProject', args);
                } else {
                    // callback a error so the caller has the control about error handling
                    cb && cb(false);
                }
            });
        },
        /**
         * actually same as saveKey but the internal controller call is different
         * @param projectId
         * @param language
         * @param keyAndValue
         * @param cb
         */
        createKey : function (projectId, language, keyAndValue, cb) {
            server.saveKey(projectId, language, keyAndValue,
                function(err, key, value) {
                    // TODO handle error case
                    if (!err) {
                        cb(projectId, language, key, value);
                        callController('onCreateKey', [projectId, language, key, value]);
                    }
                });
        },
        /**
         * Save changes to a key's value. Change will be broadcast to other clients.
         * @param projectId
         * @param language
         * @param keyAndValue an object of { key : "value" }
         * @param cb callback to execute after saving
         */
        saveKey : function (projectId, language, keyAndValue, cb) {
            server.saveKey(projectId, language, keyAndValue,
                function(err, key, value) {
                    // TODO handle error case
                    if (!err) {
                        cb(projectId, language, key, value);
                    }
            });
        },
        /**
         *
         * @param projectName
         * @param currentDirId if of the directory in which the new project will be created
         */
        createNewProject : function (projectName, currentDirId) {
            server.createNewProject(currentDirId, projectName, {}, function(err, projectData) {
                // TODO handle error case
                if (!err) {
                    callController('onNewProjectCreated', [projectData]);
                }
            });
        },
        createNewDirectory : function(directoryName, currentDirectory) {
            server.createNewDirectory(directoryName, currentDirectory, function(err, directoryData) {
                // TODO handle error case
                if (!err) {
                    callController('onNewDirectoryCreated', [directoryData]);
                }
            });
        },
        /**
         * Renames a key for all languages
         * @param projectId
         * @param obj {newKey: string, oldKey: string}
         */
        renameKey : function (projectId, obj) {
            server.renameKey(projectId, {
                newKey : obj.newKey,
                oldKey : obj.oldKey
            }, function (err, oldKey, newKey) {
                if (!err) {
                    callController('renameKey', [oldKey, newKey]);
                } else {
                    callController('renameKey', [false]);
                }
            });
        },
        /**
         * Removes a key for all languages.
         * @param projectId
         * @param keyName
         */
        removeKey : function (projectId, keyName) {
            server.removeKey(projectId, keyName, function (err, keyName) {
                if (!err) {
                    callController('removeKey', [keyName]);
                }
            });
        },
        removeImage : function(projectId, categoryName) {
            server.removeImage(projectId, categoryName, function (err, categoryName) {
                if (!err) {
                    callController('imageRemoved', [categoryName]);
                }
                else {
                    toast.showMessage(err.message);
                }
            });
        },
        // Not really tested
        ready : function (cb) {
            if (server) {
                cb();
            } else {
                cbs.push(cb);
            }
        },
        init : function (s) {
            server = s;
            server.attachClientCallbacks(events.serverEvents);
            // call ready queue
            cbs.map(function (cb) {
                cb && cb();
                return null;
            });
        },
        /**
         *
         * Get the contents of the directory.
         *
         * @param dir the selected directory.
         * @param cb {projects:[String]:dirs:[String]}
         */
        getDirectory : function (dir, cb) {
            server.getDirectory(dir, function (args) {
                // only call the controller if not false
                cb && cb(args);
                if (args !== false) {
                    callController('getDirectory', [args]);
                }
            });
        },
        saveProjectDescription : function(projectId, id, description, callback) {
            server.saveProjectDescription(projectId, id, description, function(err) {
                if (!err) {
                    callback && callback(true);
                    callController('savedProjectDescription', []);
                } else {
                    callback && callback(false);
                }
            });
        }
    };
}());

module.exports = trade;
}).call(this,require("+7ZJp0"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/trade.js","/")
},{"+7ZJp0":60,"./events.js":14,"buffer":55,"canny":38,"dnode":43,"dom-opts":54,"shoe":74}],18:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
var uiEvent = (function () {
    var eventQueues = {
            activateLanguage : [],
            deActivateLanguage : [],
            addLanguage: [],
            showExportDialog: [],
            projectSelected: [],
            showOverviewPage: [],
            updateKey: [],
            anchorFocus: [],
            enableEditorMode: [],
            showFileUpload: [],
            fileUploaded: []
    };
    return {
        addUiEventListener : function (obj) {
            Object.keys(obj).forEach(function (key) {
                if (eventQueues.hasOwnProperty(key)) {
                    eventQueues[key].push(obj[key]);
                }
            });
        },
        callUievent : function (eventName, args) {
            var argsList = [].slice.call(arguments, 1, arguments.length);
            if (eventQueues.hasOwnProperty(eventName)) {
                eventQueues[eventName].forEach(function (fc) {
                   fc.apply(null, argsList);
                });
            }
        }
    }
}());

module.exports = uiEvent;

}).call(this,require("+7ZJp0"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/uiEventManager.js","/")
},{"+7ZJp0":60,"buffer":55}],19:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
/**
 * anchorMenu
 *
 * TODO show the actual frame:
 *  * detect which dome categories in dom are in view and add a classes to the menu ul category.
 *      * the expected effect will be look like a frame which categories are in view
 *      * first-child border-top last-child border bottom and the rest border left and right will give a frame effect
 *
 *  do it for all c-anchorMenu-parent element which could be found in view
 *
 * The anchor menu shows all elements which have the class c-anchorMenu-parent as parent and searches for children
 * with class c-anchorMenu-child. It renders a ul li list and registered a click call to throw a click event with the id.
 *
 * @type {exports}
 */
var util = require('../util/url'),
    rootNode,
    parentNodeList = [],
    onSelect = function () {},
    shrinkOffsetForViewDetection = 100,
    highlightTopMostKey = (function() {

        var highlightedItem;

        /**
         * check if node is aligned top most in the browser view
         * @param obj
         */
        return function() {

            var firstOpenCategory = rootNode.querySelector('li.c-inView'),
                currentMainViewCategoryNode,
                currentMainViewCategoryChildNodes,
                mainViewTopMostKeyNode;

            if (!firstOpenCategory) {
                return;
            }

            // Reset previous highlighted item
            if (highlightedItem) {
                highlightedItem.classList.remove('c-key-highlight');
            }

            // Highlight topmost item
            currentMainViewCategoryNode = document.body.querySelector('#' + firstOpenCategory.attributes.data.nodeValue);
            currentMainViewCategoryChildNodes = currentMainViewCategoryNode.querySelectorAll('.c-anchorMenu-child');
            mainViewTopMostKeyNode = getFirstElementInViewport(currentMainViewCategoryChildNodes);

            if (mainViewTopMostKeyNode) {
                highlightedItem = rootNode.querySelector('[data=' + mainViewTopMostKeyNode.id + ']');
                highlightedItem.classList.add('c-key-highlight');
            }
        }
    })();

function focusElement(id, elem) {
    var dom;
    // handle the active class from menu
    [].slice.call(rootNode.querySelectorAll('.c-active')).forEach(function (n) {
        n.classList.remove('c-active');
    });
    elem.classList.add('c-active');
    elem.parentNode.parentNode.classList.add('c-active');
    // handle the common dom active class
    [].slice.call(document.querySelectorAll('.c-anchorMenu-focus')).forEach(function (n) {
        n.classList.remove('c-anchorMenu-focus');
    });
    dom = document.getElementById(id);
    if (dom) {
        dom.classList.add('c-anchorMenu-focus');
    }
}
/**
 *
 * @param items [{id : string, children : [string]}]
 */
function addItems(root, items) {
    var ul = document.createElement('ul'),
        anchor = util.getAnchor();
    root.appendChild(ul);
    items.forEach(function (catObj) {
        var li = document.createElement('li'),
            cat = catObj,
            span = document.createElement('span');
        if (typeof catObj === 'object') {
            cat = catObj.value || catObj.id;
        }
        span.appendChild(document.createTextNode(cat));
        li.appendChild(span);
        li.setAttribute('data', catObj.id);
        span.addEventListener('click', function () {
            onSelect(catObj.id);
            focusElement(catObj.id, li);
        });

        if (catObj.children) {
            addItems(li, catObj.children)
        }
        ul.appendChild(li);
        if ('#' + catObj.id === anchor) {
            focusElement(catObj.id, li);
        }
    });
}

/**
 * check is the node is in the view
 * @param node
 */
function isNodeInView(node) {
    var w = {
            top: window.scrollY,
            bottom : window.scrollY + window.innerHeight
        },
        bodyRect = document.body.getBoundingClientRect(),
        elemRect = node.getBoundingClientRect(),
        offset = elemRect.top - bodyRect.top + shrinkOffsetForViewDetection,
        nodeHeight = offset + node.offsetHeight - (shrinkOffsetForViewDetection * 2);
    return offset > w.top && offset < w.bottom ||    // is top frame in view
        nodeHeight > w.top && nodeHeight < w.bottom ||  // is bottom frame in view
        offset < w.top && nodeHeight > w.bottom;    // is top frame above view and bottom frame below view
}

function cutCategories(val) {
    var split = val.split('_');
    if (split.length > 1) {
        split.splice(0, 1);
    }
    return {
        id : val,
        value : split.join('_')
    }
}

function expandCategoriesInView()     {
    parentNodeList.forEach(function (obj) {
        var li = rootNode.querySelector('[data=' + obj.id + ']');
        if (isNodeInView(obj.node)) {
            li.classList.add('c-inView');
        } else {
            li.classList.remove('c-inView');
        }
    });
}

function getFirstElementInViewport(nodes) {
    var keyNode,
        pageScrollOffset = document.body.scrollTop,
        i = nodes.length,
        nodeMargin;

    while(i--) {
        keyNode = nodes[i];
        nodeMargin = parseInt(window.getComputedStyle(keyNode, null).marginBottom, 10);
        if(getPageOffsetForElement(keyNode) - nodeMargin * 2 <= pageScrollOffset) {
            return keyNode;
        }
    }

    // Return first key node for current active category
    return nodes[0];
}

function getPageOffsetForElement(elem) {
    var bodyRect = document.body.getBoundingClientRect(),
        elemRect = elem.getBoundingClientRect();
    return elemRect.top - bodyRect.top;
}

module.exports = {
    focusElement : function (id) {
        var li = rootNode.querySelector('[data=' + id + ']');
        if (li) {
            focusElement(id,li);
        }
    },
    onSelect : function (fc) {
        onSelect = fc;
    },
    renderMenu : function () {
        var catObj = [];
        // clear parent node list
        parentNodeList = [];

        [].slice.call(document.querySelectorAll('.c-anchorMenu-parent')).forEach(function (parent) {
            var id = parent.getAttribute('id'),
                children = [];
            // collect parents
            parentNodeList.push({node : parent, id : id});

            if (id) {
                [].slice.call(parent.querySelectorAll('.c-anchorMenu-child')).forEach(function (child) {
                    var id = child.getAttribute('id');
                    if (id) {
                        children.push(cutCategories(id));
                    }
                });
                catObj.push({id : id, children : children});
            }
        });
        [].slice.call(rootNode.children).forEach(function (child) {
            child.remove();
        });
        addItems(rootNode, catObj);
        rootNode.children[0].style.height = window.innerHeight - 125 + 'px';
    },
    add : function (node, attr) {
        rootNode = node;
    },
    ready : function () {
        window.addEventListener('scroll', function (e) {
            expandCategoriesInView();
            highlightTopMostKey();
        });
        window.addEventListener('resize', function () {
            if (rootNode.children[0]) {
                rootNode.children[0].style.height = window.innerHeight - 125 + 'px';
            }
        });
    }
};
}).call(this,require("+7ZJp0"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/uiModules/anchorMenu.js","/uiModules")
},{"+7ZJp0":60,"../util/url":37,"buffer":55}],20:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
var onLogout = function () {console.log('auth:onLogout is not handled')},
    brain = {
        logoutButton : function (node) {
            node.addEventListener('click', onLogout);
        }
    };

module.exports = {
    onLogout : function (fc) {
        onLogout = fc;
    },
    add : function (node, attr) {
        if (brain.hasOwnProperty(attr)) {
            brain[attr](node);
        }
    }
};
}).call(this,require("+7ZJp0"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/uiModules/auth.js","/uiModules")
},{"+7ZJp0":60,"buffer":55}],21:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
var repeatFcPointer,
    onClick = function (item) {
        console.warn('breadcrumb:click handler not registered', item);
    };

module.exports = {
    onClick : function (fc) {
        onClick = fc;
    },
    add : function (node, attr) {},
    /**
     *
     * @param parentDirectories [String]
     */
    updateFolders : function (parentDirectories) {
        repeatFcPointer(parentDirectories.map(function (item) {
            return {name : item.name, onClick : function () {
                onClick(item.id);
            }}
        }));
    },
    /**
     * for canny repeat to get
     */
    registerCannyRepeat : function (fc) {
        repeatFcPointer = fc;
    }
}

}).call(this,require("+7ZJp0"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/uiModules/breadcrumb.js","/uiModules")
},{"+7ZJp0":60,"buffer":55}],22:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
var onCreateNewProject = function() { console.warn('createNewProject.onCreateNewProject not set')},
    onCreateNewDirectory = function() { console.warn('createNewProject.onCreateNewDirectory not set')};

var projectNameInputNode,
    directoryNameInputNode;

function isValidProjectName(projectName) {
    return (projectName.length > 0 && projectName.search('\\.|,| ') === -1) ? true : false;
}

function isValidDirectoryName(directoryName) {
    // TBD more forbidden characters?
    return (directoryName.length > 0 && directoryName.search('/') === -1) ? true : false;
}

module.exports = {
    add : function(node, attribute) {
        switch (attribute) {
            case 'createNewProjectInputProject' :
                projectNameInputNode = node;
                break;
            case 'newDirectoryNameInput' :
                directoryNameInputNode = node;
                break;
            case 'createNewProjectSubmit' :
                node.addEventListener('click', function() {
                    var projectName = projectNameInputNode.value;
                    if (isValidProjectName(projectName)) {
                        onCreateNewProject(projectName);
                    } else {
                        projectNameInputNode.style.backgroundColor = '#ff4444';
                    }
                });
                break;
            case 'createNewDirectorySubmit' :
                node.addEventListener('click', function() {
                    var directoryName = directoryNameInputNode.value;
                    if (isValidDirectoryName(directoryName)) {
                        onCreateNewDirectory(directoryName);
                    } else {
                        directoryNameInputNode.style.backgroundColor = '#ff4444';
                    }
                });
                break;
        }
    },
    /**
     * Pass in listener for execution of creating new project.
     * @param func
     */
    onCreateNewProject : function(func) {
        onCreateNewProject = func;
    },
    /**
     * Pass in listener for execution of creating a new directory.
     * @param func
     */
    onCreateNewDirectoy : function(func) {
        onCreateNewDirectory = func;
    }
};

}).call(this,require("+7ZJp0"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/uiModules/createNewProject.js","/uiModules")
},{"+7ZJp0":60,"buffer":55}],23:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
var Overlay = require('./overlay');
	displayManager = function() {

		var mainController = canny.flowControl,
			overlayController = canny.flowControl.createNewInstance('overlays'),
			children = {
				overlay: {
					ids: [],
					controller: overlayController,
					add: function(node, id) {

						var overlay = new Overlay(node, id);
						overlay.onClick(function() {
							setDisplayStateById(id, false);
						});

						this.controller.add(overlay.node, {
							'view': overlay.id
						});
						this.ids.push(overlay.id);
					}
				},
				view: {
					ids: [],
					controller: mainController,
					add: function(node, id) {
						this.controller.add(node, {
							'view': id
						});
						this.ids.push(id);
					}
				}
			};

		function setDisplayStateById(id, show) {
			Object.keys(children).map(function(type) {
				var pool = children[type],
					ids = pool.ids,
					currentId;

				for (var i = 0; i < ids.length; i++) {
					currentId = ids[i];
					if (id === currentId) {
						if (show) {
							pool.controller.show(currentId);
						}
						else if (pool.controller.mod[id]) {
							pool.controller.mod[id].forEach(function(obj) {
								obj.hide();
							});
						}
						break;
					}
				}
			});
		}

		return {
			add: function(node, descriptor) {
				var keys, key;
				if (typeof descriptor === 'object') {
					keys = Object.keys(descriptor);
					for (var i = 0; i < keys.length; i++) {
						key = keys[i];
						if (children.hasOwnProperty(key)) {
							children[key].add(node, descriptor[key]);
						}
					}
				}
				else {
					console.warn('Parameter to add child to displayManager is not valid: ' + descriptor);
				}
			},
			show: function(id) {
				setDisplayStateById(id, true);
			},
			hide: function(id) {
				setDisplayStateById(id, false);
			}

		};
	};

module.exports = displayManager;
}).call(this,require("+7ZJp0"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/uiModules/displayManager.js","/uiModules")
},{"+7ZJp0":60,"./overlay":28,"buffer":55}],24:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
/**
 * handles all texts
 */
var domOpts = require('dom-opts'),
    flagMap = {
        da: 'dk',
        de: 'de',
        fr: 'fr',
        nl: 'nl',
        en: 'us',
        en_GB: 'gb',
        sv: 'se',
        es: 'es'
    };

function getLang(lang) {
    var flagLang = lang;
    if (flagMap.hasOwnProperty(lang)) {
        flagLang = flagMap[lang];
    }
    return flagLang;
}

module.exports = {
    getFlag : function (lang) {
        return domOpts.createElement('span', null, 'flag-icon flag-icon-' + getLang(lang));
    },
    getFlagClasses : function (lang) {
        return ['flag-icon', 'flag-icon-' + getLang(lang)];
    }
};
}).call(this,require("+7ZJp0"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/uiModules/flag.js","/uiModules")
},{"+7ZJp0":60,"buffer":55,"dom-opts":54}],25:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
/*global ace */
/*jslint browser: true */
var trade = require('../trade.js'),
    events = require('../events.js'),
    C = require('../CONST.js');

window.domOpts = window.domOpts || require('dom-opts');

var imageViewer = (function () {
    "use strict";

    var nodeToAppend,
        init = false,
        config = {
            idPrefix : 'imageViewer_'
        },
        setupContainerCSS = function (node, css) {
            for (var prop in css) {
                node.style[prop] =  css[prop];
            }
        },
        settings = {
            maxWidth : 300,
            maxHeight: 300
        },
        fc = {
            hideImageViewer : function () {
                var pres = nodeToAppend.domChildTags('img');

                if (pres.length > 0) {
                    // there are other open images
                    pres.forEach(function (e) {
                        e.domAddClass('hidden');
                    });
                }
            },
            showImage : function (obj) {
                var img, id = config.idPrefix + obj.id,
                    actualImg = document.getElementById(id);

                if (actualImg !== null) {
                    actualImg.domRemoveClass('hidden');
                } else {
                    img = new Image();
                    img.onload = function () {
                        console.log('DONE IMAGE');
                    };
                    img.src =  "data:image/png;base64," + obj.data;
                    setupContainerCSS(img, {
                        maxWidth : '100%',
                        maxHeight : '100%'
                    });
                    img.setAttribute('id', id);
                    img.domAppendTo(nodeToAppend);
                }
            }
        };

        events.addServerListener('sendFile', function (obj) {
            if (init) {
                fc.hideImageViewer();

                if (obj.fileType === C.FILE_MANAGER.FILE_TYPES.IMAGE) {
                    fc.showImage(obj);
                }
            }
        });


    return {
        add : function (node, attr) {
            init = true;
            nodeToAppend = node;
            nodeToAppend.setAttribute('id', 'imageViewer');

            setupContainerCSS(nodeToAppend, {
                width : settings.maxWidth + 'px',
                height: settings.maxHeight + 'px'
            });
        },
        setup : function (config) {
            var obj;
            for (obj in config) {
                settings[obj] = config[obj];
            }
        }
    };
}());

module.exports = imageViewer;
}).call(this,require("+7ZJp0"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/uiModules/imageViewer.js","/uiModules")
},{"+7ZJp0":60,"../CONST.js":1,"../events.js":14,"../trade.js":17,"buffer":55,"dom-opts":54}],26:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){

function addEdit(node, fc) {
   var div = domOpts.createElement('div', null, 'inputEditManager-button edit octicon octicon-pencil');
    div.addEventListener('click', function () {
        node.classList.add('c-edit');
        fc();
    });
    div.setAttribute('title', 'edit');
    node.appendChild(div);
}
function addCancel(node, fc) {
    var div = domOpts.createElement('div', null, 'inputEditManager-button cancel octicon octicon-x');
    div.addEventListener('click', function () {
        node.classList.remove('c-edit');
        fc();
    });
    div.setAttribute('title', 'cancel');
    node.appendChild(div);
}

function addSave(node, fc) {
    var div = domOpts.createElement('div', null, 'inputEditManager-button save octicon octicon-check');
    div.addEventListener('click', function () {
        fc();
    });
    div.setAttribute('title', 'save changes');
    node.appendChild(div);
}

function addDelete(node, fc) {
    var div = domOpts.createElement('div', null, 'inputEditManager-button delete octicon octicon-trashcan');
    div.addEventListener('click', function () {
        fc();
    });
    div.setAttribute('title', 'remove this key');
    node.appendChild(div);
}

function closeEditorView(keyInputNode) {
    var editorPanelNode = keyInputNode.parentNode.querySelector('.inputEditManager.wrap');
    if (editorPanelNode) {
        editorPanelNode.classList.remove('c-edit');
    }
}

module.exports = {
    /**
     * each key input node hast
     * @param keyInputNode
     */
    closeEditView : function (keyInputNode) {
        if (keyInputNode) {
            closeEditorView(keyInputNode);
        }
    },
    addEditorPanel : function (keyNode, listeners) {
        var containerNode = domOpts.createElement('div', null, 'inputEditManager wrap');

        if (listeners.hasOwnProperty('onEdit')) {
            addEdit(containerNode, listeners.onEdit);
        }

        if (listeners.hasOwnProperty('onDelete')) {
            addDelete(containerNode, listeners.onDelete);
        }
        if (listeners.hasOwnProperty('onSave')) {
            addSave(containerNode, listeners.onSave);
        }
        if (listeners.hasOwnProperty('onCancel')) {
            addCancel(containerNode, listeners.onCancel);
        }

        containerNode.domAppendTo(keyNode);
    },
    removePanel : function (node) {
        node.querySelector('.inputEditManager.wrap').domRemove();
    }
}
}).call(this,require("+7ZJp0"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/uiModules/inputEditManager.js","/uiModules")
},{"+7ZJp0":60,"buffer":55}],27:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){

var rootNode;

module.exports = {
    show : function () {
        rootNode.classList.add('c-show');
    },
    hide : function () {
        rootNode.classList.remove('c-show');
    },
    add : function (node, attr) {
        if (attr === 'button') {
            node.addEventListener('click', function () {
               if (rootNode.classList.contains('c-show')) {
                   rootNode.classList.remove('c-show');
               } else {
                   rootNode.classList.add('c-show');
               }
            });
        } else {
            rootNode = node;
        }
    }
};

}).call(this,require("+7ZJp0"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/uiModules/menuRight.js","/uiModules")
},{"+7ZJp0":60,"buffer":55}],28:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
module.exports = function Overlay(node, id) {

	var id = id,
		node = node,
		clickHandler = function() {
			console.warn('Click listener not attached for overlay with id: ' + id);
		};

	node.classList.add('displayManager-overlay');
	node.addEventListener('click', function (e) {
		if (node === e.target) {
			clickHandler();
		}
	});

	return {
		id: id,
		node: node,
		onClick: function(cb) {
			clickHandler = cb;
		}
	}
};
}).call(this,require("+7ZJp0"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/uiModules/overlay.js","/uiModules")
},{"+7ZJp0":60,"buffer":55}],29:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
/*global */
/*jslint browser: true*/

var canny = require('canny'),
    flag = require('./flag'),
    texts = require('./texts'),
    uiEvents = require('../uiEventManager.js');

/**
 * E.g.: canny-mod="flowControl" canny-var="{'view' : 'viewToShow'}"
 *
 * you can activate a initial view with a anchor in the URL e.g.: yourdomain.html#viewToShow
 * Or pass a comma separated module list for activate more module #viewToShow,otherView
 *
 * TODO made it possible to summarize views with one identifier.
 * Instead of call: gdom.flowControl.show('view1', 'view2', 'view3') call gdom.flowControl.show('view').
 */
var projectMainNavigation = (function () {
    "use strict";

    var mainNode,
        selectLanguageQueue = [],
        onShowJSONQueue = [],
        onEnableEditorModeQueue = [],
        onShowJMBFQueue = [],
        bundleName = window.domOpts.params.bundle,
        modViews = {
            main : function (node) {
                mainNode = node;
            },
            menuToggleButton : function (node) {
                new svgIcon(node, {
                    hamburgerCross : {
                        url : '/dist/animatedSVG/svg/hamburger.svg',
                        animation : [
                            {
                                el : 'path:nth-child(1)',
                                animProperties : {
                                    from : { val : '{"path" : "m 5.0916789,20.818994 53.8166421,0"}' },
                                    to : { val : '{"path" : "M 12.972944,50.936147 51.027056,12.882035"}' }
                                }
                            },
                            {
                                el : 'path:nth-child(2)',
                                animProperties : {
                                    from : { val : '{"transform" : "s1 1", "opacity" : 1}', before : '{"transform" : "s0 0"}' },
                                    to : { val : '{"opacity" : 0}' }
                                }
                            },
                            {
                                el : 'path:nth-child(3)',
                                animProperties : {
                                    from : { val : '{"path" : "m 5.0916788,42.95698 53.8166422,0"}' },
                                    to : { val : '{"path" : "M 12.972944,12.882035 51.027056,50.936147"}' }
                                }
                            }
                        ]
                    }
                }, {
                    easing : mina.elastic, speed: 1200, size : {w : '4em', h : '3em'}
                });
                node.addEventListener('click', function () {
                    if (mainNode.classList.contains('c-open')) {
                        mainNode.classList.remove('c-open');
                    } else {
                        mainNode.classList.add('c-open');
                    }
                })
            },
            showResourceBundleEditor : function (node) {
                // reload the page because the files are not synced
                node.setAttribute('href', '#');
                node.addEventListener('click', function () {
                    location.reload();
                });
            },
            showMessageBundleFormat : function (node) {
                node.addEventListener('click', function () {
                    onShowJMBFQueue.forEach(function (fc) {
                        fc();
                    });
                });
            },
            showJSONBundle : function(node) {
                node.addEventListener('click', function() {
                    onShowJSONQueue.forEach(function (fc) {
                        fc();
                    });
                });
            },
            enableEditorMode : function(node) {
                node.addEventListener('click', function() {
                    onEnableEditorModeQueue.forEach(function (fc) {
                        fc();
                    });
                });
            },
            from : function (node) {
                this.from.node = node;
            },
            to : function (node) {
                this.to.node = node;
            }
        };

    /**
     *
     * @param locales []
     * @param node
     */
    function setLocale(locales, node) {
        var ul = node.querySelector('.languages'), li, languageNameNode, progressNode, flagIC;
        if (ul) {
            // remove all existing children first
            [].slice.call(ul.querySelectorAll('li')).forEach(function (elem) {
                ul.removeChild(elem);
            });
        } else {
            ul = window.domOpts.createElement('ul', null, 'navigationMenu languages');
        }
        locales.forEach(function (key) {
            var numOfTransKeys = window.domOpts.createElement('span', null, 'numOfTransKeys'),
                maxKeyNode = window.domOpts.createElement('span', null, 'maxKey');
            li = window.domOpts.createElement('li');
            languageNameNode = window.domOpts.createElement('span');
            progressNode = window.domOpts.createElement('span', null, 'progress');
            numOfTransKeys.appendChild(document.createTextNode('-'));
            numOfTransKeys.domAppendTo(progressNode);
            progressNode.appendChild(document.createTextNode('/'));
            maxKeyNode.appendChild(document.createTextNode('-'));
            maxKeyNode.domAppendTo(progressNode);

            li.classList.add('lang', key);

            li.addEventListener('click', function () {
                var isInactive = true,
                    isActive = this.classList.contains('c-active');

                if (isActive) {
                    this.classList.toggle('c-inactive');
                    isInactive = this.classList.contains('c-inactive');
                } else {
                    // has no state
                }

                selectLanguageQueue.forEach(function (fc) {
                    fc({
                        isActive : isActive,
                        isInactive : isInactive,
                        project : bundleName,
                        language: key
                    });
                });
            });

            languageNameNode.innerHTML = texts.getLanguageNames(key);
            languageNameNode.className = 'langName';
            languageNameNode.domAppendTo(li);
            progressNode.domAppendTo(li);
            flagIC = flag.getFlag(key);
            flagIC.classList.add('icon', 'octicon', 'octicon-plus');
            flagIC.domAppendTo(li);
            li.domAppendTo(ul);
        });
        ul.domAppendTo(node);
    }

    /**
     * update all language max keys for all languages
     * @param keys
     * @param node
     */
    function updateMaxKeys(keys, node) {
        [].slice.call(node.querySelectorAll('.languages .lang')).forEach(function(langNode) {
            langNode.querySelector('.maxKey').innerHTML = keys;
        });
    }

    /**
     * update a specific language
     * @param key
     * @param lang
     * @param node
     */
    function updateNumberOfLangKeys(key, lang, node) {
        console.log('projectMainNavigation:updateNumberOfLangKeys', key, lang);
        node.querySelector('.languages .lang.' + lang + ' .numOfTransKeys').innerHTML = key;
    }

    return {
        setNumberOfTranslationMaxKeys : function (maxKeys) {
            updateMaxKeys(maxKeys, modViews.from.node);
        },
        setNumberOfTranslatedLanguageKey : function (numberOfKeys, lang) {
            updateNumberOfLangKeys(numberOfKeys, lang, modViews.from.node);
        },
        onLanguageSelect : function (fc) {
            selectLanguageQueue.push(fc);
        },
        onShowJSON : function (fc) {
            onShowJSONQueue.push(fc);
        },
        onShowJMBF : function (fc) {
            onShowJMBFQueue.push(fc);
        },
        onEnableEditorMode : function (fc) {
            onEnableEditorModeQueue.push(fc);
        },
        activateLang : function (lang) {
            var node = mainNode.querySelector('li.' + lang);
            node.classList.remove('c-inactive');
            node.classList.add('c-active');
        },
        deActivateLang : function (lang) {
            var node = mainNode.querySelector('li.' + lang);
            node.classList.add('c-inactive');
        },
        /**
         * Apply the current project's number to the flags: activate flag where translations exist and show number of
         * translated keys.
         * @param keysTotal the total number of keys
         * @param translatedKeysPerLang the number of translated keys per language
         */
        setActivatedProjectLanguages : function (keysTotal, translatedKeysPerLang) {
            [].slice.call(mainNode.querySelectorAll('li')).forEach(function (node) {
                var progressNode = node.querySelector('.progress');
                node.classList.remove('c-active');
                if (progressNode) {
                    progressNode.children[0].innerHTML = "-";
                    progressNode.children[1].innerHTML = "-";
                }
            });

            Object.keys(translatedKeysPerLang).forEach(function (key) {
                [].slice.call(mainNode.querySelectorAll('li.' + key)).forEach(function (node) {
                    var progressNode = node.querySelector('.progress');
                    node.classList.add('c-active');
                    if (progressNode) {
                       progressNode.children[0].innerHTML = translatedKeysPerLang[key];
                       progressNode.children[1].innerHTML = keysTotal;
                    }
                });
            })
        },
        setAvailableLanguages : function (languages) {
            setLocale(languages, modViews.from.node);
        },
        ready : function () {
            console.log('nav-controller ready event');
        },
        add : function (node, attr) {    // part of api
            if (modViews.hasOwnProperty(attr)) {
                modViews[attr](node);
            } else {
                console.log('LINK NOT IMPLEMENTED');
            }
        }
    };
}());

module.exports =  projectMainNavigation;
}).call(this,require("+7ZJp0"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/uiModules/projectMainNavigation.js","/uiModules")
},{"+7ZJp0":60,"../uiEventManager.js":18,"./flag":24,"./texts":31,"buffer":55,"canny":38}],30:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
var projectOverview = (function() {
    'use strict';

    var componentRootNode,
        renderProjectsAndDirectoriesList,
        onCreateProjectPressed = function() { console.warn('projectOverview.onCreateProjectPressed not set')},
        onParentDirectorySelected = function() {console.warn('projectOverview.onParentDirectorySelected not set')},
        onProjectSelected = function() { console.warn('projectOverview.onProjectSelected not set')},
        onDirectorySelected = function() { console.warn('projectOverview.onDirectorySelected not set')},
        onCreateDirectoryPressed = function() { console.warn('projectOverview.onCreateDirectoryPressed not set')};

    return {
        /**
         * Called from canny when registering components. The only component which we expect to be registered is
         * "projectOverviewContainer" (the root node of the component).
         * @param node
         * @param vars
         */
        add: function (node, attr) {
            if (componentRootNode === undefined) {
                componentRootNode = node;
            } else {
                console.warn('projectOverview:add multiple views detected - it should be registered only ones in the DOM!');
            }
        },
        /**
         * Called from canny on documentReady event.
         */
        ready: function() {

            var createProjectButtonNode = componentRootNode.querySelector('.js-createProjectButton');
            if (!createProjectButtonNode) {
                console.error('No child node with class "createProjectButton found inside "projectOverviewContainer"');
            } else {
                createProjectButtonNode.addEventListener('click', function(event) {
                    onCreateProjectPressed();
                });
            }

            var createFolderButtonNode = componentRootNode.querySelector('.js-createFolderButton');
            if (!createFolderButtonNode) {
                console.error('No child node with class "createFolderButton found inside "projectOverviewContainer"');
            } else {
                createFolderButtonNode.addEventListener('click', function(event) {
                    onCreateDirectoryPressed();
                });
            }

            var selectParentDirectoryButton = componentRootNode.querySelector('.js-selectParentDirectoryButton');
            if (!selectParentDirectoryButton) {
                console.error('No child node with class "selectParentDirectoryButton" found inside "projectOverviewContainer"');
            } else {
                selectParentDirectoryButton.addEventListener('click', function(event) {
                    onParentDirectorySelected();
                });
            }
        },
        /**
         * Inform the ui module about the new current set of directories and projects to list. This will also trigger
         * a new rendering of the projects list with the new content.
         * @param projectNames
         * @param directoryNames
         */
        setProjectsAndDirectories: function (projectNames, directoryNames) {
            var projectsAndDirectories = [];

            if (!projectNames || !directoryNames) {
                return;
            } else if (!renderProjectsAndDirectoriesList) {
                console.error('renderProjectsAndDirectoriesList function has not been set, new list cannot be shown');
                return;
            }

            console.log('got projects', projectNames);
            console.log('got directories', directoryNames);

            projectNames.forEach(function(projectName) {
                projectsAndDirectories.push({
                    name : projectName,
                    dir : false,
                    openProjectListItem : function () {
                        console.log('project selected:', projectName);
                        if (onProjectSelected) {
                            onProjectSelected(projectName);
                        }
                    }
                });
            });
            directoryNames.forEach(function(directoryName) {
                projectsAndDirectories.push({
                    name : directoryName,
                    dir : true,
                    openProjectListItem : function() {
                        console.log('directory selected:', directoryName);
                        if (onDirectorySelected) {
                            onDirectorySelected(directoryName);
                        }
                    }
                });
            });

            renderProjectsAndDirectoriesList(projectsAndDirectories);
        },
        /**
         * For canny-repeat registered on the projects list, provide the function for rendering the list.
         * @param func a function which will set the list of projects and directories.
         */
        setRenderProjectsAndDirectoriesListFunction : function(func) {
            renderProjectsAndDirectoriesList = func;
        },
        /**
         * Register a listener callback which will react to "to parent directory" event.
         * @param listener
         */
        onParentDirectorySelected : function(listener) {
            onParentDirectorySelected = listener;
        },
        /**
         * Register a listener callback which will react to clicks on a project. The callback function should expect
         * one parameter which is the project name.
         * @param listener
         */
        onProjectSelected : function(listener) {
            onProjectSelected = listener;
        },
        /**
         * Register a listener callback which will react to clicks on a directory. The callback function should expect
         * one parameter which is the directory name.
         * @param listener
         */
        onDirectorySelected : function(listener) {
            onDirectorySelected = listener;
        },
        onCreateProjectPressed : function(func) {
            onCreateProjectPressed = func;
        },
        onCreateDirectoryPressed : function(func) {
            onCreateDirectoryPressed = func;
        }
    };
})();

module.exports = projectOverview;

}).call(this,require("+7ZJp0"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/uiModules/projectOverview.js","/uiModules")
},{"+7ZJp0":60,"buffer":55}],31:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
/**
 * handles all texts
 */
var texts = (function () {
    'use strict';
    var node,
        languageNames = {
            da: 'Danmark',
            de: 'Deutschland',
            fr: 'France',
            nl: 'Nederland',
            en: 'United States (Default)',
            en_GB: 'United Kingdom',
            sv: 'Sverige',
            es: 'Espanol'
        },
        texts = {
            changeTexts :  function () {},
            data : {
                projectName: '',
                projectDescription: ''
            }
        };

    return {
        getLanguageNames : function (key) {return languageNames[key]},
        setTexts : function (data) {
            texts.changeTexts('msg', data);
        },
        getTexts : function (fc) {
            console.log('texts:yes text is triggered');
            texts.changeTexts = fc;
            texts.changeTexts('msg', texts.data);
        },
        add : function (elem, attr) {
            node = elem;
        },
        ready : function () {
            console.log('texts ready!');
        }
    };
}());

module.exports = texts;
}).call(this,require("+7ZJp0"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/uiModules/texts.js","/uiModules")
},{"+7ZJp0":60,"buffer":55}],32:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){

var flag = require('./flag.js'),
    inputEditManager = require('./inputEditManager.js'),
    displayManager = require('canny').displayManager,
    conf = {
        rowPrefix : "",
        inputPrefix : "_value",
        inputTransPrefix : "_trans"
    };
/**
 * Rename all DOM id attributes from old to new key
 * @param oldKey
 * @param newKey
 */
function renameDOMIds(oldKey, newKey, availableLanguages) {
    Object.keys(conf).forEach(function (prop) {
        var node;
        if (prop === 'inputTransPrefix') {
            availableLanguages.forEach(function (lang) {
                node = document.getElementById(getLanguageTextId(oldKey, lang));
                if (node) {
                    node.setAttribute('id', getLanguageTextId(newKey, lang));
                } else {
                    console.error('translationView:renameIds can not find dom node for id', getLanguageTextId(newKey, lang));
                }
            })
        } else {
            node = document.getElementById(oldKey + conf[prop]);
            if (node) {
                console.log('translationView:rename id:' , oldKey + conf[prop], 'property:', prop);
                node.setAttribute('id', newKey + conf[prop]);
            } else {
                // TODO why this failure throws when rename a key but all is working fine - ????
                console.error('translationView:renameIds can not find dom node for id', oldKey + conf[prop], 'property:', prop);
            }
        }
    });
}

function textAreaKeyPressListener(e) {
    var key = e.keyCode || e.which;
    if (key === 13) {
        e.returnValue = false;
    }
    return true;
}

function keyKeyPressListener(e) {
    var key = e.keyCode || e.which;
    if (key === 32) {
        e.returnValue = false;
    }
    return true;
}

function validateNewKey(string) {
    return (string.length > 0 && string.search('\\.|,| ') === -1) ? true : false;
}

function getLanguageTextId(key, lang) {
    return [key, lang, conf.inputTransPrefix].join('_');
}
/**
 * handle the translation overview
 * TODO refactor base.connection
 */
var translationView = (function () {
    'use strict';

    // TODO remove project name - only the controller needs to know this
    function SaveOnLeave(node, key, lang, text) {
        var textList = [text],
            textIdx = 0;
        function getIdFromRow(node) {
            var id = node.parentNode.parentNode.parentNode.getAttribute('id').replace(conf.rowPrefix,'');
            console.log('translationView:getIdFromRow:', id);
           return id;
        }
        node.addEventListener('change', function (e) {
            console.log("Old: " + textList[textIdx]);
            var newValue = this.value;
            if (textList[textIdx] !== newValue) {
                textList.push(newValue);
                textIdx++;
            }
            console.log(textList);
            onSaveKey && onSaveKey(getIdFromRow(node), lang, newValue);
        });
    }

    function removeEventListenersFromRow(rowNode) {
        [].slice.call(rowNode.querySelectorAll('textarea')).forEach(function (tarea) {
            tarea.removeEventListener('change', false);
            tarea.setAttribute('readonly', 'true');
        });

        [].slice.call(rowNode.querySelectorAll('input')).forEach(function (input) {
            input.removeEventListener('keypress', false);
            input.setAttribute('readonly', 'true');
        });
    }

    var rootNode, // main node all content are added to here
        selectors = {
            root : "resourceBundleTable",
            debug : "debugIncomming",
            tpl : {
                tableBody : 'tableBody'
            }
        },
    // QUESTION: are these real queues?
        onQueues = {
            addNewKey : [],
            createNewProject : [],
            removeKey : [],
            renameKey : [],
            categoryClicked : []
        },
        ui = {
            css : {
                sendSuccess : 'sendSuccess',
                updateKey : 'updateKey'
            },
            sendSuccess : function (key, inputPrefix) {
                var node1  = document.getElementById(key),
                    node2  = document.getElementById(key + inputPrefix);
                if (node1) {ui.removeStateClasses(node1).classList.remove(ui.css.sendSuccess); setTimeout(function () {ui.removeStateClasses(node1).classList.add(ui.css.sendSuccess);}, 100) }
                if (node2) {ui.removeStateClasses(node2).classList.remove(ui.css.sendSuccess); setTimeout(function () {ui.removeStateClasses(node2).classList.add(ui.css.sendSuccess);}, 100)  }
            },
            updateInputFields : function (key, inputPrefix) {
                var node = document.getElementById(key + inputPrefix);
                if (node) {ui.removeStateClasses(node).domAddClass(ui.css.updateKey); }
            },
            removeStateClasses : function (node) {
                var cssState, classes = '';
                if (!node) {return; }
                // TODO refactor Object.keys()
                for (cssState in ui.css) {
                    classes += cssState + ' ';
                }
                node.domRemoveClass(classes);
                return node;
            }
        },
        error = {
            print : function (msg) {
                var node = document.getElementById('errorPrint');
                if (!node) {
                    node = document.createElement('div');
                    node.setAttribute('id', 'errorPrint');
                    node.style.padding = "20px";
                    node.style.backgroundColor = "#d3d3d3";
                    node.style.border = "2px solid #ff0000";
                    document.body.appendChild(node);
                }
                node.innerHTML = msg;
            }
        },
        /**
         * Callback (registered from controller) to be called when changes to a key must be saved
         */
        onSaveKey = function () {console.log('translationView:callback not implemented');},
        onCreateKey = function () {console.log('translationView:callback not implemented')},
        // methods needs to be implemented on controller side
        con = {
            // send resource method - implementation on controller side
            saveKey : function (key, lang, value) {}
        },
        brain = {
            createNewProjectInputProject : {
                init : function (node) {
                    this.node = node;
                }
            },
            createNewProjectProjectDescription : {
                init : function (node) {
                    this.node = node;
                }
            },
            createNewProjectSubmit : (function () {
                var node;
                return {
                    init : function (elem) {
                        node = elem;
                        node.addEventListener('click', function () {
                            var projectValue = brain.createNewProjectInputProject.node.value;

                            if (validateNewKey(projectValue)) {
                                // TODO read description field
                                onQueues.createNewProject.forEach(function (fc) {
                                    fc(projectValue, {
                                        description : brain.createNewProjectProjectDescription.node.value
                                    });
                                });
                                // TODO check if closed is needed?
                                displayManager.hide('createNewProjectView');
                            } else {
                                // TODO replace with classes
                                brain.createNewProjectInputProject.node.style.backgroundColor = '#ff4444';
                            }
                        });
                    }
                }
            }()),
            projectShow : {
                init : function (node) {
                    node.addEventListener('click', function () {
                        displayManager.show('translationViewProjectCategoryKey');
                    });
                }
            },
            projectInputCategory : {
                init : function (node) {
                    this.node = node;
                }
            },
            projectInputKey : {
                init : function (node) {
                    this.node = node;
                }
            },
            projectSubmit : (function () {
                var node;
                return {
                    init : function (elem) {
                        node = elem;
                        node.addEventListener('click', function () {
                            console.log('CREATE NEW CATEGORY KEY');
                            var categoryKey = brain.projectInputCategory.node.value,
                                key = brain.projectInputKey.node.value,
                                newKey;

                            if (validateNewKey(categoryKey) && validateNewKey(key)) {
                                // TODO default language
                                newKey = categoryKey + '_' + key;
                                onCreateKey(newKey);
                            } else {
                                // TODO replace with classes
                                brain.projectInputCategory.node.style.backgroundColor = '#ff4444';
                                brain.projectInputKey.node.style.backgroundColor = '#ff4444';
                            }
                        });
                    }
                }
            }())
        },
        fc = {
            enableEditorMode : function (enable) {
                if (enable) {
                    rootNode.classList.add('c-enableEditorMode');
                } else {
                    rootNode.classList.remove('c-enableEditorMode');
                }
            },
            sendSuccess : ui.sendSuccess,
            add : function (node, attr) {
                if (attr === 'main') {
                    rootNode = node;
                } else if (brain.hasOwnProperty(attr)) {
                    brain[attr].init(node);
                }
            },
            getViewKeyObject : function (obj) {
                var newKey,
                    contextName = null,
                    delemitter = '_';
                if (/\./.test(obj.key)) {
                    delemitter = '.';
                }

                newKey = obj.key.split(delemitter);

                if (newKey.length > 1) {
                    // use slice if we need the complete key in the view
                    contextName = newKey.splice(0, 1)[0];
                }
                return {
                    id : obj.key,  // deprecated
                    key : obj.key,
                    contextName : contextName,
                    keyName : newKey.join(delemitter),
                    value : obj.value
                };
            },
            isBundleEqual : function (bundle1, bundle2) {
                if (bundle1.bundle === bundle2.bundle && bundle1.locale === bundle2.locale) {
                    return true;
                }
                return false;
            },
            getBundleNameFrom : function () {

                return {
                    bundle : domOpts.params.bundle || 'messages',
                    locale : this.getFromParam()
                };
            },
            getFromParam : function () {
                return domOpts.params.from || 'de';
            },
            getBundleNameTo : function () {

                return {
                    bundle : domOpts.params.bundle || 'messages',
                    locale : domOpts.params.to || null
                };
            },
            getBundleName : function (locale) {
                var bundle  = domOpts.params.bundle || 'messages';
                return bundle + '_' + locale;
            },
            /**
             * Render the i18n input field for keys from a single language. The row header (i.e. the actual key field) is
             * rendered, too if it does not exist yet.
             * @param bundles {key: string, data: string}
             * @param actualLanguage
             * @param availableProjectLanguages
             * @param projectName
             */
            printBundleTemplate : function (bundles, actualLanguage, availableProjectLanguages, cb) {
                var keyObj,
                    projectNode,
                    /**
                     * Setup header and handle the category
                     * @param node
                     * @param keyObj
                     * @returns {HTMLElement}
                     */
                    prepareCategoryNode = function (node, keyObj) {
                        var categoryNode = document.getElementById(keyObj.contextName);
                        if (!categoryNode) {
                            categoryNode = document.querySelector('#templates .categoryNode').cloneNode(true);
                            categoryNode.classList.add('c-anchorMenu-parent');
                            var categoryName = keyObj.contextName;
                            var categoryNodeId = categoryName;
                            categoryNode.setAttribute('id', categoryNodeId);
                            if (categoryName) {
                                let h2 = categoryNode.querySelector('h2');
                                h2.appendChild(document.createTextNode(categoryName));
                                h2.addEventListener('click', function() {
                                    onQueues.categoryClicked.forEach(function (fc) {
                                        fc(categoryNodeId);
                                    });
                                });
                                // add the description functionality
                                var catDescNode = categoryNode.querySelector('.js-cat-description');
                                var span = document.createElement('span');
                                span.className = 'js-text';
                                catDescNode.appendChild(span);
                                if (catDescNode) {
                                    canny.textEditor.add(catDescNode, {id : categoryName, placeholder : 'Add here the category description'});
                                    canny.translationViewImageUpload.add(categoryNode.querySelector('.js-imageUpload-editButton'), categoryName);
                                }
                                // add add key input field and button
                                var keyNameInput = categoryNode.querySelector('input');
                                keyNameInput.setAttribute('category', categoryName);
                                keyNameInput.addEventListener('keypress', keyKeyPressListener);
                                categoryNode.querySelector('label').innerText = categoryName + "_";
                                var button = categoryNode.querySelector('button');
                                button.addEventListener('click', function () {
                                    if (validateNewKey(keyNameInput.value)) {
                                        var newKey = categoryName + '_' + keyNameInput.value;
                                        // TODO refactor this - server should add the key for all available languages - or pass default lang
                                        onCreateKey(newKey, actualLanguage);
                                    } else {
                                        button.style.color = '#ff0000';
                                        keyNameInput.style.backgroundColor = "#ff4444";
                                    }
                                });
                            }
                            rootNode.appendChild(categoryNode);
                        }
                        return categoryNode;
                    };

                bundles.forEach(function (data) {
                    keyObj =  fc.getViewKeyObject(data);
                    // TODO which who calc the cate...
                    projectNode = prepareCategoryNode(rootNode, keyObj);
                    fc.addRowWithLanguages(projectNode, keyObj, actualLanguage, availableProjectLanguages);
                    cb(projectNode.getAttribute('id'));
                    cb(keyObj.key);
                });
            },
            /**
             * creates a key field
             *
             * @param node
             * @param data
             */
            addKeyField : function (node, data) {
                var keyInputNode = document.getElementById(data.key + conf.inputPrefix),
                    keyNode;
                if (!keyInputNode) {
                    keyInputNode = domOpts.createElement('input', data.key + conf.inputPrefix, 'keyField');
                    keyNode = domOpts.createElement('div', null, 'data key octicon octicon-key');
                    keyInputNode.setAttribute('disabled', 'true');
                    inputEditManager.addEditorPanel(keyNode, {
                        onDelete : function () {
                            var yes = window.confirm('Delete this key?\nThis key with all translations will removed.');
                            if (yes) {
                                onQueues.removeKey.forEach(function (fc) {
                                    fc({
                                        key: data.key
                                    });
                                });
                            }
                        },
                        onEdit : function () {
                            keyInputNode.removeAttribute('disabled');
                            // save actual key for restoring if cancel
                            data.keyName = keyInputNode.value;
                            // get the key: take id attribute and remove the value from it
                            data.key = keyInputNode.getAttribute('id').replace(conf.inputPrefix, '');
                            keyInputNode.focus();
                        },
                        onCancel : function () {
                            keyInputNode.setAttribute('disabled', 'true');
                            keyInputNode.value = data.keyName;
                        },
                        onSave : function () {
                            console.log('translationView:addKeyField save new key');
                            var value = data.contextName ? data.contextName + '_' + keyInputNode.value : keyInputNode.value;
                            if (keyInputNode.value != '' && value != data.key) {
                                onQueues.renameKey.forEach(function (fc) {
                                    fc({
                                        newKey: value,
                                        oldKey: data.key
                                    });
                                });
                            }
                        }
                    });
                    // register the input key listener to capture wrong character
                    keyInputNode.addEventListener('keypress', keyKeyPressListener);

                    keyNode.setAttribute('data', data.keyName);

                    keyNode.appendChild(keyInputNode);
                    node.insertBefore(keyNode, node.children[0]);
                    keyInputNode.value =  data.keyName;
                }
            },
            /**
             * creates a languages field
             *
             * @param key
             * @param lang
             */
            addLanguageField : function (node, key, value, lang) {

                var textNode = document.getElementById(getLanguageTextId(key, lang)),
                    dataNode;

                if (!textNode) {
                    textNode = domOpts.createElement('textarea', getLanguageTextId(key, lang), 'textField');

                    dataNode = domOpts.createElement('div', null, 'data tpl js_' + lang);

                    textNode.addEventListener('keypress', textAreaKeyPressListener);

                    textNode.setAttribute('type', 'text');

                    new SaveOnLeave(textNode, key, lang, value);

                    dataNode.appendChild(textNode);
                    dataNode.appendChild(flag.getFlag(lang));

                    node.appendChild(dataNode);
                }

                if (value || value === ''){
                    textNode.value = value? unicode.encode(value) : '';
                }

            },
            /**
             * creates a row
             * @param key
             */
            getRow : function (node, key) {
                // try to get the row
                var row = document.getElementById(key + conf.rowPrefix),
                    translationContainer = row !== null ? row.querySelector('.translationContainer') : document.createElement('div');

                translationContainer.className = "translationContainer";

                // if there is a row but it is marked as removed than removed it
                if (row && row.classList.contains('c-removed')) {
                    row.domRemove();
                    row = undefined;
                }
                // create a row if the row is not exists
                if (!row) {
                    row = domOpts.createElement('div', key + conf.rowPrefix, 'row c-anchorMenu-child');
                    // add the description functionality
                    var catDescNode = document.createElement('div');
                    var span = document.createElement('span');
                    span.className = 'js-text';
                    catDescNode.appendChild(span);
                    catDescNode.className = 'js-row-description';
                    row.appendChild(catDescNode);
                    canny.textEditor.add(catDescNode, {id : key, placeholder : 'Add here the key description'});

                    // add the translation area field container
                    row.appendChild(translationContainer);
                    node.appendChild(row);

                }


                return row;
            },
            addRowWithLanguages : function (node, data, actualLanguage, allProjectLanguages) {
                var row = fc.getRow(node, data.key);

                fc.addKeyField(row, data);

                allProjectLanguages.forEach(function (lang) {
                    fc.addLanguageField(row.querySelector('.translationContainer'), data.key, actualLanguage === lang ? data.value : null, lang);
                });
            },
            addLanguage : function (keys, lang) {
                var row;
                keys.forEach(function (key) {
                    row = document.getElementById(key + conf.rowPrefix);
                    if (row) {
                        fc.addLanguageField(row.querySelector('.translationContainer'), key, null, lang);
                    } else {
                        console.log('translationView:addLanguage found key which is not available in view:', key);
                    }
                });
            },
            clearView : function () {
                // just reset all for now
                // TODO do it better ;)
                [].slice.call(rootNode.children).forEach(function (child) {
                    rootNode.removeChild(child);
                });
            },
            showLang : function (lang) {
                // show the lang tab
                rootNode.classList.remove('c-hide_' + lang);
            },
            /**
             * show a key as deleted
             * @param key
             */
            markKeyAsRemoved : function (key) {
                var row = document.getElementById(key + conf.rowPrefix),
                    removeIc;
                if (row && !row.classList.contains('c-removed')) {
                    row.classList.add('c-removed');
                    removeIc = domOpts.createElement('div', null, 'remove-button octicon octicon-x');
                    removeIc.addEventListener('click', function () {
                        row.domRemove();
                    });
                    removeIc.domAppendTo(row);
                    removeEventListenersFromRow(row);
                    inputEditManager.removePanel(row);
                } else {
                    console.error('translationView:markkeyAsRemoved no node found for key', key, row);
                }
            },
            /**
             * remove a key
             */
            removeKey : function (key) {
                var row = document.getElementById(key + conf.rowPrefix);
                if (row) {
                    row.domRemove();
                }
            },
            /**
             * rename a key
             *
             * @param oldKey
             * @param newKey
             * @param availableProjectLanguages []
             */
            renameKey : function (oldKey, newKey, availableProjectLanguages) {
                var keyInputNode = document.getElementById(oldKey + conf.inputPrefix),
                    keyName;

                if (keyInputNode) {
                    keyName = fc.getViewKeyObject({key: newKey}).keyName;
                    renameDOMIds(oldKey, newKey, availableProjectLanguages);
                    keyInputNode.value = keyName;
                    // close the edit view
                    inputEditManager.closeEditView(keyInputNode);
                    // disabled the input field
                    keyInputNode.setAttribute('disabled', 'true');
                    keyInputNode.parentNode.setAttribute('data', keyName);
                }
            },
            removeImage : function (categoryName) {
                var imageBox = rootNode.querySelector('#' + categoryName + ' .imageUpload-imageBox');
                while (imageBox.firstChild) {
                    imageBox.removeChild(imageBox.firstChild);
                }
                imageBox.classList.remove('c-show');
            },
            hideLang : function (lang) {
                rootNode.classList.add('c-hide_' + lang);
            },
            onCreateNewProject : function (cb) {
                onQueues.createNewProject.push(cb);
            },
            onCategoryClicked : function (cb) {
                onQueues.categoryClicked.push(cb);
            },
            onAddNewKey : function (cb) {
               onQueues.addNewKey.push(cb);
            },
            onRenameKey : function (cb) {
                onQueues.renameKey.push(cb);
            },
            onRemoveKey : function (cb) {
                onQueues.removeKey.push(cb);
            },
            /**
             * Set logic for handling saving changes to a key.
             * @param func
             */
            onSaveKey : function (func) {
                onSaveKey = func;
            },
            /**
             * Set logic for handling saving changes to a key.
             * @param func
             */
            onCreateKey : function (func) {
                onCreateKey = func;
            }
        };
    return fc;
}());

module.exports = translationView;

}).call(this,require("+7ZJp0"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/uiModules/translationView.js","/uiModules")
},{"+7ZJp0":60,"./flag.js":24,"./inputEditManager.js":26,"buffer":55,"canny":38}],33:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
var node;
module.exports = {
    add : function (elem ,attr) {
        node = elem;
    },
    addDescriptions : function (keyDescriptions) {
        Object.keys(keyDescriptions).forEach(function (key) {
            var parent = document.getElementById(key),
                child;
            if (parent) {
                child = parent.querySelector('.js-text');
                if (child) {
                    child.innerHTML = keyDescriptions[key];
                }
            }
        })
    }
}
}).call(this,require("+7ZJp0"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/uiModules/translationViewDescription.js","/uiModules")
},{"+7ZJp0":60,"buffer":55}],34:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
/**
 * is for the translation view to add the image upload button and show the images
 */
var rootNode,
    onUploadButton = function () { console.warn('translationViewImageUpload::onUploadButton() not implemented.'); },
    onDeleteButton = function () { console.warn('translationViewImageUpload::onDeleteButton() not implemented.'); };

function uploadButton(id) {
    var node = document.createElement('div');
    node.className = 'upload-btn octicon octicon-cloud-upload';
    node.addEventListener('click', function () {
        onUploadButton(id);
    });
    node.setAttribute('title', 'upload a image file');
    return node;
}

function editPanel(id) {
    var deleteBtn = document.createElement('div'),
        editBtn = document.createElement('div'),
        cancelBtn = document.createElement('div'),
        panelWrap = document.createElement('div');

    panelWrap.className = 'imageUpload-imageBox-editPanel';
    editBtn.className = 'edit-btn octicon octicon-pencil';
    editBtn.addEventListener('click', function () {
        panelWrap.classList.add('c-edit');
    });
    cancelBtn.className = 'cancel-btn octicon octicon-x';
    cancelBtn.addEventListener('click', function () {
        panelWrap.classList.remove('c-edit');
    });
    deleteBtn.className = 'delete-btn octicon octicon-trashcan';
    deleteBtn.addEventListener('click', function () {
        onDeleteButton(id);
    });
    
    deleteBtn.setAttribute('title', 'remove image');
    cancelBtn.setAttribute('title', 'cancel');
    editBtn.setAttribute('title', 'edit');

    panelWrap.appendChild(editBtn);
    panelWrap.appendChild(cancelBtn);
    panelWrap.appendChild(deleteBtn);
    return panelWrap;
}

function getImage(file) {
    var img = new Image();
    img.src = file;
    img.addEventListener('click', function () {
        var win = window.open(file, '_blank');
        win.focus();
    });
    return img;
}

function addImageContent(id, img) {
    var node = document.createElement('div'),
        resizeAble = document.createElement('div');
    resizeAble.className = 'imageUpload-imageBox-resizeable'; 
    node.className = 'imageUpload-imageBox-content';
    resizeAble.appendChild(img);
    node.appendChild(resizeAble);
    node.appendChild(editPanel(id));
    return node;
}

module.exports = {
    onUploadButton : function (fc) {
        onUploadButton = fc;
    },
    onDeleteButton: function (fc) {
        onDeleteButton = fc;
    },
    add : function (node, attr) {
        node.appendChild(uploadButton(attr))
    },
    appendImage : function (projectId, id, image) {
        var dom = document.getElementById(id),
            imgContainer;
        if (dom) {
            imgContainer = dom.querySelector('.js-imageUpload-box');
            if (imgContainer) {
                [].slice.call(imgContainer.children).forEach(function (n) {
                    n.remove();
                });
                imgContainer.classList.add('c-show');
                imgContainer.appendChild(addImageContent(id, getImage('/images' + projectId + '/' + image)));
            }
        }
    }
}
}).call(this,require("+7ZJp0"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/uiModules/translationViewImageUpload.js","/uiModules")
},{"+7ZJp0":60,"buffer":55}],35:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
/**
 * shows the uploader form to upload a image to the server
 */
var onUpload = function () {},
    brain = {
        fileInput : {
            init: function (node) {
                node.addEventListener('change', upload);
            }
        }
    };

function upload() {
    console.log('c-upload:trigger upload');
    var file = this.files[0];
    if (file) {
        // send it direct after drop
        [].slice.call(this.files).forEach(function (file) {
            // TODO instead pass  directly a array of files - so we save POST calls
            onUpload(file);
        });
        // cleanup value otherwise file with same name can't uploaded again
        this.value = null;
        return false;
    }
}
/**
 *
 * @returns {{add: Function, ready: Function}}
 */
module.exports = {
    onUpload : function (fc) {
        onUpload = fc;
    },
    add : function (node, attr) {
        if (brain.hasOwnProperty(attr)) {
            brain[attr].init(node);
        }
    }
};
}).call(this,require("+7ZJp0"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/uiModules/upload.js","/uiModules")
},{"+7ZJp0":60,"buffer":55}],36:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){

var unicode = (function(){

    String.prototype.getEachChar = function(cb){
        var newString = this;
        for (var i = 0; i < newString.length; i++) {
            newString[i] = cb(newString[i]);
        }
        return newString.toString();
    }
    var reg = new RegExp('\\\\u([0-9a-fA-F]{4})',"g");
    return {
        encode : function(string){
            if(!string){return '';}
            var newstring = string.replace(reg,
                function (match, submatch) {
                    console.log(match,submatch);
                    return String.fromCharCode(parseInt(submatch, 16));
                });
            return newstring;
        },
        decode : function(string){
            return string.getEachChar(function(c){
                for (var i = 0; i < table.length; i++) {
                    if(table[i] == c){
                        console.log('found:'+table[i])
                        return table[i];
                    }
                }
                return c;
            });
        }

    }
}());

module.exports = unicode;

var table = [
    '\u00C0',
    '\u00C1',
    '\u00C2',
    '\u00C3',
    '\u00C4',
    '\u00C5',
    '\u00C6',
    '\u00C7',
    '\u00C8',
    '\u00C9',
    '\u00CA',
    '\u00CB',
    '\u00CC',
    '\u00CD',
    '\u00CE',
    '\u00CF',
    '\u00D0',
    '\u00D1',
    '\u00D2',
    '\u00D3',
    '\u00D4',
    '\u00D5',
    '\u00D6',
    '\u00D8',
    '\u00D9',
    '\u00DA',
    '\u00DB',
    '\u00DC',
    '\u00DD',
    '\u00DE',
    '\u00DF',
    '\u00E0',
    '\u00E1',
    '\u00E2',
    '\u00E3',
    '\u00E4',
    '\u00E5',
    '\u00E6',
    '\u00E7',
    '\u00E8',
    '\u00E9',
    '\u00EA',
    '\u00EB',
    '\u00EC',
    '\u00ED',
    '\u00EE',
    '\u00EF',
    '\u00F0',
    '\u00F1',
    '\u00F2',
    '\u00F3',
    '\u00F4',
    '\u00F5',
    '\u00F6',
    '\u00F8',
    '\u00F9',
    '\u00FA',
    '\u00FB',
    '\u00FC',
    '\u00FD',
    '\u00FE',
    '\u00FF'
];
}).call(this,require("+7ZJp0"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/unicode.js","/")
},{"+7ZJp0":60,"buffer":55}],37:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
function getAnchor() {
    var href = location.href;
    if (/#/.test(href)) {
        return '#' + location.href.replace(/.*#/, '');
    }
    return '';
}

module.exports = {
    getAnchor : getAnchor,
    hasAnchor : function () {
        return getAnchor() !== '';
    }
}
}).call(this,require("+7ZJp0"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/util/url.js","/util")
},{"+7ZJp0":60,"buffer":55}],38:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
/*global */
/*jslint browser: true*/
/**
 *
 * E.g.:
 *  canny-mod="moduleObj" canny-var="{'propertyKey':'value'}"
 *  canny-mod="moduleString" canny-var="button"
 *
 * Instead of canny-var you can use the module name to avoid conflicts like:
 * E.g.: canny-mod="mod1 mod2" canny-mod1={'foo':'123456', 'bar':'654321'} canny-mod2="mod2Property"
 *
 * ---------------------------------------------------------------------------- eightyfour
 */
(function (global) {
    "use strict";
    var canny = (function () {
        var readyQueue = [],
            readyQueueInit = false,
            moduleQueue = []; // save modules to call the ready method once

        /**
         * Find the single quotes and replace them with double quotes except string which
         * are part of the property string.
         *
         * @param string
         * @returns {string}
         */
        function escapeStringForJSON(string) {
            var s = string
                .replace(/\{\s*\'/g,'{"').replace(/\'\s*\}/g,'"}')
                .replace(/:\s*\'/g,':"').replace(/\'\s*:/g,'":')
                .replace(/,\s*\'/g,',"').replace(/\'\s*,/g,'",');
            return s;
        }

        function callMethodQueue(queue) {
            (function reduce() {
                var fc = queue.pop();
                if (fc) {
                    fc();
                    reduce();
                } else {
                    queue = [];
                }
            }());
        }

        function parseNode(node, name, cb) {
            var that = this, gdModuleChildren = [].slice.call(node.querySelectorAll('[' + name + '-mod]')), prepareReadyQueue = {};

            gdModuleChildren.forEach(function (node) {
                var attribute = node.getAttribute(name + '-mod'), attr, viewPart, attributes, cannyVar;

                attributes = attribute.split(' ');

                attributes.forEach(function (moduleName) {
                    if (that[moduleName]) {
                        if (node.getAttribute(name + '-mod')) {
                            if (node.getAttribute(name + '-' + moduleName)) {
                                cannyVar = node.getAttribute(name + '-' + moduleName);
                            } else {
                                cannyVar = node.getAttribute(name + '-var');
                            }
                            if (cannyVar) {
                                // simple JSON test
                                if (/\{\s*\'|\".*:.*\}/.test(cannyVar)) {
                                    attr = escapeStringForJSON(cannyVar);
                                    // could be a JSON
                                    try {
                                        viewPart = JSON.parse(attr);
                                    } catch (ex) {
                                        console.error("canny can't parse passed JSON for module: " + moduleName, node);
                                    }
                                } else {
                                    viewPart = cannyVar;
                                }
                            }
                        }
                        // has module a ready function than save it for calling
                        if (that[moduleName].hasOwnProperty('ready')) {
                            // TODO or call it immediately?
                            prepareReadyQueue[moduleName] = that[moduleName].ready;
                        }
                        if (that.hasOwnProperty(moduleName)) {
                            that[moduleName].add(node, viewPart);
                        }
                    } else {
                        console.warn('canny parse: module with name ´' + moduleName + '´ is not registered');
                    }
                });
            });
            // add ready callback to moduleQueue
            Object.keys(prepareReadyQueue).forEach(function (name) {
                moduleQueue.push(prepareReadyQueue[name]);
            });
            cb && cb();
        }

        document.addEventListener('DOMContentLoaded', function cannyDomLoad() {
            document.removeEventListener('DOMContentLoaded', cannyDomLoad);

            parseNode.apply(canny, [document, 'canny']);

            callMethodQueue(moduleQueue);
            // call registered ready functions
            readyQueueInit = true;
            callMethodQueue(readyQueue);
        }, false);

        return {
            add : function (name, module) {
                var moduleApi = module;
                if (!this.hasOwnProperty(name)) {
                    if (typeof module === 'function') {
                        moduleApi = module(this); // initialize the module with the actual canny instance
                    }
                    this[name] = moduleApi;
                } else {
                    console.error('canny: Try to register module with name ' + name + ' twice');
                }
            },
            ready : function (fc) {
                if (!readyQueueInit) {
                    readyQueue.push(fc);
                } else {
                    fc();
                }
            },
            cannyParse : function (node, name, cb) {
                // TODO needs a callback
                if (typeof name === 'function') {
                    cb = name;
                    name = "canny";
                }
                parseNode.apply(this || canny, [node, name || 'canny', function () {
                    callMethodQueue(moduleQueue);
                    cb && cb();
                }]);
            }
        };
    }());
    // export as module or bind to global
    if (typeof module !== 'undefined' && module.hasOwnProperty('exports')) { module.exports = canny; } else {global.canny = canny; }
}(this));
}).call(this,require("+7ZJp0"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../../../node_modules/canny/canny.js","/../../../node_modules/canny")
},{"+7ZJp0":60,"buffer":55}],39:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
/*global canny */
/*jslint browser: true*/

/**
 * Required: 'canny' in global scope
 *
 * E.g.:
 * canny.async.load(URL, function (src) {
 *     node.innerHTML = src;
 *     // trigger canny parse to register canny on our new modules
 *     canny.cannyParse(node, function () {
 *         console.log('CANNY PARSE DONE');
 *     });
 * });
 *
 * Alternative you can just use loadHTML (scripts will automatically added and parsed by canny):
 * canny.async.loadHTML(node, {url : URL}, function () {
 *     console.log('kodos_load READY');
 * });
 *
 * Or directly as canny module:
 * <div canny-mod="async" canny-var="{'url':'/you/HTML/file.html'}"></div>
 *
 * TODO solve dependency problem to canny.
 *
 */
(function () {
    'use strict';
    var async = (function () {
        var filesToLoad = [],
            pushLoadCBs = [],
            ready = false;

        /**
         *
         * @param script
         * @param cb
         */
        function appendScript(script, cb) {
            var node = document.createElement('script');
            node.type = "text/javascript";
            node.async = true;
            node.setAttribute('src', script.getAttribute('src'));
            node.addEventListener('load', cb, false);
            node.addEventListener('error', cb, true);
            document.head.appendChild(node);
        }

        /**
         *
         * @param scripts
         * @param cb
         */
        function appendScriptsToHead(scripts, cb) {
            var script, i, includesScripts = false,
                scriptCounter = (function () {
                    var count = 0;
                    return {
                        up : function () {count++; },
                        ready : function () {
                            count--;
                            if (count <= 0) {
                                cb();
                            }
                        }
                    };
                }());
            console.log('async:detect script', scripts);
            for (i = 0; i < scripts.length; i++) {
                script = scripts[i];
                if (script.getAttribute('src')) {
                    includesScripts = true;
                    scriptCounter.up();
                    appendScript(script, scriptCounter.ready);
                } else {
                    console.warn('async: found inline script tag!!!');
                }
            }

            if (scripts.length === 0 || includesScripts === false) {
                cb();
            }

        }

        /**
         *
         * @param node
         * @param attr {{url:string}}
         * @param cb
         */
        function loadHTML(node, attr, cb) {
            var div = document.createElement('div'),
                scripts,
                // only parse if html and scripts are loaded (scripts has callbacks because there are needs to loaded asynchronous)
                handleCannyParse = (function (cb) {
                    var waitForScripts = true,
                        waitForHTML = true,
                        triggger = function () {
                            if (!waitForScripts && !waitForHTML) {
                                canny.cannyParse(node, cb); // init only canny own modules
                            }
                        };
                    return {
                        scriptReady : function () {
                            waitForScripts = false;
                            triggger();
                        },
                        htmlReady : function () {
                            waitForHTML = false;
                            triggger();
                        }
                    };
                }(function () {
                    cb(attr);
                }));

            load(attr.url, function (src) {
                var childs;
                if (src) {
                    div.innerHTML = src;
                    scripts = div.getElementsByTagName('script');
                    childs = [].slice.call(div.childNodes);
                    console.log('async:load', attr);
                    appendScriptsToHead(scripts, handleCannyParse.scriptReady);
                    childs.forEach(function (child) {
                        if (!(child.tagName === 'SCRIPT' && child.getAttribute('src'))) {
                            node.appendChild(child);
                        }
                    });
                    handleCannyParse.htmlReady();
                } else {
                    console.warn('async: Loading async HTML failed');
                }
            });
        }
        /**
         * simple wrapper to load HTML files with GET
         * @param path
         * @param cb
         */
        function load(path, cb) {
            doAjax({
                method: 'GET',
                path: path,
                onSuccess: function (response) {
                    cb(response.responseText);
                }
            });
        }
        /**
         *
         * @param params {{
         *   noCache:boolean,
         *   method:string|POST(default),
         *   data:object|string,
         *   path:string,
         *   onFailure:function,
         *   onSuccess:function,
         *   contentType:string|Content-Type(default),
         *   mimeType:string|text plain(default)
         * }}
         */
         function doAjax(params) {
            var call = new XMLHttpRequest();
            var url = params.path;
            if (params.method === 'GET' && typeof params.data === 'object') {
                for (var attr in params.data) {
                    url = url + ((/\?/).test(url) ? "&" : "?") + attr + "=" + params.data[attr];
                }
            }
            if (params.noCache) {
                url = url + ((/\?/).test(url) ? "&" : "?") + "ts=" + (new Date()).getTime();
            }
            params.method = params.method || 'POST';
            call.open(params.method, url, true);
            call.onreadystatechange = function () {
                // TODO use === is this string or number ?
                if (call.readyState == 4) {
                    if (call.status >= 400) {
                        if (params.onFailure) {
                            params.onFailure(call);
                        }
                    } else {
                        if (params.onSuccess) {
                            params.onSuccess(call);
                        }
                    }
                }
            };
            call.setRequestHeader(params.contentType || "Content-Type", params.mimeType || "text/plain");
            if (params.method === 'POST') {
                call.send(params.data);
            } else {
                call.send();
            }
        }

        return {
            /**
             * add a callback. So you will be notified when files are loaded asynchronous.
             * You will be called only once except your return true then async will keep
             * your callback in the notifier list and you will be informed for each async request.
             *
             * The async module will call each callback with the actual attr. So you have the control
             * how often you will be notified.
             *
             * Might be changed in the future version of async:
             * Currently this is only executed for canny modules which are loaded from the DOM directly.
             *
             * @param fc
             */
            pushLoadCB : function (fc) {
                pushLoadCBs.push(fc);
            },
            /**
             * Do a simple ajax call.
             *
             * @param params {{
             *   noCache:boolean,
             *   method:string|POST(default),
             *   data:object,string,
             *   path:string,
             *   onFailure:function,
             *   onSuccess:function,
             *   contentType:string|Content-Type(default),
             *   mimeType:string|text plain(default)
             * }}
             */
            doAjax: doAjax,
            /**
             *
             * @param node
             * @param attr {{url:string}}
             * @param cb
             */
            loadHTML : loadHTML,
            /**
             * Deprecated: use loadHTML instead
             * @param path
             * @param cb
             */
            load: function () {
                console.warn('async:load function load is deprecated. Use loadHTML instead');
                load.apply(null, arguments);
            },
            /**
             * canny's add method
             *
             * @param node
             * @param attr
             */
            add: function (node, attr) {    // part of api
                // TODO implement logic for loading it directly from html
                if (attr.hasOwnProperty('url')) {
                    if (!ready) {
                        filesToLoad.push({
                            node: node,
                            attr: attr
                        });
                    } else {
                        loadHTML(node, attr);
                    }
                }
            },
            ready: function () {
                var obj, cbCount = filesToLoad.length;
                while (filesToLoad.length > 0) {
                    obj = filesToLoad.splice(0, 1)[0];
                    loadHTML(obj.node, obj.attr, function (attr) {
                        var keepPushCB = [], tmpCb;
                        cbCount--;
                        while (pushLoadCBs.length > 0) {
                            tmpCb = pushLoadCBs.splice(0, 1)[0];
                            if (tmpCb(attr) === true) {
                                keepPushCB.push(tmpCb);
                            }
                        }
                        pushLoadCBs = keepPushCB;
                    });
                }
            }
        };
    }());
    // export as module or bind to global
    if (typeof module !== 'undefined' && module.hasOwnProperty('exports')) {
        module.exports = async;
    } else {
        canny.add('async', async);
    }

}());
}).call(this,require("+7ZJp0"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../../../node_modules/canny/mod/async.js","/../../../node_modules/canny/mod")
},{"+7ZJp0":60,"buffer":55}],40:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
/*global canny */
/*jslint browser: true*/

/**
 * E.g.: canny-mod="flowControl" canny-var="{'view' : 'viewName'}"
 *
 * you can activate a initial view with a anchor in the URL e.g.: yourdomain.html#viewToShow
 * Or pass a comma separated module list for activate more module #viewToShow,otherView
 *
 * TODO made it possible to summarize views with one identifier.
 * Instead of call: canny.flowControl.show('view1', 'view2', 'view3') call canny.flowControl.show('view').
 *
 * TODO add a hide method that just hide the specific element.
 *
 * TODO handle the fade in and out via CSS classes - and use transitions for it
 */
(function () {
    "use strict";

    /**
     * wraps transitionend event vendor implementation
     */
    function onTransitionEndOnce(node, cb) {
        var event = (function () {
                if (node.style.webkitTransition !== undefined) {
                    return 'webkitTransitionEnd';
                } else if (node.style.transition !== undefined) {
                    return 'transitionend';
                }
            }()),
            listener = function(e) {
                e.target.removeEventListener(e.type, listener);
                cb(e);
            };
        if (event) {
            node.addEventListener(event, listener, false);
        } else {
            cb();
        }
    }

    var flowControlInstance = function (fcInstanceName) {
        var instanceName = fcInstanceName,
            modViews = {}, // saves module views
            getViewAnchor = function () {
                var hash = location.hash || null, hashSub;
                if (hash) {
                    hashSub = hash.substr(1);
                    return hashSub.split(',');
                }
                return hash;
            },
            getAllModuleChildrens = function (cNode) {
                // TODO test selector if we have more than one module in canny-mod
                var children = cNode.querySelectorAll('[canny-mod*=' + instanceName + ']'),
                    fc_childNodes = {};
//                            if (cNode.hasChildNodes()) {
//                                [].slice.call(cNode.children).forEach(findChildren);
//                            }
                [].slice.call(children).forEach(function (mod) {
                    var attrValue, view;
                    // TODO read attributes should be a part of canny functionality
                    attrValue = mod.getAttribute('canny-var').split("\'").join('\"');
                    if (/:/.test(attrValue)) {
                        // could be a JSON
                        view = JSON.parse(attrValue).view;
                    } else {
                        view = attrValue;
                    }
                    fc_childNodes[view] = mod;
                });
                return fc_childNodes;
            },
            /**
             * Each flowControl node will end up in a flowControlModule.
             *
             * @param node
             * @param attr
             * @returns {{hasChildrenWithName: hasChildrenWithName, getViewName: getViewName, show: show, hide: hide, fadeOut: fadeOut, getNode: getNode, fadeIn: fadeIn}}
             */
            flowControlModule = function (node, attr) {
                var flowControlChildNodes = {},
                    async = false,
                    parentViews = fc.getParentNode(attr.view);
                // saves all children in a object
                flowControlChildNodes = getAllModuleChildrens(node);
//                    console.log('flowControlChildNodes:', flowControlChildNodes);
                return {
                    hasChildrenWithName : function (viewName) {
                        return flowControlChildNodes.hasOwnProperty(viewName);
                    },
                    getViewName : function () {
                        return attr.view;
                    },
                    display : function () {
                        // don't call parents
                        // don't fade in
                        node.style.display = '';
                    },
                    show : function (cb) {
                        if (parentViews) {
                            parentViews.forEach(function (fc_module) {
//                                console.log('parentViews', fc_module.getViewName());
                                fc_module.display();
                            });
                        }
                        if (!async && attr.hasOwnProperty('async')) {
                            canny.async.loadHTML(node, {url : attr.async}, function () {
                                node.style.display = '';
                                cb();
                            });
                            async = true;
                        } else {
                            node.style.display = '';
                            cb && cb();
                        }
                    },
                    hide : function () {
                        node.style.display = 'none';
                    },
                    fadeOut : function (cb) {
                        fc.fadeOut(node, cb || function () {});
                    },
                    getNode : function () {
                        return node;
                    },
                    fadeIn : function (cb) {
                        if (parentViews) {
                            parentViews.forEach(function (fc_module) {
//                                console.log('parentViews', fc_module.getViewName());
                                fc_module.display();
                            });
                        }
                        if (!async && attr.hasOwnProperty('async')) {
                            canny.async.loadHTML(node, {url : attr.async}, function () {
                                fc.fadeIn(node,  cb || function () {});
                            });
                            async = true;
                        } else {
                            fc.fadeIn(node,  cb || function () {});
                        }
                    }
                };

            },
            showInitialView = getViewAnchor(),
            fc = {
                // get all parent modules from the given viewName
                getParentNode : function (viewName) {
                    var queue = Object.keys(modViews), l, i, parents = [];
                    l = queue.length;
                    for (i = 0; i < l; i++) {
                        // TODO
                        if (viewName !== queue[i] && modViews[queue[i]][0].hasChildrenWithName(viewName)) {
                            parents.push(modViews[queue[i]][0]);
                        }
                    }
                    return parents.length === 0 ? null : parents;
                },
                // passes a view list and complete the list with all parent node names
                addParents : function (views) {
                    var extViews = views, i, l, pNode,
                        pushExtViews = function (name) {
                            if (extViews.indexOf(name) === -1) {
                                extViews.push(name);
                            }
                        },
                        addParentView = function (viewName) {
                            // TODO call ends always with null - viewName is top parent
                            var pViewName = fc.getParentNode(viewName);
//                            console.log('viewName: ' + viewName, 'pViewName ' + pViewName );
                            if (pViewName) {
                                pViewName.forEach(function (fc_module) {
                                    // TODO while has parent add it to the extViews
                                    pushExtViews(fc_module.getViewName());
                                    addParentView(fc_module.getViewName());
                                });
                            }
                        };
                    l = views.length;
                    for (i = 0; i < l; i++) {
                        pNode = fc.getParentNode(views[i]);
                        if (pNode) {
                            pNode.forEach(function (fc_module) {
                                pushExtViews(fc_module.getViewName());
                                // so far we have parents do it recursive
                                // TODO not needed each parent will do it by own -
                                addParentView(fc_module.getViewName());
                            });
                        }
                    }
                    return extViews;
                },
                fadeOut : function (node, cb) {

                    if(node.style.display === 'none') {
                        cb();
                    } else {
                        node.classList.add('c-flowControl');
                        node.classList.add('fade-out');

                        setTimeout(function () {
                            node.style.display = 'none';
                            node.classList.remove('c-flowControl');
                            node.classList.remove('fade-out');
                            cb();
                        }, 300);
                    }

                },
                fadeIn : function (node, cb) {
                    // TODO: fade in does not work properly
                    node.style.display = '';
                    node.classList.add('c-flowControl');
                    node.classList.add('fade-in');

                    setTimeout(function() {
                        node.classList.remove('c-flowControl');
                        node.classList.remove('fade-in');
                        cb();

                        // trigger reflow to fix the black boxes issue FTTWO-1249
                        // TODO: check if this can be avoided or
                        var box = document.querySelector('.t-centerBox-content');
                        if (box) {
                            box.style.opacity = 0.99;
                            setTimeout(function() {
                                box.style.opacity = 1;
                            }, 50);
                        }
                    }, 300);
                }
            },
            ext = {
                /**
                 *
                 * @param node
                 * @param innerNode
                 * @returns {{remove: remove}}
                 */
                progress : function (node, innerNode) {
                    var newNode = document.createElement('div'), centerNode = document.createElement('div'), txtNode;
                    node.style.position = 'relative';
                    newNode.style.opacity = '0.6';
                    newNode.style.backgroundColor = '#666';
                    newNode.style.position = 'absolute';
                    newNode.style.top = 0;
                    newNode.style.left = 0;
                    newNode.style.width = node.offsetWidth + 'px';
                    newNode.style.height = node.offsetHeight + 'px';
                    newNode.style.borderRadius = window.getComputedStyle(node, null).borderRadius;

                    centerNode.style.position = 'absolute';
                    centerNode.style.top = (node.offsetHeight / 2) - 30 + 'px';
                    centerNode.style.width = node.offsetWidth + 'px';
                    centerNode.style.textAlign = 'center';

                    if (innerNode) {
                        centerNode.appendChild(innerNode);
                    }
                    node.appendChild(newNode);
                    node.appendChild(centerNode);
                    return {
                        remove : function (delay, cb) {
                            setTimeout(function () {
                                node.removeChild(newNode);
                                node.removeChild(centerNode);
                                cb && cb();
                            }, delay || 0);
                        },
                        fadeOut : function (delay, cb) {
                            setTimeout(function () {
                                fc.fadeOut(newNode, function () {
                                    node.removeChild(newNode);
                                    node.removeChild(centerNode);
                                    cb && cb();
                                });
                            }, delay || 0);
                        }
                    };
                }
            },
            /**
             *
             * @type {{mod: {}, createNewInstance: createNewInstance, ready: ready, add: add, show: show, fadeIn: fadeIn, showImmediately: showImmediately, overlay: overlay}}
             */
                api = {
                mod : modViews, // part of api
                /**
                 * this method could be used to create new instances of flowControl (only needed if you
                 * load this script directly without require)
                 * @param name (unique module name)
                 **/
                createNewInstance : function (name) {
                    return flowControl(name);
                },
                ready : function () {
                    var modNames, i, l;
                    if (showInitialView) {
                        modNames = Object.keys(modViews);
                        l = modNames.length;
                        // check if showInitialView contains a registered module
                        for (i = 0; i < l; i++) {
                            if (showInitialView.indexOf(modNames[i]) !== -1) {
                                this.showImmediately.apply(null, showInitialView);
                                break;
                            }
                        }
                    }
                },
                /**
                 *
                 * @param node
                 * @param attr {{view:(identifier),}}
                 */
                add : function (node, attr) {    // part of api
                    if (!modViews[attr.view]) {
                        modViews[attr.view] = [];
                    }
                    modViews[attr.view].push(flowControlModule(node, attr));
                },
                /**
                 * @deprecated will handle showImmediately in near future
                 */
                show : function () {
                    api.fadeIn.apply(this, arguments);
                },
                /**
                 * @param name (arguments list of views to show)
                 */
                fadeIn : function (name) {
                    var showMods = [].slice.call(arguments),
                        queue = Object.keys(modViews),
                        queueCount = 0,// = queue.length,
                        fadeIn = function () {
                            showMods.forEach(function (module) {
                                if (modViews.hasOwnProperty(module)) {
                                    modViews[module].forEach(function (obj) {
                                        obj.fadeIn(function () {
                                            // TODO remove
//                                                console.log('FADE IN DONE');
                                            // TODO count callbacks and handle it ?
                                        });
                                    });
                                }
                            });
                            // if last param is function than handle it as callback
                            if (typeof showMods[showMods.length - 1] === 'function') {
                                showMods[showMods.length - 1]();
                            }
                        };
                    showMods = fc.addParents(showMods);
                    queue.forEach(function (view) {
                        queueCount += modViews[view].length;
                    });
                    // iterate over all registered modules
                    queue.forEach(function (view) {
                        // iterate over all instances of the same view
                        modViews[view].forEach(function (obj) {
                            // hide all (except incoming and parents) TODO but only the parents of the module
                            if (showMods.indexOf(view) === -1) {
                                obj.fadeOut(function () {
                                    queueCount--;
                                    if (queueCount <= 0) {
                                        fadeIn();
                                    }
                                });
                            } else {
                                queueCount--;
                                if (queueCount <= 0) {
                                    fadeIn();
                                }
                            }
                        });
                    });
                },
                /**
                 * @deprecated use show instead
                 * @param name
                 */
                showImmediately : function (name) {    // module specific
                    var showMods = [].slice.call(arguments),
                        queue = Object.keys(modViews),
                        queueCount = 0,
                        countCb = (function () {
                            var cb, length = 0;
                            // if last param is function than handle it as callback
                            if (typeof showMods[showMods.length - 1] === 'function') {
                                cb = showMods[showMods.length - 1];
                            }
                            return {
                                countUp : function (num) {
                                    length += num;
                                },
                                reduce : function () {
                                    length--;
                                    if (cb && length <= 0) {
                                        cb();
                                    }
                                }
                            };
                        }()),
                        show = function () {
                            showMods.forEach(function (module) {
                                if (modViews.hasOwnProperty(module)) {
                                    countCb.countUp(modViews[module].length);
                                    modViews[module].forEach(function (obj) {
                                        obj.show(countCb.reduce);
                                    });
                                }
                            });
                        };
                    showMods = fc.addParents(showMods);
                    // hide all (except incoming)
                    queue.forEach(function (view) {
                        queueCount += modViews[view].length;
                        modViews[view].forEach(function (obj) {
                            queueCount--;
                            if (showMods.indexOf(obj) === -1) {
                                obj.hide();
                            }
                            if (queueCount <= 0) {
                                show();
                            }
                        });
                    });
                },
                overlay : function (name) {
                    var node;
                    // it's own module?
                    if (modViews.hasOwnProperty(name)) {
                        node = modViews[name].getNode();
                    } else {
                        node = document.getElementById(name);
                    }

                    return {
                        by : function (name, text) {
                            return ext[name](node, text);
                        }
                    };
                }
            };
        return api;
    },
    flowControl = (function () {
        var instances = {};
        return function (name) {
            var instance,
                def = name || 'flowControl';
            if (instances.hasOwnProperty(def)) {
                instance = instances[def];
            } else {
                instances[def] = flowControlInstance(def);
                instance = instances[def];
            }
            return instance;
        };
    }());
    // export as module or bind to global
    if (typeof module !== 'undefined' && module.hasOwnProperty('exports')) { module.exports = flowControl; } else {canny.add('flowControl', flowControl('flowControl')); }

}());

}).call(this,require("+7ZJp0"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../../../node_modules/canny/mod/flowControl.js","/../../../node_modules/canny/mod")
},{"+7ZJp0":60,"buffer":55}],41:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
/*global canny */
/*jslint browser: true*/

/**
 * repeat
 *
 * E.g.
 *  <div canny-mod="repeat" canny-var="{'for':'item', 'in':'path.to.list'}">
 *     <p>DATA: {{item}})</p>
 *  </div>
 *  or:
 *  <div canny-mod="repeat" canny-var="{'for':'objectItem', 'in':'path.to.object'}">
 *     <p>DATA FOO: {{objectItem.foo}})</p>
 *     <p>DATA BAR: {{objectItem.bar}})</p>
 *  </div>
 *
 * for:
 * is the name of the iterating item to have access from the DOM.
 *
 * in:
 * is the source where repeat can find the array.
 * It accepts functions, array, and objects pointer
 * - object: keep in mind that object has no specific sorting
 * - array:
 * - function: repeat will call it with the following parameter:
 *  * function which needs to be called with the object or list
 *  * ...
 *
 *  TODO: add example to get data direct from
 *   * a list of function
 *   * a object which contain functions
 *
 */
(function () {
    'use strict';

    var openChar = '{',
        endChar  = '}',
        ESCAPE_RE = /[-.*+?^${}()|[\]\/\\]/g,
        repeat = (function () {
            var BINDING_RE = getRegex();

            /**
             *  Parse a piece of text, return an array of tokens
             *  @param text
             *  @return [key:String, html:boolean]
             */
            function parse(text) {
                if (!BINDING_RE.test(text)) {return null; }
                var m, i, token, match, tokens = [];
                /* jshint boss: true */
                while (m = text.match(BINDING_RE)) {
                    i = m.index;
                    if (i > 0) {tokens.push(text.slice(0, i)); }
                    token = { key: m[1].trim() };
                    match = m[0];
                    token.html =
                        match.charAt(2) === openChar &&
                        match.charAt(match.length - 3) === endChar;
                    tokens.push(token);
                    text = text.slice(i + m[0].length);
                }
                if (text.length) {tokens.push(text); }
                return tokens;
            }
            /**
             *
             * @param textNode
             * @param obj
             * @param itemName
             */
            function compileTextNode(textNode, obj, itemName) {
                var tokens = parse(textNode.nodeValue), el, token, val, i, l, tmp, tokenObjectProperty;

                if (!tokens || obj === undefined) {return; }

                for (i = 0, l = tokens.length; i < l; i++) {
                    token = tokens[i];
                    if (typeof token === 'object') {
                        tmp = token.key.split('.');
                        if (tmp.length > 0 && tmp[0] === itemName) {
                            tokenObjectProperty = tmp.slice(1).join('.');
                            if (typeof obj === 'object') {
                                val = getGlobalCall(tokenObjectProperty, obj);
                            } else {
                                val = obj;
                            }
                        } else {
                            // just a string?
                            val = obj;
                        }
                        if (typeof val === 'string' || typeof val === 'number') {
                            el = document.createTextNode(val);
                            textNode.parentNode.insertBefore(el, textNode);
                        } else if (typeof val === 'boolean') {
                            el = document.createTextNode(val.toString());
                            textNode.parentNode.insertBefore(el, textNode);
                        } else if (typeof val === 'function') {
                            el = document.createTextNode(val(textNode.parentNode));
                            textNode.parentNode.insertBefore(el, textNode);
                        } else {
                            console.error('repeat: can not find property "' + tokenObjectProperty + '" for object', obj,
                                'are you sure that the iterate variable is the same as the access token?');
                        }
                    } else {
                        el = document.createTextNode(token);
                        // just normal string put back to view
                        textNode.parentNode.insertBefore(el, textNode);
                    }

                }
                textNode.parentNode.removeChild(textNode);
            }
            /**
             *
             * @param node
             * @param dataObj
             * @param itemName
             */
            function compileElement (node, dataObj, itemName) {
                // recursively compile childNodes
                if (node.hasChildNodes()) {
                    [].slice.call(node.childNodes).forEach(function (child) {
                        compile(child, dataObj, itemName);
                    });
                }
            }
            /**
             * Compile a DOM node (recursive)
             * @param node
             * @param dataObj
             * @param itemName
             * @returns {*}
             */
            function compile(node, dataObj, itemName) {
                var nodeType = node.nodeType;
                if (nodeType === 1 && node.tagName !== 'SCRIPT') { // a normal node
                    compileElement(node, dataObj, itemName);
                } else if (nodeType === 3) {
                    compileTextNode(node, dataObj, itemName);
                }

                return node;
            }

            /**
             * helper function to do the read variable from string magic.
             * The cb will called with the property value - in case of undefined the variable does not exists
             * @param node
             * @param attributeName
             * @param cb
             */
            function getLoopValueFromAttribute(node, obj, itemName, attributeName, cb) {
                var tmp = node.getAttribute(attributeName).split('.'), tokenObjectProperty;
                if (tmp.length > 0 && tmp[0] === itemName) {
                    tokenObjectProperty = tmp.slice(1).join('.');
                    cb(getGlobalCall(tokenObjectProperty, obj));
                } else {
                    // TODO handle this correctly
                    console.error('repeat:getLoopValueFromAttribute has problems');
                }
            }

            /**
             * register click events
             *
             * @param clone
             * @param item
             * @param itemName
             */
            function handleEvents(clone, obj, itemName) {
                var onClick = 'on-click';
                // check children of clone
                [].slice.call(clone.querySelectorAll('[' + onClick + ']')).forEach(function (node) {
                    getLoopValueFromAttribute(node, obj, itemName, onClick, function (val) {
                        if (typeof val === 'function') {
                            node.addEventListener('click', val);
                        } else {
                            console.log('repeat:can not register click listener without a function', node);
                        }
                    });
                });
            }

            /**
             * Replaces expressions for all tag attributes
             *
             * @param clone
             * @param obj
             * @param itemName (currently not in used but needs to be checked)
             */
            function handleAttributes(clone, obj, itemName) {
                (function searchForExpressions(children) {
                    [].slice.call(children).forEach(function (node) {
                        var i, attr;
                        if (node.children.length > 0) {
                            // do it recursive for all children
                            searchForExpressions(node.children);
                        }
                        for (i = 0; i < node.attributes.length; i++) {
                            attr = node.attributes[i];
                            if (/\{\{/.test(attr.textContent)) {
                                if (attr.name) {
                                    (function () {
                                        var token = parse(attr.textContent),
                                            endData = [], tmpToken, j, globalObj, tmpTokenSplit;
                                        for (j = 0; j < token.length; j++) {
                                            tmpToken = token[j];
                                            if (typeof tmpToken === 'object') {
                                                if (/\./.test(tmpToken.key)) {
                                                    tmpTokenSplit = tmpToken.key.split('.').slice(1).join('.');
                                                } else {
                                                    tmpTokenSplit = tmpToken.key;
                                                }
                                                if (typeof obj === 'object') {
                                                    globalObj = getGlobalCall(tmpTokenSplit, obj);
                                                    if (typeof globalObj === 'function') {
                                                        endData.push(globalObj());
                                                    } else {
                                                        endData.push(globalObj);
                                                    }
                                                } else if (typeof obj === 'string') {
                                                    endData.push(obj);
                                                } else if (typeof obj === 'function') {
                                                    endData.push(obj(node));
                                                }

                                            } else {
                                                endData.push(tmpToken.trim());
                                            }
                                        }
                                        attr.textContent = endData.join(' ');
                                    }())
                                }
                            }
                        }
                    });
                }(clone.children));
            }

            /**
             * handle the if conditions if and if-not
             * @param clone
             * @param obj
             * @param itemName
             */
            function handleIfCondition(clone, obj, itemName) {
                var attributeName_if = 'if',
                    attributeName_if_not = 'if-not';

                function checkIf(val, node) {
                    if (!val) {
                        node.parentNode.removeChild(node);
                    }
                }
                function checkIfNot(val, node) {
                    if (val) {
                        node.parentNode.removeChild(node);
                    }
                }
                // check children of clone
                [].slice.call(clone.querySelectorAll('[' +attributeName_if + ']')).forEach(function (node) {
                    getLoopValueFromAttribute(node, obj, itemName, attributeName_if, function (val) {checkIf(val, node);});
                });

                [].slice.call(clone.querySelectorAll('[' +attributeName_if_not + ']')).forEach(function (node) {
                    getLoopValueFromAttribute(node, obj, itemName, attributeName_if_not, function (val) {checkIfNot(val, node);});
                });
            }

            /**
             * Looped through the collection and do the logic for each clone instance.
             * Actually it supports only collection - no objects.
             * @param node
             * @param itemName
             * @param collection
             * @param template
             */
            function registerTemplate(node, itemName, collection, template) {
                var mainFrag;
                if (typeof collection === 'object') {
                    if (Object.prototype.toString.call(collection) === '[object Array]') {
                        // it is an array
                        mainFrag = document.createDocumentFragment();
                        collection.forEach(function (item) {
                            // item could be an object or just a property like a
                            // string (in case of it is direct a list of strings)
                            template.forEach(function (childTpl) {
                                // TODO works also with fragment but then the qunit test fails
                                // - there is a problem with the phantomjs
//                                var fragment = document.createDocumentFragment();
                                var fragment = document.createElement('div');
                                fragment.appendChild(childTpl.cloneNode(true));
                                // if conditions can remove elements from clone - it's important that this is executed first
                                handleIfCondition(fragment, item, itemName);
                                if (fragment.children && fragment.children.length === 1) {
                                    handleEvents(fragment, item, itemName);
                                    handleAttributes(fragment, item, itemName);
                                    // replace texts:
                                    mainFrag.appendChild(compile(fragment.children[0], item, itemName));
                                } else {
                                   // console.log('repeat:element has been removed from DOM');
                                }
                            });
                        });
                        node.appendChild(mainFrag);
                    } else {
                        // it is an object
                        console.error('repeat detect object but object currently not supported');
                        // what render? - property name or value? - Both?
                    }
                } else {
                    console.error('repeat:registerTemplate detect none acceptable data argument', collection);
                }
            }

            /**
             * Create a new repeat instance and do the "magic".
             * @param node
             * @param scopeName
             * @param data
             */
            function execRepeat(node, scopeName, data) {
                var template = [];
                [].slice.call(node.children).forEach(function (child) {
                    template.push(node.removeChild(child));
                });

                if (typeof data === 'function') {
                    data(function (data) {
                        // better would be a update children but this is much effort to detect
                        [].slice.call(node.children).forEach(function (child) {
                            node.removeChild(child);
                        });
                        registerTemplate(node, scopeName, data, template);
                    });
                } else {
                    registerTemplate(node, scopeName, data, template)
                }
            }

            return {
                /**
                 * the attribute requires:
                 *  for: name of the iterator
                 *  in: pointer to: function, array or object
                 *
                 * @param node
                 * @param attr {{for:string,in:string}}
                 */
                add : function (node, attr) {
                    var inPointer;
                    if (typeof attr === 'object' && attr.in && attr.for) {
                        if (typeof attr.in === 'string') {
                            // TODO replace window with this and also other instances could use the magic as closure
                            inPointer = getGlobalCall(attr.in, window);
                        } else {
                            inPointer = attr.in;
                        }
                        execRepeat(node, attr.for, inPointer);
                    } else {
                        console.warn('repeat:add none acceptable attributes', attr);
                    }
                }
            };
        }());

    function escapeRegex(str) {
        return str.replace(ESCAPE_RE, '\\$&');
    }

    function getRegex() {
        var open = escapeRegex(openChar),
            end  = escapeRegex(endChar);
        return new RegExp(open + open + open + '?(.+?)' + end + '?' + end + end);
    }

    /**
     * Read a property from a given string and object.
     * Returns the founded property pointer or undefined.
     * @param value
     * @param obj
     * @returns {*} or undefined
     */
    function getGlobalCall (value, obj) {
        var split = value.split('.'),
            rec = function (cur) {
                if (obj[cur] !== undefined) {
                    obj = obj[cur];
                    rec(split.shift());
                } else if (cur === value ) {
                    obj = undefined;
                }
            };
        rec(split.shift());
        return obj;
    }

    // export as module or bind to global
    if (typeof module !== 'undefined' && module.hasOwnProperty('exports')) {
        module.exports = repeat;
    } else {
        canny.add('repeat', repeat);
    }

}());

}).call(this,require("+7ZJp0"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../../../node_modules/canny/mod/repeat.js","/../../../node_modules/canny/mod")
},{"+7ZJp0":60,"buffer":55}],42:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
/*global canny */
/*jslint browser: true*/
/**
 *
 * E.g. {{whisker}}:
 *  <div canny-mod="whisker" canny-var="{'bind':'scope','to':{'message':'My text'}}">
 *     <p>DATA: {{scope.message}})</p>
 *  </div>
 *  Or just pass the function pointer the default scope is 'scope'.
 *  <div canny-mod="whisker" canny-var="mymodule.functionPointer">
 *     <p>DATA: {{scope.message}})</p>
 *  </div>
 *
 */
(function () {
    "use strict";

    var openChar = '{',
        endChar  = '}',
        ESCAPE_RE = /[-.*+?^${}()|[\]\/\\]/g,
        whisker = (function () {
            var BINDING_RE = getRegex();
            /**
             *  Parse a piece of text, return an array of tokens
             *  TODO refactor method
             *  @param text
             *  @return [{key:String, html:boolean}]
             */
            function parse(text) {
                if (!BINDING_RE.test(text)) {return null; }
                var m, i, token, match, tokens = [], orig = {text: text, idx : 0}, textObject;
                /* jshint boss: true */
                while (m = text.match(BINDING_RE)) {
                    i = m.index;
                    token = {concat : true};
                    if (i > 0) {
                        if (orig.idx === 0) {
                            textObject = {
                                concat : orig.text[orig.idx - 1] !== ' ',
                                value : text.slice(0, i),
                                text : true
                            };
                            orig.idx += i;
                        } else {
                            orig.idx += i;
                            textObject = {
                                concat : orig.text[orig.idx - 1] !== ' ',
                                value : text.slice(0, i),
                                text : true
                            };
                        }
                        tokens.push(textObject);
                    }
                    orig.idx += i;
                    token.key = m[1].trim();
                    match = m[0];
                    token.html =
                        match.charAt(2) === openChar &&
                        match.charAt(match.length - 3) === endChar;
                    tokens.push(token);
                    text = text.slice(i + m[0].length);
                }
                if (text.length) {
                    tokens.push({value : text, text : true, concat: true});
                }
                return tokens;
            }
            /**
             *
             * @param node
             * @param dataObj
             * @param itemName
             * @return tokens [{key:String, node:DOM node, html: boolean}]
             */
            function compileTextNode(node, dataObj, itemName) {
                var tokens = parse(node.nodeValue),
                    obj = dataObj,
                    el, token, i, l, tmp, tokenObjectProperty, val;
                if (!tokens || obj === undefined || typeof obj === 'string') {return; }

                for (i = 0, l = tokens.length; i < l; i++) {
                    token = tokens[i];

                    if (typeof token === 'object' && token.hasOwnProperty('key')) {
                        tmp = token.key.split('.');
                        if (tmp.length > 0 && tmp[0] === itemName) {
                            tokenObjectProperty = tmp.slice(1).join('.');
                            if (typeof obj === 'object') {
                                val = getGlobalCall(tokenObjectProperty, obj);
                            } else {
                                val = obj;
                            }
                        } else {
                            // just a string?
                            val = obj;
                        }
                        if (typeof val === 'string' || typeof val === 'number') {
                            el = document.createTextNode(val);
                            node.parentNode.insertBefore(el, node);
                        } else if (typeof val === 'boolean') {
                            el = document.createTextNode(val.toString());
                            node.parentNode.insertBefore(el, node);
                        } else if (typeof val === 'function') {
                            el = document.createTextNode(val(node.parentNode));
                            node.parentNode.insertBefore(el, node);
                        } else if (tmp[0] === itemName) {
                            // property is not exists but it is the same scope
                            el = document.createTextNode('');
                            node.parentNode.insertBefore(el, node);
                        } else {
                            // restore the token... looks like is not mine
                            el = document.createTextNode('{{' + token.key + '}}');
                            node.parentNode.insertBefore(el, node);
                        }
                        token.node = el;
                    } else {
                        el = document.createTextNode(token.value);
                        // just normal string put back to view
                        node.parentNode.insertBefore(el, node);
                    }
                }
                node.parentNode.removeChild(node);
                return tokens;
            }
            /**
             *
             * @param node
             * @param dataObj
             * @param itemName
             */
            function compileElement (node, dataObj, itemName) {
                var tokens = [],
                    token;
                // recursively compile childNodes
                if (node.hasChildNodes()) {
                    [].slice.call(node.childNodes).forEach(function (child) {
                        token = compile(child, dataObj, itemName);
                        if (token) {
                            tokens = tokens.concat(token);
                        }
                    });
                }
                return tokens.length > 0 ? tokens : undefined;
            }
            /**
             *  Compile a DOM node (recursive)
             * @param node
             * @param dataObj
             * @param itemName
             * @returns {*}
             */
            function compile(node, dataObj, itemName) {
                var nodeType = node.nodeType,
                    tokens = [],
                    token;
                if (nodeType === 1 && node.tagName !== 'SCRIPT') { // a normal node
                    token = compileElement(node, dataObj, itemName);
                    if (token) {
                        tokens = tokens.concat(token);
                    }
                } else if (nodeType === 3) {
                    token = compileTextNode(node, dataObj, itemName);
                    if (token) {
                        tokens = tokens.concat(token);
                    }
                }
                return tokens.length > 0 ? tokens : undefined;
            }

            /**
             * Replaces expressions for all tag attributes
             *
             * loop though all children and check if a attribute has a expressions inside
             *
             * @param containerNode
             * @param obj
             * @param itemName
             * @return returnTokens [{key:String, attr: node attribute reference, html: boolean}]
             */
            function handleAttributes(containerNode, obj, itemName) {
                var returnTokens = [];
                (function searchForExpressions(children) {
                    [].slice.call(children).forEach(function (node) {
                        var i, attr, rTokens;
                        if (node.children.length > 0) {
                            // do it recursive for all children
                            searchForExpressions(node.children);
                        }
                        // loop through each attribute
                        for (i = 0; i < node.attributes.length; i++) {
                            attr = node.attributes[i];
                            if (/\{\{/.test(attr.textContent)) {
                                if (attr.name) {
                                    rTokens = (function () {
                                        var token = parse(attr.textContent),
                                            endData = [], tmpToken, j, tmpTokenSplit, value;
                                        for (j = 0; j < token.length; j++) {
                                            tmpToken = token[j];
                                            // if token not itemName skipp all
                                            if (tmpToken.key !== undefined && tmpToken.key.split('.')[0] === itemName) {
                                                // save the attribute
                                                tmpToken.attr = attr;
                                                if (/\./.test(tmpToken.key)) {
                                                    tmpTokenSplit = tmpToken.key.split('.').slice(1).join('.');
                                                } else {
                                                    tmpTokenSplit = tmpToken.key;
                                                }
                                                if (typeof obj === 'object') {
                                                    tmpToken.value = getGlobalCall(tmpTokenSplit, obj);
                                                    if (typeof tmpToken.value === 'function') {
                                                        value = tmpToken.value();
                                                    } else {
                                                        value = tmpToken.value;
                                                    }
                                                } else if (typeof obj === 'string') {
                                                    value = obj;
                                                } else if (typeof obj === 'function') {
                                                    value = obj(node);
                                                }

                                            } else if (tmpToken.hasOwnProperty('key')) {
                                                // restore the expression - might be another whisker instance will
                                                // needs this
                                                value = '{{' + tmpToken.key + '}}';
                                            } else {
                                                value = tmpToken.value;
                                            }
                                            endData.push({value : value, concat : tmpToken.concat});
                                        }
                                        attr.textContent = endData.map(function (d) {
                                            return d.concat ? d.value : ' ' + d.value;
                                        }).join('');
                                        return token;
                                    }());
                                    returnTokens = returnTokens.concat(rTokens);
                                }
                            }
                        }
                    });
                }(containerNode.children));
                return returnTokens;
            }

            /**
             * do the magic for attributes or text nodes
             *
             * @param node
             * @param scopeName
             * @param data
             */
            function fillData(node, scopeName, data) {
                var tokens = [];
                if (typeof data === 'object') {
                    // handleEvents(node, data, scopeName);
                    tokens = tokens.concat(handleAttributes(node, data, scopeName));
                    // replace texts:
                    return tokens.concat(compile(node, data, scopeName));
                } else {
                    console.error('whisker:handleAttributes detect none acceptable data argument', data);
                }
            }

            /**
             * helper function for updateData to update the text nodes
             * @param token
             * @param val
             */
            function updateText(token, val) {

                if (typeof val === 'string' || typeof val === 'number') {
                    token.node.nodeValue = val;
                } else if (typeof val === 'boolean') {
                    // TODO test
                    token.node.nodeValue = val.toString();
                } else if (typeof val === 'function') {
                    // TODO test and implement
                    //    token.node.nodeValue = val(token.node.parentNode);
                }
            }

            /**
             * helper function for updateData to update the attributes for a node
             * @param token
             * @param val
             */
            function updateAttributes(token, val) {
                if (typeof val === 'string' || typeof val === 'number') {
                    var replaceText = token.attr.textContent;
                    if (replaceText) {
                        token.attr.textContent = replaceText.replace(token.value, val);
                        token.value = val;
                    } else {
                        token.attr.textContent = replaceText + val;
                    }
                } else if (typeof val === 'boolean') {
                    // TODO test
                    token.node.nodeValue = val.toString();
                } else if (typeof val === 'function') {
                    // TODO test and implement
                    //    token.node.nodeValue = val(token.node.parentNode);
                }
            }
            /**
             *
             * Call this to update the existing data's
             *
             * TODO test also boolean and function
             *
             * @param tokenObjList [{key : "scopeName.property", node}]
             * @param scopeName
             * @param obj
             */
            function updateData(tokenObjList, scopeName, obj) {
                tokenObjList.forEach(function (token) {
                    if (token && token.hasOwnProperty('key')) {
                        var tmp = token.key.split('.'), tokenObjectProperty, val;
                        if (tmp.length > 0 && tmp[0] === scopeName) {
                            tokenObjectProperty = tmp.slice(1).join('.');
                            if (typeof obj === 'object') {
                                val = getGlobalCall(tokenObjectProperty, obj);
                            } else {
                                val = obj;
                            }

                            if (val !== undefined) {
                                if (token.hasOwnProperty('attr')) {
                                    // handle attribute
                                    updateAttributes(token, val);
                                } else {
                                    updateText(token, val);
                                }
                            }
                        }
                    }
                });
            }

            /**
             * TODO description
             * Create a new whisker instance and do the "magic".
             * @param node
             * @param scopeName
             * @param data
             */
            function exec(node, data, scopeName) {
                var currentScope = scopeName,
                    keyValueholder = {};
                if (typeof data === 'function') {
                    data(function (scope, data) {
                        if (data !== undefined) {
                            currentScope  = scope;
                        } else {
                            data = scope;
                        }
                        if (keyValueholder.hasOwnProperty(scope)) {
                            updateData(keyValueholder[scope], currentScope, data);
                        } else {
                            keyValueholder[scope] = fillData(node, currentScope, data);
                        }
                    });
                } else {
                    fillData(node, currentScope, data)
                }
            }

            return {
                add : function (node, attr) {
                    var inPointer;
                    if (typeof attr === 'object' && attr.to && attr.bind) {
                        if (typeof attr.to === 'string') {
                            // TODO replace window with this and also other instances could use the magic as closure
                            inPointer = getGlobalCall(attr.to, window);
                        } else {
                            inPointer = attr.to;
                        }
                        exec(node, inPointer, attr.bind);
                    } else {
                        inPointer = getGlobalCall(attr, window);
                        if (typeof inPointer === 'function') {
                            exec(node, inPointer);
                        } else {
                            console.warn('whisker:add none acceptable attributes', attr);
                        }
                    }
                }
            };
        }());

    function escapeRegex(str) {
        return str.replace(ESCAPE_RE, '\\$&');
    }

    function getRegex() {
        var open = escapeRegex(openChar),
            end  = escapeRegex(endChar);
        return new RegExp(open + open + open + '?(.+?)' + end + '?' + end + end);
    }

    /**
     * Read a property from a given string and object.
     * Returns the founded property pointer or undefined.
     * @param value
     * @param obj
     * @returns {*} or undefined
     */
    function getGlobalCall (value, obj) {
        var split = value.split('.'),
            rec = function (cur) {
                if (obj[cur] !== undefined) {
                    obj = obj[cur];
                    rec(split.shift());
                } else if (cur === value ) {
                    obj = undefined;
                }
            };
        rec(split.shift());
        return obj;
    }

    // export as module or bind to global
    if (typeof module !== 'undefined' && module.hasOwnProperty('exports')) {
        module.exports = whisker;
    } else {
        canny.add('whisker', whisker);
    }

}());

}).call(this,require("+7ZJp0"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../../../node_modules/canny/mod/whisker.js","/../../../node_modules/canny/mod")
},{"+7ZJp0":60,"buffer":55}],43:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
var dnode = require('./lib/dnode');

module.exports = function (cons, opts) {
    return new dnode(cons, opts);
};

}).call(this,require("+7ZJp0"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../../../node_modules/dnode/browser.js","/../../../node_modules/dnode")
},{"+7ZJp0":60,"./lib/dnode":44,"buffer":55}],44:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
var protocol = require('dnode-protocol');
var Stream = require('stream');
var json = typeof JSON === 'object' ? JSON : require('jsonify');

module.exports = dnode;
dnode.prototype = {};
(function () { // browsers etc
    for (var key in Stream.prototype) {
        dnode.prototype[key] = Stream.prototype[key];
    }
})();

function dnode (cons, opts) {
    Stream.call(this);
    var self = this;
    
    self.opts = opts || {};
    
    self.cons = typeof cons === 'function'
        ? cons
        : function () { return cons || {} }
    ;
    
    self.readable = true;
    self.writable = true;
    
    process.nextTick(function () {
        if (self._ended) return;
        self.proto = self._createProto();
        self.proto.start();
        
        if (!self._handleQueue) return;
        for (var i = 0; i < self._handleQueue.length; i++) {
            self.handle(self._handleQueue[i]);
        }
    });
}

dnode.prototype._createProto = function () {
    var self = this;
    var proto = protocol(function (remote) {
        if (self._ended) return;
        
        var ref = self.cons.call(this, remote, self);
        if (typeof ref !== 'object') ref = this;
        
        self.emit('local', ref, self);
        
        return ref;
    }, self.opts.proto);
    
    proto.on('remote', function (remote) {
        self.emit('remote', remote, self);
        self.emit('ready'); // backwards compatability, deprecated
    });
    
    proto.on('request', function (req) {
        if (!self.readable) return;
        
        if (self.opts.emit === 'object') {
            self.emit('data', req);
        }
        else self.emit('data', json.stringify(req) + '\n');
    });
    
    proto.on('fail', function (err) {
        // errors that the remote end was responsible for
        self.emit('fail', err);
    });
    
    proto.on('error', function (err) {
        // errors that the local code was responsible for
        self.emit('error', err);
    });
    
    return proto;
};

dnode.prototype.write = function (buf) {
    if (this._ended) return;
    var self = this;
    var row;
    
    if (buf && typeof buf === 'object'
    && buf.constructor && buf.constructor.name === 'Buffer'
    && buf.length
    && typeof buf.slice === 'function') {
        // treat like a buffer
        if (!self._bufs) self._bufs = [];
        
        // treat like a buffer
        for (var i = 0, j = 0; i < buf.length; i++) {
            if (buf[i] === 0x0a) {
                self._bufs.push(buf.slice(j, i));
                
                var line = '';
                for (var k = 0; k < self._bufs.length; k++) {
                    line += String(self._bufs[k]);
                }
                
                try { row = json.parse(line) }
                catch (err) { return self.end() }
                
                j = i + 1;
                
                self.handle(row);
                self._bufs = [];
            }
        }
        
        if (j < buf.length) self._bufs.push(buf.slice(j, buf.length));
    }
    else if (buf && typeof buf === 'object') {
        // .isBuffer() without the Buffer
        // Use self to pipe JSONStream.parse() streams.
        self.handle(buf);
    }
    else {
        if (typeof buf !== 'string') buf = String(buf);
        if (!self._line) self._line = '';
        
        for (var i = 0; i < buf.length; i++) {
            if (buf.charCodeAt(i) === 0x0a) {
                try { row = json.parse(self._line) }
                catch (err) { return self.end() }
                
                self._line = '';
                self.handle(row);
            }
            else self._line += buf.charAt(i)
        }
    }
};

dnode.prototype.handle = function (row) {
    if (!this.proto) {
        if (!this._handleQueue) this._handleQueue = [];
        this._handleQueue.push(row);
    }
    else this.proto.handle(row);
};

dnode.prototype.end = function () {
    if (this._ended) return;
    this._ended = true;
    this.writable = false;
    this.readable = false;
    this.emit('end');
};

dnode.prototype.destroy = function () {
    this.end();
};

}).call(this,require("+7ZJp0"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../../../node_modules/dnode/lib/dnode.js","/../../../node_modules/dnode/lib")
},{"+7ZJp0":60,"buffer":55,"dnode-protocol":45,"jsonify":51,"stream":66}],45:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
var EventEmitter = require('events').EventEmitter;
var scrubber = require('./lib/scrub');
var objectKeys = require('./lib/keys');
var forEach = require('./lib/foreach');
var isEnumerable = require('./lib/is_enum');

module.exports = function (cons, opts) {
    return new Proto(cons, opts);
};

(function () { // browsers bleh
    for (var key in EventEmitter.prototype) {
        Proto.prototype[key] = EventEmitter.prototype[key];
    }
})();

function Proto (cons, opts) {
    var self = this;
    EventEmitter.call(self);
    if (!opts) opts = {};
    
    self.remote = {};
    self.callbacks = { local : [], remote : [] };
    self.wrap = opts.wrap;
    self.unwrap = opts.unwrap;
    
    self.scrubber = scrubber(self.callbacks.local);
    
    if (typeof cons === 'function') {
        self.instance = new cons(self.remote, self);
    }
    else self.instance = cons || {};
}

Proto.prototype.start = function () {
    this.request('methods', [ this.instance ]);
};

Proto.prototype.cull = function (id) {
    delete this.callbacks.remote[id];
    this.emit('request', {
        method : 'cull',
        arguments : [ id ]
    });
};

Proto.prototype.request = function (method, args) {
    var scrub = this.scrubber.scrub(args);
    
    this.emit('request', {
        method : method,
        arguments : scrub.arguments,
        callbacks : scrub.callbacks,
        links : scrub.links
    });
};

Proto.prototype.handle = function (req) {
    var self = this;
    var args = self.scrubber.unscrub(req, function (id) {
        if (self.callbacks.remote[id] === undefined) {
            // create a new function only if one hasn't already been created
            // for a particular id
            var cb = function () {
                self.request(id, [].slice.apply(arguments));
            };
            self.callbacks.remote[id] = self.wrap ? self.wrap(cb, id) : cb;
            return cb;
        }
        return self.unwrap
            ? self.unwrap(self.callbacks.remote[id], id)
            : self.callbacks.remote[id]
        ;
    });
    
    if (req.method === 'methods') {
        self.handleMethods(args[0]);
    }
    else if (req.method === 'cull') {
        forEach(args, function (id) {
            delete self.callbacks.local[id];
        });
    }
    else if (typeof req.method === 'string') {
        if (isEnumerable(self.instance, req.method)) {
            self.apply(self.instance[req.method], args);
        }
        else {
            self.emit('fail', new Error(
                'request for non-enumerable method: ' + req.method
            ));
        }
    }
    else if (typeof req.method == 'number') {
        var fn = self.callbacks.local[req.method];
        if (!fn) {
            self.emit('fail', new Error('no such method'));
        }
        else self.apply(fn, args);
    }
};

Proto.prototype.handleMethods = function (methods) {
    var self = this;
    if (typeof methods != 'object') {
        methods = {};
    }
    
    // copy since assignment discards the previous refs
    forEach(objectKeys(self.remote), function (key) {
        delete self.remote[key];
    });
    
    forEach(objectKeys(methods), function (key) {
        self.remote[key] = methods[key];
    });
    
    self.emit('remote', self.remote);
    self.emit('ready');
};

Proto.prototype.apply = function (f, args) {
    try { f.apply(undefined, args) }
    catch (err) { this.emit('error', err) }
};

}).call(this,require("+7ZJp0"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../../../node_modules/dnode/node_modules/dnode-protocol/index.js","/../../../node_modules/dnode/node_modules/dnode-protocol")
},{"+7ZJp0":60,"./lib/foreach":46,"./lib/is_enum":47,"./lib/keys":48,"./lib/scrub":49,"buffer":55,"events":58}],46:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
module.exports = function forEach (xs, f) {
    if (xs.forEach) return xs.forEach(f)
    for (var i = 0; i < xs.length; i++) {
        f.call(xs, xs[i], i);
    }
}

}).call(this,require("+7ZJp0"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../../../node_modules/dnode/node_modules/dnode-protocol/lib/foreach.js","/../../../node_modules/dnode/node_modules/dnode-protocol/lib")
},{"+7ZJp0":60,"buffer":55}],47:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
var objectKeys = require('./keys');

module.exports = function (obj, key) {
    if (Object.prototype.propertyIsEnumerable) {
        return Object.prototype.propertyIsEnumerable.call(obj, key);
    }
    var keys = objectKeys(obj);
    for (var i = 0; i < keys.length; i++) {
        if (key === keys[i]) return true;
    }
    return false;
};

}).call(this,require("+7ZJp0"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../../../node_modules/dnode/node_modules/dnode-protocol/lib/is_enum.js","/../../../node_modules/dnode/node_modules/dnode-protocol/lib")
},{"+7ZJp0":60,"./keys":48,"buffer":55}],48:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
module.exports = Object.keys || function (obj) {
    var keys = [];
    for (var key in obj) keys.push(key);
    return keys;
};

}).call(this,require("+7ZJp0"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../../../node_modules/dnode/node_modules/dnode-protocol/lib/keys.js","/../../../node_modules/dnode/node_modules/dnode-protocol/lib")
},{"+7ZJp0":60,"buffer":55}],49:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
var traverse = require('traverse');
var objectKeys = require('./keys');
var forEach = require('./foreach');

function indexOf (xs, x) {
    if (xs.indexOf) return xs.indexOf(x);
    for (var i = 0; i < xs.length; i++) if (xs[i] === x) return i;
    return -1;
}

// scrub callbacks out of requests in order to call them again later
module.exports = function (callbacks) {
    return new Scrubber(callbacks);
};

function Scrubber (callbacks) {
    this.callbacks = callbacks;
}

// Take the functions out and note them for future use
Scrubber.prototype.scrub = function (obj) {
    var self = this;
    var paths = {};
    var links = [];
    
    var args = traverse(obj).map(function (node) {
        if (typeof node === 'function') {
            var i = indexOf(self.callbacks, node);
            if (i >= 0 && !(i in paths)) {
                // Keep previous function IDs only for the first function
                // found. This is somewhat suboptimal but the alternatives
                // are worse.
                paths[i] = this.path;
            }
            else {
                var id = self.callbacks.length;
                self.callbacks.push(node);
                paths[id] = this.path;
            }
            
            this.update('[Function]');
        }
        else if (this.circular) {
            links.push({ from : this.circular.path, to : this.path });
            this.update('[Circular]');
        }
    });
    
    return {
        arguments : args,
        callbacks : paths,
        links : links
    };
};
 
// Replace callbacks. The supplied function should take a callback id and
// return a callback of its own.
Scrubber.prototype.unscrub = function (msg, f) {
    var args = msg.arguments || [];
    forEach(objectKeys(msg.callbacks || {}), function (sid) {
        var id = parseInt(sid, 10);
        var path = msg.callbacks[id];
        traverse.set(args, path, f(id));
    });
    
    forEach(msg.links || [], function (link) {
        var value = traverse.get(args, link.from);
        traverse.set(args, link.to, value);
    });
    
    return args;
};

}).call(this,require("+7ZJp0"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../../../node_modules/dnode/node_modules/dnode-protocol/lib/scrub.js","/../../../node_modules/dnode/node_modules/dnode-protocol/lib")
},{"+7ZJp0":60,"./foreach":46,"./keys":48,"buffer":55,"traverse":50}],50:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
var traverse = module.exports = function (obj) {
    return new Traverse(obj);
};

function Traverse (obj) {
    this.value = obj;
}

Traverse.prototype.get = function (ps) {
    var node = this.value;
    for (var i = 0; i < ps.length; i ++) {
        var key = ps[i];
        if (!node || !hasOwnProperty.call(node, key)) {
            node = undefined;
            break;
        }
        node = node[key];
    }
    return node;
};

Traverse.prototype.has = function (ps) {
    var node = this.value;
    for (var i = 0; i < ps.length; i ++) {
        var key = ps[i];
        if (!node || !hasOwnProperty.call(node, key)) {
            return false;
        }
        node = node[key];
    }
    return true;
};

Traverse.prototype.set = function (ps, value) {
    var node = this.value;
    for (var i = 0; i < ps.length - 1; i ++) {
        var key = ps[i];
        if (!hasOwnProperty.call(node, key)) node[key] = {};
        node = node[key];
    }
    node[ps[i]] = value;
    return value;
};

Traverse.prototype.map = function (cb) {
    return walk(this.value, cb, true);
};

Traverse.prototype.forEach = function (cb) {
    this.value = walk(this.value, cb, false);
    return this.value;
};

Traverse.prototype.reduce = function (cb, init) {
    var skip = arguments.length === 1;
    var acc = skip ? this.value : init;
    this.forEach(function (x) {
        if (!this.isRoot || !skip) {
            acc = cb.call(this, acc, x);
        }
    });
    return acc;
};

Traverse.prototype.paths = function () {
    var acc = [];
    this.forEach(function (x) {
        acc.push(this.path); 
    });
    return acc;
};

Traverse.prototype.nodes = function () {
    var acc = [];
    this.forEach(function (x) {
        acc.push(this.node);
    });
    return acc;
};

Traverse.prototype.clone = function () {
    var parents = [], nodes = [];
    
    return (function clone (src) {
        for (var i = 0; i < parents.length; i++) {
            if (parents[i] === src) {
                return nodes[i];
            }
        }
        
        if (typeof src === 'object' && src !== null) {
            var dst = copy(src);
            
            parents.push(src);
            nodes.push(dst);
            
            forEach(objectKeys(src), function (key) {
                dst[key] = clone(src[key]);
            });
            
            parents.pop();
            nodes.pop();
            return dst;
        }
        else {
            return src;
        }
    })(this.value);
};

function walk (root, cb, immutable) {
    var path = [];
    var parents = [];
    var alive = true;
    
    return (function walker (node_) {
        var node = immutable ? copy(node_) : node_;
        var modifiers = {};
        
        var keepGoing = true;
        
        var state = {
            node : node,
            node_ : node_,
            path : [].concat(path),
            parent : parents[parents.length - 1],
            parents : parents,
            key : path.slice(-1)[0],
            isRoot : path.length === 0,
            level : path.length,
            circular : null,
            update : function (x, stopHere) {
                if (!state.isRoot) {
                    state.parent.node[state.key] = x;
                }
                state.node = x;
                if (stopHere) keepGoing = false;
            },
            'delete' : function (stopHere) {
                delete state.parent.node[state.key];
                if (stopHere) keepGoing = false;
            },
            remove : function (stopHere) {
                if (isArray(state.parent.node)) {
                    state.parent.node.splice(state.key, 1);
                }
                else {
                    delete state.parent.node[state.key];
                }
                if (stopHere) keepGoing = false;
            },
            keys : null,
            before : function (f) { modifiers.before = f },
            after : function (f) { modifiers.after = f },
            pre : function (f) { modifiers.pre = f },
            post : function (f) { modifiers.post = f },
            stop : function () { alive = false },
            block : function () { keepGoing = false }
        };
        
        if (!alive) return state;
        
        function updateState() {
            if (typeof state.node === 'object' && state.node !== null) {
                if (!state.keys || state.node_ !== state.node) {
                    state.keys = objectKeys(state.node)
                }
                
                state.isLeaf = state.keys.length == 0;
                
                for (var i = 0; i < parents.length; i++) {
                    if (parents[i].node_ === node_) {
                        state.circular = parents[i];
                        break;
                    }
                }
            }
            else {
                state.isLeaf = true;
                state.keys = null;
            }
            
            state.notLeaf = !state.isLeaf;
            state.notRoot = !state.isRoot;
        }
        
        updateState();
        
        // use return values to update if defined
        var ret = cb.call(state, state.node);
        if (ret !== undefined && state.update) state.update(ret);
        
        if (modifiers.before) modifiers.before.call(state, state.node);
        
        if (!keepGoing) return state;
        
        if (typeof state.node == 'object'
        && state.node !== null && !state.circular) {
            parents.push(state);
            
            updateState();
            
            forEach(state.keys, function (key, i) {
                path.push(key);
                
                if (modifiers.pre) modifiers.pre.call(state, state.node[key], key);
                
                var child = walker(state.node[key]);
                if (immutable && hasOwnProperty.call(state.node, key)) {
                    state.node[key] = child.node;
                }
                
                child.isLast = i == state.keys.length - 1;
                child.isFirst = i == 0;
                
                if (modifiers.post) modifiers.post.call(state, child);
                
                path.pop();
            });
            parents.pop();
        }
        
        if (modifiers.after) modifiers.after.call(state, state.node);
        
        return state;
    })(root).node;
}

function copy (src) {
    if (typeof src === 'object' && src !== null) {
        var dst;
        
        if (isArray(src)) {
            dst = [];
        }
        else if (isDate(src)) {
            dst = new Date(src.getTime ? src.getTime() : src);
        }
        else if (isRegExp(src)) {
            dst = new RegExp(src);
        }
        else if (isError(src)) {
            dst = { message: src.message };
        }
        else if (isBoolean(src)) {
            dst = new Boolean(src);
        }
        else if (isNumber(src)) {
            dst = new Number(src);
        }
        else if (isString(src)) {
            dst = new String(src);
        }
        else if (Object.create && Object.getPrototypeOf) {
            dst = Object.create(Object.getPrototypeOf(src));
        }
        else if (src.constructor === Object) {
            dst = {};
        }
        else {
            var proto =
                (src.constructor && src.constructor.prototype)
                || src.__proto__
                || {}
            ;
            var T = function () {};
            T.prototype = proto;
            dst = new T;
        }
        
        forEach(objectKeys(src), function (key) {
            dst[key] = src[key];
        });
        return dst;
    }
    else return src;
}

var objectKeys = Object.keys || function keys (obj) {
    var res = [];
    for (var key in obj) res.push(key)
    return res;
};

function toS (obj) { return Object.prototype.toString.call(obj) }
function isDate (obj) { return toS(obj) === '[object Date]' }
function isRegExp (obj) { return toS(obj) === '[object RegExp]' }
function isError (obj) { return toS(obj) === '[object Error]' }
function isBoolean (obj) { return toS(obj) === '[object Boolean]' }
function isNumber (obj) { return toS(obj) === '[object Number]' }
function isString (obj) { return toS(obj) === '[object String]' }

var isArray = Array.isArray || function isArray (xs) {
    return Object.prototype.toString.call(xs) === '[object Array]';
};

var forEach = function (xs, fn) {
    if (xs.forEach) return xs.forEach(fn)
    else for (var i = 0; i < xs.length; i++) {
        fn(xs[i], i, xs);
    }
};

forEach(objectKeys(Traverse.prototype), function (key) {
    traverse[key] = function (obj) {
        var args = [].slice.call(arguments, 1);
        var t = new Traverse(obj);
        return t[key].apply(t, args);
    };
});

var hasOwnProperty = Object.hasOwnProperty || function (obj, key) {
    return key in obj;
};

}).call(this,require("+7ZJp0"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../../../node_modules/dnode/node_modules/dnode-protocol/node_modules/traverse/index.js","/../../../node_modules/dnode/node_modules/dnode-protocol/node_modules/traverse")
},{"+7ZJp0":60,"buffer":55}],51:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
exports.parse = require('./lib/parse');
exports.stringify = require('./lib/stringify');

}).call(this,require("+7ZJp0"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../../../node_modules/dnode/node_modules/jsonify/index.js","/../../../node_modules/dnode/node_modules/jsonify")
},{"+7ZJp0":60,"./lib/parse":52,"./lib/stringify":53,"buffer":55}],52:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
var at, // The index of the current character
    ch, // The current character
    escapee = {
        '"':  '"',
        '\\': '\\',
        '/':  '/',
        b:    '\b',
        f:    '\f',
        n:    '\n',
        r:    '\r',
        t:    '\t'
    },
    text,

    error = function (m) {
        // Call error when something is wrong.
        throw {
            name:    'SyntaxError',
            message: m,
            at:      at,
            text:    text
        };
    },
    
    next = function (c) {
        // If a c parameter is provided, verify that it matches the current character.
        if (c && c !== ch) {
            error("Expected '" + c + "' instead of '" + ch + "'");
        }
        
        // Get the next character. When there are no more characters,
        // return the empty string.
        
        ch = text.charAt(at);
        at += 1;
        return ch;
    },
    
    number = function () {
        // Parse a number value.
        var number,
            string = '';
        
        if (ch === '-') {
            string = '-';
            next('-');
        }
        while (ch >= '0' && ch <= '9') {
            string += ch;
            next();
        }
        if (ch === '.') {
            string += '.';
            while (next() && ch >= '0' && ch <= '9') {
                string += ch;
            }
        }
        if (ch === 'e' || ch === 'E') {
            string += ch;
            next();
            if (ch === '-' || ch === '+') {
                string += ch;
                next();
            }
            while (ch >= '0' && ch <= '9') {
                string += ch;
                next();
            }
        }
        number = +string;
        if (!isFinite(number)) {
            error("Bad number");
        } else {
            return number;
        }
    },
    
    string = function () {
        // Parse a string value.
        var hex,
            i,
            string = '',
            uffff;
        
        // When parsing for string values, we must look for " and \ characters.
        if (ch === '"') {
            while (next()) {
                if (ch === '"') {
                    next();
                    return string;
                } else if (ch === '\\') {
                    next();
                    if (ch === 'u') {
                        uffff = 0;
                        for (i = 0; i < 4; i += 1) {
                            hex = parseInt(next(), 16);
                            if (!isFinite(hex)) {
                                break;
                            }
                            uffff = uffff * 16 + hex;
                        }
                        string += String.fromCharCode(uffff);
                    } else if (typeof escapee[ch] === 'string') {
                        string += escapee[ch];
                    } else {
                        break;
                    }
                } else {
                    string += ch;
                }
            }
        }
        error("Bad string");
    },

    white = function () {

// Skip whitespace.

        while (ch && ch <= ' ') {
            next();
        }
    },

    word = function () {

// true, false, or null.

        switch (ch) {
        case 't':
            next('t');
            next('r');
            next('u');
            next('e');
            return true;
        case 'f':
            next('f');
            next('a');
            next('l');
            next('s');
            next('e');
            return false;
        case 'n':
            next('n');
            next('u');
            next('l');
            next('l');
            return null;
        }
        error("Unexpected '" + ch + "'");
    },

    value,  // Place holder for the value function.

    array = function () {

// Parse an array value.

        var array = [];

        if (ch === '[') {
            next('[');
            white();
            if (ch === ']') {
                next(']');
                return array;   // empty array
            }
            while (ch) {
                array.push(value());
                white();
                if (ch === ']') {
                    next(']');
                    return array;
                }
                next(',');
                white();
            }
        }
        error("Bad array");
    },

    object = function () {

// Parse an object value.

        var key,
            object = {};

        if (ch === '{') {
            next('{');
            white();
            if (ch === '}') {
                next('}');
                return object;   // empty object
            }
            while (ch) {
                key = string();
                white();
                next(':');
                if (Object.hasOwnProperty.call(object, key)) {
                    error('Duplicate key "' + key + '"');
                }
                object[key] = value();
                white();
                if (ch === '}') {
                    next('}');
                    return object;
                }
                next(',');
                white();
            }
        }
        error("Bad object");
    };

value = function () {

// Parse a JSON value. It could be an object, an array, a string, a number,
// or a word.

    white();
    switch (ch) {
    case '{':
        return object();
    case '[':
        return array();
    case '"':
        return string();
    case '-':
        return number();
    default:
        return ch >= '0' && ch <= '9' ? number() : word();
    }
};

// Return the json_parse function. It will have access to all of the above
// functions and variables.

module.exports = function (source, reviver) {
    var result;
    
    text = source;
    at = 0;
    ch = ' ';
    result = value();
    white();
    if (ch) {
        error("Syntax error");
    }

    // If there is a reviver function, we recursively walk the new structure,
    // passing each name/value pair to the reviver function for possible
    // transformation, starting with a temporary root object that holds the result
    // in an empty key. If there is not a reviver function, we simply return the
    // result.

    return typeof reviver === 'function' ? (function walk(holder, key) {
        var k, v, value = holder[key];
        if (value && typeof value === 'object') {
            for (k in value) {
                if (Object.prototype.hasOwnProperty.call(value, k)) {
                    v = walk(value, k);
                    if (v !== undefined) {
                        value[k] = v;
                    } else {
                        delete value[k];
                    }
                }
            }
        }
        return reviver.call(holder, key, value);
    }({'': result}, '')) : result;
};

}).call(this,require("+7ZJp0"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../../../node_modules/dnode/node_modules/jsonify/lib/parse.js","/../../../node_modules/dnode/node_modules/jsonify/lib")
},{"+7ZJp0":60,"buffer":55}],53:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
    escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
    gap,
    indent,
    meta = {    // table of character substitutions
        '\b': '\\b',
        '\t': '\\t',
        '\n': '\\n',
        '\f': '\\f',
        '\r': '\\r',
        '"' : '\\"',
        '\\': '\\\\'
    },
    rep;

function quote(string) {
    // If the string contains no control characters, no quote characters, and no
    // backslash characters, then we can safely slap some quotes around it.
    // Otherwise we must also replace the offending characters with safe escape
    // sequences.
    
    escapable.lastIndex = 0;
    return escapable.test(string) ? '"' + string.replace(escapable, function (a) {
        var c = meta[a];
        return typeof c === 'string' ? c :
            '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
    }) + '"' : '"' + string + '"';
}

function str(key, holder) {
    // Produce a string from holder[key].
    var i,          // The loop counter.
        k,          // The member key.
        v,          // The member value.
        length,
        mind = gap,
        partial,
        value = holder[key];
    
    // If the value has a toJSON method, call it to obtain a replacement value.
    if (value && typeof value === 'object' &&
            typeof value.toJSON === 'function') {
        value = value.toJSON(key);
    }
    
    // If we were called with a replacer function, then call the replacer to
    // obtain a replacement value.
    if (typeof rep === 'function') {
        value = rep.call(holder, key, value);
    }
    
    // What happens next depends on the value's type.
    switch (typeof value) {
        case 'string':
            return quote(value);
        
        case 'number':
            // JSON numbers must be finite. Encode non-finite numbers as null.
            return isFinite(value) ? String(value) : 'null';
        
        case 'boolean':
        case 'null':
            // If the value is a boolean or null, convert it to a string. Note:
            // typeof null does not produce 'null'. The case is included here in
            // the remote chance that this gets fixed someday.
            return String(value);
            
        case 'object':
            if (!value) return 'null';
            gap += indent;
            partial = [];
            
            // Array.isArray
            if (Object.prototype.toString.apply(value) === '[object Array]') {
                length = value.length;
                for (i = 0; i < length; i += 1) {
                    partial[i] = str(i, value) || 'null';
                }
                
                // Join all of the elements together, separated with commas, and
                // wrap them in brackets.
                v = partial.length === 0 ? '[]' : gap ?
                    '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']' :
                    '[' + partial.join(',') + ']';
                gap = mind;
                return v;
            }
            
            // If the replacer is an array, use it to select the members to be
            // stringified.
            if (rep && typeof rep === 'object') {
                length = rep.length;
                for (i = 0; i < length; i += 1) {
                    k = rep[i];
                    if (typeof k === 'string') {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            }
            else {
                // Otherwise, iterate through all of the keys in the object.
                for (k in value) {
                    if (Object.prototype.hasOwnProperty.call(value, k)) {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            }
            
        // Join all of the member texts together, separated with commas,
        // and wrap them in braces.

        v = partial.length === 0 ? '{}' : gap ?
            '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}' :
            '{' + partial.join(',') + '}';
        gap = mind;
        return v;
    }
}

module.exports = function (value, replacer, space) {
    var i;
    gap = '';
    indent = '';
    
    // If the space parameter is a number, make an indent string containing that
    // many spaces.
    if (typeof space === 'number') {
        for (i = 0; i < space; i += 1) {
            indent += ' ';
        }
    }
    // If the space parameter is a string, it will be used as the indent string.
    else if (typeof space === 'string') {
        indent = space;
    }

    // If there is a replacer, it must be a function or an array.
    // Otherwise, throw an error.
    rep = replacer;
    if (replacer && typeof replacer !== 'function'
    && (typeof replacer !== 'object' || typeof replacer.length !== 'number')) {
        throw new Error('JSON.stringify');
    }
    
    // Make a fake root object containing our value under the key of ''.
    // Return the result of stringifying the value.
    return str('', {'': value});
};

}).call(this,require("+7ZJp0"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../../../node_modules/dnode/node_modules/jsonify/lib/stringify.js","/../../../node_modules/dnode/node_modules/jsonify/lib")
},{"+7ZJp0":60,"buffer":55}],54:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
/*global HTMLElement */
/*jslint browser: true */

var domOpts = {};

domOpts.params = (function () {
    "use strict";
    var params = {}, i, nv, parts;
    if (location.search) {
        parts = location.search.substring(1).split('&');
        for (i = 0; i < parts.length; i++) {
            nv = parts[i].split('=');
            if (nv[0]) {
                params[nv[0]] = nv[1] || true;
            }
        }
    }
    return params;
}());

domOpts.createElement = function (tag, id, classes) {
    "use strict";
    var newNode = document.createElement(tag);
    if (id) {newNode.setAttribute('id', id); }
    if (classes) {newNode.setAttribute('class', classes); }
    return newNode;
};
module.exports =  domOpts;

// dom operations:
HTMLElement.prototype.domAddClass = function (addClasses) {
    "use strict";
    var attrClass = this.getAttribute('class'),
        addClassesList = addClasses.split(' '), newClasses = [], i;
    for (i = 0; i < addClassesList.length; i++) {
        if (!this.domHasClass(addClassesList[i])) {
            newClasses.push(addClassesList[i]);
        }
    }
    this.setAttribute('class', attrClass !== null ? attrClass + ' ' + newClasses.join(' ') : newClasses.join(' '));
    return this;
};
// TODO remove all classes with same name
HTMLElement.prototype.domRemoveClass = function (removeableClasses) {
    "use strict";
    var removeClasses = (removeableClasses && removeableClasses.split(' ')) || this.getAttribute('class').split(' '),
        attrClass = this.getAttribute('class'),
        currentClasses,
        i,
        idx;
    if (attrClass !== null) {
        currentClasses = attrClass.split(' ');
        for (i = 0; i < removeClasses.length; i++) {
            idx = currentClasses.indexOf(removeClasses[i]);
            if (idx >= 0) {
                currentClasses = currentClasses.slice(0, idx).concat(currentClasses.slice(idx + 1, currentClasses.length - 1));
            }
        }
        this.setAttribute('class', currentClasses.join(' '));
    }
    return this;
};

// dom operations:
HTMLElement.prototype.domHasClass = function (className) {
    "use strict";
    var classes = this.getAttribute('class'), currentClasses, i;
    if (classes !== null) {
        currentClasses = classes.split(' ');
        for (i = 0; i < currentClasses.length; i++) {
            if (currentClasses[i] === className) {return true; }
        }
    }
    return false;
};

HTMLElement.prototype.domRemove = function () {
    "use strict";
    this.parentNode.removeChild(this);
};
/**
 * remove all child elements from node
 */
HTMLElement.prototype.domEmpty = function () {
    "use strict";
    Array.prototype.slice.call(this.children).forEach(function (child) {
        child.domRemove(this);
    });
};

HTMLElement.prototype.domAppendTo = function (elem) {
    "use strict";
    var node = elem;
    if (typeof node === 'string') {
        node = document.getElementById(node);
    }
    node.appendChild(this);
    return this;
};

HTMLElement.prototype.domAppendChild = function (elem) {
    "use strict";
    var node = elem;
    if (typeof node === 'string') {
        node = document.getElementById(node);
    }
    this.appendChild(node);
    return this;
};

HTMLElement.prototype.domChildTags = function (tag) {
    "use strict";
    var tags = [];
    Array.prototype.slice.call(this.children).forEach(function (e) {
        if (e.tagName.toLowerCase() === tag.toLowerCase()) {
            tags.push(e);
        }
    });
    return tags;
};
}).call(this,require("+7ZJp0"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../../../node_modules/dom-opts/domOpts.js","/../../../node_modules/dom-opts")
},{"+7ZJp0":60,"buffer":55}],55:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */

var base64 = require('base64-js')
var ieee754 = require('ieee754')

exports.Buffer = Buffer
exports.SlowBuffer = Buffer
exports.INSPECT_MAX_BYTES = 50
Buffer.poolSize = 8192

/**
 * If `Buffer._useTypedArrays`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (compatible down to IE6)
 */
Buffer._useTypedArrays = (function () {
  // Detect if browser supports Typed Arrays. Supported browsers are IE 10+, Firefox 4+,
  // Chrome 7+, Safari 5.1+, Opera 11.6+, iOS 4.2+. If the browser does not support adding
  // properties to `Uint8Array` instances, then that's the same as no `Uint8Array` support
  // because we need to be able to add all the node Buffer API methods. This is an issue
  // in Firefox 4-29. Now fixed: https://bugzilla.mozilla.org/show_bug.cgi?id=695438
  try {
    var buf = new ArrayBuffer(0)
    var arr = new Uint8Array(buf)
    arr.foo = function () { return 42 }
    return 42 === arr.foo() &&
        typeof arr.subarray === 'function' // Chrome 9-10 lack `subarray`
  } catch (e) {
    return false
  }
})()

/**
 * Class: Buffer
 * =============
 *
 * The Buffer constructor returns instances of `Uint8Array` that are augmented
 * with function properties for all the node `Buffer` API functions. We use
 * `Uint8Array` so that square bracket notation works as expected -- it returns
 * a single octet.
 *
 * By augmenting the instances, we can avoid modifying the `Uint8Array`
 * prototype.
 */
function Buffer (subject, encoding, noZero) {
  if (!(this instanceof Buffer))
    return new Buffer(subject, encoding, noZero)

  var type = typeof subject

  // Workaround: node's base64 implementation allows for non-padded strings
  // while base64-js does not.
  if (encoding === 'base64' && type === 'string') {
    subject = stringtrim(subject)
    while (subject.length % 4 !== 0) {
      subject = subject + '='
    }
  }

  // Find the length
  var length
  if (type === 'number')
    length = coerce(subject)
  else if (type === 'string')
    length = Buffer.byteLength(subject, encoding)
  else if (type === 'object')
    length = coerce(subject.length) // assume that object is array-like
  else
    throw new Error('First argument needs to be a number, array or string.')

  var buf
  if (Buffer._useTypedArrays) {
    // Preferred: Return an augmented `Uint8Array` instance for best performance
    buf = Buffer._augment(new Uint8Array(length))
  } else {
    // Fallback: Return THIS instance of Buffer (created by `new`)
    buf = this
    buf.length = length
    buf._isBuffer = true
  }

  var i
  if (Buffer._useTypedArrays && typeof subject.byteLength === 'number') {
    // Speed optimization -- use set if we're copying from a typed array
    buf._set(subject)
  } else if (isArrayish(subject)) {
    // Treat array-ish objects as a byte array
    for (i = 0; i < length; i++) {
      if (Buffer.isBuffer(subject))
        buf[i] = subject.readUInt8(i)
      else
        buf[i] = subject[i]
    }
  } else if (type === 'string') {
    buf.write(subject, 0, encoding)
  } else if (type === 'number' && !Buffer._useTypedArrays && !noZero) {
    for (i = 0; i < length; i++) {
      buf[i] = 0
    }
  }

  return buf
}

// STATIC METHODS
// ==============

Buffer.isEncoding = function (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'binary':
    case 'base64':
    case 'raw':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.isBuffer = function (b) {
  return !!(b !== null && b !== undefined && b._isBuffer)
}

Buffer.byteLength = function (str, encoding) {
  var ret
  str = str + ''
  switch (encoding || 'utf8') {
    case 'hex':
      ret = str.length / 2
      break
    case 'utf8':
    case 'utf-8':
      ret = utf8ToBytes(str).length
      break
    case 'ascii':
    case 'binary':
    case 'raw':
      ret = str.length
      break
    case 'base64':
      ret = base64ToBytes(str).length
      break
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      ret = str.length * 2
      break
    default:
      throw new Error('Unknown encoding')
  }
  return ret
}

Buffer.concat = function (list, totalLength) {
  assert(isArray(list), 'Usage: Buffer.concat(list, [totalLength])\n' +
      'list should be an Array.')

  if (list.length === 0) {
    return new Buffer(0)
  } else if (list.length === 1) {
    return list[0]
  }

  var i
  if (typeof totalLength !== 'number') {
    totalLength = 0
    for (i = 0; i < list.length; i++) {
      totalLength += list[i].length
    }
  }

  var buf = new Buffer(totalLength)
  var pos = 0
  for (i = 0; i < list.length; i++) {
    var item = list[i]
    item.copy(buf, pos)
    pos += item.length
  }
  return buf
}

// BUFFER INSTANCE METHODS
// =======================

function _hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  // must be an even number of digits
  var strLen = string.length
  assert(strLen % 2 === 0, 'Invalid hex string')

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; i++) {
    var byte = parseInt(string.substr(i * 2, 2), 16)
    assert(!isNaN(byte), 'Invalid hex string')
    buf[offset + i] = byte
  }
  Buffer._charsWritten = i * 2
  return i
}

function _utf8Write (buf, string, offset, length) {
  var charsWritten = Buffer._charsWritten =
    blitBuffer(utf8ToBytes(string), buf, offset, length)
  return charsWritten
}

function _asciiWrite (buf, string, offset, length) {
  var charsWritten = Buffer._charsWritten =
    blitBuffer(asciiToBytes(string), buf, offset, length)
  return charsWritten
}

function _binaryWrite (buf, string, offset, length) {
  return _asciiWrite(buf, string, offset, length)
}

function _base64Write (buf, string, offset, length) {
  var charsWritten = Buffer._charsWritten =
    blitBuffer(base64ToBytes(string), buf, offset, length)
  return charsWritten
}

function _utf16leWrite (buf, string, offset, length) {
  var charsWritten = Buffer._charsWritten =
    blitBuffer(utf16leToBytes(string), buf, offset, length)
  return charsWritten
}

Buffer.prototype.write = function (string, offset, length, encoding) {
  // Support both (string, offset, length, encoding)
  // and the legacy (string, encoding, offset, length)
  if (isFinite(offset)) {
    if (!isFinite(length)) {
      encoding = length
      length = undefined
    }
  } else {  // legacy
    var swap = encoding
    encoding = offset
    offset = length
    length = swap
  }

  offset = Number(offset) || 0
  var remaining = this.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }
  encoding = String(encoding || 'utf8').toLowerCase()

  var ret
  switch (encoding) {
    case 'hex':
      ret = _hexWrite(this, string, offset, length)
      break
    case 'utf8':
    case 'utf-8':
      ret = _utf8Write(this, string, offset, length)
      break
    case 'ascii':
      ret = _asciiWrite(this, string, offset, length)
      break
    case 'binary':
      ret = _binaryWrite(this, string, offset, length)
      break
    case 'base64':
      ret = _base64Write(this, string, offset, length)
      break
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      ret = _utf16leWrite(this, string, offset, length)
      break
    default:
      throw new Error('Unknown encoding')
  }
  return ret
}

Buffer.prototype.toString = function (encoding, start, end) {
  var self = this

  encoding = String(encoding || 'utf8').toLowerCase()
  start = Number(start) || 0
  end = (end !== undefined)
    ? Number(end)
    : end = self.length

  // Fastpath empty strings
  if (end === start)
    return ''

  var ret
  switch (encoding) {
    case 'hex':
      ret = _hexSlice(self, start, end)
      break
    case 'utf8':
    case 'utf-8':
      ret = _utf8Slice(self, start, end)
      break
    case 'ascii':
      ret = _asciiSlice(self, start, end)
      break
    case 'binary':
      ret = _binarySlice(self, start, end)
      break
    case 'base64':
      ret = _base64Slice(self, start, end)
      break
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      ret = _utf16leSlice(self, start, end)
      break
    default:
      throw new Error('Unknown encoding')
  }
  return ret
}

Buffer.prototype.toJSON = function () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function (target, target_start, start, end) {
  var source = this

  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (!target_start) target_start = 0

  // Copy 0 bytes; we're done
  if (end === start) return
  if (target.length === 0 || source.length === 0) return

  // Fatal error conditions
  assert(end >= start, 'sourceEnd < sourceStart')
  assert(target_start >= 0 && target_start < target.length,
      'targetStart out of bounds')
  assert(start >= 0 && start < source.length, 'sourceStart out of bounds')
  assert(end >= 0 && end <= source.length, 'sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length)
    end = this.length
  if (target.length - target_start < end - start)
    end = target.length - target_start + start

  var len = end - start

  if (len < 100 || !Buffer._useTypedArrays) {
    for (var i = 0; i < len; i++)
      target[i + target_start] = this[i + start]
  } else {
    target._set(this.subarray(start, start + len), target_start)
  }
}

function _base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function _utf8Slice (buf, start, end) {
  var res = ''
  var tmp = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; i++) {
    if (buf[i] <= 0x7F) {
      res += decodeUtf8Char(tmp) + String.fromCharCode(buf[i])
      tmp = ''
    } else {
      tmp += '%' + buf[i].toString(16)
    }
  }

  return res + decodeUtf8Char(tmp)
}

function _asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; i++)
    ret += String.fromCharCode(buf[i])
  return ret
}

function _binarySlice (buf, start, end) {
  return _asciiSlice(buf, start, end)
}

function _hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; i++) {
    out += toHex(buf[i])
  }
  return out
}

function _utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i+1] * 256)
  }
  return res
}

Buffer.prototype.slice = function (start, end) {
  var len = this.length
  start = clamp(start, len, 0)
  end = clamp(end, len, len)

  if (Buffer._useTypedArrays) {
    return Buffer._augment(this.subarray(start, end))
  } else {
    var sliceLen = end - start
    var newBuf = new Buffer(sliceLen, undefined, true)
    for (var i = 0; i < sliceLen; i++) {
      newBuf[i] = this[i + start]
    }
    return newBuf
  }
}

// `get` will be removed in Node 0.13+
Buffer.prototype.get = function (offset) {
  console.log('.get() is deprecated. Access using array indexes instead.')
  return this.readUInt8(offset)
}

// `set` will be removed in Node 0.13+
Buffer.prototype.set = function (v, offset) {
  console.log('.set() is deprecated. Access using array indexes instead.')
  return this.writeUInt8(v, offset)
}

Buffer.prototype.readUInt8 = function (offset, noAssert) {
  if (!noAssert) {
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset < this.length, 'Trying to read beyond buffer length')
  }

  if (offset >= this.length)
    return

  return this[offset]
}

function _readUInt16 (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 1 < buf.length, 'Trying to read beyond buffer length')
  }

  var len = buf.length
  if (offset >= len)
    return

  var val
  if (littleEndian) {
    val = buf[offset]
    if (offset + 1 < len)
      val |= buf[offset + 1] << 8
  } else {
    val = buf[offset] << 8
    if (offset + 1 < len)
      val |= buf[offset + 1]
  }
  return val
}

Buffer.prototype.readUInt16LE = function (offset, noAssert) {
  return _readUInt16(this, offset, true, noAssert)
}

Buffer.prototype.readUInt16BE = function (offset, noAssert) {
  return _readUInt16(this, offset, false, noAssert)
}

function _readUInt32 (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'Trying to read beyond buffer length')
  }

  var len = buf.length
  if (offset >= len)
    return

  var val
  if (littleEndian) {
    if (offset + 2 < len)
      val = buf[offset + 2] << 16
    if (offset + 1 < len)
      val |= buf[offset + 1] << 8
    val |= buf[offset]
    if (offset + 3 < len)
      val = val + (buf[offset + 3] << 24 >>> 0)
  } else {
    if (offset + 1 < len)
      val = buf[offset + 1] << 16
    if (offset + 2 < len)
      val |= buf[offset + 2] << 8
    if (offset + 3 < len)
      val |= buf[offset + 3]
    val = val + (buf[offset] << 24 >>> 0)
  }
  return val
}

Buffer.prototype.readUInt32LE = function (offset, noAssert) {
  return _readUInt32(this, offset, true, noAssert)
}

Buffer.prototype.readUInt32BE = function (offset, noAssert) {
  return _readUInt32(this, offset, false, noAssert)
}

Buffer.prototype.readInt8 = function (offset, noAssert) {
  if (!noAssert) {
    assert(offset !== undefined && offset !== null,
        'missing offset')
    assert(offset < this.length, 'Trying to read beyond buffer length')
  }

  if (offset >= this.length)
    return

  var neg = this[offset] & 0x80
  if (neg)
    return (0xff - this[offset] + 1) * -1
  else
    return this[offset]
}

function _readInt16 (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 1 < buf.length, 'Trying to read beyond buffer length')
  }

  var len = buf.length
  if (offset >= len)
    return

  var val = _readUInt16(buf, offset, littleEndian, true)
  var neg = val & 0x8000
  if (neg)
    return (0xffff - val + 1) * -1
  else
    return val
}

Buffer.prototype.readInt16LE = function (offset, noAssert) {
  return _readInt16(this, offset, true, noAssert)
}

Buffer.prototype.readInt16BE = function (offset, noAssert) {
  return _readInt16(this, offset, false, noAssert)
}

function _readInt32 (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'Trying to read beyond buffer length')
  }

  var len = buf.length
  if (offset >= len)
    return

  var val = _readUInt32(buf, offset, littleEndian, true)
  var neg = val & 0x80000000
  if (neg)
    return (0xffffffff - val + 1) * -1
  else
    return val
}

Buffer.prototype.readInt32LE = function (offset, noAssert) {
  return _readInt32(this, offset, true, noAssert)
}

Buffer.prototype.readInt32BE = function (offset, noAssert) {
  return _readInt32(this, offset, false, noAssert)
}

function _readFloat (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset + 3 < buf.length, 'Trying to read beyond buffer length')
  }

  return ieee754.read(buf, offset, littleEndian, 23, 4)
}

Buffer.prototype.readFloatLE = function (offset, noAssert) {
  return _readFloat(this, offset, true, noAssert)
}

Buffer.prototype.readFloatBE = function (offset, noAssert) {
  return _readFloat(this, offset, false, noAssert)
}

function _readDouble (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset + 7 < buf.length, 'Trying to read beyond buffer length')
  }

  return ieee754.read(buf, offset, littleEndian, 52, 8)
}

Buffer.prototype.readDoubleLE = function (offset, noAssert) {
  return _readDouble(this, offset, true, noAssert)
}

Buffer.prototype.readDoubleBE = function (offset, noAssert) {
  return _readDouble(this, offset, false, noAssert)
}

Buffer.prototype.writeUInt8 = function (value, offset, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset < this.length, 'trying to write beyond buffer length')
    verifuint(value, 0xff)
  }

  if (offset >= this.length) return

  this[offset] = value
}

function _writeUInt16 (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 1 < buf.length, 'trying to write beyond buffer length')
    verifuint(value, 0xffff)
  }

  var len = buf.length
  if (offset >= len)
    return

  for (var i = 0, j = Math.min(len - offset, 2); i < j; i++) {
    buf[offset + i] =
        (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
            (littleEndian ? i : 1 - i) * 8
  }
}

Buffer.prototype.writeUInt16LE = function (value, offset, noAssert) {
  _writeUInt16(this, value, offset, true, noAssert)
}

Buffer.prototype.writeUInt16BE = function (value, offset, noAssert) {
  _writeUInt16(this, value, offset, false, noAssert)
}

function _writeUInt32 (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'trying to write beyond buffer length')
    verifuint(value, 0xffffffff)
  }

  var len = buf.length
  if (offset >= len)
    return

  for (var i = 0, j = Math.min(len - offset, 4); i < j; i++) {
    buf[offset + i] =
        (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
  }
}

Buffer.prototype.writeUInt32LE = function (value, offset, noAssert) {
  _writeUInt32(this, value, offset, true, noAssert)
}

Buffer.prototype.writeUInt32BE = function (value, offset, noAssert) {
  _writeUInt32(this, value, offset, false, noAssert)
}

Buffer.prototype.writeInt8 = function (value, offset, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset < this.length, 'Trying to write beyond buffer length')
    verifsint(value, 0x7f, -0x80)
  }

  if (offset >= this.length)
    return

  if (value >= 0)
    this.writeUInt8(value, offset, noAssert)
  else
    this.writeUInt8(0xff + value + 1, offset, noAssert)
}

function _writeInt16 (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 1 < buf.length, 'Trying to write beyond buffer length')
    verifsint(value, 0x7fff, -0x8000)
  }

  var len = buf.length
  if (offset >= len)
    return

  if (value >= 0)
    _writeUInt16(buf, value, offset, littleEndian, noAssert)
  else
    _writeUInt16(buf, 0xffff + value + 1, offset, littleEndian, noAssert)
}

Buffer.prototype.writeInt16LE = function (value, offset, noAssert) {
  _writeInt16(this, value, offset, true, noAssert)
}

Buffer.prototype.writeInt16BE = function (value, offset, noAssert) {
  _writeInt16(this, value, offset, false, noAssert)
}

function _writeInt32 (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'Trying to write beyond buffer length')
    verifsint(value, 0x7fffffff, -0x80000000)
  }

  var len = buf.length
  if (offset >= len)
    return

  if (value >= 0)
    _writeUInt32(buf, value, offset, littleEndian, noAssert)
  else
    _writeUInt32(buf, 0xffffffff + value + 1, offset, littleEndian, noAssert)
}

Buffer.prototype.writeInt32LE = function (value, offset, noAssert) {
  _writeInt32(this, value, offset, true, noAssert)
}

Buffer.prototype.writeInt32BE = function (value, offset, noAssert) {
  _writeInt32(this, value, offset, false, noAssert)
}

function _writeFloat (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'Trying to write beyond buffer length')
    verifIEEE754(value, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }

  var len = buf.length
  if (offset >= len)
    return

  ieee754.write(buf, value, offset, littleEndian, 23, 4)
}

Buffer.prototype.writeFloatLE = function (value, offset, noAssert) {
  _writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function (value, offset, noAssert) {
  _writeFloat(this, value, offset, false, noAssert)
}

function _writeDouble (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 7 < buf.length,
        'Trying to write beyond buffer length')
    verifIEEE754(value, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }

  var len = buf.length
  if (offset >= len)
    return

  ieee754.write(buf, value, offset, littleEndian, 52, 8)
}

Buffer.prototype.writeDoubleLE = function (value, offset, noAssert) {
  _writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function (value, offset, noAssert) {
  _writeDouble(this, value, offset, false, noAssert)
}

// fill(value, start=0, end=buffer.length)
Buffer.prototype.fill = function (value, start, end) {
  if (!value) value = 0
  if (!start) start = 0
  if (!end) end = this.length

  if (typeof value === 'string') {
    value = value.charCodeAt(0)
  }

  assert(typeof value === 'number' && !isNaN(value), 'value is not a number')
  assert(end >= start, 'end < start')

  // Fill 0 bytes; we're done
  if (end === start) return
  if (this.length === 0) return

  assert(start >= 0 && start < this.length, 'start out of bounds')
  assert(end >= 0 && end <= this.length, 'end out of bounds')

  for (var i = start; i < end; i++) {
    this[i] = value
  }
}

Buffer.prototype.inspect = function () {
  var out = []
  var len = this.length
  for (var i = 0; i < len; i++) {
    out[i] = toHex(this[i])
    if (i === exports.INSPECT_MAX_BYTES) {
      out[i + 1] = '...'
      break
    }
  }
  return '<Buffer ' + out.join(' ') + '>'
}

/**
 * Creates a new `ArrayBuffer` with the *copied* memory of the buffer instance.
 * Added in Node 0.12. Only available in browsers that support ArrayBuffer.
 */
Buffer.prototype.toArrayBuffer = function () {
  if (typeof Uint8Array !== 'undefined') {
    if (Buffer._useTypedArrays) {
      return (new Buffer(this)).buffer
    } else {
      var buf = new Uint8Array(this.length)
      for (var i = 0, len = buf.length; i < len; i += 1)
        buf[i] = this[i]
      return buf.buffer
    }
  } else {
    throw new Error('Buffer.toArrayBuffer not supported in this browser')
  }
}

// HELPER FUNCTIONS
// ================

function stringtrim (str) {
  if (str.trim) return str.trim()
  return str.replace(/^\s+|\s+$/g, '')
}

var BP = Buffer.prototype

/**
 * Augment a Uint8Array *instance* (not the Uint8Array class!) with Buffer methods
 */
Buffer._augment = function (arr) {
  arr._isBuffer = true

  // save reference to original Uint8Array get/set methods before overwriting
  arr._get = arr.get
  arr._set = arr.set

  // deprecated, will be removed in node 0.13+
  arr.get = BP.get
  arr.set = BP.set

  arr.write = BP.write
  arr.toString = BP.toString
  arr.toLocaleString = BP.toString
  arr.toJSON = BP.toJSON
  arr.copy = BP.copy
  arr.slice = BP.slice
  arr.readUInt8 = BP.readUInt8
  arr.readUInt16LE = BP.readUInt16LE
  arr.readUInt16BE = BP.readUInt16BE
  arr.readUInt32LE = BP.readUInt32LE
  arr.readUInt32BE = BP.readUInt32BE
  arr.readInt8 = BP.readInt8
  arr.readInt16LE = BP.readInt16LE
  arr.readInt16BE = BP.readInt16BE
  arr.readInt32LE = BP.readInt32LE
  arr.readInt32BE = BP.readInt32BE
  arr.readFloatLE = BP.readFloatLE
  arr.readFloatBE = BP.readFloatBE
  arr.readDoubleLE = BP.readDoubleLE
  arr.readDoubleBE = BP.readDoubleBE
  arr.writeUInt8 = BP.writeUInt8
  arr.writeUInt16LE = BP.writeUInt16LE
  arr.writeUInt16BE = BP.writeUInt16BE
  arr.writeUInt32LE = BP.writeUInt32LE
  arr.writeUInt32BE = BP.writeUInt32BE
  arr.writeInt8 = BP.writeInt8
  arr.writeInt16LE = BP.writeInt16LE
  arr.writeInt16BE = BP.writeInt16BE
  arr.writeInt32LE = BP.writeInt32LE
  arr.writeInt32BE = BP.writeInt32BE
  arr.writeFloatLE = BP.writeFloatLE
  arr.writeFloatBE = BP.writeFloatBE
  arr.writeDoubleLE = BP.writeDoubleLE
  arr.writeDoubleBE = BP.writeDoubleBE
  arr.fill = BP.fill
  arr.inspect = BP.inspect
  arr.toArrayBuffer = BP.toArrayBuffer

  return arr
}

// slice(start, end)
function clamp (index, len, defaultValue) {
  if (typeof index !== 'number') return defaultValue
  index = ~~index;  // Coerce to integer.
  if (index >= len) return len
  if (index >= 0) return index
  index += len
  if (index >= 0) return index
  return 0
}

function coerce (length) {
  // Coerce length to a number (possibly NaN), round up
  // in case it's fractional (e.g. 123.456) then do a
  // double negate to coerce a NaN to 0. Easy, right?
  length = ~~Math.ceil(+length)
  return length < 0 ? 0 : length
}

function isArray (subject) {
  return (Array.isArray || function (subject) {
    return Object.prototype.toString.call(subject) === '[object Array]'
  })(subject)
}

function isArrayish (subject) {
  return isArray(subject) || Buffer.isBuffer(subject) ||
      subject && typeof subject === 'object' &&
      typeof subject.length === 'number'
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; i++) {
    var b = str.charCodeAt(i)
    if (b <= 0x7F)
      byteArray.push(str.charCodeAt(i))
    else {
      var start = i
      if (b >= 0xD800 && b <= 0xDFFF) i++
      var h = encodeURIComponent(str.slice(start, i+1)).substr(1).split('%')
      for (var j = 0; j < h.length; j++)
        byteArray.push(parseInt(h[j], 16))
    }
  }
  return byteArray
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; i++) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; i++) {
    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(str)
}

function blitBuffer (src, dst, offset, length) {
  var pos
  for (var i = 0; i < length; i++) {
    if ((i + offset >= dst.length) || (i >= src.length))
      break
    dst[i + offset] = src[i]
  }
  return i
}

function decodeUtf8Char (str) {
  try {
    return decodeURIComponent(str)
  } catch (err) {
    return String.fromCharCode(0xFFFD) // UTF 8 invalid char
  }
}

/*
 * We have to make sure that the value is a valid integer. This means that it
 * is non-negative. It has no fractional component and that it does not
 * exceed the maximum allowed value.
 */
function verifuint (value, max) {
  assert(typeof value === 'number', 'cannot write a non-number as a number')
  assert(value >= 0, 'specified a negative value for writing an unsigned value')
  assert(value <= max, 'value is larger than maximum value for type')
  assert(Math.floor(value) === value, 'value has a fractional component')
}

function verifsint (value, max, min) {
  assert(typeof value === 'number', 'cannot write a non-number as a number')
  assert(value <= max, 'value larger than maximum allowed value')
  assert(value >= min, 'value smaller than minimum allowed value')
  assert(Math.floor(value) === value, 'value has a fractional component')
}

function verifIEEE754 (value, max, min) {
  assert(typeof value === 'number', 'cannot write a non-number as a number')
  assert(value <= max, 'value larger than maximum allowed value')
  assert(value >= min, 'value smaller than minimum allowed value')
}

function assert (test, message) {
  if (!test) throw new Error(message || 'Failed assertion')
}

}).call(this,require("+7ZJp0"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../../../node_modules/gulp-browserify/node_modules/browserify/node_modules/buffer/index.js","/../../../node_modules/gulp-browserify/node_modules/browserify/node_modules/buffer")
},{"+7ZJp0":60,"base64-js":56,"buffer":55,"ieee754":57}],56:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
var lookup = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

;(function (exports) {
	'use strict';

  var Arr = (typeof Uint8Array !== 'undefined')
    ? Uint8Array
    : Array

	var PLUS   = '+'.charCodeAt(0)
	var SLASH  = '/'.charCodeAt(0)
	var NUMBER = '0'.charCodeAt(0)
	var LOWER  = 'a'.charCodeAt(0)
	var UPPER  = 'A'.charCodeAt(0)
	var PLUS_URL_SAFE = '-'.charCodeAt(0)
	var SLASH_URL_SAFE = '_'.charCodeAt(0)

	function decode (elt) {
		var code = elt.charCodeAt(0)
		if (code === PLUS ||
		    code === PLUS_URL_SAFE)
			return 62 // '+'
		if (code === SLASH ||
		    code === SLASH_URL_SAFE)
			return 63 // '/'
		if (code < NUMBER)
			return -1 //no match
		if (code < NUMBER + 10)
			return code - NUMBER + 26 + 26
		if (code < UPPER + 26)
			return code - UPPER
		if (code < LOWER + 26)
			return code - LOWER + 26
	}

	function b64ToByteArray (b64) {
		var i, j, l, tmp, placeHolders, arr

		if (b64.length % 4 > 0) {
			throw new Error('Invalid string. Length must be a multiple of 4')
		}

		// the number of equal signs (place holders)
		// if there are two placeholders, than the two characters before it
		// represent one byte
		// if there is only one, then the three characters before it represent 2 bytes
		// this is just a cheap hack to not do indexOf twice
		var len = b64.length
		placeHolders = '=' === b64.charAt(len - 2) ? 2 : '=' === b64.charAt(len - 1) ? 1 : 0

		// base64 is 4/3 + up to two characters of the original data
		arr = new Arr(b64.length * 3 / 4 - placeHolders)

		// if there are placeholders, only get up to the last complete 4 chars
		l = placeHolders > 0 ? b64.length - 4 : b64.length

		var L = 0

		function push (v) {
			arr[L++] = v
		}

		for (i = 0, j = 0; i < l; i += 4, j += 3) {
			tmp = (decode(b64.charAt(i)) << 18) | (decode(b64.charAt(i + 1)) << 12) | (decode(b64.charAt(i + 2)) << 6) | decode(b64.charAt(i + 3))
			push((tmp & 0xFF0000) >> 16)
			push((tmp & 0xFF00) >> 8)
			push(tmp & 0xFF)
		}

		if (placeHolders === 2) {
			tmp = (decode(b64.charAt(i)) << 2) | (decode(b64.charAt(i + 1)) >> 4)
			push(tmp & 0xFF)
		} else if (placeHolders === 1) {
			tmp = (decode(b64.charAt(i)) << 10) | (decode(b64.charAt(i + 1)) << 4) | (decode(b64.charAt(i + 2)) >> 2)
			push((tmp >> 8) & 0xFF)
			push(tmp & 0xFF)
		}

		return arr
	}

	function uint8ToBase64 (uint8) {
		var i,
			extraBytes = uint8.length % 3, // if we have 1 byte left, pad 2 bytes
			output = "",
			temp, length

		function encode (num) {
			return lookup.charAt(num)
		}

		function tripletToBase64 (num) {
			return encode(num >> 18 & 0x3F) + encode(num >> 12 & 0x3F) + encode(num >> 6 & 0x3F) + encode(num & 0x3F)
		}

		// go through the array every three bytes, we'll deal with trailing stuff later
		for (i = 0, length = uint8.length - extraBytes; i < length; i += 3) {
			temp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2])
			output += tripletToBase64(temp)
		}

		// pad the end with zeros, but make sure to not forget the extra bytes
		switch (extraBytes) {
			case 1:
				temp = uint8[uint8.length - 1]
				output += encode(temp >> 2)
				output += encode((temp << 4) & 0x3F)
				output += '=='
				break
			case 2:
				temp = (uint8[uint8.length - 2] << 8) + (uint8[uint8.length - 1])
				output += encode(temp >> 10)
				output += encode((temp >> 4) & 0x3F)
				output += encode((temp << 2) & 0x3F)
				output += '='
				break
		}

		return output
	}

	exports.toByteArray = b64ToByteArray
	exports.fromByteArray = uint8ToBase64
}(typeof exports === 'undefined' ? (this.base64js = {}) : exports))

}).call(this,require("+7ZJp0"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../../../node_modules/gulp-browserify/node_modules/browserify/node_modules/buffer/node_modules/base64-js/lib/b64.js","/../../../node_modules/gulp-browserify/node_modules/browserify/node_modules/buffer/node_modules/base64-js/lib")
},{"+7ZJp0":60,"buffer":55}],57:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = nBytes * 8 - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = nBytes * 8 - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = (value * c - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}

}).call(this,require("+7ZJp0"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../../../node_modules/gulp-browserify/node_modules/browserify/node_modules/buffer/node_modules/ieee754/index.js","/../../../node_modules/gulp-browserify/node_modules/browserify/node_modules/buffer/node_modules/ieee754")
},{"+7ZJp0":60,"buffer":55}],58:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

function EventEmitter() {
  this._events = this._events || {};
  this._maxListeners = this._maxListeners || undefined;
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
EventEmitter.defaultMaxListeners = 10;

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function(n) {
  if (!isNumber(n) || n < 0 || isNaN(n))
    throw TypeError('n must be a positive number');
  this._maxListeners = n;
  return this;
};

EventEmitter.prototype.emit = function(type) {
  var er, handler, len, args, i, listeners;

  if (!this._events)
    this._events = {};

  // If there is no 'error' event listener then throw.
  if (type === 'error') {
    if (!this._events.error ||
        (isObject(this._events.error) && !this._events.error.length)) {
      er = arguments[1];
      if (er instanceof Error) {
        throw er; // Unhandled 'error' event
      }
      throw TypeError('Uncaught, unspecified "error" event.');
    }
  }

  handler = this._events[type];

  if (isUndefined(handler))
    return false;

  if (isFunction(handler)) {
    switch (arguments.length) {
      // fast cases
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;
      // slower
      default:
        len = arguments.length;
        args = new Array(len - 1);
        for (i = 1; i < len; i++)
          args[i - 1] = arguments[i];
        handler.apply(this, args);
    }
  } else if (isObject(handler)) {
    len = arguments.length;
    args = new Array(len - 1);
    for (i = 1; i < len; i++)
      args[i - 1] = arguments[i];

    listeners = handler.slice();
    len = listeners.length;
    for (i = 0; i < len; i++)
      listeners[i].apply(this, args);
  }

  return true;
};

EventEmitter.prototype.addListener = function(type, listener) {
  var m;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events)
    this._events = {};

  // To avoid recursion in the case that type === "newListener"! Before
  // adding it to the listeners, first emit "newListener".
  if (this._events.newListener)
    this.emit('newListener', type,
              isFunction(listener.listener) ?
              listener.listener : listener);

  if (!this._events[type])
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;
  else if (isObject(this._events[type]))
    // If we've already got an array, just append.
    this._events[type].push(listener);
  else
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];

  // Check for listener leak
  if (isObject(this._events[type]) && !this._events[type].warned) {
    var m;
    if (!isUndefined(this._maxListeners)) {
      m = this._maxListeners;
    } else {
      m = EventEmitter.defaultMaxListeners;
    }

    if (m && m > 0 && this._events[type].length > m) {
      this._events[type].warned = true;
      console.error('(node) warning: possible EventEmitter memory ' +
                    'leak detected. %d listeners added. ' +
                    'Use emitter.setMaxListeners() to increase limit.',
                    this._events[type].length);
      if (typeof console.trace === 'function') {
        // not supported in IE 10
        console.trace();
      }
    }
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function(type, listener) {
  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  var fired = false;

  function g() {
    this.removeListener(type, g);

    if (!fired) {
      fired = true;
      listener.apply(this, arguments);
    }
  }

  g.listener = listener;
  this.on(type, g);

  return this;
};

// emits a 'removeListener' event iff the listener was removed
EventEmitter.prototype.removeListener = function(type, listener) {
  var list, position, length, i;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events || !this._events[type])
    return this;

  list = this._events[type];
  length = list.length;
  position = -1;

  if (list === listener ||
      (isFunction(list.listener) && list.listener === listener)) {
    delete this._events[type];
    if (this._events.removeListener)
      this.emit('removeListener', type, listener);

  } else if (isObject(list)) {
    for (i = length; i-- > 0;) {
      if (list[i] === listener ||
          (list[i].listener && list[i].listener === listener)) {
        position = i;
        break;
      }
    }

    if (position < 0)
      return this;

    if (list.length === 1) {
      list.length = 0;
      delete this._events[type];
    } else {
      list.splice(position, 1);
    }

    if (this._events.removeListener)
      this.emit('removeListener', type, listener);
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function(type) {
  var key, listeners;

  if (!this._events)
    return this;

  // not listening for removeListener, no need to emit
  if (!this._events.removeListener) {
    if (arguments.length === 0)
      this._events = {};
    else if (this._events[type])
      delete this._events[type];
    return this;
  }

  // emit removeListener for all listeners on all events
  if (arguments.length === 0) {
    for (key in this._events) {
      if (key === 'removeListener') continue;
      this.removeAllListeners(key);
    }
    this.removeAllListeners('removeListener');
    this._events = {};
    return this;
  }

  listeners = this._events[type];

  if (isFunction(listeners)) {
    this.removeListener(type, listeners);
  } else {
    // LIFO order
    while (listeners.length)
      this.removeListener(type, listeners[listeners.length - 1]);
  }
  delete this._events[type];

  return this;
};

EventEmitter.prototype.listeners = function(type) {
  var ret;
  if (!this._events || !this._events[type])
    ret = [];
  else if (isFunction(this._events[type]))
    ret = [this._events[type]];
  else
    ret = this._events[type].slice();
  return ret;
};

EventEmitter.listenerCount = function(emitter, type) {
  var ret;
  if (!emitter._events || !emitter._events[type])
    ret = 0;
  else if (isFunction(emitter._events[type]))
    ret = 1;
  else
    ret = emitter._events[type].length;
  return ret;
};

function isFunction(arg) {
  return typeof arg === 'function';
}

function isNumber(arg) {
  return typeof arg === 'number';
}

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}

function isUndefined(arg) {
  return arg === void 0;
}

}).call(this,require("+7ZJp0"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../../../node_modules/gulp-browserify/node_modules/browserify/node_modules/events/events.js","/../../../node_modules/gulp-browserify/node_modules/browserify/node_modules/events")
},{"+7ZJp0":60,"buffer":55}],59:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    var TempCtor = function () {}
    TempCtor.prototype = superCtor.prototype
    ctor.prototype = new TempCtor()
    ctor.prototype.constructor = ctor
  }
}

}).call(this,require("+7ZJp0"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../../../node_modules/gulp-browserify/node_modules/browserify/node_modules/inherits/inherits_browser.js","/../../../node_modules/gulp-browserify/node_modules/browserify/node_modules/inherits")
},{"+7ZJp0":60,"buffer":55}],60:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
// shim for using process in browser

var process = module.exports = {};

process.nextTick = (function () {
    var canSetImmediate = typeof window !== 'undefined'
    && window.setImmediate;
    var canPost = typeof window !== 'undefined'
    && window.postMessage && window.addEventListener
    ;

    if (canSetImmediate) {
        return function (f) { return window.setImmediate(f) };
    }

    if (canPost) {
        var queue = [];
        window.addEventListener('message', function (ev) {
            var source = ev.source;
            if ((source === window || source === null) && ev.data === 'process-tick') {
                ev.stopPropagation();
                if (queue.length > 0) {
                    var fn = queue.shift();
                    fn();
                }
            }
        }, true);

        return function nextTick(fn) {
            queue.push(fn);
            window.postMessage('process-tick', '*');
        };
    }

    return function nextTick(fn) {
        setTimeout(fn, 0);
    };
})();

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
}

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};

}).call(this,require("+7ZJp0"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../../../node_modules/gulp-browserify/node_modules/browserify/node_modules/process/browser.js","/../../../node_modules/gulp-browserify/node_modules/browserify/node_modules/process")
},{"+7ZJp0":60,"buffer":55}],61:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
/*! http://mths.be/punycode v1.2.4 by @mathias */
;(function(root) {

	/** Detect free variables */
	var freeExports = typeof exports == 'object' && exports;
	var freeModule = typeof module == 'object' && module &&
		module.exports == freeExports && module;
	var freeGlobal = typeof global == 'object' && global;
	if (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal) {
		root = freeGlobal;
	}

	/**
	 * The `punycode` object.
	 * @name punycode
	 * @type Object
	 */
	var punycode,

	/** Highest positive signed 32-bit float value */
	maxInt = 2147483647, // aka. 0x7FFFFFFF or 2^31-1

	/** Bootstring parameters */
	base = 36,
	tMin = 1,
	tMax = 26,
	skew = 38,
	damp = 700,
	initialBias = 72,
	initialN = 128, // 0x80
	delimiter = '-', // '\x2D'

	/** Regular expressions */
	regexPunycode = /^xn--/,
	regexNonASCII = /[^ -~]/, // unprintable ASCII chars + non-ASCII chars
	regexSeparators = /\x2E|\u3002|\uFF0E|\uFF61/g, // RFC 3490 separators

	/** Error messages */
	errors = {
		'overflow': 'Overflow: input needs wider integers to process',
		'not-basic': 'Illegal input >= 0x80 (not a basic code point)',
		'invalid-input': 'Invalid input'
	},

	/** Convenience shortcuts */
	baseMinusTMin = base - tMin,
	floor = Math.floor,
	stringFromCharCode = String.fromCharCode,

	/** Temporary variable */
	key;

	/*--------------------------------------------------------------------------*/

	/**
	 * A generic error utility function.
	 * @private
	 * @param {String} type The error type.
	 * @returns {Error} Throws a `RangeError` with the applicable error message.
	 */
	function error(type) {
		throw RangeError(errors[type]);
	}

	/**
	 * A generic `Array#map` utility function.
	 * @private
	 * @param {Array} array The array to iterate over.
	 * @param {Function} callback The function that gets called for every array
	 * item.
	 * @returns {Array} A new array of values returned by the callback function.
	 */
	function map(array, fn) {
		var length = array.length;
		while (length--) {
			array[length] = fn(array[length]);
		}
		return array;
	}

	/**
	 * A simple `Array#map`-like wrapper to work with domain name strings.
	 * @private
	 * @param {String} domain The domain name.
	 * @param {Function} callback The function that gets called for every
	 * character.
	 * @returns {Array} A new string of characters returned by the callback
	 * function.
	 */
	function mapDomain(string, fn) {
		return map(string.split(regexSeparators), fn).join('.');
	}

	/**
	 * Creates an array containing the numeric code points of each Unicode
	 * character in the string. While JavaScript uses UCS-2 internally,
	 * this function will convert a pair of surrogate halves (each of which
	 * UCS-2 exposes as separate characters) into a single code point,
	 * matching UTF-16.
	 * @see `punycode.ucs2.encode`
	 * @see <http://mathiasbynens.be/notes/javascript-encoding>
	 * @memberOf punycode.ucs2
	 * @name decode
	 * @param {String} string The Unicode input string (UCS-2).
	 * @returns {Array} The new array of code points.
	 */
	function ucs2decode(string) {
		var output = [],
		    counter = 0,
		    length = string.length,
		    value,
		    extra;
		while (counter < length) {
			value = string.charCodeAt(counter++);
			if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
				// high surrogate, and there is a next character
				extra = string.charCodeAt(counter++);
				if ((extra & 0xFC00) == 0xDC00) { // low surrogate
					output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
				} else {
					// unmatched surrogate; only append this code unit, in case the next
					// code unit is the high surrogate of a surrogate pair
					output.push(value);
					counter--;
				}
			} else {
				output.push(value);
			}
		}
		return output;
	}

	/**
	 * Creates a string based on an array of numeric code points.
	 * @see `punycode.ucs2.decode`
	 * @memberOf punycode.ucs2
	 * @name encode
	 * @param {Array} codePoints The array of numeric code points.
	 * @returns {String} The new Unicode string (UCS-2).
	 */
	function ucs2encode(array) {
		return map(array, function(value) {
			var output = '';
			if (value > 0xFFFF) {
				value -= 0x10000;
				output += stringFromCharCode(value >>> 10 & 0x3FF | 0xD800);
				value = 0xDC00 | value & 0x3FF;
			}
			output += stringFromCharCode(value);
			return output;
		}).join('');
	}

	/**
	 * Converts a basic code point into a digit/integer.
	 * @see `digitToBasic()`
	 * @private
	 * @param {Number} codePoint The basic numeric code point value.
	 * @returns {Number} The numeric value of a basic code point (for use in
	 * representing integers) in the range `0` to `base - 1`, or `base` if
	 * the code point does not represent a value.
	 */
	function basicToDigit(codePoint) {
		if (codePoint - 48 < 10) {
			return codePoint - 22;
		}
		if (codePoint - 65 < 26) {
			return codePoint - 65;
		}
		if (codePoint - 97 < 26) {
			return codePoint - 97;
		}
		return base;
	}

	/**
	 * Converts a digit/integer into a basic code point.
	 * @see `basicToDigit()`
	 * @private
	 * @param {Number} digit The numeric value of a basic code point.
	 * @returns {Number} The basic code point whose value (when used for
	 * representing integers) is `digit`, which needs to be in the range
	 * `0` to `base - 1`. If `flag` is non-zero, the uppercase form is
	 * used; else, the lowercase form is used. The behavior is undefined
	 * if `flag` is non-zero and `digit` has no uppercase form.
	 */
	function digitToBasic(digit, flag) {
		//  0..25 map to ASCII a..z or A..Z
		// 26..35 map to ASCII 0..9
		return digit + 22 + 75 * (digit < 26) - ((flag != 0) << 5);
	}

	/**
	 * Bias adaptation function as per section 3.4 of RFC 3492.
	 * http://tools.ietf.org/html/rfc3492#section-3.4
	 * @private
	 */
	function adapt(delta, numPoints, firstTime) {
		var k = 0;
		delta = firstTime ? floor(delta / damp) : delta >> 1;
		delta += floor(delta / numPoints);
		for (/* no initialization */; delta > baseMinusTMin * tMax >> 1; k += base) {
			delta = floor(delta / baseMinusTMin);
		}
		return floor(k + (baseMinusTMin + 1) * delta / (delta + skew));
	}

	/**
	 * Converts a Punycode string of ASCII-only symbols to a string of Unicode
	 * symbols.
	 * @memberOf punycode
	 * @param {String} input The Punycode string of ASCII-only symbols.
	 * @returns {String} The resulting string of Unicode symbols.
	 */
	function decode(input) {
		// Don't use UCS-2
		var output = [],
		    inputLength = input.length,
		    out,
		    i = 0,
		    n = initialN,
		    bias = initialBias,
		    basic,
		    j,
		    index,
		    oldi,
		    w,
		    k,
		    digit,
		    t,
		    /** Cached calculation results */
		    baseMinusT;

		// Handle the basic code points: let `basic` be the number of input code
		// points before the last delimiter, or `0` if there is none, then copy
		// the first basic code points to the output.

		basic = input.lastIndexOf(delimiter);
		if (basic < 0) {
			basic = 0;
		}

		for (j = 0; j < basic; ++j) {
			// if it's not a basic code point
			if (input.charCodeAt(j) >= 0x80) {
				error('not-basic');
			}
			output.push(input.charCodeAt(j));
		}

		// Main decoding loop: start just after the last delimiter if any basic code
		// points were copied; start at the beginning otherwise.

		for (index = basic > 0 ? basic + 1 : 0; index < inputLength; /* no final expression */) {

			// `index` is the index of the next character to be consumed.
			// Decode a generalized variable-length integer into `delta`,
			// which gets added to `i`. The overflow checking is easier
			// if we increase `i` as we go, then subtract off its starting
			// value at the end to obtain `delta`.
			for (oldi = i, w = 1, k = base; /* no condition */; k += base) {

				if (index >= inputLength) {
					error('invalid-input');
				}

				digit = basicToDigit(input.charCodeAt(index++));

				if (digit >= base || digit > floor((maxInt - i) / w)) {
					error('overflow');
				}

				i += digit * w;
				t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);

				if (digit < t) {
					break;
				}

				baseMinusT = base - t;
				if (w > floor(maxInt / baseMinusT)) {
					error('overflow');
				}

				w *= baseMinusT;

			}

			out = output.length + 1;
			bias = adapt(i - oldi, out, oldi == 0);

			// `i` was supposed to wrap around from `out` to `0`,
			// incrementing `n` each time, so we'll fix that now:
			if (floor(i / out) > maxInt - n) {
				error('overflow');
			}

			n += floor(i / out);
			i %= out;

			// Insert `n` at position `i` of the output
			output.splice(i++, 0, n);

		}

		return ucs2encode(output);
	}

	/**
	 * Converts a string of Unicode symbols to a Punycode string of ASCII-only
	 * symbols.
	 * @memberOf punycode
	 * @param {String} input The string of Unicode symbols.
	 * @returns {String} The resulting Punycode string of ASCII-only symbols.
	 */
	function encode(input) {
		var n,
		    delta,
		    handledCPCount,
		    basicLength,
		    bias,
		    j,
		    m,
		    q,
		    k,
		    t,
		    currentValue,
		    output = [],
		    /** `inputLength` will hold the number of code points in `input`. */
		    inputLength,
		    /** Cached calculation results */
		    handledCPCountPlusOne,
		    baseMinusT,
		    qMinusT;

		// Convert the input in UCS-2 to Unicode
		input = ucs2decode(input);

		// Cache the length
		inputLength = input.length;

		// Initialize the state
		n = initialN;
		delta = 0;
		bias = initialBias;

		// Handle the basic code points
		for (j = 0; j < inputLength; ++j) {
			currentValue = input[j];
			if (currentValue < 0x80) {
				output.push(stringFromCharCode(currentValue));
			}
		}

		handledCPCount = basicLength = output.length;

		// `handledCPCount` is the number of code points that have been handled;
		// `basicLength` is the number of basic code points.

		// Finish the basic string - if it is not empty - with a delimiter
		if (basicLength) {
			output.push(delimiter);
		}

		// Main encoding loop:
		while (handledCPCount < inputLength) {

			// All non-basic code points < n have been handled already. Find the next
			// larger one:
			for (m = maxInt, j = 0; j < inputLength; ++j) {
				currentValue = input[j];
				if (currentValue >= n && currentValue < m) {
					m = currentValue;
				}
			}

			// Increase `delta` enough to advance the decoder's <n,i> state to <m,0>,
			// but guard against overflow
			handledCPCountPlusOne = handledCPCount + 1;
			if (m - n > floor((maxInt - delta) / handledCPCountPlusOne)) {
				error('overflow');
			}

			delta += (m - n) * handledCPCountPlusOne;
			n = m;

			for (j = 0; j < inputLength; ++j) {
				currentValue = input[j];

				if (currentValue < n && ++delta > maxInt) {
					error('overflow');
				}

				if (currentValue == n) {
					// Represent delta as a generalized variable-length integer
					for (q = delta, k = base; /* no condition */; k += base) {
						t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);
						if (q < t) {
							break;
						}
						qMinusT = q - t;
						baseMinusT = base - t;
						output.push(
							stringFromCharCode(digitToBasic(t + qMinusT % baseMinusT, 0))
						);
						q = floor(qMinusT / baseMinusT);
					}

					output.push(stringFromCharCode(digitToBasic(q, 0)));
					bias = adapt(delta, handledCPCountPlusOne, handledCPCount == basicLength);
					delta = 0;
					++handledCPCount;
				}
			}

			++delta;
			++n;

		}
		return output.join('');
	}

	/**
	 * Converts a Punycode string representing a domain name to Unicode. Only the
	 * Punycoded parts of the domain name will be converted, i.e. it doesn't
	 * matter if you call it on a string that has already been converted to
	 * Unicode.
	 * @memberOf punycode
	 * @param {String} domain The Punycode domain name to convert to Unicode.
	 * @returns {String} The Unicode representation of the given Punycode
	 * string.
	 */
	function toUnicode(domain) {
		return mapDomain(domain, function(string) {
			return regexPunycode.test(string)
				? decode(string.slice(4).toLowerCase())
				: string;
		});
	}

	/**
	 * Converts a Unicode string representing a domain name to Punycode. Only the
	 * non-ASCII parts of the domain name will be converted, i.e. it doesn't
	 * matter if you call it with a domain that's already in ASCII.
	 * @memberOf punycode
	 * @param {String} domain The domain name to convert, as a Unicode string.
	 * @returns {String} The Punycode representation of the given domain name.
	 */
	function toASCII(domain) {
		return mapDomain(domain, function(string) {
			return regexNonASCII.test(string)
				? 'xn--' + encode(string)
				: string;
		});
	}

	/*--------------------------------------------------------------------------*/

	/** Define the public API */
	punycode = {
		/**
		 * A string representing the current Punycode.js version number.
		 * @memberOf punycode
		 * @type String
		 */
		'version': '1.2.4',
		/**
		 * An object of methods to convert from JavaScript's internal character
		 * representation (UCS-2) to Unicode code points, and back.
		 * @see <http://mathiasbynens.be/notes/javascript-encoding>
		 * @memberOf punycode
		 * @type Object
		 */
		'ucs2': {
			'decode': ucs2decode,
			'encode': ucs2encode
		},
		'decode': decode,
		'encode': encode,
		'toASCII': toASCII,
		'toUnicode': toUnicode
	};

	/** Expose `punycode` */
	// Some AMD build optimizers, like r.js, check for specific condition patterns
	// like the following:
	if (
		typeof define == 'function' &&
		typeof define.amd == 'object' &&
		define.amd
	) {
		define('punycode', function() {
			return punycode;
		});
	} else if (freeExports && !freeExports.nodeType) {
		if (freeModule) { // in Node.js or RingoJS v0.8.0+
			freeModule.exports = punycode;
		} else { // in Narwhal or RingoJS v0.7.0-
			for (key in punycode) {
				punycode.hasOwnProperty(key) && (freeExports[key] = punycode[key]);
			}
		}
	} else { // in Rhino or a web browser
		root.punycode = punycode;
	}

}(this));

}).call(this,require("+7ZJp0"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../../../node_modules/gulp-browserify/node_modules/browserify/node_modules/punycode/punycode.js","/../../../node_modules/gulp-browserify/node_modules/browserify/node_modules/punycode")
},{"+7ZJp0":60,"buffer":55}],62:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

// If obj.hasOwnProperty has been overridden, then calling
// obj.hasOwnProperty(prop) will break.
// See: https://github.com/joyent/node/issues/1707
function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

module.exports = function(qs, sep, eq, options) {
  sep = sep || '&';
  eq = eq || '=';
  var obj = {};

  if (typeof qs !== 'string' || qs.length === 0) {
    return obj;
  }

  var regexp = /\+/g;
  qs = qs.split(sep);

  var maxKeys = 1000;
  if (options && typeof options.maxKeys === 'number') {
    maxKeys = options.maxKeys;
  }

  var len = qs.length;
  // maxKeys <= 0 means that we should not limit keys count
  if (maxKeys > 0 && len > maxKeys) {
    len = maxKeys;
  }

  for (var i = 0; i < len; ++i) {
    var x = qs[i].replace(regexp, '%20'),
        idx = x.indexOf(eq),
        kstr, vstr, k, v;

    if (idx >= 0) {
      kstr = x.substr(0, idx);
      vstr = x.substr(idx + 1);
    } else {
      kstr = x;
      vstr = '';
    }

    k = decodeURIComponent(kstr);
    v = decodeURIComponent(vstr);

    if (!hasOwnProperty(obj, k)) {
      obj[k] = v;
    } else if (isArray(obj[k])) {
      obj[k].push(v);
    } else {
      obj[k] = [obj[k], v];
    }
  }

  return obj;
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};

}).call(this,require("+7ZJp0"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../../../node_modules/gulp-browserify/node_modules/browserify/node_modules/querystring-es3/decode.js","/../../../node_modules/gulp-browserify/node_modules/browserify/node_modules/querystring-es3")
},{"+7ZJp0":60,"buffer":55}],63:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

var stringifyPrimitive = function(v) {
  switch (typeof v) {
    case 'string':
      return v;

    case 'boolean':
      return v ? 'true' : 'false';

    case 'number':
      return isFinite(v) ? v : '';

    default:
      return '';
  }
};

module.exports = function(obj, sep, eq, name) {
  sep = sep || '&';
  eq = eq || '=';
  if (obj === null) {
    obj = undefined;
  }

  if (typeof obj === 'object') {
    return map(objectKeys(obj), function(k) {
      var ks = encodeURIComponent(stringifyPrimitive(k)) + eq;
      if (isArray(obj[k])) {
        return obj[k].map(function(v) {
          return ks + encodeURIComponent(stringifyPrimitive(v));
        }).join(sep);
      } else {
        return ks + encodeURIComponent(stringifyPrimitive(obj[k]));
      }
    }).join(sep);

  }

  if (!name) return '';
  return encodeURIComponent(stringifyPrimitive(name)) + eq +
         encodeURIComponent(stringifyPrimitive(obj));
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};

function map (xs, f) {
  if (xs.map) return xs.map(f);
  var res = [];
  for (var i = 0; i < xs.length; i++) {
    res.push(f(xs[i], i));
  }
  return res;
}

var objectKeys = Object.keys || function (obj) {
  var res = [];
  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) res.push(key);
  }
  return res;
};

}).call(this,require("+7ZJp0"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../../../node_modules/gulp-browserify/node_modules/browserify/node_modules/querystring-es3/encode.js","/../../../node_modules/gulp-browserify/node_modules/browserify/node_modules/querystring-es3")
},{"+7ZJp0":60,"buffer":55}],64:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
'use strict';

exports.decode = exports.parse = require('./decode');
exports.encode = exports.stringify = require('./encode');

}).call(this,require("+7ZJp0"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../../../node_modules/gulp-browserify/node_modules/browserify/node_modules/querystring-es3/index.js","/../../../node_modules/gulp-browserify/node_modules/browserify/node_modules/querystring-es3")
},{"+7ZJp0":60,"./decode":62,"./encode":63,"buffer":55}],65:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// a duplex stream is just a stream that is both readable and writable.
// Since JS doesn't have multiple prototypal inheritance, this class
// prototypally inherits from Readable, and then parasitically from
// Writable.

module.exports = Duplex;
var inherits = require('inherits');
var setImmediate = require('process/browser.js').nextTick;
var Readable = require('./readable.js');
var Writable = require('./writable.js');

inherits(Duplex, Readable);

Duplex.prototype.write = Writable.prototype.write;
Duplex.prototype.end = Writable.prototype.end;
Duplex.prototype._write = Writable.prototype._write;

function Duplex(options) {
  if (!(this instanceof Duplex))
    return new Duplex(options);

  Readable.call(this, options);
  Writable.call(this, options);

  if (options && options.readable === false)
    this.readable = false;

  if (options && options.writable === false)
    this.writable = false;

  this.allowHalfOpen = true;
  if (options && options.allowHalfOpen === false)
    this.allowHalfOpen = false;

  this.once('end', onend);
}

// the no-half-open enforcer
function onend() {
  // if we allow half-open state, or if the writable side ended,
  // then we're ok.
  if (this.allowHalfOpen || this._writableState.ended)
    return;

  // no more data can be written.
  // But allow more writes to happen in this tick.
  var self = this;
  setImmediate(function () {
    self.end();
  });
}

}).call(this,require("+7ZJp0"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../../../node_modules/gulp-browserify/node_modules/browserify/node_modules/stream-browserify/duplex.js","/../../../node_modules/gulp-browserify/node_modules/browserify/node_modules/stream-browserify")
},{"+7ZJp0":60,"./readable.js":69,"./writable.js":71,"buffer":55,"inherits":59,"process/browser.js":67}],66:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

module.exports = Stream;

var EE = require('events').EventEmitter;
var inherits = require('inherits');

inherits(Stream, EE);
Stream.Readable = require('./readable.js');
Stream.Writable = require('./writable.js');
Stream.Duplex = require('./duplex.js');
Stream.Transform = require('./transform.js');
Stream.PassThrough = require('./passthrough.js');

// Backwards-compat with node 0.4.x
Stream.Stream = Stream;



// old-style streams.  Note that the pipe method (the only relevant
// part of this class) is overridden in the Readable class.

function Stream() {
  EE.call(this);
}

Stream.prototype.pipe = function(dest, options) {
  var source = this;

  function ondata(chunk) {
    if (dest.writable) {
      if (false === dest.write(chunk) && source.pause) {
        source.pause();
      }
    }
  }

  source.on('data', ondata);

  function ondrain() {
    if (source.readable && source.resume) {
      source.resume();
    }
  }

  dest.on('drain', ondrain);

  // If the 'end' option is not supplied, dest.end() will be called when
  // source gets the 'end' or 'close' events.  Only dest.end() once.
  if (!dest._isStdio && (!options || options.end !== false)) {
    source.on('end', onend);
    source.on('close', onclose);
  }

  var didOnEnd = false;
  function onend() {
    if (didOnEnd) return;
    didOnEnd = true;

    dest.end();
  }


  function onclose() {
    if (didOnEnd) return;
    didOnEnd = true;

    if (typeof dest.destroy === 'function') dest.destroy();
  }

  // don't leave dangling pipes when there are errors.
  function onerror(er) {
    cleanup();
    if (EE.listenerCount(this, 'error') === 0) {
      throw er; // Unhandled stream error in pipe.
    }
  }

  source.on('error', onerror);
  dest.on('error', onerror);

  // remove all the event listeners that were added.
  function cleanup() {
    source.removeListener('data', ondata);
    dest.removeListener('drain', ondrain);

    source.removeListener('end', onend);
    source.removeListener('close', onclose);

    source.removeListener('error', onerror);
    dest.removeListener('error', onerror);

    source.removeListener('end', cleanup);
    source.removeListener('close', cleanup);

    dest.removeListener('close', cleanup);
  }

  source.on('end', cleanup);
  source.on('close', cleanup);

  dest.on('close', cleanup);

  dest.emit('pipe', source);

  // Allow for unix-like usage: A.pipe(B).pipe(C)
  return dest;
};

}).call(this,require("+7ZJp0"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../../../node_modules/gulp-browserify/node_modules/browserify/node_modules/stream-browserify/index.js","/../../../node_modules/gulp-browserify/node_modules/browserify/node_modules/stream-browserify")
},{"+7ZJp0":60,"./duplex.js":65,"./passthrough.js":68,"./readable.js":69,"./transform.js":70,"./writable.js":71,"buffer":55,"events":58,"inherits":59}],67:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
// shim for using process in browser

var process = module.exports = {};

process.nextTick = (function () {
    var canSetImmediate = typeof window !== 'undefined'
    && window.setImmediate;
    var canPost = typeof window !== 'undefined'
    && window.postMessage && window.addEventListener
    ;

    if (canSetImmediate) {
        return function (f) { return window.setImmediate(f) };
    }

    if (canPost) {
        var queue = [];
        window.addEventListener('message', function (ev) {
            var source = ev.source;
            if ((source === window || source === null) && ev.data === 'process-tick') {
                ev.stopPropagation();
                if (queue.length > 0) {
                    var fn = queue.shift();
                    fn();
                }
            }
        }, true);

        return function nextTick(fn) {
            queue.push(fn);
            window.postMessage('process-tick', '*');
        };
    }

    return function nextTick(fn) {
        setTimeout(fn, 0);
    };
})();

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];

process.binding = function (name) {
    throw new Error('process.binding is not supported');
}

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};

}).call(this,require("+7ZJp0"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../../../node_modules/gulp-browserify/node_modules/browserify/node_modules/stream-browserify/node_modules/process/browser.js","/../../../node_modules/gulp-browserify/node_modules/browserify/node_modules/stream-browserify/node_modules/process")
},{"+7ZJp0":60,"buffer":55}],68:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// a passthrough stream.
// basically just the most minimal sort of Transform stream.
// Every written chunk gets output as-is.

module.exports = PassThrough;

var Transform = require('./transform.js');
var inherits = require('inherits');
inherits(PassThrough, Transform);

function PassThrough(options) {
  if (!(this instanceof PassThrough))
    return new PassThrough(options);

  Transform.call(this, options);
}

PassThrough.prototype._transform = function(chunk, encoding, cb) {
  cb(null, chunk);
};

}).call(this,require("+7ZJp0"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../../../node_modules/gulp-browserify/node_modules/browserify/node_modules/stream-browserify/passthrough.js","/../../../node_modules/gulp-browserify/node_modules/browserify/node_modules/stream-browserify")
},{"+7ZJp0":60,"./transform.js":70,"buffer":55,"inherits":59}],69:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

module.exports = Readable;
Readable.ReadableState = ReadableState;

var EE = require('events').EventEmitter;
var Stream = require('./index.js');
var Buffer = require('buffer').Buffer;
var setImmediate = require('process/browser.js').nextTick;
var StringDecoder;

var inherits = require('inherits');
inherits(Readable, Stream);

function ReadableState(options, stream) {
  options = options || {};

  // the point at which it stops calling _read() to fill the buffer
  // Note: 0 is a valid value, means "don't call _read preemptively ever"
  var hwm = options.highWaterMark;
  this.highWaterMark = (hwm || hwm === 0) ? hwm : 16 * 1024;

  // cast to ints.
  this.highWaterMark = ~~this.highWaterMark;

  this.buffer = [];
  this.length = 0;
  this.pipes = null;
  this.pipesCount = 0;
  this.flowing = false;
  this.ended = false;
  this.endEmitted = false;
  this.reading = false;

  // In streams that never have any data, and do push(null) right away,
  // the consumer can miss the 'end' event if they do some I/O before
  // consuming the stream.  So, we don't emit('end') until some reading
  // happens.
  this.calledRead = false;

  // a flag to be able to tell if the onwrite cb is called immediately,
  // or on a later tick.  We set this to true at first, becuase any
  // actions that shouldn't happen until "later" should generally also
  // not happen before the first write call.
  this.sync = true;

  // whenever we return null, then we set a flag to say
  // that we're awaiting a 'readable' event emission.
  this.needReadable = false;
  this.emittedReadable = false;
  this.readableListening = false;


  // object stream flag. Used to make read(n) ignore n and to
  // make all the buffer merging and length checks go away
  this.objectMode = !!options.objectMode;

  // Crypto is kind of old and crusty.  Historically, its default string
  // encoding is 'binary' so we have to make this configurable.
  // Everything else in the universe uses 'utf8', though.
  this.defaultEncoding = options.defaultEncoding || 'utf8';

  // when piping, we only care about 'readable' events that happen
  // after read()ing all the bytes and not getting any pushback.
  this.ranOut = false;

  // the number of writers that are awaiting a drain event in .pipe()s
  this.awaitDrain = 0;

  // if true, a maybeReadMore has been scheduled
  this.readingMore = false;

  this.decoder = null;
  this.encoding = null;
  if (options.encoding) {
    if (!StringDecoder)
      StringDecoder = require('string_decoder').StringDecoder;
    this.decoder = new StringDecoder(options.encoding);
    this.encoding = options.encoding;
  }
}

function Readable(options) {
  if (!(this instanceof Readable))
    return new Readable(options);

  this._readableState = new ReadableState(options, this);

  // legacy
  this.readable = true;

  Stream.call(this);
}

// Manually shove something into the read() buffer.
// This returns true if the highWaterMark has not been hit yet,
// similar to how Writable.write() returns true if you should
// write() some more.
Readable.prototype.push = function(chunk, encoding) {
  var state = this._readableState;

  if (typeof chunk === 'string' && !state.objectMode) {
    encoding = encoding || state.defaultEncoding;
    if (encoding !== state.encoding) {
      chunk = new Buffer(chunk, encoding);
      encoding = '';
    }
  }

  return readableAddChunk(this, state, chunk, encoding, false);
};

// Unshift should *always* be something directly out of read()
Readable.prototype.unshift = function(chunk) {
  var state = this._readableState;
  return readableAddChunk(this, state, chunk, '', true);
};

function readableAddChunk(stream, state, chunk, encoding, addToFront) {
  var er = chunkInvalid(state, chunk);
  if (er) {
    stream.emit('error', er);
  } else if (chunk === null || chunk === undefined) {
    state.reading = false;
    if (!state.ended)
      onEofChunk(stream, state);
  } else if (state.objectMode || chunk && chunk.length > 0) {
    if (state.ended && !addToFront) {
      var e = new Error('stream.push() after EOF');
      stream.emit('error', e);
    } else if (state.endEmitted && addToFront) {
      var e = new Error('stream.unshift() after end event');
      stream.emit('error', e);
    } else {
      if (state.decoder && !addToFront && !encoding)
        chunk = state.decoder.write(chunk);

      // update the buffer info.
      state.length += state.objectMode ? 1 : chunk.length;
      if (addToFront) {
        state.buffer.unshift(chunk);
      } else {
        state.reading = false;
        state.buffer.push(chunk);
      }

      if (state.needReadable)
        emitReadable(stream);

      maybeReadMore(stream, state);
    }
  } else if (!addToFront) {
    state.reading = false;
  }

  return needMoreData(state);
}



// if it's past the high water mark, we can push in some more.
// Also, if we have no data yet, we can stand some
// more bytes.  This is to work around cases where hwm=0,
// such as the repl.  Also, if the push() triggered a
// readable event, and the user called read(largeNumber) such that
// needReadable was set, then we ought to push more, so that another
// 'readable' event will be triggered.
function needMoreData(state) {
  return !state.ended &&
         (state.needReadable ||
          state.length < state.highWaterMark ||
          state.length === 0);
}

// backwards compatibility.
Readable.prototype.setEncoding = function(enc) {
  if (!StringDecoder)
    StringDecoder = require('string_decoder').StringDecoder;
  this._readableState.decoder = new StringDecoder(enc);
  this._readableState.encoding = enc;
};

// Don't raise the hwm > 128MB
var MAX_HWM = 0x800000;
function roundUpToNextPowerOf2(n) {
  if (n >= MAX_HWM) {
    n = MAX_HWM;
  } else {
    // Get the next highest power of 2
    n--;
    for (var p = 1; p < 32; p <<= 1) n |= n >> p;
    n++;
  }
  return n;
}

function howMuchToRead(n, state) {
  if (state.length === 0 && state.ended)
    return 0;

  if (state.objectMode)
    return n === 0 ? 0 : 1;

  if (isNaN(n) || n === null) {
    // only flow one buffer at a time
    if (state.flowing && state.buffer.length)
      return state.buffer[0].length;
    else
      return state.length;
  }

  if (n <= 0)
    return 0;

  // If we're asking for more than the target buffer level,
  // then raise the water mark.  Bump up to the next highest
  // power of 2, to prevent increasing it excessively in tiny
  // amounts.
  if (n > state.highWaterMark)
    state.highWaterMark = roundUpToNextPowerOf2(n);

  // don't have that much.  return null, unless we've ended.
  if (n > state.length) {
    if (!state.ended) {
      state.needReadable = true;
      return 0;
    } else
      return state.length;
  }

  return n;
}

// you can override either this method, or the async _read(n) below.
Readable.prototype.read = function(n) {
  var state = this._readableState;
  state.calledRead = true;
  var nOrig = n;

  if (typeof n !== 'number' || n > 0)
    state.emittedReadable = false;

  // if we're doing read(0) to trigger a readable event, but we
  // already have a bunch of data in the buffer, then just trigger
  // the 'readable' event and move on.
  if (n === 0 &&
      state.needReadable &&
      (state.length >= state.highWaterMark || state.ended)) {
    emitReadable(this);
    return null;
  }

  n = howMuchToRead(n, state);

  // if we've ended, and we're now clear, then finish it up.
  if (n === 0 && state.ended) {
    if (state.length === 0)
      endReadable(this);
    return null;
  }

  // All the actual chunk generation logic needs to be
  // *below* the call to _read.  The reason is that in certain
  // synthetic stream cases, such as passthrough streams, _read
  // may be a completely synchronous operation which may change
  // the state of the read buffer, providing enough data when
  // before there was *not* enough.
  //
  // So, the steps are:
  // 1. Figure out what the state of things will be after we do
  // a read from the buffer.
  //
  // 2. If that resulting state will trigger a _read, then call _read.
  // Note that this may be asynchronous, or synchronous.  Yes, it is
  // deeply ugly to write APIs this way, but that still doesn't mean
  // that the Readable class should behave improperly, as streams are
  // designed to be sync/async agnostic.
  // Take note if the _read call is sync or async (ie, if the read call
  // has returned yet), so that we know whether or not it's safe to emit
  // 'readable' etc.
  //
  // 3. Actually pull the requested chunks out of the buffer and return.

  // if we need a readable event, then we need to do some reading.
  var doRead = state.needReadable;

  // if we currently have less than the highWaterMark, then also read some
  if (state.length - n <= state.highWaterMark)
    doRead = true;

  // however, if we've ended, then there's no point, and if we're already
  // reading, then it's unnecessary.
  if (state.ended || state.reading)
    doRead = false;

  if (doRead) {
    state.reading = true;
    state.sync = true;
    // if the length is currently zero, then we *need* a readable event.
    if (state.length === 0)
      state.needReadable = true;
    // call internal read method
    this._read(state.highWaterMark);
    state.sync = false;
  }

  // If _read called its callback synchronously, then `reading`
  // will be false, and we need to re-evaluate how much data we
  // can return to the user.
  if (doRead && !state.reading)
    n = howMuchToRead(nOrig, state);

  var ret;
  if (n > 0)
    ret = fromList(n, state);
  else
    ret = null;

  if (ret === null) {
    state.needReadable = true;
    n = 0;
  }

  state.length -= n;

  // If we have nothing in the buffer, then we want to know
  // as soon as we *do* get something into the buffer.
  if (state.length === 0 && !state.ended)
    state.needReadable = true;

  // If we happened to read() exactly the remaining amount in the
  // buffer, and the EOF has been seen at this point, then make sure
  // that we emit 'end' on the very next tick.
  if (state.ended && !state.endEmitted && state.length === 0)
    endReadable(this);

  return ret;
};

function chunkInvalid(state, chunk) {
  var er = null;
  if (!Buffer.isBuffer(chunk) &&
      'string' !== typeof chunk &&
      chunk !== null &&
      chunk !== undefined &&
      !state.objectMode &&
      !er) {
    er = new TypeError('Invalid non-string/buffer chunk');
  }
  return er;
}


function onEofChunk(stream, state) {
  if (state.decoder && !state.ended) {
    var chunk = state.decoder.end();
    if (chunk && chunk.length) {
      state.buffer.push(chunk);
      state.length += state.objectMode ? 1 : chunk.length;
    }
  }
  state.ended = true;

  // if we've ended and we have some data left, then emit
  // 'readable' now to make sure it gets picked up.
  if (state.length > 0)
    emitReadable(stream);
  else
    endReadable(stream);
}

// Don't emit readable right away in sync mode, because this can trigger
// another read() call => stack overflow.  This way, it might trigger
// a nextTick recursion warning, but that's not so bad.
function emitReadable(stream) {
  var state = stream._readableState;
  state.needReadable = false;
  if (state.emittedReadable)
    return;

  state.emittedReadable = true;
  if (state.sync)
    setImmediate(function() {
      emitReadable_(stream);
    });
  else
    emitReadable_(stream);
}

function emitReadable_(stream) {
  stream.emit('readable');
}


// at this point, the user has presumably seen the 'readable' event,
// and called read() to consume some data.  that may have triggered
// in turn another _read(n) call, in which case reading = true if
// it's in progress.
// However, if we're not ended, or reading, and the length < hwm,
// then go ahead and try to read some more preemptively.
function maybeReadMore(stream, state) {
  if (!state.readingMore) {
    state.readingMore = true;
    setImmediate(function() {
      maybeReadMore_(stream, state);
    });
  }
}

function maybeReadMore_(stream, state) {
  var len = state.length;
  while (!state.reading && !state.flowing && !state.ended &&
         state.length < state.highWaterMark) {
    stream.read(0);
    if (len === state.length)
      // didn't get any data, stop spinning.
      break;
    else
      len = state.length;
  }
  state.readingMore = false;
}

// abstract method.  to be overridden in specific implementation classes.
// call cb(er, data) where data is <= n in length.
// for virtual (non-string, non-buffer) streams, "length" is somewhat
// arbitrary, and perhaps not very meaningful.
Readable.prototype._read = function(n) {
  this.emit('error', new Error('not implemented'));
};

Readable.prototype.pipe = function(dest, pipeOpts) {
  var src = this;
  var state = this._readableState;

  switch (state.pipesCount) {
    case 0:
      state.pipes = dest;
      break;
    case 1:
      state.pipes = [state.pipes, dest];
      break;
    default:
      state.pipes.push(dest);
      break;
  }
  state.pipesCount += 1;

  var doEnd = (!pipeOpts || pipeOpts.end !== false) &&
              dest !== process.stdout &&
              dest !== process.stderr;

  var endFn = doEnd ? onend : cleanup;
  if (state.endEmitted)
    setImmediate(endFn);
  else
    src.once('end', endFn);

  dest.on('unpipe', onunpipe);
  function onunpipe(readable) {
    if (readable !== src) return;
    cleanup();
  }

  function onend() {
    dest.end();
  }

  // when the dest drains, it reduces the awaitDrain counter
  // on the source.  This would be more elegant with a .once()
  // handler in flow(), but adding and removing repeatedly is
  // too slow.
  var ondrain = pipeOnDrain(src);
  dest.on('drain', ondrain);

  function cleanup() {
    // cleanup event handlers once the pipe is broken
    dest.removeListener('close', onclose);
    dest.removeListener('finish', onfinish);
    dest.removeListener('drain', ondrain);
    dest.removeListener('error', onerror);
    dest.removeListener('unpipe', onunpipe);
    src.removeListener('end', onend);
    src.removeListener('end', cleanup);

    // if the reader is waiting for a drain event from this
    // specific writer, then it would cause it to never start
    // flowing again.
    // So, if this is awaiting a drain, then we just call it now.
    // If we don't know, then assume that we are waiting for one.
    if (!dest._writableState || dest._writableState.needDrain)
      ondrain();
  }

  // if the dest has an error, then stop piping into it.
  // however, don't suppress the throwing behavior for this.
  // check for listeners before emit removes one-time listeners.
  var errListeners = EE.listenerCount(dest, 'error');
  function onerror(er) {
    unpipe();
    if (errListeners === 0 && EE.listenerCount(dest, 'error') === 0)
      dest.emit('error', er);
  }
  dest.once('error', onerror);

  // Both close and finish should trigger unpipe, but only once.
  function onclose() {
    dest.removeListener('finish', onfinish);
    unpipe();
  }
  dest.once('close', onclose);
  function onfinish() {
    dest.removeListener('close', onclose);
    unpipe();
  }
  dest.once('finish', onfinish);

  function unpipe() {
    src.unpipe(dest);
  }

  // tell the dest that it's being piped to
  dest.emit('pipe', src);

  // start the flow if it hasn't been started already.
  if (!state.flowing) {
    // the handler that waits for readable events after all
    // the data gets sucked out in flow.
    // This would be easier to follow with a .once() handler
    // in flow(), but that is too slow.
    this.on('readable', pipeOnReadable);

    state.flowing = true;
    setImmediate(function() {
      flow(src);
    });
  }

  return dest;
};

function pipeOnDrain(src) {
  return function() {
    var dest = this;
    var state = src._readableState;
    state.awaitDrain--;
    if (state.awaitDrain === 0)
      flow(src);
  };
}

function flow(src) {
  var state = src._readableState;
  var chunk;
  state.awaitDrain = 0;

  function write(dest, i, list) {
    var written = dest.write(chunk);
    if (false === written) {
      state.awaitDrain++;
    }
  }

  while (state.pipesCount && null !== (chunk = src.read())) {

    if (state.pipesCount === 1)
      write(state.pipes, 0, null);
    else
      forEach(state.pipes, write);

    src.emit('data', chunk);

    // if anyone needs a drain, then we have to wait for that.
    if (state.awaitDrain > 0)
      return;
  }

  // if every destination was unpiped, either before entering this
  // function, or in the while loop, then stop flowing.
  //
  // NB: This is a pretty rare edge case.
  if (state.pipesCount === 0) {
    state.flowing = false;

    // if there were data event listeners added, then switch to old mode.
    if (EE.listenerCount(src, 'data') > 0)
      emitDataEvents(src);
    return;
  }

  // at this point, no one needed a drain, so we just ran out of data
  // on the next readable event, start it over again.
  state.ranOut = true;
}

function pipeOnReadable() {
  if (this._readableState.ranOut) {
    this._readableState.ranOut = false;
    flow(this);
  }
}


Readable.prototype.unpipe = function(dest) {
  var state = this._readableState;

  // if we're not piping anywhere, then do nothing.
  if (state.pipesCount === 0)
    return this;

  // just one destination.  most common case.
  if (state.pipesCount === 1) {
    // passed in one, but it's not the right one.
    if (dest && dest !== state.pipes)
      return this;

    if (!dest)
      dest = state.pipes;

    // got a match.
    state.pipes = null;
    state.pipesCount = 0;
    this.removeListener('readable', pipeOnReadable);
    state.flowing = false;
    if (dest)
      dest.emit('unpipe', this);
    return this;
  }

  // slow case. multiple pipe destinations.

  if (!dest) {
    // remove all.
    var dests = state.pipes;
    var len = state.pipesCount;
    state.pipes = null;
    state.pipesCount = 0;
    this.removeListener('readable', pipeOnReadable);
    state.flowing = false;

    for (var i = 0; i < len; i++)
      dests[i].emit('unpipe', this);
    return this;
  }

  // try to find the right one.
  var i = indexOf(state.pipes, dest);
  if (i === -1)
    return this;

  state.pipes.splice(i, 1);
  state.pipesCount -= 1;
  if (state.pipesCount === 1)
    state.pipes = state.pipes[0];

  dest.emit('unpipe', this);

  return this;
};

// set up data events if they are asked for
// Ensure readable listeners eventually get something
Readable.prototype.on = function(ev, fn) {
  var res = Stream.prototype.on.call(this, ev, fn);

  if (ev === 'data' && !this._readableState.flowing)
    emitDataEvents(this);

  if (ev === 'readable' && this.readable) {
    var state = this._readableState;
    if (!state.readableListening) {
      state.readableListening = true;
      state.emittedReadable = false;
      state.needReadable = true;
      if (!state.reading) {
        this.read(0);
      } else if (state.length) {
        emitReadable(this, state);
      }
    }
  }

  return res;
};
Readable.prototype.addListener = Readable.prototype.on;

// pause() and resume() are remnants of the legacy readable stream API
// If the user uses them, then switch into old mode.
Readable.prototype.resume = function() {
  emitDataEvents(this);
  this.read(0);
  this.emit('resume');
};

Readable.prototype.pause = function() {
  emitDataEvents(this, true);
  this.emit('pause');
};

function emitDataEvents(stream, startPaused) {
  var state = stream._readableState;

  if (state.flowing) {
    // https://github.com/isaacs/readable-stream/issues/16
    throw new Error('Cannot switch to old mode now.');
  }

  var paused = startPaused || false;
  var readable = false;

  // convert to an old-style stream.
  stream.readable = true;
  stream.pipe = Stream.prototype.pipe;
  stream.on = stream.addListener = Stream.prototype.on;

  stream.on('readable', function() {
    readable = true;

    var c;
    while (!paused && (null !== (c = stream.read())))
      stream.emit('data', c);

    if (c === null) {
      readable = false;
      stream._readableState.needReadable = true;
    }
  });

  stream.pause = function() {
    paused = true;
    this.emit('pause');
  };

  stream.resume = function() {
    paused = false;
    if (readable)
      setImmediate(function() {
        stream.emit('readable');
      });
    else
      this.read(0);
    this.emit('resume');
  };

  // now make it start, just in case it hadn't already.
  stream.emit('readable');
}

// wrap an old-style stream as the async data source.
// This is *not* part of the readable stream interface.
// It is an ugly unfortunate mess of history.
Readable.prototype.wrap = function(stream) {
  var state = this._readableState;
  var paused = false;

  var self = this;
  stream.on('end', function() {
    if (state.decoder && !state.ended) {
      var chunk = state.decoder.end();
      if (chunk && chunk.length)
        self.push(chunk);
    }

    self.push(null);
  });

  stream.on('data', function(chunk) {
    if (state.decoder)
      chunk = state.decoder.write(chunk);
    if (!chunk || !state.objectMode && !chunk.length)
      return;

    var ret = self.push(chunk);
    if (!ret) {
      paused = true;
      stream.pause();
    }
  });

  // proxy all the other methods.
  // important when wrapping filters and duplexes.
  for (var i in stream) {
    if (typeof stream[i] === 'function' &&
        typeof this[i] === 'undefined') {
      this[i] = function(method) { return function() {
        return stream[method].apply(stream, arguments);
      }}(i);
    }
  }

  // proxy certain important events.
  var events = ['error', 'close', 'destroy', 'pause', 'resume'];
  forEach(events, function(ev) {
    stream.on(ev, function (x) {
      return self.emit.apply(self, ev, x);
    });
  });

  // when we try to consume some more bytes, simply unpause the
  // underlying stream.
  self._read = function(n) {
    if (paused) {
      paused = false;
      stream.resume();
    }
  };

  return self;
};



// exposed for testing purposes only.
Readable._fromList = fromList;

// Pluck off n bytes from an array of buffers.
// Length is the combined lengths of all the buffers in the list.
function fromList(n, state) {
  var list = state.buffer;
  var length = state.length;
  var stringMode = !!state.decoder;
  var objectMode = !!state.objectMode;
  var ret;

  // nothing in the list, definitely empty.
  if (list.length === 0)
    return null;

  if (length === 0)
    ret = null;
  else if (objectMode)
    ret = list.shift();
  else if (!n || n >= length) {
    // read it all, truncate the array.
    if (stringMode)
      ret = list.join('');
    else
      ret = Buffer.concat(list, length);
    list.length = 0;
  } else {
    // read just some of it.
    if (n < list[0].length) {
      // just take a part of the first list item.
      // slice is the same for buffers and strings.
      var buf = list[0];
      ret = buf.slice(0, n);
      list[0] = buf.slice(n);
    } else if (n === list[0].length) {
      // first list is a perfect match
      ret = list.shift();
    } else {
      // complex case.
      // we have enough to cover it, but it spans past the first buffer.
      if (stringMode)
        ret = '';
      else
        ret = new Buffer(n);

      var c = 0;
      for (var i = 0, l = list.length; i < l && c < n; i++) {
        var buf = list[0];
        var cpy = Math.min(n - c, buf.length);

        if (stringMode)
          ret += buf.slice(0, cpy);
        else
          buf.copy(ret, c, 0, cpy);

        if (cpy < buf.length)
          list[0] = buf.slice(cpy);
        else
          list.shift();

        c += cpy;
      }
    }
  }

  return ret;
}

function endReadable(stream) {
  var state = stream._readableState;

  // If we get here before consuming all the bytes, then that is a
  // bug in node.  Should never happen.
  if (state.length > 0)
    throw new Error('endReadable called on non-empty stream');

  if (!state.endEmitted && state.calledRead) {
    state.ended = true;
    setImmediate(function() {
      // Check that we didn't get one last unshift.
      if (!state.endEmitted && state.length === 0) {
        state.endEmitted = true;
        stream.readable = false;
        stream.emit('end');
      }
    });
  }
}

function forEach (xs, f) {
  for (var i = 0, l = xs.length; i < l; i++) {
    f(xs[i], i);
  }
}

function indexOf (xs, x) {
  for (var i = 0, l = xs.length; i < l; i++) {
    if (xs[i] === x) return i;
  }
  return -1;
}

}).call(this,require("+7ZJp0"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../../../node_modules/gulp-browserify/node_modules/browserify/node_modules/stream-browserify/readable.js","/../../../node_modules/gulp-browserify/node_modules/browserify/node_modules/stream-browserify")
},{"+7ZJp0":60,"./index.js":66,"buffer":55,"events":58,"inherits":59,"process/browser.js":67,"string_decoder":72}],70:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// a transform stream is a readable/writable stream where you do
// something with the data.  Sometimes it's called a "filter",
// but that's not a great name for it, since that implies a thing where
// some bits pass through, and others are simply ignored.  (That would
// be a valid example of a transform, of course.)
//
// While the output is causally related to the input, it's not a
// necessarily symmetric or synchronous transformation.  For example,
// a zlib stream might take multiple plain-text writes(), and then
// emit a single compressed chunk some time in the future.
//
// Here's how this works:
//
// The Transform stream has all the aspects of the readable and writable
// stream classes.  When you write(chunk), that calls _write(chunk,cb)
// internally, and returns false if there's a lot of pending writes
// buffered up.  When you call read(), that calls _read(n) until
// there's enough pending readable data buffered up.
//
// In a transform stream, the written data is placed in a buffer.  When
// _read(n) is called, it transforms the queued up data, calling the
// buffered _write cb's as it consumes chunks.  If consuming a single
// written chunk would result in multiple output chunks, then the first
// outputted bit calls the readcb, and subsequent chunks just go into
// the read buffer, and will cause it to emit 'readable' if necessary.
//
// This way, back-pressure is actually determined by the reading side,
// since _read has to be called to start processing a new chunk.  However,
// a pathological inflate type of transform can cause excessive buffering
// here.  For example, imagine a stream where every byte of input is
// interpreted as an integer from 0-255, and then results in that many
// bytes of output.  Writing the 4 bytes {ff,ff,ff,ff} would result in
// 1kb of data being output.  In this case, you could write a very small
// amount of input, and end up with a very large amount of output.  In
// such a pathological inflating mechanism, there'd be no way to tell
// the system to stop doing the transform.  A single 4MB write could
// cause the system to run out of memory.
//
// However, even in such a pathological case, only a single written chunk
// would be consumed, and then the rest would wait (un-transformed) until
// the results of the previous transformed chunk were consumed.

module.exports = Transform;

var Duplex = require('./duplex.js');
var inherits = require('inherits');
inherits(Transform, Duplex);


function TransformState(options, stream) {
  this.afterTransform = function(er, data) {
    return afterTransform(stream, er, data);
  };

  this.needTransform = false;
  this.transforming = false;
  this.writecb = null;
  this.writechunk = null;
}

function afterTransform(stream, er, data) {
  var ts = stream._transformState;
  ts.transforming = false;

  var cb = ts.writecb;

  if (!cb)
    return stream.emit('error', new Error('no writecb in Transform class'));

  ts.writechunk = null;
  ts.writecb = null;

  if (data !== null && data !== undefined)
    stream.push(data);

  if (cb)
    cb(er);

  var rs = stream._readableState;
  rs.reading = false;
  if (rs.needReadable || rs.length < rs.highWaterMark) {
    stream._read(rs.highWaterMark);
  }
}


function Transform(options) {
  if (!(this instanceof Transform))
    return new Transform(options);

  Duplex.call(this, options);

  var ts = this._transformState = new TransformState(options, this);

  // when the writable side finishes, then flush out anything remaining.
  var stream = this;

  // start out asking for a readable event once data is transformed.
  this._readableState.needReadable = true;

  // we have implemented the _read method, and done the other things
  // that Readable wants before the first _read call, so unset the
  // sync guard flag.
  this._readableState.sync = false;

  this.once('finish', function() {
    if ('function' === typeof this._flush)
      this._flush(function(er) {
        done(stream, er);
      });
    else
      done(stream);
  });
}

Transform.prototype.push = function(chunk, encoding) {
  this._transformState.needTransform = false;
  return Duplex.prototype.push.call(this, chunk, encoding);
};

// This is the part where you do stuff!
// override this function in implementation classes.
// 'chunk' is an input chunk.
//
// Call `push(newChunk)` to pass along transformed output
// to the readable side.  You may call 'push' zero or more times.
//
// Call `cb(err)` when you are done with this chunk.  If you pass
// an error, then that'll put the hurt on the whole operation.  If you
// never call cb(), then you'll never get another chunk.
Transform.prototype._transform = function(chunk, encoding, cb) {
  throw new Error('not implemented');
};

Transform.prototype._write = function(chunk, encoding, cb) {
  var ts = this._transformState;
  ts.writecb = cb;
  ts.writechunk = chunk;
  ts.writeencoding = encoding;
  if (!ts.transforming) {
    var rs = this._readableState;
    if (ts.needTransform ||
        rs.needReadable ||
        rs.length < rs.highWaterMark)
      this._read(rs.highWaterMark);
  }
};

// Doesn't matter what the args are here.
// _transform does all the work.
// That we got here means that the readable side wants more data.
Transform.prototype._read = function(n) {
  var ts = this._transformState;

  if (ts.writechunk && ts.writecb && !ts.transforming) {
    ts.transforming = true;
    this._transform(ts.writechunk, ts.writeencoding, ts.afterTransform);
  } else {
    // mark that we need a transform, so that any data that comes in
    // will get processed, now that we've asked for it.
    ts.needTransform = true;
  }
};


function done(stream, er) {
  if (er)
    return stream.emit('error', er);

  // if there's nothing in the write buffer, then that means
  // that nothing more will ever be provided
  var ws = stream._writableState;
  var rs = stream._readableState;
  var ts = stream._transformState;

  if (ws.length)
    throw new Error('calling transform done when ws.length != 0');

  if (ts.transforming)
    throw new Error('calling transform done when still transforming');

  return stream.push(null);
}

}).call(this,require("+7ZJp0"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../../../node_modules/gulp-browserify/node_modules/browserify/node_modules/stream-browserify/transform.js","/../../../node_modules/gulp-browserify/node_modules/browserify/node_modules/stream-browserify")
},{"+7ZJp0":60,"./duplex.js":65,"buffer":55,"inherits":59}],71:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// A bit simpler than readable streams.
// Implement an async ._write(chunk, cb), and it'll handle all
// the drain event emission and buffering.

module.exports = Writable;
Writable.WritableState = WritableState;

var isUint8Array = typeof Uint8Array !== 'undefined'
  ? function (x) { return x instanceof Uint8Array }
  : function (x) {
    return x && x.constructor && x.constructor.name === 'Uint8Array'
  }
;
var isArrayBuffer = typeof ArrayBuffer !== 'undefined'
  ? function (x) { return x instanceof ArrayBuffer }
  : function (x) {
    return x && x.constructor && x.constructor.name === 'ArrayBuffer'
  }
;

var inherits = require('inherits');
var Stream = require('./index.js');
var setImmediate = require('process/browser.js').nextTick;
var Buffer = require('buffer').Buffer;

inherits(Writable, Stream);

function WriteReq(chunk, encoding, cb) {
  this.chunk = chunk;
  this.encoding = encoding;
  this.callback = cb;
}

function WritableState(options, stream) {
  options = options || {};

  // the point at which write() starts returning false
  // Note: 0 is a valid value, means that we always return false if
  // the entire buffer is not flushed immediately on write()
  var hwm = options.highWaterMark;
  this.highWaterMark = (hwm || hwm === 0) ? hwm : 16 * 1024;

  // object stream flag to indicate whether or not this stream
  // contains buffers or objects.
  this.objectMode = !!options.objectMode;

  // cast to ints.
  this.highWaterMark = ~~this.highWaterMark;

  this.needDrain = false;
  // at the start of calling end()
  this.ending = false;
  // when end() has been called, and returned
  this.ended = false;
  // when 'finish' is emitted
  this.finished = false;

  // should we decode strings into buffers before passing to _write?
  // this is here so that some node-core streams can optimize string
  // handling at a lower level.
  var noDecode = options.decodeStrings === false;
  this.decodeStrings = !noDecode;

  // Crypto is kind of old and crusty.  Historically, its default string
  // encoding is 'binary' so we have to make this configurable.
  // Everything else in the universe uses 'utf8', though.
  this.defaultEncoding = options.defaultEncoding || 'utf8';

  // not an actual buffer we keep track of, but a measurement
  // of how much we're waiting to get pushed to some underlying
  // socket or file.
  this.length = 0;

  // a flag to see when we're in the middle of a write.
  this.writing = false;

  // a flag to be able to tell if the onwrite cb is called immediately,
  // or on a later tick.  We set this to true at first, becuase any
  // actions that shouldn't happen until "later" should generally also
  // not happen before the first write call.
  this.sync = true;

  // a flag to know if we're processing previously buffered items, which
  // may call the _write() callback in the same tick, so that we don't
  // end up in an overlapped onwrite situation.
  this.bufferProcessing = false;

  // the callback that's passed to _write(chunk,cb)
  this.onwrite = function(er) {
    onwrite(stream, er);
  };

  // the callback that the user supplies to write(chunk,encoding,cb)
  this.writecb = null;

  // the amount that is being written when _write is called.
  this.writelen = 0;

  this.buffer = [];
}

function Writable(options) {
  // Writable ctor is applied to Duplexes, though they're not
  // instanceof Writable, they're instanceof Readable.
  if (!(this instanceof Writable) && !(this instanceof Stream.Duplex))
    return new Writable(options);

  this._writableState = new WritableState(options, this);

  // legacy.
  this.writable = true;

  Stream.call(this);
}

// Otherwise people can pipe Writable streams, which is just wrong.
Writable.prototype.pipe = function() {
  this.emit('error', new Error('Cannot pipe. Not readable.'));
};


function writeAfterEnd(stream, state, cb) {
  var er = new Error('write after end');
  // TODO: defer error events consistently everywhere, not just the cb
  stream.emit('error', er);
  setImmediate(function() {
    cb(er);
  });
}

// If we get something that is not a buffer, string, null, or undefined,
// and we're not in objectMode, then that's an error.
// Otherwise stream chunks are all considered to be of length=1, and the
// watermarks determine how many objects to keep in the buffer, rather than
// how many bytes or characters.
function validChunk(stream, state, chunk, cb) {
  var valid = true;
  if (!Buffer.isBuffer(chunk) &&
      'string' !== typeof chunk &&
      chunk !== null &&
      chunk !== undefined &&
      !state.objectMode) {
    var er = new TypeError('Invalid non-string/buffer chunk');
    stream.emit('error', er);
    setImmediate(function() {
      cb(er);
    });
    valid = false;
  }
  return valid;
}

Writable.prototype.write = function(chunk, encoding, cb) {
  var state = this._writableState;
  var ret = false;

  if (typeof encoding === 'function') {
    cb = encoding;
    encoding = null;
  }

  if (!Buffer.isBuffer(chunk) && isUint8Array(chunk))
    chunk = new Buffer(chunk);
  if (isArrayBuffer(chunk) && typeof Uint8Array !== 'undefined')
    chunk = new Buffer(new Uint8Array(chunk));
  
  if (Buffer.isBuffer(chunk))
    encoding = 'buffer';
  else if (!encoding)
    encoding = state.defaultEncoding;

  if (typeof cb !== 'function')
    cb = function() {};

  if (state.ended)
    writeAfterEnd(this, state, cb);
  else if (validChunk(this, state, chunk, cb))
    ret = writeOrBuffer(this, state, chunk, encoding, cb);

  return ret;
};

function decodeChunk(state, chunk, encoding) {
  if (!state.objectMode &&
      state.decodeStrings !== false &&
      typeof chunk === 'string') {
    chunk = new Buffer(chunk, encoding);
  }
  return chunk;
}

// if we're already writing something, then just put this
// in the queue, and wait our turn.  Otherwise, call _write
// If we return false, then we need a drain event, so set that flag.
function writeOrBuffer(stream, state, chunk, encoding, cb) {
  chunk = decodeChunk(state, chunk, encoding);
  var len = state.objectMode ? 1 : chunk.length;

  state.length += len;

  var ret = state.length < state.highWaterMark;
  state.needDrain = !ret;

  if (state.writing)
    state.buffer.push(new WriteReq(chunk, encoding, cb));
  else
    doWrite(stream, state, len, chunk, encoding, cb);

  return ret;
}

function doWrite(stream, state, len, chunk, encoding, cb) {
  state.writelen = len;
  state.writecb = cb;
  state.writing = true;
  state.sync = true;
  stream._write(chunk, encoding, state.onwrite);
  state.sync = false;
}

function onwriteError(stream, state, sync, er, cb) {
  if (sync)
    setImmediate(function() {
      cb(er);
    });
  else
    cb(er);

  stream.emit('error', er);
}

function onwriteStateUpdate(state) {
  state.writing = false;
  state.writecb = null;
  state.length -= state.writelen;
  state.writelen = 0;
}

function onwrite(stream, er) {
  var state = stream._writableState;
  var sync = state.sync;
  var cb = state.writecb;

  onwriteStateUpdate(state);

  if (er)
    onwriteError(stream, state, sync, er, cb);
  else {
    // Check if we're actually ready to finish, but don't emit yet
    var finished = needFinish(stream, state);

    if (!finished && !state.bufferProcessing && state.buffer.length)
      clearBuffer(stream, state);

    if (sync) {
      setImmediate(function() {
        afterWrite(stream, state, finished, cb);
      });
    } else {
      afterWrite(stream, state, finished, cb);
    }
  }
}

function afterWrite(stream, state, finished, cb) {
  if (!finished)
    onwriteDrain(stream, state);
  cb();
  if (finished)
    finishMaybe(stream, state);
}

// Must force callback to be called on nextTick, so that we don't
// emit 'drain' before the write() consumer gets the 'false' return
// value, and has a chance to attach a 'drain' listener.
function onwriteDrain(stream, state) {
  if (state.length === 0 && state.needDrain) {
    state.needDrain = false;
    stream.emit('drain');
  }
}


// if there's something in the buffer waiting, then process it
function clearBuffer(stream, state) {
  state.bufferProcessing = true;

  for (var c = 0; c < state.buffer.length; c++) {
    var entry = state.buffer[c];
    var chunk = entry.chunk;
    var encoding = entry.encoding;
    var cb = entry.callback;
    var len = state.objectMode ? 1 : chunk.length;

    doWrite(stream, state, len, chunk, encoding, cb);

    // if we didn't call the onwrite immediately, then
    // it means that we need to wait until it does.
    // also, that means that the chunk and cb are currently
    // being processed, so move the buffer counter past them.
    if (state.writing) {
      c++;
      break;
    }
  }

  state.bufferProcessing = false;
  if (c < state.buffer.length)
    state.buffer = state.buffer.slice(c);
  else
    state.buffer.length = 0;
}

Writable.prototype._write = function(chunk, encoding, cb) {
  cb(new Error('not implemented'));
};

Writable.prototype.end = function(chunk, encoding, cb) {
  var state = this._writableState;

  if (typeof chunk === 'function') {
    cb = chunk;
    chunk = null;
    encoding = null;
  } else if (typeof encoding === 'function') {
    cb = encoding;
    encoding = null;
  }

  if (typeof chunk !== 'undefined' && chunk !== null)
    this.write(chunk, encoding);

  // ignore unnecessary end() calls.
  if (!state.ending && !state.finished)
    endWritable(this, state, cb);
};


function needFinish(stream, state) {
  return (state.ending &&
          state.length === 0 &&
          !state.finished &&
          !state.writing);
}

function finishMaybe(stream, state) {
  var need = needFinish(stream, state);
  if (need) {
    state.finished = true;
    stream.emit('finish');
  }
  return need;
}

function endWritable(stream, state, cb) {
  state.ending = true;
  finishMaybe(stream, state);
  if (cb) {
    if (state.finished)
      setImmediate(cb);
    else
      stream.once('finish', cb);
  }
  state.ended = true;
}

}).call(this,require("+7ZJp0"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../../../node_modules/gulp-browserify/node_modules/browserify/node_modules/stream-browserify/writable.js","/../../../node_modules/gulp-browserify/node_modules/browserify/node_modules/stream-browserify")
},{"+7ZJp0":60,"./index.js":66,"buffer":55,"inherits":59,"process/browser.js":67}],72:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var Buffer = require('buffer').Buffer;

function assertEncoding(encoding) {
  if (encoding && !Buffer.isEncoding(encoding)) {
    throw new Error('Unknown encoding: ' + encoding);
  }
}

var StringDecoder = exports.StringDecoder = function(encoding) {
  this.encoding = (encoding || 'utf8').toLowerCase().replace(/[-_]/, '');
  assertEncoding(encoding);
  switch (this.encoding) {
    case 'utf8':
      // CESU-8 represents each of Surrogate Pair by 3-bytes
      this.surrogateSize = 3;
      break;
    case 'ucs2':
    case 'utf16le':
      // UTF-16 represents each of Surrogate Pair by 2-bytes
      this.surrogateSize = 2;
      this.detectIncompleteChar = utf16DetectIncompleteChar;
      break;
    case 'base64':
      // Base-64 stores 3 bytes in 4 chars, and pads the remainder.
      this.surrogateSize = 3;
      this.detectIncompleteChar = base64DetectIncompleteChar;
      break;
    default:
      this.write = passThroughWrite;
      return;
  }

  this.charBuffer = new Buffer(6);
  this.charReceived = 0;
  this.charLength = 0;
};


StringDecoder.prototype.write = function(buffer) {
  var charStr = '';
  var offset = 0;

  // if our last write ended with an incomplete multibyte character
  while (this.charLength) {
    // determine how many remaining bytes this buffer has to offer for this char
    var i = (buffer.length >= this.charLength - this.charReceived) ?
                this.charLength - this.charReceived :
                buffer.length;

    // add the new bytes to the char buffer
    buffer.copy(this.charBuffer, this.charReceived, offset, i);
    this.charReceived += (i - offset);
    offset = i;

    if (this.charReceived < this.charLength) {
      // still not enough chars in this buffer? wait for more ...
      return '';
    }

    // get the character that was split
    charStr = this.charBuffer.slice(0, this.charLength).toString(this.encoding);

    // lead surrogate (D800-DBFF) is also the incomplete character
    var charCode = charStr.charCodeAt(charStr.length - 1);
    if (charCode >= 0xD800 && charCode <= 0xDBFF) {
      this.charLength += this.surrogateSize;
      charStr = '';
      continue;
    }
    this.charReceived = this.charLength = 0;

    // if there are no more bytes in this buffer, just emit our char
    if (i == buffer.length) return charStr;

    // otherwise cut off the characters end from the beginning of this buffer
    buffer = buffer.slice(i, buffer.length);
    break;
  }

  var lenIncomplete = this.detectIncompleteChar(buffer);

  var end = buffer.length;
  if (this.charLength) {
    // buffer the incomplete character bytes we got
    buffer.copy(this.charBuffer, 0, buffer.length - lenIncomplete, end);
    this.charReceived = lenIncomplete;
    end -= lenIncomplete;
  }

  charStr += buffer.toString(this.encoding, 0, end);

  var end = charStr.length - 1;
  var charCode = charStr.charCodeAt(end);
  // lead surrogate (D800-DBFF) is also the incomplete character
  if (charCode >= 0xD800 && charCode <= 0xDBFF) {
    var size = this.surrogateSize;
    this.charLength += size;
    this.charReceived += size;
    this.charBuffer.copy(this.charBuffer, size, 0, size);
    this.charBuffer.write(charStr.charAt(charStr.length - 1), this.encoding);
    return charStr.substring(0, end);
  }

  // or just emit the charStr
  return charStr;
};

StringDecoder.prototype.detectIncompleteChar = function(buffer) {
  // determine how many bytes we have to check at the end of this buffer
  var i = (buffer.length >= 3) ? 3 : buffer.length;

  // Figure out if one of the last i bytes of our buffer announces an
  // incomplete char.
  for (; i > 0; i--) {
    var c = buffer[buffer.length - i];

    // See http://en.wikipedia.org/wiki/UTF-8#Description

    // 110XXXXX
    if (i == 1 && c >> 5 == 0x06) {
      this.charLength = 2;
      break;
    }

    // 1110XXXX
    if (i <= 2 && c >> 4 == 0x0E) {
      this.charLength = 3;
      break;
    }

    // 11110XXX
    if (i <= 3 && c >> 3 == 0x1E) {
      this.charLength = 4;
      break;
    }
  }

  return i;
};

StringDecoder.prototype.end = function(buffer) {
  var res = '';
  if (buffer && buffer.length)
    res = this.write(buffer);

  if (this.charReceived) {
    var cr = this.charReceived;
    var buf = this.charBuffer;
    var enc = this.encoding;
    res += buf.slice(0, cr).toString(enc);
  }

  return res;
};

function passThroughWrite(buffer) {
  return buffer.toString(this.encoding);
}

function utf16DetectIncompleteChar(buffer) {
  var incomplete = this.charReceived = buffer.length % 2;
  this.charLength = incomplete ? 2 : 0;
  return incomplete;
}

function base64DetectIncompleteChar(buffer) {
  var incomplete = this.charReceived = buffer.length % 3;
  this.charLength = incomplete ? 3 : 0;
  return incomplete;
}

}).call(this,require("+7ZJp0"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../../../node_modules/gulp-browserify/node_modules/browserify/node_modules/string_decoder/index.js","/../../../node_modules/gulp-browserify/node_modules/browserify/node_modules/string_decoder")
},{"+7ZJp0":60,"buffer":55}],73:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var punycode = require('punycode');

exports.parse = urlParse;
exports.resolve = urlResolve;
exports.resolveObject = urlResolveObject;
exports.format = urlFormat;

exports.Url = Url;

function Url() {
  this.protocol = null;
  this.slashes = null;
  this.auth = null;
  this.host = null;
  this.port = null;
  this.hostname = null;
  this.hash = null;
  this.search = null;
  this.query = null;
  this.pathname = null;
  this.path = null;
  this.href = null;
}

// Reference: RFC 3986, RFC 1808, RFC 2396

// define these here so at least they only have to be
// compiled once on the first module load.
var protocolPattern = /^([a-z0-9.+-]+:)/i,
    portPattern = /:[0-9]*$/,

    // RFC 2396: characters reserved for delimiting URLs.
    // We actually just auto-escape these.
    delims = ['<', '>', '"', '`', ' ', '\r', '\n', '\t'],

    // RFC 2396: characters not allowed for various reasons.
    unwise = ['{', '}', '|', '\\', '^', '`'].concat(delims),

    // Allowed by RFCs, but cause of XSS attacks.  Always escape these.
    autoEscape = ['\''].concat(unwise),
    // Characters that are never ever allowed in a hostname.
    // Note that any invalid chars are also handled, but these
    // are the ones that are *expected* to be seen, so we fast-path
    // them.
    nonHostChars = ['%', '/', '?', ';', '#'].concat(autoEscape),
    hostEndingChars = ['/', '?', '#'],
    hostnameMaxLen = 255,
    hostnamePartPattern = /^[a-z0-9A-Z_-]{0,63}$/,
    hostnamePartStart = /^([a-z0-9A-Z_-]{0,63})(.*)$/,
    // protocols that can allow "unsafe" and "unwise" chars.
    unsafeProtocol = {
      'javascript': true,
      'javascript:': true
    },
    // protocols that never have a hostname.
    hostlessProtocol = {
      'javascript': true,
      'javascript:': true
    },
    // protocols that always contain a // bit.
    slashedProtocol = {
      'http': true,
      'https': true,
      'ftp': true,
      'gopher': true,
      'file': true,
      'http:': true,
      'https:': true,
      'ftp:': true,
      'gopher:': true,
      'file:': true
    },
    querystring = require('querystring');

function urlParse(url, parseQueryString, slashesDenoteHost) {
  if (url && isObject(url) && url instanceof Url) return url;

  var u = new Url;
  u.parse(url, parseQueryString, slashesDenoteHost);
  return u;
}

Url.prototype.parse = function(url, parseQueryString, slashesDenoteHost) {
  if (!isString(url)) {
    throw new TypeError("Parameter 'url' must be a string, not " + typeof url);
  }

  var rest = url;

  // trim before proceeding.
  // This is to support parse stuff like "  http://foo.com  \n"
  rest = rest.trim();

  var proto = protocolPattern.exec(rest);
  if (proto) {
    proto = proto[0];
    var lowerProto = proto.toLowerCase();
    this.protocol = lowerProto;
    rest = rest.substr(proto.length);
  }

  // figure out if it's got a host
  // user@server is *always* interpreted as a hostname, and url
  // resolution will treat //foo/bar as host=foo,path=bar because that's
  // how the browser resolves relative URLs.
  if (slashesDenoteHost || proto || rest.match(/^\/\/[^@\/]+@[^@\/]+/)) {
    var slashes = rest.substr(0, 2) === '//';
    if (slashes && !(proto && hostlessProtocol[proto])) {
      rest = rest.substr(2);
      this.slashes = true;
    }
  }

  if (!hostlessProtocol[proto] &&
      (slashes || (proto && !slashedProtocol[proto]))) {

    // there's a hostname.
    // the first instance of /, ?, ;, or # ends the host.
    //
    // If there is an @ in the hostname, then non-host chars *are* allowed
    // to the left of the last @ sign, unless some host-ending character
    // comes *before* the @-sign.
    // URLs are obnoxious.
    //
    // ex:
    // http://a@b@c/ => user:a@b host:c
    // http://a@b?@c => user:a host:c path:/?@c

    // v0.12 TODO(isaacs): This is not quite how Chrome does things.
    // Review our test case against browsers more comprehensively.

    // find the first instance of any hostEndingChars
    var hostEnd = -1;
    for (var i = 0; i < hostEndingChars.length; i++) {
      var hec = rest.indexOf(hostEndingChars[i]);
      if (hec !== -1 && (hostEnd === -1 || hec < hostEnd))
        hostEnd = hec;
    }

    // at this point, either we have an explicit point where the
    // auth portion cannot go past, or the last @ char is the decider.
    var auth, atSign;
    if (hostEnd === -1) {
      // atSign can be anywhere.
      atSign = rest.lastIndexOf('@');
    } else {
      // atSign must be in auth portion.
      // http://a@b/c@d => host:b auth:a path:/c@d
      atSign = rest.lastIndexOf('@', hostEnd);
    }

    // Now we have a portion which is definitely the auth.
    // Pull that off.
    if (atSign !== -1) {
      auth = rest.slice(0, atSign);
      rest = rest.slice(atSign + 1);
      this.auth = decodeURIComponent(auth);
    }

    // the host is the remaining to the left of the first non-host char
    hostEnd = -1;
    for (var i = 0; i < nonHostChars.length; i++) {
      var hec = rest.indexOf(nonHostChars[i]);
      if (hec !== -1 && (hostEnd === -1 || hec < hostEnd))
        hostEnd = hec;
    }
    // if we still have not hit it, then the entire thing is a host.
    if (hostEnd === -1)
      hostEnd = rest.length;

    this.host = rest.slice(0, hostEnd);
    rest = rest.slice(hostEnd);

    // pull out port.
    this.parseHost();

    // we've indicated that there is a hostname,
    // so even if it's empty, it has to be present.
    this.hostname = this.hostname || '';

    // if hostname begins with [ and ends with ]
    // assume that it's an IPv6 address.
    var ipv6Hostname = this.hostname[0] === '[' &&
        this.hostname[this.hostname.length - 1] === ']';

    // validate a little.
    if (!ipv6Hostname) {
      var hostparts = this.hostname.split(/\./);
      for (var i = 0, l = hostparts.length; i < l; i++) {
        var part = hostparts[i];
        if (!part) continue;
        if (!part.match(hostnamePartPattern)) {
          var newpart = '';
          for (var j = 0, k = part.length; j < k; j++) {
            if (part.charCodeAt(j) > 127) {
              // we replace non-ASCII char with a temporary placeholder
              // we need this to make sure size of hostname is not
              // broken by replacing non-ASCII by nothing
              newpart += 'x';
            } else {
              newpart += part[j];
            }
          }
          // we test again with ASCII char only
          if (!newpart.match(hostnamePartPattern)) {
            var validParts = hostparts.slice(0, i);
            var notHost = hostparts.slice(i + 1);
            var bit = part.match(hostnamePartStart);
            if (bit) {
              validParts.push(bit[1]);
              notHost.unshift(bit[2]);
            }
            if (notHost.length) {
              rest = '/' + notHost.join('.') + rest;
            }
            this.hostname = validParts.join('.');
            break;
          }
        }
      }
    }

    if (this.hostname.length > hostnameMaxLen) {
      this.hostname = '';
    } else {
      // hostnames are always lower case.
      this.hostname = this.hostname.toLowerCase();
    }

    if (!ipv6Hostname) {
      // IDNA Support: Returns a puny coded representation of "domain".
      // It only converts the part of the domain name that
      // has non ASCII characters. I.e. it dosent matter if
      // you call it with a domain that already is in ASCII.
      var domainArray = this.hostname.split('.');
      var newOut = [];
      for (var i = 0; i < domainArray.length; ++i) {
        var s = domainArray[i];
        newOut.push(s.match(/[^A-Za-z0-9_-]/) ?
            'xn--' + punycode.encode(s) : s);
      }
      this.hostname = newOut.join('.');
    }

    var p = this.port ? ':' + this.port : '';
    var h = this.hostname || '';
    this.host = h + p;
    this.href += this.host;

    // strip [ and ] from the hostname
    // the host field still retains them, though
    if (ipv6Hostname) {
      this.hostname = this.hostname.substr(1, this.hostname.length - 2);
      if (rest[0] !== '/') {
        rest = '/' + rest;
      }
    }
  }

  // now rest is set to the post-host stuff.
  // chop off any delim chars.
  if (!unsafeProtocol[lowerProto]) {

    // First, make 100% sure that any "autoEscape" chars get
    // escaped, even if encodeURIComponent doesn't think they
    // need to be.
    for (var i = 0, l = autoEscape.length; i < l; i++) {
      var ae = autoEscape[i];
      var esc = encodeURIComponent(ae);
      if (esc === ae) {
        esc = escape(ae);
      }
      rest = rest.split(ae).join(esc);
    }
  }


  // chop off from the tail first.
  var hash = rest.indexOf('#');
  if (hash !== -1) {
    // got a fragment string.
    this.hash = rest.substr(hash);
    rest = rest.slice(0, hash);
  }
  var qm = rest.indexOf('?');
  if (qm !== -1) {
    this.search = rest.substr(qm);
    this.query = rest.substr(qm + 1);
    if (parseQueryString) {
      this.query = querystring.parse(this.query);
    }
    rest = rest.slice(0, qm);
  } else if (parseQueryString) {
    // no query string, but parseQueryString still requested
    this.search = '';
    this.query = {};
  }
  if (rest) this.pathname = rest;
  if (slashedProtocol[lowerProto] &&
      this.hostname && !this.pathname) {
    this.pathname = '/';
  }

  //to support http.request
  if (this.pathname || this.search) {
    var p = this.pathname || '';
    var s = this.search || '';
    this.path = p + s;
  }

  // finally, reconstruct the href based on what has been validated.
  this.href = this.format();
  return this;
};

// format a parsed object into a url string
function urlFormat(obj) {
  // ensure it's an object, and not a string url.
  // If it's an obj, this is a no-op.
  // this way, you can call url_format() on strings
  // to clean up potentially wonky urls.
  if (isString(obj)) obj = urlParse(obj);
  if (!(obj instanceof Url)) return Url.prototype.format.call(obj);
  return obj.format();
}

Url.prototype.format = function() {
  var auth = this.auth || '';
  if (auth) {
    auth = encodeURIComponent(auth);
    auth = auth.replace(/%3A/i, ':');
    auth += '@';
  }

  var protocol = this.protocol || '',
      pathname = this.pathname || '',
      hash = this.hash || '',
      host = false,
      query = '';

  if (this.host) {
    host = auth + this.host;
  } else if (this.hostname) {
    host = auth + (this.hostname.indexOf(':') === -1 ?
        this.hostname :
        '[' + this.hostname + ']');
    if (this.port) {
      host += ':' + this.port;
    }
  }

  if (this.query &&
      isObject(this.query) &&
      Object.keys(this.query).length) {
    query = querystring.stringify(this.query);
  }

  var search = this.search || (query && ('?' + query)) || '';

  if (protocol && protocol.substr(-1) !== ':') protocol += ':';

  // only the slashedProtocols get the //.  Not mailto:, xmpp:, etc.
  // unless they had them to begin with.
  if (this.slashes ||
      (!protocol || slashedProtocol[protocol]) && host !== false) {
    host = '//' + (host || '');
    if (pathname && pathname.charAt(0) !== '/') pathname = '/' + pathname;
  } else if (!host) {
    host = '';
  }

  if (hash && hash.charAt(0) !== '#') hash = '#' + hash;
  if (search && search.charAt(0) !== '?') search = '?' + search;

  pathname = pathname.replace(/[?#]/g, function(match) {
    return encodeURIComponent(match);
  });
  search = search.replace('#', '%23');

  return protocol + host + pathname + search + hash;
};

function urlResolve(source, relative) {
  return urlParse(source, false, true).resolve(relative);
}

Url.prototype.resolve = function(relative) {
  return this.resolveObject(urlParse(relative, false, true)).format();
};

function urlResolveObject(source, relative) {
  if (!source) return relative;
  return urlParse(source, false, true).resolveObject(relative);
}

Url.prototype.resolveObject = function(relative) {
  if (isString(relative)) {
    var rel = new Url();
    rel.parse(relative, false, true);
    relative = rel;
  }

  var result = new Url();
  Object.keys(this).forEach(function(k) {
    result[k] = this[k];
  }, this);

  // hash is always overridden, no matter what.
  // even href="" will remove it.
  result.hash = relative.hash;

  // if the relative url is empty, then there's nothing left to do here.
  if (relative.href === '') {
    result.href = result.format();
    return result;
  }

  // hrefs like //foo/bar always cut to the protocol.
  if (relative.slashes && !relative.protocol) {
    // take everything except the protocol from relative
    Object.keys(relative).forEach(function(k) {
      if (k !== 'protocol')
        result[k] = relative[k];
    });

    //urlParse appends trailing / to urls like http://www.example.com
    if (slashedProtocol[result.protocol] &&
        result.hostname && !result.pathname) {
      result.path = result.pathname = '/';
    }

    result.href = result.format();
    return result;
  }

  if (relative.protocol && relative.protocol !== result.protocol) {
    // if it's a known url protocol, then changing
    // the protocol does weird things
    // first, if it's not file:, then we MUST have a host,
    // and if there was a path
    // to begin with, then we MUST have a path.
    // if it is file:, then the host is dropped,
    // because that's known to be hostless.
    // anything else is assumed to be absolute.
    if (!slashedProtocol[relative.protocol]) {
      Object.keys(relative).forEach(function(k) {
        result[k] = relative[k];
      });
      result.href = result.format();
      return result;
    }

    result.protocol = relative.protocol;
    if (!relative.host && !hostlessProtocol[relative.protocol]) {
      var relPath = (relative.pathname || '').split('/');
      while (relPath.length && !(relative.host = relPath.shift()));
      if (!relative.host) relative.host = '';
      if (!relative.hostname) relative.hostname = '';
      if (relPath[0] !== '') relPath.unshift('');
      if (relPath.length < 2) relPath.unshift('');
      result.pathname = relPath.join('/');
    } else {
      result.pathname = relative.pathname;
    }
    result.search = relative.search;
    result.query = relative.query;
    result.host = relative.host || '';
    result.auth = relative.auth;
    result.hostname = relative.hostname || relative.host;
    result.port = relative.port;
    // to support http.request
    if (result.pathname || result.search) {
      var p = result.pathname || '';
      var s = result.search || '';
      result.path = p + s;
    }
    result.slashes = result.slashes || relative.slashes;
    result.href = result.format();
    return result;
  }

  var isSourceAbs = (result.pathname && result.pathname.charAt(0) === '/'),
      isRelAbs = (
          relative.host ||
          relative.pathname && relative.pathname.charAt(0) === '/'
      ),
      mustEndAbs = (isRelAbs || isSourceAbs ||
                    (result.host && relative.pathname)),
      removeAllDots = mustEndAbs,
      srcPath = result.pathname && result.pathname.split('/') || [],
      relPath = relative.pathname && relative.pathname.split('/') || [],
      psychotic = result.protocol && !slashedProtocol[result.protocol];

  // if the url is a non-slashed url, then relative
  // links like ../.. should be able
  // to crawl up to the hostname, as well.  This is strange.
  // result.protocol has already been set by now.
  // Later on, put the first path part into the host field.
  if (psychotic) {
    result.hostname = '';
    result.port = null;
    if (result.host) {
      if (srcPath[0] === '') srcPath[0] = result.host;
      else srcPath.unshift(result.host);
    }
    result.host = '';
    if (relative.protocol) {
      relative.hostname = null;
      relative.port = null;
      if (relative.host) {
        if (relPath[0] === '') relPath[0] = relative.host;
        else relPath.unshift(relative.host);
      }
      relative.host = null;
    }
    mustEndAbs = mustEndAbs && (relPath[0] === '' || srcPath[0] === '');
  }

  if (isRelAbs) {
    // it's absolute.
    result.host = (relative.host || relative.host === '') ?
                  relative.host : result.host;
    result.hostname = (relative.hostname || relative.hostname === '') ?
                      relative.hostname : result.hostname;
    result.search = relative.search;
    result.query = relative.query;
    srcPath = relPath;
    // fall through to the dot-handling below.
  } else if (relPath.length) {
    // it's relative
    // throw away the existing file, and take the new path instead.
    if (!srcPath) srcPath = [];
    srcPath.pop();
    srcPath = srcPath.concat(relPath);
    result.search = relative.search;
    result.query = relative.query;
  } else if (!isNullOrUndefined(relative.search)) {
    // just pull out the search.
    // like href='?foo'.
    // Put this after the other two cases because it simplifies the booleans
    if (psychotic) {
      result.hostname = result.host = srcPath.shift();
      //occationaly the auth can get stuck only in host
      //this especialy happens in cases like
      //url.resolveObject('mailto:local1@domain1', 'local2@domain2')
      var authInHost = result.host && result.host.indexOf('@') > 0 ?
                       result.host.split('@') : false;
      if (authInHost) {
        result.auth = authInHost.shift();
        result.host = result.hostname = authInHost.shift();
      }
    }
    result.search = relative.search;
    result.query = relative.query;
    //to support http.request
    if (!isNull(result.pathname) || !isNull(result.search)) {
      result.path = (result.pathname ? result.pathname : '') +
                    (result.search ? result.search : '');
    }
    result.href = result.format();
    return result;
  }

  if (!srcPath.length) {
    // no path at all.  easy.
    // we've already handled the other stuff above.
    result.pathname = null;
    //to support http.request
    if (result.search) {
      result.path = '/' + result.search;
    } else {
      result.path = null;
    }
    result.href = result.format();
    return result;
  }

  // if a url ENDs in . or .., then it must get a trailing slash.
  // however, if it ends in anything else non-slashy,
  // then it must NOT get a trailing slash.
  var last = srcPath.slice(-1)[0];
  var hasTrailingSlash = (
      (result.host || relative.host) && (last === '.' || last === '..') ||
      last === '');

  // strip single dots, resolve double dots to parent dir
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = srcPath.length; i >= 0; i--) {
    last = srcPath[i];
    if (last == '.') {
      srcPath.splice(i, 1);
    } else if (last === '..') {
      srcPath.splice(i, 1);
      up++;
    } else if (up) {
      srcPath.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (!mustEndAbs && !removeAllDots) {
    for (; up--; up) {
      srcPath.unshift('..');
    }
  }

  if (mustEndAbs && srcPath[0] !== '' &&
      (!srcPath[0] || srcPath[0].charAt(0) !== '/')) {
    srcPath.unshift('');
  }

  if (hasTrailingSlash && (srcPath.join('/').substr(-1) !== '/')) {
    srcPath.push('');
  }

  var isAbsolute = srcPath[0] === '' ||
      (srcPath[0] && srcPath[0].charAt(0) === '/');

  // put the host back
  if (psychotic) {
    result.hostname = result.host = isAbsolute ? '' :
                                    srcPath.length ? srcPath.shift() : '';
    //occationaly the auth can get stuck only in host
    //this especialy happens in cases like
    //url.resolveObject('mailto:local1@domain1', 'local2@domain2')
    var authInHost = result.host && result.host.indexOf('@') > 0 ?
                     result.host.split('@') : false;
    if (authInHost) {
      result.auth = authInHost.shift();
      result.host = result.hostname = authInHost.shift();
    }
  }

  mustEndAbs = mustEndAbs || (result.host && srcPath.length);

  if (mustEndAbs && !isAbsolute) {
    srcPath.unshift('');
  }

  if (!srcPath.length) {
    result.pathname = null;
    result.path = null;
  } else {
    result.pathname = srcPath.join('/');
  }

  //to support request.http
  if (!isNull(result.pathname) || !isNull(result.search)) {
    result.path = (result.pathname ? result.pathname : '') +
                  (result.search ? result.search : '');
  }
  result.auth = relative.auth || result.auth;
  result.slashes = result.slashes || relative.slashes;
  result.href = result.format();
  return result;
};

Url.prototype.parseHost = function() {
  var host = this.host;
  var port = portPattern.exec(host);
  if (port) {
    port = port[0];
    if (port !== ':') {
      this.port = port.substr(1);
    }
    host = host.substr(0, host.length - port.length);
  }
  if (host) this.hostname = host;
};

function isString(arg) {
  return typeof arg === "string";
}

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}

function isNull(arg) {
  return arg === null;
}
function isNullOrUndefined(arg) {
  return  arg == null;
}

}).call(this,require("+7ZJp0"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../../../node_modules/gulp-browserify/node_modules/browserify/node_modules/url/url.js","/../../../node_modules/gulp-browserify/node_modules/browserify/node_modules/url")
},{"+7ZJp0":60,"buffer":55,"punycode":61,"querystring":64}],74:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
var Stream = require('stream');
var sockjs = require('sockjs-client');
var resolve = require('url').resolve;
var parse = require('url').parse;

module.exports = function (u, cb) {
    var uri = parse(u).protocol ? u : resolve(window.location.href, u);
    
    var stream = new Stream;
    stream.readable = true;
    stream.writable = true;
    
    var ready = false;
    var buffer = [];
    
    var sock = sockjs(uri);
    stream.sock = sock;
    
    stream.write = function (msg) {
        if (!ready || buffer.length) buffer.push(msg)
        else sock.send(msg)
    };
    
    stream.end = function (msg) {
        if (msg !== undefined) stream.write(msg);
        if (!ready) {
            stream._ended = true;
            return;
        }
        stream.writable = false;
        sock.close();
    };
    
    stream.destroy = function () {
        stream._ended = true;
        stream.writable = stream.readable = false;
        buffer.length = 0
        sock.close();
    };
    
    sock.onopen = function () {
        if (typeof cb === 'function') cb();
        ready = true;
        for (var i = 0; i < buffer.length; i++) {
            sock.send(buffer[i]);
        }
        buffer = [];
        stream.emit('connect');
        if (stream._ended) stream.end();
    };
    
    sock.onmessage = function (e) {
        stream.emit('data', e.data);
    };
    
    sock.onclose = function () {
        stream.emit('end');
        stream.writable = false;
        stream.readable = false;
    };
    
    return stream;
};

}).call(this,require("+7ZJp0"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../../../node_modules/shoe/browser.js","/../../../node_modules/shoe")
},{"+7ZJp0":60,"buffer":55,"sockjs-client":75,"stream":66,"url":73}],75:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
/* SockJS client, version 0.3.1.7.ga67f.dirty, http://sockjs.org, MIT License

Copyright (c) 2011-2012 VMware, Inc.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

// JSON2 by Douglas Crockford (minified).
var JSON;JSON||(JSON={}),function(){function str(a,b){var c,d,e,f,g=gap,h,i=b[a];i&&typeof i=="object"&&typeof i.toJSON=="function"&&(i=i.toJSON(a)),typeof rep=="function"&&(i=rep.call(b,a,i));switch(typeof i){case"string":return quote(i);case"number":return isFinite(i)?String(i):"null";case"boolean":case"null":return String(i);case"object":if(!i)return"null";gap+=indent,h=[];if(Object.prototype.toString.apply(i)==="[object Array]"){f=i.length;for(c=0;c<f;c+=1)h[c]=str(c,i)||"null";e=h.length===0?"[]":gap?"[\n"+gap+h.join(",\n"+gap)+"\n"+g+"]":"["+h.join(",")+"]",gap=g;return e}if(rep&&typeof rep=="object"){f=rep.length;for(c=0;c<f;c+=1)typeof rep[c]=="string"&&(d=rep[c],e=str(d,i),e&&h.push(quote(d)+(gap?": ":":")+e))}else for(d in i)Object.prototype.hasOwnProperty.call(i,d)&&(e=str(d,i),e&&h.push(quote(d)+(gap?": ":":")+e));e=h.length===0?"{}":gap?"{\n"+gap+h.join(",\n"+gap)+"\n"+g+"}":"{"+h.join(",")+"}",gap=g;return e}}function quote(a){escapable.lastIndex=0;return escapable.test(a)?'"'+a.replace(escapable,function(a){var b=meta[a];return typeof b=="string"?b:"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4)})+'"':'"'+a+'"'}function f(a){return a<10?"0"+a:a}"use strict",typeof Date.prototype.toJSON!="function"&&(Date.prototype.toJSON=function(a){return isFinite(this.valueOf())?this.getUTCFullYear()+"-"+f(this.getUTCMonth()+1)+"-"+f(this.getUTCDate())+"T"+f(this.getUTCHours())+":"+f(this.getUTCMinutes())+":"+f(this.getUTCSeconds())+"Z":null},String.prototype.toJSON=Number.prototype.toJSON=Boolean.prototype.toJSON=function(a){return this.valueOf()});var cx=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,escapable=/[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,gap,indent,meta={"\b":"\\b","\t":"\\t","\n":"\\n","\f":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"},rep;typeof JSON.stringify!="function"&&(JSON.stringify=function(a,b,c){var d;gap="",indent="";if(typeof c=="number")for(d=0;d<c;d+=1)indent+=" ";else typeof c=="string"&&(indent=c);rep=b;if(!b||typeof b=="function"||typeof b=="object"&&typeof b.length=="number")return str("",{"":a});throw new Error("JSON.stringify")}),typeof JSON.parse!="function"&&(JSON.parse=function(text,reviver){function walk(a,b){var c,d,e=a[b];if(e&&typeof e=="object")for(c in e)Object.prototype.hasOwnProperty.call(e,c)&&(d=walk(e,c),d!==undefined?e[c]=d:delete e[c]);return reviver.call(a,b,e)}var j;text=String(text),cx.lastIndex=0,cx.test(text)&&(text=text.replace(cx,function(a){return"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4)}));if(/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,"@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,"]").replace(/(?:^|:|,)(?:\s*\[)+/g,""))){j=eval("("+text+")");return typeof reviver=="function"?walk({"":j},""):j}throw new SyntaxError("JSON.parse")})}()


//     [*] Including lib/index.js
// Public object
var SockJS = (function(){
              var _document = document;
              var _window = window;
              var utils = {};


//         [*] Including lib/reventtarget.js
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Copyright (c) 2011-2012 VMware, Inc.
 *
 * For the license see COPYING.
 * ***** END LICENSE BLOCK *****
 */

/* Simplified implementation of DOM2 EventTarget.
 *   http://www.w3.org/TR/DOM-Level-2-Events/events.html#Events-EventTarget
 */
var REventTarget = function() {};
REventTarget.prototype.addEventListener = function (eventType, listener) {
    if(!this._listeners) {
         this._listeners = {};
    }
    if(!(eventType in this._listeners)) {
        this._listeners[eventType] = [];
    }
    var arr = this._listeners[eventType];
    if(utils.arrIndexOf(arr, listener) === -1) {
        arr.push(listener);
    }
    return;
};

REventTarget.prototype.removeEventListener = function (eventType, listener) {
    if(!(this._listeners && (eventType in this._listeners))) {
        return;
    }
    var arr = this._listeners[eventType];
    var idx = utils.arrIndexOf(arr, listener);
    if (idx !== -1) {
        if(arr.length > 1) {
            this._listeners[eventType] = arr.slice(0, idx).concat( arr.slice(idx+1) );
        } else {
            delete this._listeners[eventType];
        }
        return;
    }
    return;
};

REventTarget.prototype.dispatchEvent = function (event) {
    var t = event.type;
    var args = Array.prototype.slice.call(arguments, 0);
    if (this['on'+t]) {
        this['on'+t].apply(this, args);
    }
    if (this._listeners && t in this._listeners) {
        for(var i=0; i < this._listeners[t].length; i++) {
            this._listeners[t][i].apply(this, args);
        }
    }
};
//         [*] End of lib/reventtarget.js


//         [*] Including lib/simpleevent.js
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Copyright (c) 2011-2012 VMware, Inc.
 *
 * For the license see COPYING.
 * ***** END LICENSE BLOCK *****
 */

var SimpleEvent = function(type, obj) {
    this.type = type;
    if (typeof obj !== 'undefined') {
        for(var k in obj) {
            if (!obj.hasOwnProperty(k)) continue;
            this[k] = obj[k];
        }
    }
};

SimpleEvent.prototype.toString = function() {
    var r = [];
    for(var k in this) {
        if (!this.hasOwnProperty(k)) continue;
        var v = this[k];
        if (typeof v === 'function') v = '[function]';
        r.push(k + '=' + v);
    }
    return 'SimpleEvent(' + r.join(', ') + ')';
};
//         [*] End of lib/simpleevent.js


//         [*] Including lib/eventemitter.js
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Copyright (c) 2011-2012 VMware, Inc.
 *
 * For the license see COPYING.
 * ***** END LICENSE BLOCK *****
 */

var EventEmitter = function(events) {
    this.events = events || [];
};
EventEmitter.prototype.emit = function(type) {
    var that = this;
    var args = Array.prototype.slice.call(arguments, 1);
    if (!that.nuked && that['on'+type]) {
        that['on'+type].apply(that, args);
    }
    if (utils.arrIndexOf(that.events, type) === -1) {
        utils.log('Event ' + JSON.stringify(type) +
                  ' not listed ' + JSON.stringify(that.events) +
                  ' in ' + that);
    }
};

EventEmitter.prototype.nuke = function(type) {
    var that = this;
    that.nuked = true;
    for(var i=0; i<that.events.length; i++) {
        delete that[that.events[i]];
    }
};
//         [*] End of lib/eventemitter.js


//         [*] Including lib/utils.js
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Copyright (c) 2011-2012 VMware, Inc.
 *
 * For the license see COPYING.
 * ***** END LICENSE BLOCK *****
 */

var random_string_chars = 'abcdefghijklmnopqrstuvwxyz0123456789_';
utils.random_string = function(length, max) {
    max = max || random_string_chars.length;
    var i, ret = [];
    for(i=0; i < length; i++) {
        ret.push( random_string_chars.substr(Math.floor(Math.random() * max),1) );
    }
    return ret.join('');
};
utils.random_number = function(max) {
    return Math.floor(Math.random() * max);
};
utils.random_number_string = function(max) {
    var t = (''+(max - 1)).length;
    var p = Array(t+1).join('0');
    return (p + utils.random_number(max)).slice(-t);
};

// Assuming that url looks like: http://asdasd:111/asd
utils.getOrigin = function(url) {
    url += '/';
    var parts = url.split('/').slice(0, 3);
    return parts.join('/');
};

utils.isSameOriginUrl = function(url_a, url_b) {
    // location.origin would do, but it's not always available.
    if (!url_b) url_b = _window.location.href;

    return (url_a.split('/').slice(0,3).join('/')
                ===
            url_b.split('/').slice(0,3).join('/'));
};

utils.getParentDomain = function(url) {
    // ipv4 ip address
    if (/^[0-9.]*$/.test(url)) return url;
    // ipv6 ip address
    if (/^\[/.test(url)) return url;
    // no dots
    if (!(/[.]/.test(url))) return url;

    var parts = url.split('.').slice(1);
    return parts.join('.');
};

utils.objectExtend = function(dst, src) {
    for(var k in src) {
        if (src.hasOwnProperty(k)) {
            dst[k] = src[k];
        }
    }
    return dst;
};

var WPrefix = '_jp';

utils.polluteGlobalNamespace = function() {
    if (!(WPrefix in _window)) {
        _window[WPrefix] = {};
    }
};

utils.closeFrame = function (code, reason) {
    return 'c'+JSON.stringify([code, reason]);
};

utils.userSetCode = function (code) {
    return code === 1000 || (code >= 3000 && code <= 4999);
};

// See: http://www.erg.abdn.ac.uk/~gerrit/dccp/notes/ccid2/rto_estimator/
// and RFC 2988.
utils.countRTO = function (rtt) {
    var rto;
    if (rtt > 100) {
        rto = 3 * rtt; // rto > 300msec
    } else {
        rto = rtt + 200; // 200msec < rto <= 300msec
    }
    return rto;
}

utils.log = function() {
    if (_window.console && console.log && console.log.apply) {
        console.log.apply(console, arguments);
    }
};

utils.bind = function(fun, that) {
    if (fun.bind) {
        return fun.bind(that);
    } else {
        return function() {
            return fun.apply(that, arguments);
        };
    }
};

utils.flatUrl = function(url) {
    return url.indexOf('?') === -1 && url.indexOf('#') === -1;
};

utils.amendUrl = function(url) {
    var dl = _document.location;
    if (!url) {
        throw new Error('Wrong url for SockJS');
    }
    if (!utils.flatUrl(url)) {
        throw new Error('Only basic urls are supported in SockJS');
    }

    //  '//abc' --> 'http://abc'
    if (url.indexOf('//') === 0) {
        url = dl.protocol + url;
    }
    // '/abc' --> 'http://localhost:80/abc'
    if (url.indexOf('/') === 0) {
        url = dl.protocol + '//' + dl.host + url;
    }
    // strip trailing slashes
    url = url.replace(/[/]+$/,'');
    return url;
};

// IE doesn't support [].indexOf.
utils.arrIndexOf = function(arr, obj){
    for(var i=0; i < arr.length; i++){
        if(arr[i] === obj){
            return i;
        }
    }
    return -1;
};

utils.arrSkip = function(arr, obj) {
    var idx = utils.arrIndexOf(arr, obj);
    if (idx === -1) {
        return arr.slice();
    } else {
        var dst = arr.slice(0, idx);
        return dst.concat(arr.slice(idx+1));
    }
};

// Via: https://gist.github.com/1133122/2121c601c5549155483f50be3da5305e83b8c5df
utils.isArray = Array.isArray || function(value) {
    return {}.toString.call(value).indexOf('Array') >= 0
};

utils.delay = function(t, fun) {
    if(typeof t === 'function') {
        fun = t;
        t = 0;
    }
    return setTimeout(fun, t);
};


// Chars worth escaping, as defined by Douglas Crockford:
//   https://github.com/douglascrockford/JSON-js/blob/47a9882cddeb1e8529e07af9736218075372b8ac/json2.js#L196
var json_escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
    json_lookup = {
"\u0000":"\\u0000","\u0001":"\\u0001","\u0002":"\\u0002","\u0003":"\\u0003",
"\u0004":"\\u0004","\u0005":"\\u0005","\u0006":"\\u0006","\u0007":"\\u0007",
"\b":"\\b","\t":"\\t","\n":"\\n","\u000b":"\\u000b","\f":"\\f","\r":"\\r",
"\u000e":"\\u000e","\u000f":"\\u000f","\u0010":"\\u0010","\u0011":"\\u0011",
"\u0012":"\\u0012","\u0013":"\\u0013","\u0014":"\\u0014","\u0015":"\\u0015",
"\u0016":"\\u0016","\u0017":"\\u0017","\u0018":"\\u0018","\u0019":"\\u0019",
"\u001a":"\\u001a","\u001b":"\\u001b","\u001c":"\\u001c","\u001d":"\\u001d",
"\u001e":"\\u001e","\u001f":"\\u001f","\"":"\\\"","\\":"\\\\",
"\u007f":"\\u007f","\u0080":"\\u0080","\u0081":"\\u0081","\u0082":"\\u0082",
"\u0083":"\\u0083","\u0084":"\\u0084","\u0085":"\\u0085","\u0086":"\\u0086",
"\u0087":"\\u0087","\u0088":"\\u0088","\u0089":"\\u0089","\u008a":"\\u008a",
"\u008b":"\\u008b","\u008c":"\\u008c","\u008d":"\\u008d","\u008e":"\\u008e",
"\u008f":"\\u008f","\u0090":"\\u0090","\u0091":"\\u0091","\u0092":"\\u0092",
"\u0093":"\\u0093","\u0094":"\\u0094","\u0095":"\\u0095","\u0096":"\\u0096",
"\u0097":"\\u0097","\u0098":"\\u0098","\u0099":"\\u0099","\u009a":"\\u009a",
"\u009b":"\\u009b","\u009c":"\\u009c","\u009d":"\\u009d","\u009e":"\\u009e",
"\u009f":"\\u009f","\u00ad":"\\u00ad","\u0600":"\\u0600","\u0601":"\\u0601",
"\u0602":"\\u0602","\u0603":"\\u0603","\u0604":"\\u0604","\u070f":"\\u070f",
"\u17b4":"\\u17b4","\u17b5":"\\u17b5","\u200c":"\\u200c","\u200d":"\\u200d",
"\u200e":"\\u200e","\u200f":"\\u200f","\u2028":"\\u2028","\u2029":"\\u2029",
"\u202a":"\\u202a","\u202b":"\\u202b","\u202c":"\\u202c","\u202d":"\\u202d",
"\u202e":"\\u202e","\u202f":"\\u202f","\u2060":"\\u2060","\u2061":"\\u2061",
"\u2062":"\\u2062","\u2063":"\\u2063","\u2064":"\\u2064","\u2065":"\\u2065",
"\u2066":"\\u2066","\u2067":"\\u2067","\u2068":"\\u2068","\u2069":"\\u2069",
"\u206a":"\\u206a","\u206b":"\\u206b","\u206c":"\\u206c","\u206d":"\\u206d",
"\u206e":"\\u206e","\u206f":"\\u206f","\ufeff":"\\ufeff","\ufff0":"\\ufff0",
"\ufff1":"\\ufff1","\ufff2":"\\ufff2","\ufff3":"\\ufff3","\ufff4":"\\ufff4",
"\ufff5":"\\ufff5","\ufff6":"\\ufff6","\ufff7":"\\ufff7","\ufff8":"\\ufff8",
"\ufff9":"\\ufff9","\ufffa":"\\ufffa","\ufffb":"\\ufffb","\ufffc":"\\ufffc",
"\ufffd":"\\ufffd","\ufffe":"\\ufffe","\uffff":"\\uffff"};

// Some extra characters that Chrome gets wrong, and substitutes with
// something else on the wire.
var extra_escapable = /[\x00-\x1f\ud800-\udfff\ufffe\uffff\u0300-\u0333\u033d-\u0346\u034a-\u034c\u0350-\u0352\u0357-\u0358\u035c-\u0362\u0374\u037e\u0387\u0591-\u05af\u05c4\u0610-\u0617\u0653-\u0654\u0657-\u065b\u065d-\u065e\u06df-\u06e2\u06eb-\u06ec\u0730\u0732-\u0733\u0735-\u0736\u073a\u073d\u073f-\u0741\u0743\u0745\u0747\u07eb-\u07f1\u0951\u0958-\u095f\u09dc-\u09dd\u09df\u0a33\u0a36\u0a59-\u0a5b\u0a5e\u0b5c-\u0b5d\u0e38-\u0e39\u0f43\u0f4d\u0f52\u0f57\u0f5c\u0f69\u0f72-\u0f76\u0f78\u0f80-\u0f83\u0f93\u0f9d\u0fa2\u0fa7\u0fac\u0fb9\u1939-\u193a\u1a17\u1b6b\u1cda-\u1cdb\u1dc0-\u1dcf\u1dfc\u1dfe\u1f71\u1f73\u1f75\u1f77\u1f79\u1f7b\u1f7d\u1fbb\u1fbe\u1fc9\u1fcb\u1fd3\u1fdb\u1fe3\u1feb\u1fee-\u1fef\u1ff9\u1ffb\u1ffd\u2000-\u2001\u20d0-\u20d1\u20d4-\u20d7\u20e7-\u20e9\u2126\u212a-\u212b\u2329-\u232a\u2adc\u302b-\u302c\uaab2-\uaab3\uf900-\ufa0d\ufa10\ufa12\ufa15-\ufa1e\ufa20\ufa22\ufa25-\ufa26\ufa2a-\ufa2d\ufa30-\ufa6d\ufa70-\ufad9\ufb1d\ufb1f\ufb2a-\ufb36\ufb38-\ufb3c\ufb3e\ufb40-\ufb41\ufb43-\ufb44\ufb46-\ufb4e\ufff0-\uffff]/g,
    extra_lookup;

// JSON Quote string. Use native implementation when possible.
var JSONQuote = (JSON && JSON.stringify) || function(string) {
    json_escapable.lastIndex = 0;
    if (json_escapable.test(string)) {
        string = string.replace(json_escapable, function(a) {
            return json_lookup[a];
        });
    }
    return '"' + string + '"';
};

// This may be quite slow, so let's delay until user actually uses bad
// characters.
var unroll_lookup = function(escapable) {
    var i;
    var unrolled = {}
    var c = []
    for(i=0; i<65536; i++) {
        c.push( String.fromCharCode(i) );
    }
    escapable.lastIndex = 0;
    c.join('').replace(escapable, function (a) {
        unrolled[ a ] = '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
        return '';
    });
    escapable.lastIndex = 0;
    return unrolled;
};

// Quote string, also taking care of unicode characters that browsers
// often break. Especially, take care of unicode surrogates:
//    http://en.wikipedia.org/wiki/Mapping_of_Unicode_characters#Surrogates
utils.quote = function(string) {
    var quoted = JSONQuote(string);

    // In most cases this should be very fast and good enough.
    extra_escapable.lastIndex = 0;
    if(!extra_escapable.test(quoted)) {
        return quoted;
    }

    if(!extra_lookup) extra_lookup = unroll_lookup(extra_escapable);

    return quoted.replace(extra_escapable, function(a) {
        return extra_lookup[a];
    });
}

var _all_protocols = ['websocket',
                      'xdr-streaming',
                      'xhr-streaming',
                      'iframe-eventsource',
                      'iframe-htmlfile',
                      'xdr-polling',
                      'xhr-polling',
                      'iframe-xhr-polling',
                      'jsonp-polling'];

utils.probeProtocols = function() {
    var probed = {};
    for(var i=0; i<_all_protocols.length; i++) {
        var protocol = _all_protocols[i];
        // User can have a typo in protocol name.
        probed[protocol] = SockJS[protocol] &&
                           SockJS[protocol].enabled();
    }
    return probed;
};

utils.detectProtocols = function(probed, protocols_whitelist, info) {
    var pe = {},
        protocols = [];
    if (!protocols_whitelist) protocols_whitelist = _all_protocols;
    for(var i=0; i<protocols_whitelist.length; i++) {
        var protocol = protocols_whitelist[i];
        pe[protocol] = probed[protocol];
    }
    var maybe_push = function(protos) {
        var proto = protos.shift();
        if (pe[proto]) {
            protocols.push(proto);
        } else {
            if (protos.length > 0) {
                maybe_push(protos);
            }
        }
    }

    // 1. Websocket
    if (info.websocket !== false) {
        maybe_push(['websocket']);
    }

    // 2. Streaming
    if (pe['xhr-streaming'] && !info.null_origin) {
        protocols.push('xhr-streaming');
    } else {
        if (pe['xdr-streaming'] && !info.cookie_needed && !info.null_origin) {
            protocols.push('xdr-streaming');
        } else {
            maybe_push(['iframe-eventsource',
                        'iframe-htmlfile']);
        }
    }

    // 3. Polling
    if (pe['xhr-polling'] && !info.null_origin) {
        protocols.push('xhr-polling');
    } else {
        if (pe['xdr-polling'] && !info.cookie_needed && !info.null_origin) {
            protocols.push('xdr-polling');
        } else {
            maybe_push(['iframe-xhr-polling',
                        'jsonp-polling']);
        }
    }
    return protocols;
}
//         [*] End of lib/utils.js


//         [*] Including lib/dom.js
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Copyright (c) 2011-2012 VMware, Inc.
 *
 * For the license see COPYING.
 * ***** END LICENSE BLOCK *****
 */

// May be used by htmlfile jsonp and transports.
var MPrefix = '_sockjs_global';
utils.createHook = function() {
    var window_id = 'a' + utils.random_string(8);
    if (!(MPrefix in _window)) {
        var map = {};
        _window[MPrefix] = function(window_id) {
            if (!(window_id in map)) {
                map[window_id] = {
                    id: window_id,
                    del: function() {delete map[window_id];}
                };
            }
            return map[window_id];
        }
    }
    return _window[MPrefix](window_id);
};



utils.attachMessage = function(listener) {
    utils.attachEvent('message', listener);
};
utils.attachEvent = function(event, listener) {
    if (typeof _window.addEventListener !== 'undefined') {
        _window.addEventListener(event, listener, false);
    } else {
        // IE quirks.
        // According to: http://stevesouders.com/misc/test-postmessage.php
        // the message gets delivered only to 'document', not 'window'.
        _document.attachEvent("on" + event, listener);
        // I get 'window' for ie8.
        _window.attachEvent("on" + event, listener);
    }
};

utils.detachMessage = function(listener) {
    utils.detachEvent('message', listener);
};
utils.detachEvent = function(event, listener) {
    if (typeof _window.addEventListener !== 'undefined') {
        _window.removeEventListener(event, listener, false);
    } else {
        _document.detachEvent("on" + event, listener);
        _window.detachEvent("on" + event, listener);
    }
};


var on_unload = {};
// Things registered after beforeunload are to be called immediately.
var after_unload = false;

var trigger_unload_callbacks = function() {
    for(var ref in on_unload) {
        on_unload[ref]();
        delete on_unload[ref];
    };
};

var unload_triggered = function() {
    if(after_unload) return;
    after_unload = true;
    trigger_unload_callbacks();
};

// Onbeforeunload alone is not reliable. We could use only 'unload'
// but it's not working in opera within an iframe. Let's use both.
utils.attachEvent('beforeunload', unload_triggered);
utils.attachEvent('unload', unload_triggered);

utils.unload_add = function(listener) {
    var ref = utils.random_string(8);
    on_unload[ref] = listener;
    if (after_unload) {
        utils.delay(trigger_unload_callbacks);
    }
    return ref;
};
utils.unload_del = function(ref) {
    if (ref in on_unload)
        delete on_unload[ref];
};


utils.createIframe = function (iframe_url, error_callback) {
    var iframe = _document.createElement('iframe');
    var tref, unload_ref;
    var unattach = function() {
        clearTimeout(tref);
        // Explorer had problems with that.
        try {iframe.onload = null;} catch (x) {}
        iframe.onerror = null;
    };
    var cleanup = function() {
        if (iframe) {
            unattach();
            // This timeout makes chrome fire onbeforeunload event
            // within iframe. Without the timeout it goes straight to
            // onunload.
            setTimeout(function() {
                if(iframe) {
                    iframe.parentNode.removeChild(iframe);
                }
                iframe = null;
            }, 0);
            utils.unload_del(unload_ref);
        }
    };
    var onerror = function(r) {
        if (iframe) {
            cleanup();
            error_callback(r);
        }
    };
    var post = function(msg, origin) {
        try {
            // When the iframe is not loaded, IE raises an exception
            // on 'contentWindow'.
            if (iframe && iframe.contentWindow) {
                iframe.contentWindow.postMessage(msg, origin);
            }
        } catch (x) {};
    };

    iframe.src = iframe_url;
    iframe.style.display = 'none';
    iframe.style.position = 'absolute';
    iframe.onerror = function(){onerror('onerror');};
    iframe.onload = function() {
        // `onload` is triggered before scripts on the iframe are
        // executed. Give it few seconds to actually load stuff.
        clearTimeout(tref);
        tref = setTimeout(function(){onerror('onload timeout');}, 2000);
    };
    _document.body.appendChild(iframe);
    tref = setTimeout(function(){onerror('timeout');}, 15000);
    unload_ref = utils.unload_add(cleanup);
    return {
        post: post,
        cleanup: cleanup,
        loaded: unattach
    };
};

utils.createHtmlfile = function (iframe_url, error_callback) {
    var doc = new ActiveXObject('htmlfile');
    var tref, unload_ref;
    var iframe;
    var unattach = function() {
        clearTimeout(tref);
    };
    var cleanup = function() {
        if (doc) {
            unattach();
            utils.unload_del(unload_ref);
            iframe.parentNode.removeChild(iframe);
            iframe = doc = null;
            CollectGarbage();
        }
    };
    var onerror = function(r)  {
        if (doc) {
            cleanup();
            error_callback(r);
        }
    };
    var post = function(msg, origin) {
        try {
            // When the iframe is not loaded, IE raises an exception
            // on 'contentWindow'.
            if (iframe && iframe.contentWindow) {
                iframe.contentWindow.postMessage(msg, origin);
            }
        } catch (x) {};
    };

    doc.open();
    doc.write('<html><s' + 'cript>' +
              'document.domain="' + document.domain + '";' +
              '</s' + 'cript></html>');
    doc.close();
    doc.parentWindow[WPrefix] = _window[WPrefix];
    var c = doc.createElement('div');
    doc.body.appendChild(c);
    iframe = doc.createElement('iframe');
    c.appendChild(iframe);
    iframe.src = iframe_url;
    tref = setTimeout(function(){onerror('timeout');}, 15000);
    unload_ref = utils.unload_add(cleanup);
    return {
        post: post,
        cleanup: cleanup,
        loaded: unattach
    };
};
//         [*] End of lib/dom.js


//         [*] Including lib/dom2.js
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Copyright (c) 2011-2012 VMware, Inc.
 *
 * For the license see COPYING.
 * ***** END LICENSE BLOCK *****
 */

var AbstractXHRObject = function(){};
AbstractXHRObject.prototype = new EventEmitter(['chunk', 'finish']);

AbstractXHRObject.prototype._start = function(method, url, payload, opts) {
    var that = this;

    try {
        that.xhr = new XMLHttpRequest();
    } catch(x) {};

    if (!that.xhr) {
        try {
            that.xhr = new _window.ActiveXObject('Microsoft.XMLHTTP');
        } catch(x) {};
    }
    if (_window.ActiveXObject || _window.XDomainRequest) {
        // IE8 caches even POSTs
        url += ((url.indexOf('?') === -1) ? '?' : '&') + 't='+(+new Date);
    }

    // Explorer tends to keep connection open, even after the
    // tab gets closed: http://bugs.jquery.com/ticket/5280
    that.unload_ref = utils.unload_add(function(){that._cleanup(true);});
    try {
        that.xhr.open(method, url, true);
    } catch(e) {
        // IE raises an exception on wrong port.
        that.emit('finish', 0, '');
        that._cleanup();
        return;
    };

    if (!opts || !opts.no_credentials) {
        // Mozilla docs says https://developer.mozilla.org/en/XMLHttpRequest :
        // "This never affects same-site requests."
        that.xhr.withCredentials = 'true';
    }
    if (opts && opts.headers) {
        for(var key in opts.headers) {
            that.xhr.setRequestHeader(key, opts.headers[key]);
        }
    }

    that.xhr.onreadystatechange = function() {
        if (that.xhr) {
            var x = that.xhr;
            switch (x.readyState) {
            case 3:
                // IE doesn't like peeking into responseText or status
                // on Microsoft.XMLHTTP and readystate=3
                try {
                    var status = x.status;
                    var text = x.responseText;
                } catch (x) {};
                // IE does return readystate == 3 for 404 answers.
                if (text && text.length > 0) {
                    that.emit('chunk', status, text);
                }
                break;
            case 4:
                that.emit('finish', x.status, x.responseText);
                that._cleanup(false);
                break;
            }
        }
    };
    that.xhr.send(payload);
};

AbstractXHRObject.prototype._cleanup = function(abort) {
    var that = this;
    if (!that.xhr) return;
    utils.unload_del(that.unload_ref);

    // IE needs this field to be a function
    that.xhr.onreadystatechange = function(){};

    if (abort) {
        try {
            that.xhr.abort();
        } catch(x) {};
    }
    that.unload_ref = that.xhr = null;
};

AbstractXHRObject.prototype.close = function() {
    var that = this;
    that.nuke();
    that._cleanup(true);
};

var XHRCorsObject = utils.XHRCorsObject = function() {
    var that = this, args = arguments;
    utils.delay(function(){that._start.apply(that, args);});
};
XHRCorsObject.prototype = new AbstractXHRObject();

var XHRLocalObject = utils.XHRLocalObject = function(method, url, payload) {
    var that = this;
    utils.delay(function(){
        that._start(method, url, payload, {
            no_credentials: true
        });
    });
};
XHRLocalObject.prototype = new AbstractXHRObject();



// References:
//   http://ajaxian.com/archives/100-line-ajax-wrapper
//   http://msdn.microsoft.com/en-us/library/cc288060(v=VS.85).aspx
var XDRObject = utils.XDRObject = function(method, url, payload) {
    var that = this;
    utils.delay(function(){that._start(method, url, payload);});
};
XDRObject.prototype = new EventEmitter(['chunk', 'finish']);
XDRObject.prototype._start = function(method, url, payload) {
    var that = this;
    var xdr = new XDomainRequest();
    // IE caches even POSTs
    url += ((url.indexOf('?') === -1) ? '?' : '&') + 't='+(+new Date);

    var onerror = xdr.ontimeout = xdr.onerror = function() {
        that.emit('finish', 0, '');
        that._cleanup(false);
    };
    xdr.onprogress = function() {
        that.emit('chunk', 200, xdr.responseText);
    };
    xdr.onload = function() {
        that.emit('finish', 200, xdr.responseText);
        that._cleanup(false);
    };
    that.xdr = xdr;
    that.unload_ref = utils.unload_add(function(){that._cleanup(true);});
    try {
        // Fails with AccessDenied if port number is bogus
        that.xdr.open(method, url);
        that.xdr.send(payload);
    } catch(x) {
        onerror();
    }
};

XDRObject.prototype._cleanup = function(abort) {
    var that = this;
    if (!that.xdr) return;
    utils.unload_del(that.unload_ref);

    that.xdr.ontimeout = that.xdr.onerror = that.xdr.onprogress =
        that.xdr.onload = null;
    if (abort) {
        try {
            that.xdr.abort();
        } catch(x) {};
    }
    that.unload_ref = that.xdr = null;
};

XDRObject.prototype.close = function() {
    var that = this;
    that.nuke();
    that._cleanup(true);
};

// 1. Is natively via XHR
// 2. Is natively via XDR
// 3. Nope, but postMessage is there so it should work via the Iframe.
// 4. Nope, sorry.
utils.isXHRCorsCapable = function() {
    if (_window.XMLHttpRequest && 'withCredentials' in new XMLHttpRequest()) {
        return 1;
    }
    // XDomainRequest doesn't work if page is served from file://
    if (_window.XDomainRequest && _document.domain) {
        return 2;
    }
    if (IframeTransport.enabled()) {
        return 3;
    }
    return 4;
};
//         [*] End of lib/dom2.js


//         [*] Including lib/sockjs.js
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Copyright (c) 2011-2012 VMware, Inc.
 *
 * For the license see COPYING.
 * ***** END LICENSE BLOCK *****
 */

var SockJS = function(url, dep_protocols_whitelist, options) {
    if (this === window) {
        // makes `new` optional
        return new SockJS(url, dep_protocols_whitelist, options);
    }
    
    var that = this, protocols_whitelist;
    that._options = {devel: false, debug: false, protocols_whitelist: [],
                     info: undefined, rtt: undefined};
    if (options) {
        utils.objectExtend(that._options, options);
    }
    that._base_url = utils.amendUrl(url);
    that._server = that._options.server || utils.random_number_string(1000);
    if (that._options.protocols_whitelist &&
        that._options.protocols_whitelist.length) {
        protocols_whitelist = that._options.protocols_whitelist;
    } else {
        // Deprecated API
        if (typeof dep_protocols_whitelist === 'string' &&
            dep_protocols_whitelist.length > 0) {
            protocols_whitelist = [dep_protocols_whitelist];
        } else if (utils.isArray(dep_protocols_whitelist)) {
            protocols_whitelist = dep_protocols_whitelist
        } else {
            protocols_whitelist = null;
        }
        if (protocols_whitelist) {
            that._debug('Deprecated API: Use "protocols_whitelist" option ' +
                        'instead of supplying protocol list as a second ' +
                        'parameter to SockJS constructor.');
        }
    }
    that._protocols = [];
    that.protocol = null;
    that.readyState = SockJS.CONNECTING;
    that._ir = createInfoReceiver(that._base_url);
    that._ir.onfinish = function(info, rtt) {
        that._ir = null;
        if (info) {
            if (that._options.info) {
                // Override if user supplies the option
                info = utils.objectExtend(info, that._options.info);
            }
            if (that._options.rtt) {
                rtt = that._options.rtt;
            }
            that._applyInfo(info, rtt, protocols_whitelist);
            that._didClose();
        } else {
            that._didClose(1002, 'Can\'t connect to server', true);
        }
    };
};
// Inheritance
SockJS.prototype = new REventTarget();

SockJS.version = "0.3.1.7.ga67f.dirty";

SockJS.CONNECTING = 0;
SockJS.OPEN = 1;
SockJS.CLOSING = 2;
SockJS.CLOSED = 3;

SockJS.prototype._debug = function() {
    if (this._options.debug)
        utils.log.apply(utils, arguments);
};

SockJS.prototype._dispatchOpen = function() {
    var that = this;
    if (that.readyState === SockJS.CONNECTING) {
        if (that._transport_tref) {
            clearTimeout(that._transport_tref);
            that._transport_tref = null;
        }
        that.readyState = SockJS.OPEN;
        that.dispatchEvent(new SimpleEvent("open"));
    } else {
        // The server might have been restarted, and lost track of our
        // connection.
        that._didClose(1006, "Server lost session");
    }
};

SockJS.prototype._dispatchMessage = function(data) {
    var that = this;
    if (that.readyState !== SockJS.OPEN)
            return;
    that.dispatchEvent(new SimpleEvent("message", {data: data}));
};

SockJS.prototype._dispatchHeartbeat = function(data) {
    var that = this;
    if (that.readyState !== SockJS.OPEN)
        return;
    that.dispatchEvent(new SimpleEvent('heartbeat', {}));
};

SockJS.prototype._didClose = function(code, reason, force) {
    var that = this;
    if (that.readyState !== SockJS.CONNECTING &&
        that.readyState !== SockJS.OPEN &&
        that.readyState !== SockJS.CLOSING)
            throw new Error('INVALID_STATE_ERR');
    if (that._ir) {
        that._ir.nuke();
        that._ir = null;
    }

    if (that._transport) {
        that._transport.doCleanup();
        that._transport = null;
    }

    var close_event = new SimpleEvent("close", {
        code: code,
        reason: reason,
        wasClean: utils.userSetCode(code)});

    if (!utils.userSetCode(code) &&
        that.readyState === SockJS.CONNECTING && !force) {
        if (that._try_next_protocol(close_event)) {
            return;
        }
        close_event = new SimpleEvent("close", {code: 2000,
                                                reason: "All transports failed",
                                                wasClean: false,
                                                last_event: close_event});
    }
    that.readyState = SockJS.CLOSED;

    utils.delay(function() {
                   that.dispatchEvent(close_event);
                });
};

SockJS.prototype._didMessage = function(data) {
    var that = this;
    var type = data.slice(0, 1);
    switch(type) {
    case 'o':
        that._dispatchOpen();
        break;
    case 'a':
        var payload = JSON.parse(data.slice(1) || '[]');
        for(var i=0; i < payload.length; i++){
            that._dispatchMessage(payload[i]);
        }
        break;
    case 'm':
        var payload = JSON.parse(data.slice(1) || 'null');
        that._dispatchMessage(payload);
        break;
    case 'c':
        var payload = JSON.parse(data.slice(1) || '[]');
        that._didClose(payload[0], payload[1]);
        break;
    case 'h':
        that._dispatchHeartbeat();
        break;
    }
};

SockJS.prototype._try_next_protocol = function(close_event) {
    var that = this;
    if (that.protocol) {
        that._debug('Closed transport:', that.protocol, ''+close_event);
        that.protocol = null;
    }
    if (that._transport_tref) {
        clearTimeout(that._transport_tref);
        that._transport_tref = null;
    }

    while(1) {
        var protocol = that.protocol = that._protocols.shift();
        if (!protocol) {
            return false;
        }
        // Some protocols require access to `body`, what if were in
        // the `head`?
        if (SockJS[protocol] &&
            SockJS[protocol].need_body === true &&
            (!_document.body ||
             (typeof _document.readyState !== 'undefined'
              && _document.readyState !== 'complete'))) {
            that._protocols.unshift(protocol);
            that.protocol = 'waiting-for-load';
            utils.attachEvent('load', function(){
                that._try_next_protocol();
            });
            return true;
        }

        if (!SockJS[protocol] ||
              !SockJS[protocol].enabled(that._options)) {
            that._debug('Skipping transport:', protocol);
        } else {
            var roundTrips = SockJS[protocol].roundTrips || 1;
            var to = ((that._options.rto || 0) * roundTrips) || 5000;
            that._transport_tref = utils.delay(to, function() {
                if (that.readyState === SockJS.CONNECTING) {
                    // I can't understand how it is possible to run
                    // this timer, when the state is CLOSED, but
                    // apparently in IE everythin is possible.
                    that._didClose(2007, "Transport timeouted");
                }
            });

            var connid = utils.random_string(8);
            var trans_url = that._base_url + '/' + that._server + '/' + connid;
            that._debug('Opening transport:', protocol, ' url:'+trans_url,
                        ' RTO:'+that._options.rto);
            that._transport = new SockJS[protocol](that, trans_url,
                                                   that._base_url);
            return true;
        }
    }
};

SockJS.prototype.close = function(code, reason) {
    var that = this;
    if (code && !utils.userSetCode(code))
        throw new Error("INVALID_ACCESS_ERR");
    if(that.readyState !== SockJS.CONNECTING &&
       that.readyState !== SockJS.OPEN) {
        return false;
    }
    that.readyState = SockJS.CLOSING;
    that._didClose(code || 1000, reason || "Normal closure");
    return true;
};

SockJS.prototype.send = function(data) {
    var that = this;
    if (that.readyState === SockJS.CONNECTING)
        throw new Error('INVALID_STATE_ERR');
    if (that.readyState === SockJS.OPEN) {
        that._transport.doSend(utils.quote('' + data));
    }
    return true;
};

SockJS.prototype._applyInfo = function(info, rtt, protocols_whitelist) {
    var that = this;
    that._options.info = info;
    that._options.rtt = rtt;
    that._options.rto = utils.countRTO(rtt);
    that._options.info.null_origin = !_document.domain;
    var probed = utils.probeProtocols();
    that._protocols = utils.detectProtocols(probed, protocols_whitelist, info);
};
//         [*] End of lib/sockjs.js


//         [*] Including lib/trans-websocket.js
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Copyright (c) 2011-2012 VMware, Inc.
 *
 * For the license see COPYING.
 * ***** END LICENSE BLOCK *****
 */

var WebSocketTransport = SockJS.websocket = function(ri, trans_url) {
    var that = this;
    var url = trans_url + '/websocket';
    if (url.slice(0, 5) === 'https') {
        url = 'wss' + url.slice(5);
    } else {
        url = 'ws' + url.slice(4);
    }
    that.ri = ri;
    that.url = url;
    var Constructor = _window.WebSocket || _window.MozWebSocket;

    that.ws = new Constructor(that.url);
    that.ws.onmessage = function(e) {
        that.ri._didMessage(e.data);
    };
    // Firefox has an interesting bug. If a websocket connection is
    // created after onbeforeunload, it stays alive even when user
    // navigates away from the page. In such situation let's lie -
    // let's not open the ws connection at all. See:
    // https://github.com/sockjs/sockjs-client/issues/28
    // https://bugzilla.mozilla.org/show_bug.cgi?id=696085
    that.unload_ref = utils.unload_add(function(){that.ws.close()});
    that.ws.onclose = function() {
        that.ri._didMessage(utils.closeFrame(1006, "WebSocket connection broken"));
    };
};

WebSocketTransport.prototype.doSend = function(data) {
    this.ws.send('[' + data + ']');
};

WebSocketTransport.prototype.doCleanup = function() {
    var that = this;
    var ws = that.ws;
    if (ws) {
        ws.onmessage = ws.onclose = null;
        ws.close();
        utils.unload_del(that.unload_ref);
        that.unload_ref = that.ri = that.ws = null;
    }
};

WebSocketTransport.enabled = function() {
    return !!(_window.WebSocket || _window.MozWebSocket);
};

// In theory, ws should require 1 round trip. But in chrome, this is
// not very stable over SSL. Most likely a ws connection requires a
// separate SSL connection, in which case 2 round trips are an
// absolute minumum.
WebSocketTransport.roundTrips = 2;
//         [*] End of lib/trans-websocket.js


//         [*] Including lib/trans-sender.js
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Copyright (c) 2011-2012 VMware, Inc.
 *
 * For the license see COPYING.
 * ***** END LICENSE BLOCK *****
 */

var BufferedSender = function() {};
BufferedSender.prototype.send_constructor = function(sender) {
    var that = this;
    that.send_buffer = [];
    that.sender = sender;
};
BufferedSender.prototype.doSend = function(message) {
    var that = this;
    that.send_buffer.push(message);
    if (!that.send_stop) {
        that.send_schedule();
    }
};

// For polling transports in a situation when in the message callback,
// new message is being send. If the sending connection was started
// before receiving one, it is possible to saturate the network and
// timeout due to the lack of receiving socket. To avoid that we delay
// sending messages by some small time, in order to let receiving
// connection be started beforehand. This is only a halfmeasure and
// does not fix the big problem, but it does make the tests go more
// stable on slow networks.
BufferedSender.prototype.send_schedule_wait = function() {
    var that = this;
    var tref;
    that.send_stop = function() {
        that.send_stop = null;
        clearTimeout(tref);
    };
    tref = utils.delay(25, function() {
        that.send_stop = null;
        that.send_schedule();
    });
};

BufferedSender.prototype.send_schedule = function() {
    var that = this;
    if (that.send_buffer.length > 0) {
        var payload = '[' + that.send_buffer.join(',') + ']';
        that.send_stop = that.sender(that.trans_url,
                                     payload,
                                     function() {
                                         that.send_stop = null;
                                         that.send_schedule_wait();
                                     });
        that.send_buffer = [];
    }
};

BufferedSender.prototype.send_destructor = function() {
    var that = this;
    if (that._send_stop) {
        that._send_stop();
    }
    that._send_stop = null;
};

var jsonPGenericSender = function(url, payload, callback) {
    var that = this;

    if (!('_send_form' in that)) {
        var form = that._send_form = _document.createElement('form');
        var area = that._send_area = _document.createElement('textarea');
        area.name = 'd';
        form.style.display = 'none';
        form.style.position = 'absolute';
        form.method = 'POST';
        form.enctype = 'application/x-www-form-urlencoded';
        form.acceptCharset = "UTF-8";
        form.appendChild(area);
        _document.body.appendChild(form);
    }
    var form = that._send_form;
    var area = that._send_area;
    var id = 'a' + utils.random_string(8);
    form.target = id;
    form.action = url + '/jsonp_send?i=' + id;

    var iframe;
    try {
        // ie6 dynamic iframes with target="" support (thanks Chris Lambacher)
        iframe = _document.createElement('<iframe name="'+ id +'">');
    } catch(x) {
        iframe = _document.createElement('iframe');
        iframe.name = id;
    }
    iframe.id = id;
    form.appendChild(iframe);
    iframe.style.display = 'none';

    try {
        area.value = payload;
    } catch(e) {
        utils.log('Your browser is seriously broken. Go home! ' + e.message);
    }
    form.submit();

    var completed = function(e) {
        if (!iframe.onerror) return;
        iframe.onreadystatechange = iframe.onerror = iframe.onload = null;
        // Opera mini doesn't like if we GC iframe
        // immediately, thus this timeout.
        utils.delay(500, function() {
                       iframe.parentNode.removeChild(iframe);
                       iframe = null;
                   });
        area.value = '';
        callback();
    };
    iframe.onerror = iframe.onload = completed;
    iframe.onreadystatechange = function(e) {
        if (iframe.readyState == 'complete') completed();
    };
    return completed;
};

var createAjaxSender = function(AjaxObject) {
    return function(url, payload, callback) {
        var xo = new AjaxObject('POST', url + '/xhr_send', payload);
        xo.onfinish = function(status, text) {
            callback(status);
        };
        return function(abort_reason) {
            callback(0, abort_reason);
        };
    };
};
//         [*] End of lib/trans-sender.js


//         [*] Including lib/trans-jsonp-receiver.js
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Copyright (c) 2011-2012 VMware, Inc.
 *
 * For the license see COPYING.
 * ***** END LICENSE BLOCK *****
 */

// Parts derived from Socket.io:
//    https://github.com/LearnBoost/socket.io/blob/0.6.17/lib/socket.io/transports/jsonp-polling.js
// and jQuery-JSONP:
//    https://code.google.com/p/jquery-jsonp/source/browse/trunk/core/jquery.jsonp.js
var jsonPGenericReceiver = function(url, callback) {
    var tref;
    var script = _document.createElement('script');
    var script2;  // Opera synchronous load trick.
    var close_script = function(frame) {
        if (script2) {
            script2.parentNode.removeChild(script2);
            script2 = null;
        }
        if (script) {
            clearTimeout(tref);
            script.parentNode.removeChild(script);
            script.onreadystatechange = script.onerror =
                script.onload = script.onclick = null;
            script = null;
            callback(frame);
            callback = null;
        }
    };

    // IE9 fires 'error' event after orsc or before, in random order.
    var loaded_okay = false;
    var error_timer = null;

    script.id = 'a' + utils.random_string(8);
    script.src = url;
    script.type = 'text/javascript';
    script.charset = 'UTF-8';
    script.onerror = function(e) {
        if (!error_timer) {
            // Delay firing close_script.
            error_timer = setTimeout(function() {
                if (!loaded_okay) {
                    close_script(utils.closeFrame(
                        1006,
                        "JSONP script loaded abnormally (onerror)"));
                }
            }, 1000);
        }
    };
    script.onload = function(e) {
        close_script(utils.closeFrame(1006, "JSONP script loaded abnormally (onload)"));
    };

    script.onreadystatechange = function(e) {
        if (/loaded|closed/.test(script.readyState)) {
            if (script && script.htmlFor && script.onclick) {
                loaded_okay = true;
                try {
                    // In IE, actually execute the script.
                    script.onclick();
                } catch (x) {}
            }
            if (script) {
                close_script(utils.closeFrame(1006, "JSONP script loaded abnormally (onreadystatechange)"));
            }
        }
    };
    // IE: event/htmlFor/onclick trick.
    // One can't rely on proper order for onreadystatechange. In order to
    // make sure, set a 'htmlFor' and 'event' properties, so that
    // script code will be installed as 'onclick' handler for the
    // script object. Later, onreadystatechange, manually execute this
    // code. FF and Chrome doesn't work with 'event' and 'htmlFor'
    // set. For reference see:
    //   http://jaubourg.net/2010/07/loading-script-as-onclick-handler-of.html
    // Also, read on that about script ordering:
    //   http://wiki.whatwg.org/wiki/Dynamic_Script_Execution_Order
    if (typeof script.async === 'undefined' && _document.attachEvent) {
        // According to mozilla docs, in recent browsers script.async defaults
        // to 'true', so we may use it to detect a good browser:
        // https://developer.mozilla.org/en/HTML/Element/script
        if (!/opera/i.test(navigator.userAgent)) {
            // Naively assume we're in IE
            try {
                script.htmlFor = script.id;
                script.event = "onclick";
            } catch (x) {}
            script.async = true;
        } else {
            // Opera, second sync script hack
            script2 = _document.createElement('script');
            script2.text = "try{var a = document.getElementById('"+script.id+"'); if(a)a.onerror();}catch(x){};";
            script.async = script2.async = false;
        }
    }
    if (typeof script.async !== 'undefined') {
        script.async = true;
    }

    // Fallback mostly for Konqueror - stupid timer, 35 seconds shall be plenty.
    tref = setTimeout(function() {
                          close_script(utils.closeFrame(1006, "JSONP script loaded abnormally (timeout)"));
                      }, 35000);

    var head = _document.getElementsByTagName('head')[0];
    head.insertBefore(script, head.firstChild);
    if (script2) {
        head.insertBefore(script2, head.firstChild);
    }
    return close_script;
};
//         [*] End of lib/trans-jsonp-receiver.js


//         [*] Including lib/trans-jsonp-polling.js
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Copyright (c) 2011-2012 VMware, Inc.
 *
 * For the license see COPYING.
 * ***** END LICENSE BLOCK *****
 */

// The simplest and most robust transport, using the well-know cross
// domain hack - JSONP. This transport is quite inefficient - one
// mssage could use up to one http request. But at least it works almost
// everywhere.
// Known limitations:
//   o you will get a spinning cursor
//   o for Konqueror a dumb timer is needed to detect errors


var JsonPTransport = SockJS['jsonp-polling'] = function(ri, trans_url) {
    utils.polluteGlobalNamespace();
    var that = this;
    that.ri = ri;
    that.trans_url = trans_url;
    that.send_constructor(jsonPGenericSender);
    that._schedule_recv();
};

// Inheritnace
JsonPTransport.prototype = new BufferedSender();

JsonPTransport.prototype._schedule_recv = function() {
    var that = this;
    var callback = function(data) {
        that._recv_stop = null;
        if (data) {
            // no data - heartbeat;
            if (!that._is_closing) {
                that.ri._didMessage(data);
            }
        }
        // The message can be a close message, and change is_closing state.
        if (!that._is_closing) {
            that._schedule_recv();
        }
    };
    that._recv_stop = jsonPReceiverWrapper(that.trans_url + '/jsonp',
                                           jsonPGenericReceiver, callback);
};

JsonPTransport.enabled = function() {
    return true;
};

JsonPTransport.need_body = true;


JsonPTransport.prototype.doCleanup = function() {
    var that = this;
    that._is_closing = true;
    if (that._recv_stop) {
        that._recv_stop();
    }
    that.ri = that._recv_stop = null;
    that.send_destructor();
};


// Abstract away code that handles global namespace pollution.
var jsonPReceiverWrapper = function(url, constructReceiver, user_callback) {
    var id = 'a' + utils.random_string(6);
    var url_id = url + '?c=' + escape(WPrefix + '.' + id);
    // Callback will be called exactly once.
    var callback = function(frame) {
        delete _window[WPrefix][id];
        user_callback(frame);
    };

    var close_script = constructReceiver(url_id, callback);
    _window[WPrefix][id] = close_script;
    var stop = function() {
        if (_window[WPrefix][id]) {
            _window[WPrefix][id](utils.closeFrame(1000, "JSONP user aborted read"));
        }
    };
    return stop;
};
//         [*] End of lib/trans-jsonp-polling.js


//         [*] Including lib/trans-xhr.js
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Copyright (c) 2011-2012 VMware, Inc.
 *
 * For the license see COPYING.
 * ***** END LICENSE BLOCK *****
 */

var AjaxBasedTransport = function() {};
AjaxBasedTransport.prototype = new BufferedSender();

AjaxBasedTransport.prototype.run = function(ri, trans_url,
                                            url_suffix, Receiver, AjaxObject) {
    var that = this;
    that.ri = ri;
    that.trans_url = trans_url;
    that.send_constructor(createAjaxSender(AjaxObject));
    that.poll = new Polling(ri, Receiver,
                            trans_url + url_suffix, AjaxObject);
};

AjaxBasedTransport.prototype.doCleanup = function() {
    var that = this;
    if (that.poll) {
        that.poll.abort();
        that.poll = null;
    }
};

// xhr-streaming
var XhrStreamingTransport = SockJS['xhr-streaming'] = function(ri, trans_url) {
    this.run(ri, trans_url, '/xhr_streaming', XhrReceiver, utils.XHRCorsObject);
};

XhrStreamingTransport.prototype = new AjaxBasedTransport();

XhrStreamingTransport.enabled = function() {
    // Support for CORS Ajax aka Ajax2? Opera 12 claims CORS but
    // doesn't do streaming.
    return (_window.XMLHttpRequest &&
            'withCredentials' in new XMLHttpRequest() &&
            (!/opera/i.test(navigator.userAgent)));
};
XhrStreamingTransport.roundTrips = 2; // preflight, ajax

// Safari gets confused when a streaming ajax request is started
// before onload. This causes the load indicator to spin indefinetely.
XhrStreamingTransport.need_body = true;


// According to:
//   http://stackoverflow.com/questions/1641507/detect-browser-support-for-cross-domain-xmlhttprequests
//   http://hacks.mozilla.org/2009/07/cross-site-xmlhttprequest-with-cors/


// xdr-streaming
var XdrStreamingTransport = SockJS['xdr-streaming'] = function(ri, trans_url) {
    this.run(ri, trans_url, '/xhr_streaming', XhrReceiver, utils.XDRObject);
};

XdrStreamingTransport.prototype = new AjaxBasedTransport();

XdrStreamingTransport.enabled = function() {
    return !!_window.XDomainRequest;
};
XdrStreamingTransport.roundTrips = 2; // preflight, ajax



// xhr-polling
var XhrPollingTransport = SockJS['xhr-polling'] = function(ri, trans_url) {
    this.run(ri, trans_url, '/xhr', XhrReceiver, utils.XHRCorsObject);
};

XhrPollingTransport.prototype = new AjaxBasedTransport();

XhrPollingTransport.enabled = XhrStreamingTransport.enabled;
XhrPollingTransport.roundTrips = 2; // preflight, ajax


// xdr-polling
var XdrPollingTransport = SockJS['xdr-polling'] = function(ri, trans_url) {
    this.run(ri, trans_url, '/xhr', XhrReceiver, utils.XDRObject);
};

XdrPollingTransport.prototype = new AjaxBasedTransport();

XdrPollingTransport.enabled = XdrStreamingTransport.enabled;
XdrPollingTransport.roundTrips = 2; // preflight, ajax
//         [*] End of lib/trans-xhr.js


//         [*] Including lib/trans-iframe.js
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Copyright (c) 2011-2012 VMware, Inc.
 *
 * For the license see COPYING.
 * ***** END LICENSE BLOCK *****
 */

// Few cool transports do work only for same-origin. In order to make
// them working cross-domain we shall use iframe, served form the
// remote domain. New browsers, have capabilities to communicate with
// cross domain iframe, using postMessage(). In IE it was implemented
// from IE 8+, but of course, IE got some details wrong:
//    http://msdn.microsoft.com/en-us/library/cc197015(v=VS.85).aspx
//    http://stevesouders.com/misc/test-postmessage.php

var IframeTransport = function() {};

IframeTransport.prototype.i_constructor = function(ri, trans_url, base_url) {
    var that = this;
    that.ri = ri;
    that.origin = utils.getOrigin(base_url);
    that.base_url = base_url;
    that.trans_url = trans_url;

    var iframe_url = base_url + '/iframe.html';
    if (that.ri._options.devel) {
        iframe_url += '?t=' + (+new Date);
    }
    that.window_id = utils.random_string(8);
    iframe_url += '#' + that.window_id;

    that.iframeObj = utils.createIframe(iframe_url, function(r) {
                                            that.ri._didClose(1006, "Unable to load an iframe (" + r + ")");
                                        });

    that.onmessage_cb = utils.bind(that.onmessage, that);
    utils.attachMessage(that.onmessage_cb);
};

IframeTransport.prototype.doCleanup = function() {
    var that = this;
    if (that.iframeObj) {
        utils.detachMessage(that.onmessage_cb);
        try {
            // When the iframe is not loaded, IE raises an exception
            // on 'contentWindow'.
            if (that.iframeObj.iframe.contentWindow) {
                that.postMessage('c');
            }
        } catch (x) {}
        that.iframeObj.cleanup();
        that.iframeObj = null;
        that.onmessage_cb = that.iframeObj = null;
    }
};

IframeTransport.prototype.onmessage = function(e) {
    var that = this;
    if (e.origin !== that.origin) return;
    var window_id = e.data.slice(0, 8);
    var type = e.data.slice(8, 9);
    var data = e.data.slice(9);

    if (window_id !== that.window_id) return;

    switch(type) {
    case 's':
        that.iframeObj.loaded();
        that.postMessage('s', JSON.stringify([SockJS.version, that.protocol, that.trans_url, that.base_url]));
        break;
    case 't':
        that.ri._didMessage(data);
        break;
    }
};

IframeTransport.prototype.postMessage = function(type, data) {
    var that = this;
    that.iframeObj.post(that.window_id + type + (data || ''), that.origin);
};

IframeTransport.prototype.doSend = function (message) {
    this.postMessage('m', message);
};

IframeTransport.enabled = function() {
    // postMessage misbehaves in konqueror 4.6.5 - the messages are delivered with
    // huge delay, or not at all.
    var konqueror = navigator && navigator.userAgent && navigator.userAgent.indexOf('Konqueror') !== -1;
    return ((typeof _window.postMessage === 'function' ||
            typeof _window.postMessage === 'object') && (!konqueror));
};
//         [*] End of lib/trans-iframe.js


//         [*] Including lib/trans-iframe-within.js
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Copyright (c) 2011-2012 VMware, Inc.
 *
 * For the license see COPYING.
 * ***** END LICENSE BLOCK *****
 */

var curr_window_id;

var postMessage = function (type, data) {
    if(parent !== _window) {
        parent.postMessage(curr_window_id + type + (data || ''), '*');
    } else {
        utils.log("Can't postMessage, no parent window.", type, data);
    }
};

var FacadeJS = function() {};
FacadeJS.prototype._didClose = function (code, reason) {
    postMessage('t', utils.closeFrame(code, reason));
};
FacadeJS.prototype._didMessage = function (frame) {
    postMessage('t', frame);
};
FacadeJS.prototype._doSend = function (data) {
    this._transport.doSend(data);
};
FacadeJS.prototype._doCleanup = function () {
    this._transport.doCleanup();
};

utils.parent_origin = undefined;

SockJS.bootstrap_iframe = function() {
    var facade;
    curr_window_id = _document.location.hash.slice(1);
    var onMessage = function(e) {
        if(e.source !== parent) return;
        if(typeof utils.parent_origin === 'undefined')
            utils.parent_origin = e.origin;
        if (e.origin !== utils.parent_origin) return;

        var window_id = e.data.slice(0, 8);
        var type = e.data.slice(8, 9);
        var data = e.data.slice(9);
        if (window_id !== curr_window_id) return;
        switch(type) {
        case 's':
            var p = JSON.parse(data);
            var version = p[0];
            var protocol = p[1];
            var trans_url = p[2];
            var base_url = p[3];
            if (version !== SockJS.version) {
                utils.log("Incompatibile SockJS! Main site uses:" +
                          " \"" + version + "\", the iframe:" +
                          " \"" + SockJS.version + "\".");
            }
            if (!utils.flatUrl(trans_url) || !utils.flatUrl(base_url)) {
                utils.log("Only basic urls are supported in SockJS");
                return;
            }

            if (!utils.isSameOriginUrl(trans_url) ||
                !utils.isSameOriginUrl(base_url)) {
                utils.log("Can't connect to different domain from within an " +
                          "iframe. (" + JSON.stringify([_window.location.href, trans_url, base_url]) +
                          ")");
                return;
            }
            facade = new FacadeJS();
            facade._transport = new FacadeJS[protocol](facade, trans_url, base_url);
            break;
        case 'm':
            facade._doSend(data);
            break;
        case 'c':
            if (facade)
                facade._doCleanup();
            facade = null;
            break;
        }
    };

    // alert('test ticker');
    // facade = new FacadeJS();
    // facade._transport = new FacadeJS['w-iframe-xhr-polling'](facade, 'http://host.com:9999/ticker/12/basd');

    utils.attachMessage(onMessage);

    // Start
    postMessage('s');
};
//         [*] End of lib/trans-iframe-within.js


//         [*] Including lib/info.js
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Copyright (c) 2011-2012 VMware, Inc.
 *
 * For the license see COPYING.
 * ***** END LICENSE BLOCK *****
 */

var InfoReceiver = function(base_url, AjaxObject) {
    var that = this;
    utils.delay(function(){that.doXhr(base_url, AjaxObject);});
};

InfoReceiver.prototype = new EventEmitter(['finish']);

InfoReceiver.prototype.doXhr = function(base_url, AjaxObject) {
    var that = this;
    var t0 = (new Date()).getTime();
    var xo = new AjaxObject('GET', base_url + '/info');

    var tref = utils.delay(8000,
                           function(){xo.ontimeout();});

    xo.onfinish = function(status, text) {
        clearTimeout(tref);
        tref = null;
        if (status === 200) {
            var rtt = (new Date()).getTime() - t0;
            var info = JSON.parse(text);
            if (typeof info !== 'object') info = {};
            that.emit('finish', info, rtt);
        } else {
            that.emit('finish');
        }
    };
    xo.ontimeout = function() {
        xo.close();
        that.emit('finish');
    };
};

var InfoReceiverIframe = function(base_url) {
    var that = this;
    var go = function() {
        var ifr = new IframeTransport();
        ifr.protocol = 'w-iframe-info-receiver';
        var fun = function(r) {
            if (typeof r === 'string' && r.substr(0,1) === 'm') {
                var d = JSON.parse(r.substr(1));
                var info = d[0], rtt = d[1];
                that.emit('finish', info, rtt);
            } else {
                that.emit('finish');
            }
            ifr.doCleanup();
            ifr = null;
        };
        var mock_ri = {
            _options: {},
            _didClose: fun,
            _didMessage: fun
        };
        ifr.i_constructor(mock_ri, base_url, base_url);
    }
    if(!_document.body) {
        utils.attachEvent('load', go);
    } else {
        go();
    }
};
InfoReceiverIframe.prototype = new EventEmitter(['finish']);


var InfoReceiverFake = function() {
    // It may not be possible to do cross domain AJAX to get the info
    // data, for example for IE7. But we want to run JSONP, so let's
    // fake the response, with rtt=2s (rto=6s).
    var that = this;
    utils.delay(function() {
        that.emit('finish', {}, 2000);
    });
};
InfoReceiverFake.prototype = new EventEmitter(['finish']);

var createInfoReceiver = function(base_url) {
    if (utils.isSameOriginUrl(base_url)) {
        // If, for some reason, we have SockJS locally - there's no
        // need to start up the complex machinery. Just use ajax.
        return new InfoReceiver(base_url, utils.XHRLocalObject);
    }
    switch (utils.isXHRCorsCapable()) {
    case 1:
        return new InfoReceiver(base_url, utils.XHRCorsObject);
    case 2:
        return new InfoReceiver(base_url, utils.XDRObject);
    case 3:
        // Opera
        return new InfoReceiverIframe(base_url);
    default:
        // IE 7
        return new InfoReceiverFake();
    };
};


var WInfoReceiverIframe = FacadeJS['w-iframe-info-receiver'] = function(ri, _trans_url, base_url) {
    var ir = new InfoReceiver(base_url, utils.XHRLocalObject);
    ir.onfinish = function(info, rtt) {
        ri._didMessage('m'+JSON.stringify([info, rtt]));
        ri._didClose();
    }
};
WInfoReceiverIframe.prototype.doCleanup = function() {};
//         [*] End of lib/info.js


//         [*] Including lib/trans-iframe-eventsource.js
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Copyright (c) 2011-2012 VMware, Inc.
 *
 * For the license see COPYING.
 * ***** END LICENSE BLOCK *****
 */

var EventSourceIframeTransport = SockJS['iframe-eventsource'] = function () {
    var that = this;
    that.protocol = 'w-iframe-eventsource';
    that.i_constructor.apply(that, arguments);
};

EventSourceIframeTransport.prototype = new IframeTransport();

EventSourceIframeTransport.enabled = function () {
    return ('EventSource' in _window) && IframeTransport.enabled();
};

EventSourceIframeTransport.need_body = true;
EventSourceIframeTransport.roundTrips = 3; // html, javascript, eventsource


// w-iframe-eventsource
var EventSourceTransport = FacadeJS['w-iframe-eventsource'] = function(ri, trans_url) {
    this.run(ri, trans_url, '/eventsource', EventSourceReceiver, utils.XHRLocalObject);
}
EventSourceTransport.prototype = new AjaxBasedTransport();
//         [*] End of lib/trans-iframe-eventsource.js


//         [*] Including lib/trans-iframe-xhr-polling.js
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Copyright (c) 2011-2012 VMware, Inc.
 *
 * For the license see COPYING.
 * ***** END LICENSE BLOCK *****
 */

var XhrPollingIframeTransport = SockJS['iframe-xhr-polling'] = function () {
    var that = this;
    that.protocol = 'w-iframe-xhr-polling';
    that.i_constructor.apply(that, arguments);
};

XhrPollingIframeTransport.prototype = new IframeTransport();

XhrPollingIframeTransport.enabled = function () {
    return _window.XMLHttpRequest && IframeTransport.enabled();
};

XhrPollingIframeTransport.need_body = true;
XhrPollingIframeTransport.roundTrips = 3; // html, javascript, xhr


// w-iframe-xhr-polling
var XhrPollingITransport = FacadeJS['w-iframe-xhr-polling'] = function(ri, trans_url) {
    this.run(ri, trans_url, '/xhr', XhrReceiver, utils.XHRLocalObject);
};

XhrPollingITransport.prototype = new AjaxBasedTransport();
//         [*] End of lib/trans-iframe-xhr-polling.js


//         [*] Including lib/trans-iframe-htmlfile.js
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Copyright (c) 2011-2012 VMware, Inc.
 *
 * For the license see COPYING.
 * ***** END LICENSE BLOCK *****
 */

// This transport generally works in any browser, but will cause a
// spinning cursor to appear in any browser other than IE.
// We may test this transport in all browsers - why not, but in
// production it should be only run in IE.

var HtmlFileIframeTransport = SockJS['iframe-htmlfile'] = function () {
    var that = this;
    that.protocol = 'w-iframe-htmlfile';
    that.i_constructor.apply(that, arguments);
};

// Inheritance.
HtmlFileIframeTransport.prototype = new IframeTransport();

HtmlFileIframeTransport.enabled = function() {
    return IframeTransport.enabled();
};

HtmlFileIframeTransport.need_body = true;
HtmlFileIframeTransport.roundTrips = 3; // html, javascript, htmlfile


// w-iframe-htmlfile
var HtmlFileTransport = FacadeJS['w-iframe-htmlfile'] = function(ri, trans_url) {
    this.run(ri, trans_url, '/htmlfile', HtmlfileReceiver, utils.XHRLocalObject);
};
HtmlFileTransport.prototype = new AjaxBasedTransport();
//         [*] End of lib/trans-iframe-htmlfile.js


//         [*] Including lib/trans-polling.js
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Copyright (c) 2011-2012 VMware, Inc.
 *
 * For the license see COPYING.
 * ***** END LICENSE BLOCK *****
 */

var Polling = function(ri, Receiver, recv_url, AjaxObject) {
    var that = this;
    that.ri = ri;
    that.Receiver = Receiver;
    that.recv_url = recv_url;
    that.AjaxObject = AjaxObject;
    that._scheduleRecv();
};

Polling.prototype._scheduleRecv = function() {
    var that = this;
    var poll = that.poll = new that.Receiver(that.recv_url, that.AjaxObject);
    var msg_counter = 0;
    poll.onmessage = function(e) {
        msg_counter += 1;
        that.ri._didMessage(e.data);
    };
    poll.onclose = function(e) {
        that.poll = poll = poll.onmessage = poll.onclose = null;
        if (!that.poll_is_closing) {
            if (e.reason === 'permanent') {
                that.ri._didClose(1006, 'Polling error (' + e.reason + ')');
            } else {
                that._scheduleRecv();
            }
        }
    };
};

Polling.prototype.abort = function() {
    var that = this;
    that.poll_is_closing = true;
    if (that.poll) {
        that.poll.abort();
    }
};
//         [*] End of lib/trans-polling.js


//         [*] Including lib/trans-receiver-eventsource.js
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Copyright (c) 2011-2012 VMware, Inc.
 *
 * For the license see COPYING.
 * ***** END LICENSE BLOCK *****
 */

var EventSourceReceiver = function(url) {
    var that = this;
    var es = new EventSource(url);
    es.onmessage = function(e) {
        that.dispatchEvent(new SimpleEvent('message',
                                           {'data': unescape(e.data)}));
    };
    that.es_close = es.onerror = function(e, abort_reason) {
        // ES on reconnection has readyState = 0 or 1.
        // on network error it's CLOSED = 2
        var reason = abort_reason ? 'user' :
            (es.readyState !== 2 ? 'network' : 'permanent');
        that.es_close = es.onmessage = es.onerror = null;
        // EventSource reconnects automatically.
        es.close();
        es = null;
        // Safari and chrome < 15 crash if we close window before
        // waiting for ES cleanup. See:
        //   https://code.google.com/p/chromium/issues/detail?id=89155
        utils.delay(200, function() {
                        that.dispatchEvent(new SimpleEvent('close', {reason: reason}));
                    });
    };
};

EventSourceReceiver.prototype = new REventTarget();

EventSourceReceiver.prototype.abort = function() {
    var that = this;
    if (that.es_close) {
        that.es_close({}, true);
    }
};
//         [*] End of lib/trans-receiver-eventsource.js


//         [*] Including lib/trans-receiver-htmlfile.js
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Copyright (c) 2011-2012 VMware, Inc.
 *
 * For the license see COPYING.
 * ***** END LICENSE BLOCK *****
 */

var _is_ie_htmlfile_capable;
var isIeHtmlfileCapable = function() {
    if (_is_ie_htmlfile_capable === undefined) {
        if ('ActiveXObject' in _window) {
            try {
                _is_ie_htmlfile_capable = !!new ActiveXObject('htmlfile');
            } catch (x) {}
        } else {
            _is_ie_htmlfile_capable = false;
        }
    }
    return _is_ie_htmlfile_capable;
};


var HtmlfileReceiver = function(url) {
    var that = this;
    utils.polluteGlobalNamespace();

    that.id = 'a' + utils.random_string(6, 26);
    url += ((url.indexOf('?') === -1) ? '?' : '&') +
        'c=' + escape(WPrefix + '.' + that.id);

    var constructor = isIeHtmlfileCapable() ?
        utils.createHtmlfile : utils.createIframe;

    var iframeObj;
    _window[WPrefix][that.id] = {
        start: function () {
            iframeObj.loaded();
        },
        message: function (data) {
            that.dispatchEvent(new SimpleEvent('message', {'data': data}));
        },
        stop: function () {
            that.iframe_close({}, 'network');
        }
    };
    that.iframe_close = function(e, abort_reason) {
        iframeObj.cleanup();
        that.iframe_close = iframeObj = null;
        delete _window[WPrefix][that.id];
        that.dispatchEvent(new SimpleEvent('close', {reason: abort_reason}));
    };
    iframeObj = constructor(url, function(e) {
                                that.iframe_close({}, 'permanent');
                            });
};

HtmlfileReceiver.prototype = new REventTarget();

HtmlfileReceiver.prototype.abort = function() {
    var that = this;
    if (that.iframe_close) {
        that.iframe_close({}, 'user');
    }
};
//         [*] End of lib/trans-receiver-htmlfile.js


//         [*] Including lib/trans-receiver-xhr.js
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Copyright (c) 2011-2012 VMware, Inc.
 *
 * For the license see COPYING.
 * ***** END LICENSE BLOCK *****
 */

var XhrReceiver = function(url, AjaxObject) {
    var that = this;
    var buf_pos = 0;

    that.xo = new AjaxObject('POST', url, null);
    that.xo.onchunk = function(status, text) {
        if (status !== 200) return;
        while (1) {
            var buf = text.slice(buf_pos);
            var p = buf.indexOf('\n');
            if (p === -1) break;
            buf_pos += p+1;
            var msg = buf.slice(0, p);
            that.dispatchEvent(new SimpleEvent('message', {data: msg}));
        }
    };
    that.xo.onfinish = function(status, text) {
        that.xo.onchunk(status, text);
        that.xo = null;
        var reason = status === 200 ? 'network' : 'permanent';
        that.dispatchEvent(new SimpleEvent('close', {reason: reason}));
    }
};

XhrReceiver.prototype = new REventTarget();

XhrReceiver.prototype.abort = function() {
    var that = this;
    if (that.xo) {
        that.xo.close();
        that.dispatchEvent(new SimpleEvent('close', {reason: 'user'}));
        that.xo = null;
    }
};
//         [*] End of lib/trans-receiver-xhr.js


//         [*] Including lib/test-hooks.js
/*
 * ***** BEGIN LICENSE BLOCK *****
 * Copyright (c) 2011-2012 VMware, Inc.
 *
 * For the license see COPYING.
 * ***** END LICENSE BLOCK *****
 */

// For testing
SockJS.getUtils = function(){
    return utils;
};

SockJS.getIframeTransport = function(){
    return IframeTransport;
};
//         [*] End of lib/test-hooks.js

                  return SockJS;
          })();
if ('_sockjs_onload' in window) setTimeout(_sockjs_onload, 1);

// AMD compliance
if (typeof define === 'function' && define.amd) {
    define('sockjs', [], function(){return SockJS;});
}

if (typeof module === 'object' && module && module.exports) {
    module.exports = SockJS;
}
//     [*] End of lib/index.js

// [*] End of lib/all.js


}).call(this,require("+7ZJp0"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../../../node_modules/shoe/node_modules/sockjs-client/sockjs.js","/../../../node_modules/shoe/node_modules/sockjs-client")
},{"+7ZJp0":60,"buffer":55}]},{},[15])