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
        connectionId, // client identifier for the server
        server,
        registeredController = [];

    function callController(functionName, args) {
        registeredController.forEach(function (controller) {
            if (controller.hasOwnProperty(functionName)) {
                controller[functionName].apply(null, args);
            }
        });
    }

    return {
        addController : function (obj) {
            registeredController.push(obj);
        },
        /**
         * loads the translation project from the actual path
         * @param bundle
         */
        getMessageBundle : function (bundle) {

            var split = location.pathname.split('/'),
                path = location.pathname;

            if (/\.prj/.test(split[split.length - 1])) {
                path = '/' + split.slice(0, split.length - 1).join('/');
            }

            server.getMessageBundle(path, bundle, function (err) {
                if (err === false) {
                    console.log('trade:getMessageBundle There are no existing message bundles');
                } else {
                    var args = [].slice.call(arguments);
                    // extends the object with the project name
                    args[0].project = bundle;
                    callController('getMessageBundle', args);
                }
            });
        },
        /**
         *
         * @param bundle
         * @param data
         * @param cb
         */
        sendResource : function (bundle, data, cb) {
            var args = [].slice.call(arguments);
            // connectionId id to the first
            args.splice(0, 0, connectionId);
            server.sendResource.apply(null, [connectionId ,bundle, data, function (key, value) {
                cb(bundle.project, bundle.locale, key, value);
            }]);
        },
        /**
         * projectName
         * @param projectName
         * @param obj
         */
        createNewProject : function (projectName, obj) {
            var path = location.pathname;
            if (/\.prj/.test(path)) {
                path = (function (s) {
                    var split = s.split('/');
                    return split.splice(0, split.length - 1).join('/');
                }(path));
            }
            server.createNewProject(connectionId, path, projectName, obj, function () {
                var args = [].slice.call(arguments);
                callController('createNewProject', args);
            });
        },
        /**
         * @param bundle
         * @param obj {newKey: string, oldKey: string}
         * @param cb
         */
        renameKey : function (projectId, obj) {
            server.renameKey(connectionId, projectId, {
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
         * @param projectId
         * @param keyName
         */
        removeKey : function (projectId, keyName) {
            server.removeKey(connectionId, projectId, keyName, function (keyName) {
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
            server.setupClient(events.serverEvents, function (id) {
                connectionId = id;
            });
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
            server.receivedProjectsAndDirectories(dir, function (args) {
                cb(args);
                callController('getDirectory', [args]);
            });
        },
        /**
         *
         * @param id
         * @param cb
         */
        listPath : function (id, cb) {
            server.fileManager.readDir(id, cb);
        },
        /**
         *
         * @param id
         * @param cb
         */
        getFile : function (id, cb) {
            server.fileManager.getFile(id, function (fileObj) {
                events.serverEvents.sendFile(fileObj);
                cb();
            });
        },
        /**
         *
         * @param id
         * @param data
         * @param cb
         */
        saveFile : function (id, data, cb) {
            server.fileManager.saveFile({
                id : id,
                data: data
            }, cb);
        },
        /**
         *
         * pass a project name or nothing
         * @param projectName
         */
        getJSON : function (path, projectName, cb) {
            server.jsonFileManager.getJSON(path, projectName, function (error) {
                if (error !== false) {
                    var args = [].slice.call(arguments);
                    callController('getJSON', args);
                }
            });
        },
        /**
         *
         * @param id
         * @param data
         * @param merge
         * @param cb
         */
        saveJSON : function (id, data, merge, cb) {
            server.jsonFileManager.saveJSON(id, data, merge, function () {
                var args = [].slice.call(arguments);
                cb && cb.apply(null, args);
                callController('saveJSON', args);
            });
        }
    };
}());

canny.ready(function () {
    "use strict";

    d.on('remote', function (server) {
        trade.init(server);
    });
    d.pipe(stream).pipe(d);
});

module.exports = trade;