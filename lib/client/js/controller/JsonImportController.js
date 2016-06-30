var canny = require('canny'),
    JsonImport = canny.JsonImport,
    displayManager = canny.displayManager,
    uiEvents = require('../uiEventManager.js'),
    uploadId,
    projectData;

function sendFile(file) {
    var uri = '/importJSON?projectId=' + projectData.projectId + '&project=' + projectData.project,
        xhr = new XMLHttpRequest(),
        fd = new FormData();

    xhr.open("POST", uri, true);
    xhr.onreadystatechange = function() {
        var data;
        if (xhr.readyState == 4 && xhr.status == 200) {
            data = JSON.parse(xhr.responseText);
            uiEvents.callUievent('jsonImported', projectData.projectId, uploadId, data.name)
        } else if (xhr.readyState == 4 && xhr.status === 406) {
            toast.showMessage('Upload failure. The file language is not supported');
        }
    };
    fd.append('myFile', file);
    xhr.send(fd);
}

function applyProjectData(data) {
    projectData = data;
}

uiEvents.addUiEventListener({
    showJSONImport : function (id) {
        displayManager.show('JSONImportView');
    }
});

JsonImport.onUpload(function (file) {
    sendFile(file);
});

module.exports = {
    onNewProjectCreated : applyProjectData,
    onLoadProject : applyProjectData
};