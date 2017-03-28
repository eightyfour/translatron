/*jslint browser: true */
/**
 * handle the connection between server and client
 */
var canny = require('canny'),
    events = require('./events.js'),
    shoe = require('shoe'),
    dnode = require('dnode'),
    stream = shoe('/trade'),
    d = dnode();

window.domOpts = window.domOpts || require('dom-opts');

function addKeyPrefix(key) {
    return 'cat_' + key;
}
function removeKeyPrefix(key) {
    return key.replace('cat_', '');
}
function addKeyPrefixes(list) {
    return list.map(function (key) {
        return addKeyPrefix(key);
    });
}
function removeKeyPrefixes(list) {
    return list.map(function (key) {
        return removeKeyPrefix(key);
    });
}
/**
 * Some of the callbacks are handled via the registered controller - addController method.
 */
var trade = (function () {
    "use strict";
    // ready queue call registered call backs when trade is ready
    var cbs = [],
        server,
        registeredController = [];

    /**
     *
     * @param functionName the function to call
     * @param args an array of parameters which are passed to the function
     */
    function callController(functionName, args) {
        registeredController.forEach(function (controller) {
            if (controller.hasOwnProperty(functionName)) {
                controller[functionName].apply(null, args);
            }
        });
    }

    return {
        initialize : function (fc) {
            d.on('remote', function (server) {
                trade.init(server, fc);
            });
            d.pipe(stream).pipe(d);
        },
        addController : function (obj) {
            registeredController.push(obj);
        },
        /**
         * Load the whole project files with all required data (project specific json)
         * @param projectId
         * @param cb
         */
        loadProject : function (projectId, cb) {
            server.loadProject(projectId, function (data) {
                if (data) {
                    // prefix all keys
                    Object.keys(data.keys).forEach(function (lang) {
                        var obj = {};
                        Object.keys(data.keys[lang]).forEach(function (key) {
                            obj[addKeyPrefix(key)] = data.keys[lang][key];
                        })
                        data.keys[lang] = obj;
                    });
                    callController('onLoadProject', [data]);
                } else {
                    // callback a error so the caller has the control about error handling
                    cb && cb(false);
                }
            });
        },
        /**
         * actually same as saveKey but the internal controller call is different
         * @param projectId
         * @param language
         * @param keyAndValue
         * @param cb
         */
        createKey : function (projectId, language, keyAndValue, cb) {
            server.saveKey(projectId, language, keyAndValue,
                function(err, key, value) {
                    // TODO handle error case
                    if (!err) {
                        cb(projectId, language, key, value);
                        callController('onCreateKey', [projectId, language, key, value]);
                    }
                });
        },
        /**
         *
         * @param projectId
         * @param {{id :string, sourceCategory:string, targetCategory:string}} keyAndValue
         * @param cb
         */
        cloneKey: function(projectId, keyAndValue, cb) {
            server.cloneKey(projectId, keyAndValue,
                function(err, projectId, data) {
                    cb(err, projectId, data);
                    callController('onKeyCloned', [projectId, data]);
                }
            );
        },
        /**
         * Save changes to a key's value. Change will be broadcast to other clients.
         * @param {string} projectId
         * @param {string} language
         * @param {{key:string, value:string}} keyAndValue
         * @param {function} cb - callback to execute after saving
         */
        saveKey : function (projectId, language, keyAndValue, cb) {
            server.saveKey(projectId, language, keyAndValue,
                function(err, key, value) {
                    // TODO handle error case
                    if (!err) {
                        cb(projectId, language, key, value);
                    }
            });
        },
        /**
         *
         * @param {string} projectName
         * @param currentDirId if of the directory in which the new project will be created
         */
        createNewProject : function (projectName, currentDirId) {
            server.createNewProject(currentDirId, projectName, {}, function(err, projectData) {
                // TODO handle error case
                if (!err) {
                    callController('onNewProjectCreated', [projectData]);
                }
            });
        },
        /**
         *
         * @param {string} directoryName
         * @param {string} currentDirectory
         */
        createNewDirectory : function(directoryName, currentDirectory) {
            server.createNewDirectory(directoryName, currentDirectory, function(err, directoryData) {
                // TODO handle error case
                if (!err) {
                    callController('onNewDirectoryCreated', [directoryData]);
                }
            });
        },
        /**
         * Renames a category.
         * @param {string} projectId
         * @param {string} oldName
         * @param {string} newName
         */
        renameCategory : function (projectId, oldName, newName) {
            server.renameCategory(projectId, oldName, newName, function (err, oldName, newName) {
                if (!err) {
                    callController('renameCategory', [oldName, newName]);
                }
            });
        },
        /**
         * Removes a category with all it's child keys.
         * @param {string} projectId
         * @param {string} catName
         */
        removeCategory : function (projectId, catName) {
            server.removeCategory(projectId, catName, function (err, catName) {
                if (!err) {
                    callController('removeCategory', [catName]);
                }
            });
        },
        /**
         * Renames a key for all languages
         * @param {string} projectId
         * @param {{newKey: string, oldKey: string}} obj
         */
        renameKey : function (projectId, obj) {
            server.renameKey(projectId, {
                newKey : obj.newKey,
                oldKey : obj.oldKey
            }, function (err, oldKey, newKey) {
                if (!err) {
                    callController('renameKey', [oldKey, newKey]);
                } else {
                    callController('renameKey', [false]);
                }
            });
        },
        /**
         * Removes a key for all languages.
         * @param {string} projectId
         * @param {string} keyName
         * @param {function} cb
         */
        removeKey : function (projectId, keyName, cb) {
            server.removeKey(projectId, keyName, function (err, keyName) {
                if (!err) {
                    cb(keyName);
                    callController('removeKey', [keyName]);
                }
            });
        },
        /**
         *
         * @param {string} projectId
         * @param {string} categoryName
         */
        removeImage : function(projectId, categoryName) {
            server.removeImage(projectId, categoryName, function (err, categoryName) {
                if (!err) {
                    callController('imageRemoved', [categoryName]);
                }
                else {
                    toast.showMessage(err.message);
                }
            });
        },
        // Not really tested
        ready : function (cb) {
            if (server) {
                cb();
            } else {
                cbs.push(cb);
            }
        },
        init : function (s, fc) {
            server = s;

            if (server.setUserRights) {
                server.setUserRights(canny.cookieManager.forSessionCookie('translatron_session').getValues(), fc);
            } else {
                fc({name:'Logout', isAdmin: true}, false);
            }

            server.attachClientCallbacks(events.serverEvents);
            // call ready queue
            cbs.map(function (cb) {
                cb && cb();
                return null;
            });
        },
        /**
         *
         * Get the contents of the directory.
         *
         * @param dir the selected directory.
         * @param cb {projects:[String]:dirs:[String]}
         */
        getDirectory : function (dir, cb) {
            server.getDirectory(dir, function (args) {
                // only call the controller if not false
                cb && cb(args);
                if (args !== false) {
                    callController('getDirectory', [args]);
                }
            });
        },
        saveProjectDescription : function(projectId, id, description, callback) {
            server.saveProjectDescription(projectId, id, description, function(err) {
                if (!err) {
                    callback && callback(true);
                    callController('savedProjectDescription', []);
                } else {
                    callback && callback(false);
                }
            });
        },
        /**
         * Delete a project.
         * @param projectName
         * @param currentDirId
         * @param callback
         */
        deleteProject : function (projectName, currentDirId, callback) {
            server.deleteProject(currentDirId, projectName, function (err, prjName) {
                if (!err) {
                    callback && callback(null, prjName);
                    callController('projectDeleted', [prjName]);
                } else {
                    callback && callback(err);
                }
            });
        },
        /**
         * Delete a project.
         * @param dirName
         * @param currentDirId
         * @param callback
         */
        deleteFolder : function (dirName, currentDirId, callback) {
            server.deleteFolder(currentDirId, dirName, function (err, dirName) {
                if (!err) {
                    callback && callback(null, dirName);
                    callController('folderDeleted', [dirName]);
                } else {
                    callback && callback(err);
                }
            });
        }
    };
}());

module.exports = trade;