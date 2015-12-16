var trade = require('../trade'),
	projectMainNavigation = require('canny').projectMainNavigation,
	messagesExportOverlay = require('canny').messagesExportOverlay,
	uiEvents = require('../uiEventManager.js'),
	jsonData = {},
    active = false,
    currentProjectName;

projectMainNavigation.onShowAsJSON(function() {
    if (currentProjectName) {
        active = true;
        uiEvents.callUievent('showExportDialog');
    } else {
        console.log('THERE IS NO SELECTED PROJECT NAME');
    }
});

messagesExportOverlay.onClose(function () {
    active = false;
    console.log('CLOSE OVERLAY');
    canny.layoutManager.hideOverlay('messagesExportOverlay');
});
// TODO refactor the active = false flags and react on a "overlay close" event See: layoutManager.onHideOverlay
uiEvents.addUiEventListener({
    projectSelected : function (projectName) {
        active = false;
    },
	activateLanguage : function (lang) {
        active = false;
	},
	deActivateLanguage : function (lang) {
        active = false;
	},
	addLanguage : function (lang) {
        active = false;
	},
    showExportDialog : function (lang) {
        // fetch fresh data fro server
        if (active && currentProjectName) {
            trade.getJSON(currentProjectName, function (data) {
                console.log('Get project json:', data);
            });
        }
	}
});

function parseToJSON(obj, keyPath, value) {

	var key,
        i = 0,
        lastKeyIndex = keyPath.length - 1;

	for (i; i < lastKeyIndex; i++) {
		key = keyPath[i];
		if (!obj.hasOwnProperty(key)) {
			obj[key] = {}
		}
		obj = obj[key];
	}
	obj[keyPath[lastKeyIndex]] = value;
}

function msgBundle2json(data) {

	var result = {}, keyPath;
	data.map(function(obj) {
		keyPath = obj.key.split('_');
		parseToJSON(result, keyPath, obj.value);
	});
	return result;
}

module.exports = {
    getJSON : function (newProjectConfig) {
        if (newProjectConfig.hasOwnProperty('project')) {
            // project specific config
            currentProjectName = newProjectConfig.project;
        }
    },
	getMessageBundle : function (info) {
        if (active) {
            jsonData[info.language] = msgBundle2json(info.data);
            messagesExportOverlay.update(jsonData);
        }
	}
}

