/**
 * is for the translation view to add the image upload button and show the images
 */
var rootNode,
    onUploadButton = function () {};

function uploadButton(id) {
    var node = document.createElement('div');
    node.className = 'upload-btn octicon octicon-cloud-upload';
    node.addEventListener('click', function () {
        onUploadButton(id);
    });
    return node;
}
function appendImageUploader(id) {

}

module.exports = {
    onUploadButton : function (fc) {
        onUploadButton = fc;
    },
    add : function (node, attr) {
        node.appendChild(uploadButton(attr))
    },
    appendImage : function (id, image) {
        var dom = document.getElementById(id);
    }
}