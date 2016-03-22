/**
 * controller for the image uplaoder view - calls the server to upload a image and notifier the ui event handler
 * @type {{}}
 */
var canny = require('canny'),
    upload = canny.upload,
    uiEvents = require('../uiEventManager.js'),
    uploadId,
    projectId;

/**
 * Call this for each file - will call a call back with the server answer
 * @param file
 */
function sendFile(file, directCallback) {
    var uri = '/uploadFile?projectId=' + projectId.projectId + '&key=' + uploadId + '&project=' + projectId.project,
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
            uiEvents.callUievent('fileUploaded', projectId.projectId, uploadId, data.name)
        }
    };
    fd.append('myFile', file);
    // Initiate a multipart/form-data upload
    xhr.send(fd);
}

uiEvents.addUiEventListener({
    showFileUpload : function (id) {
        uploadId = id;
        canny.layoutManager.showOverlay('uploadView');
    }
});

upload.onUpload(function (file) {
    // TODO additional to the upload id we need the project ID
    console.log('uploadController:upload id: file:', uploadId, file);
    sendFile(file);
});

module.exports = {
    onLoadProject : function (projectData) {
        projectId = projectData;
    }
};