var ace = require("brace");
require('brace/mode/javascript');
require('brace/mode/text');
require('brace/mode/json');
require('brace/mode/css');
require('brace/mode/html');
require('brace/mode/sh');
require('../brace/properties.js');
require('brace/theme/twilight');

var messagesExportOverlay = (function() {
    "use strict";

    var closeBtnQueue = [],
        brain = {
            closeButton : function(node) {
                node.addEventListener('click', function () {
                    closeBtnQueue.forEach(function (fc) {
                        fc();
                    });
                })
            },
            codeContent : function (node) {
                this.codeContent.node = node;
            }
        },
        aceFileExtensionMap = {
            // more editors could be found in node_modules: brace/mode
            getMode : function (extension) {
                if (this.hasOwnProperty(extension)) {
                    return this[extension];
                }
                return this.defaultMode;
            },
            js : 'ace/mode/javascript',
            json : 'ace/mode/json',
            css : 'ace/mode/css',
            html : 'ace/mode/html',
            sh : 'ace/mode/sh',
            properties : 'ace/mode/properties', // not optimal but better as nothing
            defaultMode : 'ace/mode/text'
        },
        editor;



	return {
        /**
         * register on close button event
         * @param fc
         */
        onClose : function (fc) {
            closeBtnQueue.push(fc);
        },
		add : function(node, attr) {
            if (brain.hasOwnProperty(attr)) {
                brain[attr](node);
            }
		},
		update: function(data) {

            try {
                brain.codeContent.node.innerHTML = JSON.stringify(data, null, 4);

                if (editor) {
                    // the ace editor has problem with the fast destroy and throws
                    // a "Uncaught TypeError: Cannot read property 'getTokens' of null"
                    // TODO:
                    // 1. fix this by adding own pre and show only the latest
                    // updated pre.
                    // 2. Or find a solution to update the texts only if
                    // all language messages are available.
                    // 3. Or create for each language a separate language tab
                    editor.destroy();
                }

                editor = ace.edit(brain.codeContent.node.getAttribute('id'));

                editor.getSession().setMode(aceFileExtensionMap.getMode('json'));

                editor.setTheme("ace/theme/twilight");
                // currently it's not possible to write
                editor.setReadOnly(true);
            } catch (e) {
                console.warn(e);
            }

			return this;
		}
	}

}());

module.exports = messagesExportOverlay;
