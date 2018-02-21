/*global ace */
/*jslint browser: true */
const events = require('../events.js')
const C = require('../CONST.js')

window.domOpts = window.domOpts || require('dom-opts');

var imageViewer = (function () {
    "use strict";

    var nodeToAppend,
        init = false,
        config = {
            idPrefix : 'imageViewer_'
        },
        setupContainerCSS = function (node, css) {
            for (var prop in css) {
                node.style[prop] =  css[prop];
            }
        },
        settings = {
            maxWidth : 300,
            maxHeight: 300
        },
        fc = {
            hideImageViewer : function () {
                var pres = nodeToAppend.domChildTags('img');

                if (pres.length > 0) {
                    // there are other open images
                    pres.forEach(function (e) {
                        e.domAddClass('hidden');
                    });
                }
            },
            showImage : function (obj) {
                var img, id = config.idPrefix + obj.id,
                    actualImg = document.getElementById(id);

                if (actualImg !== null) {
                    actualImg.domRemoveClass('hidden');
                } else {
                    img = new Image();
                    img.onload = function () {
                        console.log('DONE IMAGE');
                    };
                    img.src =  "data:image/png;base64," + obj.data;
                    setupContainerCSS(img, {
                        maxWidth : '100%',
                        maxHeight : '100%'
                    });
                    img.setAttribute('id', id);
                    img.domAppendTo(nodeToAppend);
                }
            }
        };

        events.addServerListener('sendFile', function (obj) {
            if (init) {
                fc.hideImageViewer();

                if (obj.fileType === C.FILE_MANAGER.FILE_TYPES.IMAGE) {
                    fc.showImage(obj);
                }
            }
        });


    return {
        add : function (node, attr) {
            init = true;
            nodeToAppend = node;
            nodeToAppend.setAttribute('id', 'imageViewer');

            setupContainerCSS(nodeToAppend, {
                width : settings.maxWidth + 'px',
                height: settings.maxHeight + 'px'
            });
        },
        setup : function (config) {
            var obj;
            for (obj in config) {
                settings[obj] = config[obj];
            }
        }
    };
}());

module.exports = imageViewer;