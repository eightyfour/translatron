var trade = require('../trade'),
	mainNavigation = require('canny').projectMainNavigation,
	dialogView = require('canny').messagesExportDialog,
	uiEvents = require('../uiEventManager.js'),
	jsonData = {};

mainNavigation.onProjectSelect(function() {
	dialogView.hide(false);
});

mainNavigation.onShowAsJSON(function() {
	uiEvents.callUievent('showExportDialog');
	dialogView.show();
});

uiEvents.addUiEventListener({
	activateLanguage : function (lang) {
		dialogView.hide(true);
	},
	deActivateLanguage : function (lang) {
		dialogView.hide(true);
	},
	addLanguage : function (lang) {
		dialogView.hide(true);
	}
});

function parseToJSON(obj, keyPath, value) {

	var key;
	var i = 0;
	var lastKeyIndex = keyPath.length - 1;
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

	var result = {};
	data.map(function(obj) {
		var keyPath = obj.key.split('_');
		parseToJSON(result, keyPath, obj.value);
	});
	return result;
}

module.exports = {
	getMessageBundle : function (info) {
		jsonData[info.language] = msgBundle2json(info.data);
		dialogView.update(jsonData);
	}
}

