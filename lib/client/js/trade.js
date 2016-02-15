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
            server.loadProject(projectId, function (error) {
                var args = [].slice.call(arguments);
                if (error) {
                    callController('onLoadProject', args);
                } else {
                    // callback a error so the caller has the control about error handling
                    cb && cb(false);
                }
            });
        },
        /**
         * Save changes to a key's value. Change will be broadcast to other clients.
         * @param projectId
         * @param language
         * @param keyAndValue an object of { key : "value" }
         * @param cb callback to execute after saving
         */
        saveKey : function (projectId, language, keyAndValue, cb) {
            // TODO cb should be exclusive error-callback
            server.saveKey(projectId, language, keyAndValue,
                function(key, value) {
                    cb(projectId, language, key, value);
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
            server.createNewDirectory(directoryName, currentDirectory, function() {
                var args = [].slice.call(arguments);
                callController('onNewDirectoryCreated', args);
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
            }, function (oldKey, newKey) {
                if (oldKey) {
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
            server.removeKey(projectId, keyName, function (keyName) {
                callController('removeKey', [keyName]);
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
         * TODO ensure that multi level directories can be found
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
        saveProjectDescription : function(projectId, description, callback) {
            server.saveProjectDescription(projectId, description, function(callbackArgs) {
                callback && callback(callbackArgs);
                if (callbackArgs) {
                    callController('savedProjectDescription', [args]);
                }
            });
        }
    };
}());

module.exports = trade;