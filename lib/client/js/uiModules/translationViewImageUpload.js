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
function getImage(file) {
    var img = new Image();
    img.src = file;
    img.addEventListener('click', function () {
        var win = window.open(file, '_blank');
        win.focus();
    });
    return img;
}

module.exports = {
    onUploadButton : function (fc) {
        onUploadButton = fc;
    },
    add : function (node, attr) {
        node.appendChild(uploadButton(attr))
    },
    appendImage : function (projectId, id, image) {
        var dom = document.getElementById(id),
            imgContainer;
        if (dom) {
            imgContainer = dom.querySelector('.js-imageUpload-box');
            if (imgContainer) {
                [].slice.call(imgContainer.children).forEach(function (n) {
                    n.remove();
                });
                imgContainer.appendChild(getImage('/dist/upload' + projectId + '/' + image));
            }
        }
    }
}