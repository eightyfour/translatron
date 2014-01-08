/*global */
/*jslint browser: true */

window.domOpts = window.domOpts || require('dom-opts');

var tabManager = (function () {
    "use strict";

    var nodeToAppend,
        config = {
            idPrefix : 'tabManager_'
        },
        tabSessions = (function () {
            var id = 0,
                session = {},
                nodeIds = {};

            return {
                save : function (nodeId) {
                    var gId = config.idPrefix + id, ret;
                    if (nodeIds.hasOwnProperty(nodeId)) {
                        ret = nodeIds[nodeId];
                    } else {
                        id++;
                        session[gId] = nodeId;
                        nodeIds[nodeId] = gId;
                        ret = gId;
                    }
                    return ret;
                },
                session : session,
                ids : nodeIds
            };
        }()),
        fc = {
            addTabNode : function (name, id) {
                var tab = document.getElementById(id), active, close, ret;
                if (!tab) {
                    tab = window.domOpts.createElement('div', id, 'tab');
                    active = window.domOpts.createElement('div', null, 'activeButton');
                    close = window.domOpts.createElement('div', null, 'closeButton');
                    active.innerText = name;
                    active.setAttribute('title', name);
                    active.domAppendTo(tab);
                    close.domAppendTo(tab);
                    tab.domAppendTo(nodeToAppend);
                    ret = {
                        root : tab,
                        active : active,
                        close : close
                    };
                } else {
                    ret = false;
                }
                return ret;
            },
            removeTabNode : function (node) {
                node.domRemove();
            },
            registerClickEvent : function (node, id, cb) {
                node.addEventListener('click', function () {
                    cb(tabSessions.session[id]);
                });
            },
            activeTab  : function (id) {
                var node = document.getElementById(id),
                    tabs = nodeToAppend.domChildTags('div');
                tabs.forEach(function (e) {
                    e.domRemoveClass('active');
                });
                node.domAddClass('active');
            }
        };

    return {
        canny : {
            id : 'tabManager',
            initDom : function (domRoot) {
                nodeToAppend = domRoot;
                nodeToAppend.setAttribute('id', 'tabManager');
            }
        },
        addTab : function (obj) {
            var tabSessionId = tabSessions.save(obj.id),
                tab = fc.addTabNode(obj.text, tabSessionId);
            if (tab) {
                fc.registerClickEvent(tab.active, tabSessionId, obj.onclick);
                fc.registerClickEvent(tab.close, tabSessionId, obj.onclose);
            }
            fc.activeTab(tabSessionId);
            return tabSessionId;
        },
        removeTab : function (tabSessionId) {
            document.getElementById(tabSessionId).domRemove();
        },
        activeTab : function (tabSessionId) {
            fc.activeTab(tabSessionId);
        },
        showTabBar : function () {
            nodeToAppend.style.display = "";
        },
        hideTabBar : function () {
            nodeToAppend.style.display = "none";
        }
    };
}());

module.exports = tabManager;