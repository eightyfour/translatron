/**
 * controller for the image uplaoder view - calls the server to upload a image and notifier the ui event handler
 * @type {{}}
 */
var canny = require('canny'),
    JMBFUploader = canny.JMBFUploader,
    displayManager = canny.displayManager,
    uiEvents = require('../uiEventManager.js'),
    uploadId,
    projectInfo;
/**
 * Call this for each file - will call a call back with the server answer
 * @param file
 */
function sendFile(file, directCallback) {
    var uri = '/uploadJMBFFile?projectId=' + projectInfo.id + '&project=' + projectInfo.name,
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
            uiEvents.callUievent('JMBFFileUploaded', projectInfo.id, uploadId, data.name)
        } else if (xhr.readyState == 4 && xhr.status === 406) {
            toast.showMessage('Upload failure. The file language is not supported');
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
function applyProjectData(data, project) {
    projectInfo = project
}

uiEvents.addUiEventListener({
    showJMBFUploader : function (id) {
        displayManager.show('JMBFUploaderView');
    }
});

JMBFUploader.onUpload(function (file) {
    // TODO additional to the upload id we need the project ID
    console.log('uploadController:upload id: file:', uploadId, file);
    sendFile(file);
});

module.exports = {
    onNewProjectCreated : applyProjectData,
    onLoadProject : applyProjectData
};