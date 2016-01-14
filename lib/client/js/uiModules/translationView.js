
var flag = require('./flag.js'),
    inputEditManager = require('./inputEditManager.js'),
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

    function removeEventListenersFromRow(rowNode) {
        [].slice.call(rowNode.querySelectorAll('textarea')).forEach(function (tarea) {
            tarea.removeEventListener('change', false);
            tarea.setAttribute('readonly', 'true');
        });

        [].slice.call(rowNode.querySelectorAll('input')).forEach(function (input) {
            input.removeEventListener('keypress', false);
            input.setAttribute('readonly', 'true');
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
            createNewProject : [],
            removeKey : [],
            renameKey : []
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
        // methods needs to be implemented on controller side
        con = {
            // send resource method - implementation on controller side
            sendResource : function (key, lang, value) {}
        },
        brain = {
            createNewProjectInputProject : {
                init : function (node) {
                    this.node = node;
                }
            },
            createNewProjectProjectDescription : {
                init : function (node) {
                    this.node = node;
                }
            },
            createNewProjectSubmit : (function () {
                var node;
                return {
                    init : function (elem) {
                        node = elem;
                        node.addEventListener('click', function () {
                            var projectValue = brain.createNewProjectInputProject.node.value;

                            if (validateNewKey(projectValue)) {
                                // TODO read description field
                                onQueues.createNewProject.forEach(function (fc) {
                                    fc(projectValue, {
                                        description : brain.createNewProjectProjectDescription.node.value
                                    });
                                });
                                // TODO check if closed is needed?
                                canny.layoutManager.hideOverlay('createNewProjectView');
                            } else {
                                // TODO replace with classes
                                brain.createNewProjectInputProject.node.style.backgroundColor = '#ff4444';
                            }
                        });
                    }
                }
            }()),
            projectShow : {
                init : function (node) {
                    node.addEventListener('click', function () {
                        canny.layoutManager.showOverlay('translationViewProjectCategoryKey');
                    });
                }
            },
            projectInputCategory : {
                init : function (node) {
                    this.node = node;
                }
            },
            projectInputKey : {
                init : function (node) {
                    this.node = node;
                }
            },
            projectSubmit : (function () {
                var node;
                return {
                    init : function (elem) {
                        node = elem;
                        node.addEventListener('click', function () {
                            console.log('CREATE NEW CATEGORY KEY');
                            var categoryKey = brain.projectInputCategory.node.value,
                                key = brain.projectInputKey.node.value,
                                newKey;

                            if (validateNewKey(categoryKey) && validateNewKey(key)) {
                                // TODO default language
                                newKey = categoryKey + '_' + key;
                                con.sendResource(newKey);
                            } else {
                                // TODO replace with classes
                                brain.projectInputCategory.node.style.backgroundColor = '#ff4444';
                                brain.projectInputKey.node.style.backgroundColor = '#ff4444';
                            }
                        });
                    }
                }
            }())
        },
        fc = {
            sendSuccess : ui.sendSuccess,
            setupEvents : function (events) {
                con = events;
            },
            add : function (node, attr) {
                if (attr === 'main') {
                    rootNode = node;
                } else if (brain.hasOwnProperty(attr)) {
                    brain[attr].init(node);
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
                            button = document.createElement('button'),
                            inputInitText = 'Add new key to this category';
                        input.setAttribute('category', category);
                        input.setAttribute('type', 'text');
                        input.setAttribute('placeholder', inputInitText);
                        input.addEventListener('keypress', keyKeyPressListener);
                        label.innerText = category + "_";
                        button.className = 'button addKeyButton octicon octicon-key';

                        button.addEventListener('click', function () {
                            // TODO dot or underscore ?
                            var newKey = category + '_' + input.value;
                            if (validateNewKey(input.value)) {
                                // TODO refactor this - server should add the key for all available languages - or pass default lang
                                con.sendResource(newKey, actualLanguage);
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
                                header.className = "icon octicon octicon-tag";
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
             * @param node
             * @param data
             */
            addKeyField : function (node, data) {
                var keyInputNode = document.getElementById(data.key + conf.inputPrefix),
                    keyNode;
                if (!keyInputNode) {
                    keyInputNode = domOpts.createElement('input', data.key + conf.inputPrefix, 'keyField');
                    keyNode = domOpts.createElement('div', null, 'data key octicon octicon-key');
                    keyInputNode.setAttribute('disabled', 'true');
                    inputEditManager.addEditorPanel(keyNode, {
                        onDelete : function () {
                            var yes = window.confirm('Delete this key?\nThis key with all translations will removed.');
                            if (yes) {
                                onQueues.removeKey.forEach(function (fc) {
                                    fc({
                                        key: data.key
                                    });
                                });
                            }
                        },
                        onEdit : function () {
                            keyInputNode.removeAttribute('disabled');
                            // save actual key for restoring if cancel
                            data.keyName = keyInputNode.value;
                            // get the key: take id attribute and remove the value from it
                            data.key = keyInputNode.getAttribute('id').replace(conf.inputPrefix, '');
                            keyInputNode.focus();
                        },
                        onCancel : function () {
                            keyInputNode.setAttribute('disabled', 'true');
                            keyInputNode.value = data.keyName;
                        },
                        onSave : function () {
                            console.log('translationView:addKeyField save new key');
                            var value = data.contextName ? data.contextName + '_' + keyInputNode.value : keyInputNode.value;
                            if (keyInputNode.value != '' && value != data.key) {
                                onQueues.renameKey.forEach(function (fc) {
                                    fc({
                                        newKey: value,
                                        oldKey: data.key
                                    });
                                });
                            }
                        }
                    });
                    // register the input key listener to capture wrong character
                    keyInputNode.addEventListener('keypress', keyKeyPressListener);

                    keyNode.appendChild(keyInputNode);
                    node.appendChild(keyNode);
                    keyInputNode.value =  data.keyName;
                }
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

                if (value || value === ''){
                    textNode.value = value? unicode.encode(value) : '';
                }

            },
            /**
             * creates a row
             * @param key
             */
            getRow : function (node, key) {
                // try to get the row
                var row = document.getElementById(key + conf.rowPrefix);
                // if there is a row but it is marked as removed than removed it
                if (row && row.classList.contains('c-removed')) {
                    row.domRemove();
                    row = undefined;
                }
                // create a row if the row is not exists
                if (!row) {
                    row = domOpts.createElement('div', key + conf.rowPrefix, 'row');
                    node.appendChild(row);
                }
                return row;
            },
            addRowWithLanguages : function (node, data, actualLanguage, allProjectLanguages) {
                var row = fc.getRow(node, data.key);

                fc.addKeyField(row, data);

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
            /**
             * show a key as deleted
             * @param key
             */
            markKeyAsRemoved : function (key) {
                var row = document.getElementById(key + conf.rowPrefix),
                    removeIc;
                if (row && !row.classList.contains('c-removed')) {
                    row.classList.add('c-removed');
                    removeIc = domOpts.createElement('div', null, 'remove-button octicon octicon-x');
                    removeIc.addEventListener('click', function () {
                        row.domRemove();
                    });
                    removeIc.domAppendTo(row);
                    removeEventListenersFromRow(row);
                    inputEditManager.removePanel(row);
                }
            },
            /**
             * remove a key
             */
            removeKey : function (key) {
                var row = document.getElementById(key + conf.rowPrefix);
                if (row) {
                    row.domRemove();
                }
            },
            /**
             * rename a key
             *
             * @param oldKey
             * @param newKey
             */
            renameKey : function (oldKey, newKey) {
                var keyInputNode = document.getElementById(oldKey + conf.inputPrefix),
                    keyName;
                if (keyInputNode) {
                    keyName = fc.getViewKeyObject({key: newKey}).keyName;
                    keyInputNode.setAttribute('id', newKey + conf.inputPrefix);
                    keyInputNode.value = keyName;
                    // close the edit view
                    inputEditManager.closeEditView(keyInputNode);
                    // disabled the input field
                    keyInputNode.setAttribute('disabled', 'true');
                }
            },
            hideLang : function (lang) {
                rootNode.classList.add('c-hide_' + lang);
            },
            onCreateNewProject : function (cb) {
                onQueues.createNewProject.push(cb);
            },
            onAddNewKey : function (cb) {
               onQueues.addNewKey.push(cb);
            },
            onRenameKey : function (cb) {
                onQueues.renameKey.push(cb);
            },
            onRemoveKey : function (cb) {
                onQueues.removeKey.push(cb);
            }
        };
    return fc;
}());

module.exports = translationView;