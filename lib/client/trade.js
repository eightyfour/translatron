/*jslint browser: true */
/**
 * handle the connection between server and client
 */
var canny = require('canny'),
    C = require('../CONST.js'),
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
         *
         * @param bundle
         */
        getMessageBundle : function (bundle) {
            server.getMessageBundle(bundle, function () {
                var args = [].slice.call(arguments);
                callController('getMessageBundle', args);
            });
        },
        /**
         *
         * @param id
         * @param bundle
         * @param data
         * @param cb
         */
        sendResource : function (bundle, data, cb) {
            var args = [].slice.call(arguments);
            // connectionId id to the first
            args.splice(0, 0, connectionId);
            server.sendResource.apply(null, args);
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
            server.init(events.serverEvents);

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
        getJSON : function (projectName) {
            console.log('getJSON: ask for project file');
            server.jsonFileManager.getJSON(projectName, function () {
                var args = [].slice.call(arguments);
                callController('getJSON', args);
            });
        },
        /**
         *
         * @param id
         * @param data
         */
        saveJSON : function (id, data) {
            server.jsonFileManager.saveJSON(id, data, function () {
                var args = [].slice.call(arguments);
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