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
        if (xhr.readyState == 4) {
            var data = JSON.parse(xhr.responseText);
            if (xhr.status == 200) {
                // data.name does not exist - and is also not used, is it ?
                uiEvents.callUievent('jsonImported', projectData.projectId, uploadId, data.name)
            } else if (xhr.status === 406) {
                toast.showMessage('Upload failure. There is an error:<br />' + data.msg);
            }
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