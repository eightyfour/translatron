/*global */
/*jslint browser: true */
var trade = require('../trade.js'),
    events = require('../events.js'),
    C = require('../../CONST.js'),
    tabManager = require('./tabManager.js'),
    sessionHandler = require('../../sessionHandler.js')('fileEditor_'),
    ace = require("brace");

require('brace/mode/javascript');
require('brace/mode/text');
require('brace/mode/json');
require('brace/mode/css');
require('brace/mode/html');
require('brace/mode/sh');
require('../brace/properties.js');
require('brace/theme/twilight');

/*
 TODO:
 - wrap editor with session div
 -- add 'start edit' button
 --- show save (and close) button (or save permanent)
 */

window.domOpts = window.domOpts || require('dom-opts');

var fileEditor = (function () {
    "use strict";

    var nodeToAppend,
        config = {
            idPrefix : 'fileEditor_'
        },
        findTag = function (root, tag) {
            var tags = [];
            [].slice.call(root.children).forEach(function (e) {
                if (e.tagName.toLowerCase() === tag.toLowerCase()) {
                    tags.push(e);
                }
            });
            return tags;
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
        getExtension = function (filePath) {
            return filePath.slice(filePath.lastIndexOf('.') + 1);
        },
        fc = {
            hideEditors : function () {
                var pres = findTag(nodeToAppend, 'div');
                if (pres.length > 0) {
                    // there are other open editors
                    pres.forEach(function (e) {
                        e.domAddClass('hidden');
                    });
                }
            },
            showInEditor : function (id, obj) {
                var pre, div,
                    editor,
                    editorNodeId = 'ace_' + id,
                    rootNode = document.getElementById(id),
                    showInAceEditor = function () {
                        editor = ace.edit(editorNodeId);

                        editor.getSession().setMode(
                            aceFileExtensionMap.getMode(
                                getExtension(obj.name)));
//                    editor.setTheme('ace/theme/monokai');
                        editor.setTheme("ace/theme/twilight");
//                        editor.setReadOnly(true);
                    },
                    createSaveButton = function () {
                        var button = window.domOpts.createElement('button', null, 'saveButton');
                        button.innerText = "save";
                        button.addEventListener('click', function () {
                            console.log('SAVE CODE ON SERVER!');
                            trade.saveFile(obj.id, editor.getValue(), function (success) {
                                console.log('SAVE COMPLETE STATE:', success);
                            });
                        });
                        return button;
                    };

                if (rootNode !== null) {
                    rootNode.domRemoveClass('hidden');
                } else {
                    div = window.domOpts.createElement('div', id, 'fileEditor');
                    pre = window.domOpts.createElement('pre', editorNodeId, 'aceEditor');
                    if (/!DOCTYPE html/.test(obj.data.slice(0, 20))) {
                        pre.innerHTML = obj.data.
                            replace(/&/g, '&amp;').
                            replace(/"/g, '&quot;').
                            replace(/'/g, '&#39;').
                            replace(/</g, '&lt;').
                            replace(/>/g, '&gt;');
                    } else {
                        pre.innerHTML = obj.data;
                    }
                    pre.domAppendTo(div);
                    createSaveButton().domAppendTo(div);
                    div.domAppendTo(nodeToAppend);

                    showInAceEditor();
                }
                return editor;
            },
            removeEditor : function (id) {
                document.getElementById(id).domRemove();
            }
        };
    /**
     * param:
     *  data,
     *  filePath,
     *  fileType,
     *  name
     */
    events.addServerListener('sendFile', function (obj) {
        var editor, id, editorSessionId, tabSessionId;
        fc.hideEditors();
        if (obj.fileType === C.FILE_MANAGER.FILE_TYPES.FILE) {
            id = config.idPrefix + obj.id;
            editorSessionId = sessionHandler.save({
                id : id,
                editor : null,
                fileProp : obj
            }, id);
            editor = fc.showInEditor(editorSessionId, obj);

            tabSessionId = tabManager.addTab({
                onclick : function () {
                    var session = sessionHandler.session[editorSessionId];
                    fc.hideEditors();
                    fc.showInEditor(editorSessionId);
                    tabManager.activeTab(session.tabSessionId);
                },
                onclose : function () {
                    var session = sessionHandler.session[editorSessionId];
                    fc.removeEditor(editorSessionId);
                    tabManager.removeTab(session.tabSessionId);
                },
                text : obj.name,
                id : id
            });

            // save editor in session
            sessionHandler.session[editorSessionId].editor = editor;
            sessionHandler.session[editorSessionId].tabSessionId = tabSessionId;

            tabManager.showTabBar();
        } else {
            tabManager.hideTabBar();
        }
    });

    return {
        canny : {
            id : 'fileEditor',
            initDom : function (domRoot) {
                nodeToAppend = domRoot;
                nodeToAppend.setAttribute('id', 'fileEditor');
            }
        }
    };
}());

module.exports = fileEditor;