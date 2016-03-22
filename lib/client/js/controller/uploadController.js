/**
 * controller for the image uplaoder view - calls the server to upload a image and notifier the ui event handler
 * @type {{}}
 */
var canny = require('canny'),
    upload = canny.upload,
    uiEvents = require('../uiEventManager.js'),
    uploadId;

uiEvents.addUiEventListener({
    showFileUpload : function (id) {
        uploadId = id;
        canny.layoutManager.showOverlay('uploadView');
    }
});

upload.onUpload(function (file) {
   console.log('uploadController:upload id: file:', uploadId, file); 
});

module.exports = {
        
}