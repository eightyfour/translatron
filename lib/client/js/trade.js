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
        initialize : function () {
            d.on('remote', function (server) {
                trade.init(server);
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
            server.loadProject(projectId, function (returnValue) {
                var args = [].slice.call(arguments);
                if (returnValue) {
                    callController('onLoadProject', args);
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
         * @param projectId
         * @param language
         * @param keyAndValue an object of { key : "value" }
         * @param cb callback to execute after saving
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
         * @param projectName
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
        createNewDirectory : function(directoryName, currentDirectory) {
            server.createNewDirectory(directoryName, currentDirectory, function(err, directoryData) {
                // TODO handle error case
                if (!err) {
                    callController('onNewDirectoryCreated', [directoryData]);
                }
            });
        },
        /**
         * Removes a category with all it's child keys.
         * @param projectId
         * @param catName
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
         * @param projectId
         * @param obj {newKey: string, oldKey: string}
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
         * @param projectId
         * @param keyName
         */
        removeKey : function (projectId, keyName) {
            server.removeKey(projectId, keyName, function (err, keyName) {
                if (!err) {
                    callController('removeKey', [keyName]);
                }
            });
        },
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
        init : function (s) {
            server = s;
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
        }
    };
}());

module.exports = trade;