var trade = require('../trade'),
	mainNavigation = require('canny').projectMainNavigation,
	initialView = require('canny').initialView,
	dialogView = require('canny').messagesExportDialog,
	selectedProject;

initialView.onProjectSelected(storeProjectName);
mainNavigation.onProjectSelect(storeProjectName);

mainNavigation.onShowAsJSON(function() {
	updateMessageDialog();
	dialogView.show();
});

function storeProjectName(name) {
	if (name !== selectedProject) {
		selectedProject = name;
		updateMessageDialog();
	}
}

function updateMessageDialog() {
	if (!selectedProject) {
		return;
	}

	var jsonBundle = {};
	trade.getPropertiesFiles(selectedProject, function(files) {

		Object.keys(files).map(function(key) {
			var jsonObj = parseToJson(files[key].data);
			jsonBundle[key] = jsonObj;
		});
		dialogView.update(jsonBundle);
	});
}

function parseToJson(data) {
	var javaProps = data.split('\n');
	var jsonMsg = {};

	function processLine(line, index, arr) {
		var lineSplit = line.split('=');
		var keyPath = lineSplit[0].split('_');
		var value = lineSplit[1];

		function java2json(obj, keyPath, value) {
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

		java2json(jsonMsg, keyPath, value);
	}

	javaProps.map(processLine);
	return jsonMsg;
}