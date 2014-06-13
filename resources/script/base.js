/*global domOpts */
/*jslint browser: true */
var domready = require('domready'),
    shoe = require('shoe'),
    dnode = require('dnode'),
    unicode = require('./unicode.js'),
    toast = require('./Toast.js'),
    canny = require('canny');

require('./cannyExt/nav-controller.js');
require('./cannyExt/menu-builder.js');
canny.add('flowControl', require('canny/mod/flowControl'));

window.canny = canny;
window.domOpts = require('dom-opts');
window.unicode = unicode;
window.toast = toast;


window.base = (function () {
    "use strict";
    var selectors = {
            root : "resourceBundleTable",
            debug : "debugIncomming",
            tpl : {
                tableBody : 'tableBody'
            }
        },
        conf = {
            projectPrefix : "_prj",
            rowPrefix : "_row",
            inputPrefix : "_value",
            inputTransPrefix : "_trans"
        };

    function SaveOnLeave(node, key, bundle, text) {
        var rootKey = key, // use this key for identifier on the server
            textList = [text],
            textIdx = 0;

        node.addEventListener('change', function (e) {
            console.log("Old: " + textList[textIdx]);
            var newValue = this.value;
            if (textList[textIdx] !== newValue) {
                textList.push(newValue);
                textIdx++;
            }
            console.log(textList);
            window.base.con.sendResource(rootKey, bundle, newValue);
        });
    }

    function textAreaKeyPressListener(e) {
        var key = e.keyCode || e.which;
        if (key === 13) {
            e.returnValue = false;
        }
        return true;
    }

    function keyKeyPressListener(e) {
        var key = e.keyCode || e.which;
        if (key === 32) {
            e.returnValue = false;
        }
        return true;
    }

    function validateNewKey(string) {
        return (string.length > 0 && string.search('\\.|,| ') === -1) ? true : false;
    }

    // used on server side to call clients
    var client = {
            id : undefined, // set on server side ,
            broadCast : {fromBundle : null, toBundle : null}, // set it before setup
            updateKey : function (bundleObj, data) {
                var inputPrefix = conf.inputPrefix,
                    message = data,
                    keyNode;
                if (fc.isBundleEqual(bundleObj, window.base.getBundleNameTo())) {
                    inputPrefix = conf.inputTransPrefix;
                }
                keyNode = document.getElementById(message.key + inputPrefix);
                console.log("updateKey: ", message);
                if (!keyNode) {
                    fc.printBundleTemplate([data]);
                } else {
                    keyNode.value = message.value;
                    ui.updateInputFields(message.key, inputPrefix);
                }
            }
        },
        ui = {
            css : {
                sendSuccess : 'sendSuccess',
                updateKey : 'updateKey'
            },
            sendSuccess : function (key, inputPrefix) {
                var node1  = document.getElementById(key),
                    node2  = document.getElementById(key + inputPrefix);
                if (node1) {ui.removeStateClasses(node1).domAddClass(ui.css.sendSuccess); }
                if (node2) {ui.removeStateClasses(node2).domAddClass(ui.css.sendSuccess); }
            },
            updateInputFields : function (key, inputPrefix) {
                var node = document.getElementById(key + inputPrefix);
                if (node) {ui.removeStateClasses(node).domAddClass(ui.css.updateKey); }
            },
            removeStateClasses : function (node) {
                var cssState, classes = '';
                if (!node) {return; }
                // TODO refactor Object.keys()
                for (cssState in ui.css) {
                    classes += cssState + ' ';
                }
                node.domRemoveClass(classes);
                return node;
            }
        },
        error = {
            print : function (msg) {
                var node = document.getElementById('errorPrint');
                if (!node) {
                    node = document.createElement('div');
                    node.setAttribute('id', 'errorPrint');
                    node.style.padding = "20px";
                    node.style.backgroundColor = "#d3d3d3";
                    node.style.border = "2px solid #ff0000";
                    document.body.appendChild(node);
                }
                node.innerHTML = msg;
            }
        },
    // methods needs to be implemented on server side
        con = {
            sendResource : function (key, bundle, value, cb) {
                var inputPrefix = conf.inputPrefix, cb = cb || function () {};
                if (fc.isBundleEqual(bundle, window.base.getBundleNameTo())) {
                    inputPrefix = conf.inputTransPrefix;
                }
                window.base.server.sendResource(client.id, bundle, {key: key, value: value}, function (key) {
                    console.log('send success');
                    ui.sendSuccess(key, inputPrefix);
                    toast.showMessage('Auto save: "' + key + '" (success)');
                    cb(key, inputPrefix);
                });
            },
            sendNewKey : function (key, value) {
                window.base.server.sendNewKey(client.id, {key: key, value: value}, function () {
                    console.log('send success');
                });
            }
        },
        fc = {
            getViewKeyObject : function (obj) {
                var newKey,
                    contextName = null,
                    delemitter = '_';
                if (/\./.test(obj.key)) {
                    delemitter = '.';
                }

                newKey = obj.key.split(delemitter);

                if (newKey.length > 1) {
                    // use slice if we need the complete key in the view
                    contextName = newKey.splice(0, 1);
                }
                return {
                    id : obj.key,
                    contextName : contextName,
                    keyName : newKey.join(delemitter),
                    data : obj.data
                };
            },
            isBundleEqual : function (bundle1, bundle2) {
                if (bundle1.bundle === bundle2.bundle && bundle1.locale === bundle2.locale) {
                    return true;
                }
                return false;
            },
            getBundleNameFrom : function () {

                return {
                    bundle : domOpts.params.bundle || 'messages',
                    locale : this.getFromParam()
                };
            },
            getFromParam : function () {
                return domOpts.params.from || 'de';
            },
            getBundleNameTo : function () {

                return {
                    bundle : domOpts.params.bundle || 'messages',
                    locale : domOpts.params.to || null
                };
            },
            getBundleName : function (locale) {
                var bundle  = domOpts.params.bundle || 'messages';
                return bundle + '_' + locale;
            },
            _addData : function (node, keyObj, isTranslation) {
                var keyInputNode = document.createElement("input"),
                    textNode = document.createElement("textarea"),
                    transTextNode = document.createElement("textarea"),
                    dataNode,
                    keyNode,
                    transNode;

                textNode.addEventListener('keypress', textAreaKeyPressListener);

                keyInputNode.setAttribute('id', keyObj.id);
                keyInputNode.setAttribute('class', 'keyField');
                keyInputNode.setAttribute('readonly', 'true');
                keyInputNode.value =  keyObj.keyName;

                textNode.value =  !isTranslation ? unicode.encode(keyObj.data) : '';
                textNode.setAttribute('id', keyObj.id + conf.inputPrefix);
                textNode.setAttribute('type', 'text');
                textNode.setAttribute('class', 'textField');

                if (domOpts.params.to) {
                    textNode.setAttribute('disabled', 'true');
                }

                transTextNode.value = isTranslation ? unicode.encode(keyObj.data) : '';
                transTextNode.setAttribute('id', keyObj.id + conf.inputTransPrefix);
                transTextNode.setAttribute('type', 'text');
                transTextNode.setAttribute('class', 'textField');

                transTextNode.addEventListener('keypress', textAreaKeyPressListener);

                new SaveOnLeave(textNode, keyObj.id, fc.getBundleNameFrom(), keyObj.data);
                new SaveOnLeave(transTextNode, keyObj.id, fc.getBundleNameTo(), keyObj.data);

                keyNode = document.createElement('div');
                keyNode.setAttribute('class', 'data key');
                keyNode.appendChild(keyInputNode);
                node.appendChild(keyNode);
                dataNode = document.createElement('div');
                dataNode.setAttribute('class', 'data tpl');
                dataNode.appendChild(textNode);

                transNode = document.createElement('div');
                transNode.setAttribute('class', 'data trans');
                transNode.appendChild(transTextNode);

                node.appendChild(dataNode);
                if (domOpts.params.to) {
                    node.appendChild(transNode);
                }
            },
            mergeData : function (data, isTranslation) {
                if (isTranslation) {
                    document.getElementById(data.key + conf.inputTransPrefix).value = unicode.encode(data.data);
                } else {
                    document.getElementById(data.key + conf.inputPrefix).value = unicode.encode(data.data);
                }

            },
            printBundleTemplate : function (args) {
                var node = document.getElementById(selectors.tpl.tableBody),
                    l = args.length,
                    i, tr, row, keyObj, projectNode,
                    getAddNewKeyInputNode = function (category) {
                        var input = document.createElement('input'),
                            label = document.createElement('label'),
                            button = document.createElement('a'),
                            inputInitText = 'Add new key to this category';
                        input.setAttribute('category', category);
                        input.setAttribute('type', 'text');
                        input.setAttribute('placeholder', inputInitText);
                        input.addEventListener('keypress', keyKeyPressListener);
                        label.innerText = category + "_";
                        button.innerText = "add key";
                        button.addEventListener('click', function () {
                            // TODO dot or underscore ?
                            var value = category + '_' + input.value;
                            if (validateNewKey(value)) {
                                window.base.con.sendResource(value, fc.getBundleNameFrom(), '', function () {
                                    button.style.color = '#ffffff';
                                    input.style.backgroundColor = "#ffffff";
                                });
                            } else {
                                button.style.color = '#ff0000';
                                input.style.backgroundColor = "#ff4444";
                            }
                        });
                        return {
                            label : label,
                            input : input,
                            button: button
                        };
                    },
                    /**
                     * Setup header and handle the category
                     * @param node
                     * @param keyObj
                     * @returns {HTMLElement}
                     */
                    prepareCategoryNode = function (node, keyObj) {
                        var categoryNode = document.getElementById(keyObj.contextName ? keyObj.contextName + conf.projectPrefix : conf.projectPrefix),
                            header,
                            rowNode,
                            newKeyInputNode;

                        if (!categoryNode) {
                            categoryNode = document.createElement("div");
                            rowNode = document.createElement("div");
                            rowNode.setAttribute('class', 'addNewKeyrow');
                            categoryNode.setAttribute('id', keyObj.contextName ? keyObj.contextName + conf.projectPrefix : conf.projectPrefix);
                            if (keyObj.contextName) {
                                newKeyInputNode = getAddNewKeyInputNode(keyObj.contextName);
                                header = document.createElement("h2");
                                header.innerText = keyObj.contextName;
                                rowNode.appendChild(newKeyInputNode.label);
                                rowNode.appendChild(newKeyInputNode.input);
                                rowNode.appendChild(newKeyInputNode.button);
                                categoryNode.appendChild(header);
                                categoryNode.appendChild(rowNode);
                            }
                            node.appendChild(categoryNode);
                        }
                        return categoryNode;
                    };


                for (i = 0; i < l; i++) {
                    keyObj =  fc.getViewKeyObject(args[i]);
                    projectNode = prepareCategoryNode(node, keyObj);
                    row = document.getElementById(keyObj.id + conf.rowPrefix);
                    if (row) {
                        fc.mergeData(args[i], false);
                    } else {
                        tr = document.createElement("div");
                        tr.setAttribute('class', 'row');
                        tr.setAttribute('id', keyObj.id + conf.rowPrefix);
                        fc._addData(tr, keyObj, false);
                        projectNode.appendChild(tr);
                    }
                }
            },
            printBundleTranslation : function (args) {
                var node = document.getElementById(selectors.tpl.tableBody),
                    l = args.length,
                    i,
                    row,
                    rowNode;

                for (i = 0; i < l; i++) {
                    row = document.getElementById(args[i].key + conf.rowPrefix);
                    // test if row already exists
                    if (row) {
                        fc.mergeData(args[i], fc.getBundleNameTo().locale !== null);
                    } else {
                        rowNode = document.createElement("div");
                        rowNode.setAttribute('id', args[i] + conf.rowPrefix);
                        rowNode.setAttribute('class', 'row');
                        fc._addData(rowNode, fc.getViewKeyObject(args[i]), true);
                        node.appendChild(rowNode);
                    }
                }
            },
            printCreateNewBundle : function (parentNode, keyObj) {
                var newKeyButton = document.getElementById('addNewKeyButton'),
                    newKeyValue = document.getElementById('newKey').value;


                document.getElementById('newKey').addEventListener('keypress', keyKeyPressListener);
                newKeyButton.addEventListener('click', function () {
                    var newKey = document.getElementById('newKey'),
                        newValue = newKey.value,
                        self = this;

                    if (validateNewKey(newValue)) {
                        window.base.con.sendResource(newValue, fc.getBundleNameFrom(), '', function () {
                            newKey.value = newKeyValue;
                            self.style.color = '#ffffff';
                            newKey.style.backgroundColor = "#ffffff";
                        });
                    } else {
                        self.style.color = '#ff0000';
                        newKey.style.backgroundColor = "#ff4444";
                    }
                });
            },
            con : con,
            server : {},
            client : client,
            ui : ui,
            error : error
        };
    return fc;
}());

