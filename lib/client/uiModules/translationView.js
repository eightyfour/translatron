
var flag = require('./flag.js'),
    conf = {
        projectPrefix : "_prj",
        rowPrefix : "_row",
        inputPrefix : "_value",
        inputTransPrefix : "_trans"
    };


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

function getLanguageTextId(key, lang) {
    return [key,lang,conf.inputTransPrefix].join('_');
}
/**
 * handle the translation overview
 * TODO refactor base.connection
 */
var translationView = (function () {
    "use strict";

    // TODO remove project name - only the controller needs to know this
    function SaveOnLeave(node, key, lang, text) {
        var textList = [text],
            textIdx = 0;

        node.addEventListener('change', function (e) {
            console.log("Old: " + textList[textIdx]);
            var newValue = this.value;
            if (textList[textIdx] !== newValue) {
                textList.push(newValue);
                textIdx++;
            }
            console.log(textList);
            con.sendResource(key, lang, newValue);
        });
    }

    var rootNode, // main node all content are added to here
        selectors = {
            root : "resourceBundleTable",
            debug : "debugIncomming",
            tpl : {
                tableBody : 'tableBody'
            }
        },
        onQueues = {
            addNewKey : [],
            addSaveValue : []
        };

    var ui = {
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
            // TODO move this to controller
            sendResource : function (key, lang, value, cb) {
                var inputPrefix = conf.inputPrefix, callback = cb || function () {};

                function sendResourceCallback(key) {
                    ui.sendSuccess(key, inputPrefix);
                    toast.showMessage('Auto save: "' + key + '" (success)');
                    callback(key, inputPrefix);
                }

                if (fc.isBundleEqual(lang, fc.getBundleNameTo())) {
                    inputPrefix = conf.inputTransPrefix;
                }

                console.log('sendResource:', [lang, {key: key, value: value}]);

                onQueues.addSaveValue.forEach(function (fc) {
                    fc(lang, key, value, sendResourceCallback);
                });
            }
        },
        fc = {
            add : function (node, attr) {
                if (attr === 'main') {
                    rootNode = node;
                }
            },
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
                    id : obj.key,  // deprecated
                    key : obj.key,
                    contextName : contextName,
                    keyName : newKey.join(delemitter),
                    value : obj.value
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
            /**
             *
             * @param bundles {key: string, data: string}
             * @param actualLanguage
             * @param availableProjectLanguages
             * @param projectName
             */
            printBundleTemplate : function (bundles, actualLanguage, availableProjectLanguages) {
                var keyObj,
                    projectNode,
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
                            if (validateNewKey(input.value)) {
                                // TODO refactor this - server should add the key for all available languages - or pass default lang
                                con.sendResource(value, actualLanguage, '', function () {
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
                                // <span class="icon octicon octicon-key"></span>
                                header.className = "icon octicon octicon-key";
                                header.innerText = keyObj.contextName;
                                rowNode.appendChild(newKeyInputNode.label);
                                rowNode.appendChild(newKeyInputNode.input);
                                rowNode.appendChild(newKeyInputNode.button);
                                categoryNode.appendChild(header);
                                categoryNode.appendChild(rowNode);
                            }
                            rootNode.appendChild(categoryNode);
                        }
                        return categoryNode;
                    };

                bundles.forEach(function (data) {
                    keyObj =  fc.getViewKeyObject(data);
                    projectNode = prepareCategoryNode(rootNode, keyObj);
                    fc.addRowWithLanguages(projectNode, keyObj, actualLanguage, availableProjectLanguages);
                });

            },
            /**
             * creates a key field
             *
             * @param key
             */
            addKeyField : function (node, key, keyName) {
                var keyInputNode = document.getElementById(key + conf.inputPrefix),
                    keyNode;
                if (!keyInputNode) {
                    keyInputNode = domOpts.createElement('input', key + conf.inputPrefix, 'keyField');
                    keyNode = domOpts.createElement('div', null, 'data key');
                    keyInputNode.setAttribute('readonly', 'true');
                    keyNode.appendChild(keyInputNode);
                    node.appendChild(keyNode);
                }

                keyInputNode.value =  keyName;
            },
            /**
             * creates a languages field
             *
             * @param key
             * @param lang
             */
            addLanguageField : function (node, key, value, lang) {

                var textNode = document.getElementById(getLanguageTextId(key, lang)),
                    dataNode;

                if (!textNode) {
                    textNode = domOpts.createElement('textarea', getLanguageTextId(key, lang), 'textField');
//                    textNode.addEventListener('', function () {
//
//                    })

//                    flag.getFlagClasses(lang).forEach(function (className) {
//                        textNode.classList.add(className);
//                    });

                    dataNode = domOpts.createElement('div', null, 'data tpl js_' + lang);

                    textNode.addEventListener('keypress', textAreaKeyPressListener);

                    textNode.setAttribute('type', 'text');

                    new SaveOnLeave(textNode, key, lang, value);

                    dataNode.appendChild(textNode);
                    dataNode.appendChild(flag.getFlag(lang));

                    node.appendChild(dataNode);
                }

                if (value){
                    textNode.value = unicode.encode(value);
                }

            },
            /**
             * creates a row
             * @param key
             */
            getRow : function (node, key) {
                var row = document.getElementById(key + conf.rowPrefix);
                if (!row) {
                    row = domOpts.createElement('div', key + conf.rowPrefix, 'row');
                    node.appendChild(row);
                }
                return row;
            },
            addRowWithLanguages : function (node, data, actualLanguage, allProjectLanguages) {
                var row = fc.getRow(node, data.key);

                fc.addKeyField(row, data.key, data.keyName);

                allProjectLanguages.forEach(function (lang) {
                    fc.addLanguageField(row, data.key, actualLanguage === lang ? data.value : null, lang);
                });
            },
            addLanguage : function (keys, lang) {
                var row;
                keys.forEach(function (key) {
                    row = document.getElementById(key + conf.rowPrefix);
                    if (row) {
                        fc.addLanguageField(row, key, null, lang);
                    } else {
                        console.log('translationView:addLanguage found key which is not available in view:', key);
                    }
                });
            },
            clearView : function () {
                // just reset all for now
                // TODO do it better ;)
                [].slice.call(rootNode.children).forEach(function (child) {
                    rootNode.removeChild(child);
                });
            },
            showLang : function (lang) {
                // show the lang tab
                rootNode.classList.remove('c-hide_' + lang);
            },
            hideLang : function (lang) {
                rootNode.classList.add('c-hide_' + lang);
            },
            /**
             * TODO not in use
             *
             * @param parentNode
             * @param keyObj
             */
            printCreateNewBundle : function (projectName, defaultLanguage) {
                var newKeyButton = document.getElementById('addNewKeyButton'),
                    newKeyValue = document.getElementById('newKey').value;


                document.getElementById('newKey').addEventListener('keypress', keyKeyPressListener);
                newKeyButton.addEventListener('click', function () {
                    var newKey = document.getElementById('newKey'),
                        newValue = newKey.value,
                        self = this;

                    if (validateNewKey(newValue)) {
                        con.sendResource(newValue, defaultLanguage, '', function () {
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
            onAddNewKey : function (cb) {
               onQueues.addNewKey.push(cb);
            },
            onSaveValue : function (cb) {
                onQueues.addSaveValue.push(cb);
            }
        };
    return fc;
}());

module.exports = translationView;