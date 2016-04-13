/**
 * is for the translation view to add the image upload button and show the images
 */
var rootNode,
    onUploadButton = function () { console.warn('translationViewImageUpload::onUploadButton() not implemented.'); },
    onDeleteButton = function () { console.warn('translationViewImageUpload::onDeleteButton() not implemented.'); };

function uploadButton(id) {
    var node = document.createElement('div');
    node.className = 'upload-btn octicon octicon-cloud-upload';
    node.addEventListener('click', function () {
        onUploadButton(id);
    });
    node.setAttribute('title', 'upload a image file');
    return node;
}

function deleteButton(id) {
    var node = document.createElement('div');
    node.className = 'delete-btn octicon octicon-trashcan';
    node.addEventListener('click', function () {
        onDeleteButton(id);
    });
    node.setAttribute('title', 'Remove image');
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
    onDeleteButton: function (fc) {
        onDeleteButton = fc;
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
                imgContainer.classList.add('c-show');
                imgContainer.appendChild(getImage('/dist/upload' + projectId + '/' + image));
                imgContainer.appendChild(deleteButton(id));
            }
        }
    }
}