var stream = shoe('/dnode');
var d = dnode();


domready(function () {
    "use strict";
    var sortByKey = function (a, b) {
        if (a.key < b.key) {return -1; }
        if (a.key > b.key) {return 1; }
        return 0;
    }
    // set bundle name for only notify clients with same bundle
    base.client.broadCast.fromBundle = base.getBundleNameFrom();
    base.client.broadCast.toBundle  = base.getBundleNameTo();

    d.on('remote', function (server) {
        base.server = server;
        base.server.setupClient(base.client, function (id) {
            base.client.id = id;
        });
        console.log('Connected!', server);
        var bundleFrom = base.getBundleNameFrom(),
            bundleTo = base.getBundleNameTo();
        if (bundleFrom) {
            base.server.getMessageBundle(bundleFrom, function (s) {
                var obj = JSON.parse(s),
                    sorted;
                if (obj) {
                    sorted = obj.data.sort(sortByKey);
                    base.printBundleTemplate(sorted);

                    if (bundleTo) {
                        base.server.getMessageBundle(bundleTo, function (s) {
                            var obj = JSON.parse(s);
                            if (obj) {
                                base.printBundleTranslation(obj.data);
                            }
                            base.printCreateNewBundle();
                        });
                    } else {
                        base.printCreateNewBundle();
                    }
                } else {
                    base.printCreateNewBundle();
                }
            });
        } else {
            console.log('Do nothing?');
        }
    });
    d.pipe(stream).pipe(d);

    console.log('REQUEST PARAMS: ' + domOpts.params);

    // setup title read from URL
    (function () {
        var handleFooterNavigation = function () {

                var footerNav = document.getElementById('fixedNavigation');

                function removeOpen() {
                    footerNav.removeEventListener('mouseover', removeOpen);
                    footerNav.domRemoveClass('open');
                }

                footerNav.addEventListener('mouseover', removeOpen);
                // hide automatical
                setTimeout(removeOpen, 5000);
            },
            setupTitle = function () {
                var titleTextTranslation = document.getElementById('titleTextTranslation');
                titleTextTranslation.style.display = 'none';

                // setup table title
                if (domOpts.params.bundle) {
                    document.getElementById('title').innerText = 'Task name: ' + domOpts.params.bundle;
                }
                document.getElementById('titleText').innerText = 'Text (' + window.base.getFromParam() + ')';
                if (domOpts.params.to) {
                    titleTextTranslation.innerText = 'Text (' + domOpts.params.to + ')';
                    titleTextTranslation.style.display = '';
                }
            },
            handleMissingBundle = function () {
                var bundleName = domOpts.params.bundle;
                if (!bundleName) {
                    do {
                        bundleName = prompt('Enter the translation task number:');
                    } while (!bundleName);
                    location.href = "/?bundle=" + bundleName;
                } else {
                    setupTitle();
                }
            };

        handleMissingBundle();
        handleFooterNavigation();
    }());
});