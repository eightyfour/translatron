/**
 * controller for the image uplaoder view - calls the server to upload a image and notifier the ui event handler
 * @type {{}}
 */
var canny = require('canny'),
    upload = canny.upload,
    uiEvents = require('../uiEventManager.js'),
    uploadId;

/**
 * Call this for each file - will call a call back with the server answer
 * @param file
 */
function sendFile(file, id, directCallback) {
    var uri = "/uploadFile?projectId=" + id,
        xhr = new XMLHttpRequest(),
        fd = new FormData();

    xhr.open("POST", uri, true);
    xhr.onreadystatechange = function() {
        var data;
        if (xhr.readyState == 4 && xhr.status == 200) {
            // Handle response.
            data = JSON.parse(xhr.responseText);
            directCallback && directCallback(data); // handle response.
            console.log(events.fileSend, data);
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
    sendFile(file, uploadId)
});

module.exports = {
        
}