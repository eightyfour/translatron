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

var trade = (function () {
    "use strict";
    // ready queue call registered call backs when trade is ready
    var cbs = [],
        server;

    return {
        getMessageBundle : function (bundle, cb) {
            server.getMessageBundle.apply(null, [].slice.call(arguments));
        },
        sendResource : function (id, bundle, data, cb) {
            server.sendResource.apply(null, [].slice.call(arguments));
        },
        setupClient : function (client, cb) {
            server.setupClient.apply(null, [].slice.call(arguments));
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
            // call ready queue
            cbs.map(function (cb) {
                cb && cb();
                return null;
            });
        },
        listPath : function (id, cb) {
            server.fileManager.readDir(id, cb);
        },
        getFile : function (id, cb) {
            server.fileManager.getFile(id, function (fileObj) {
                events.serverEvents.sendFile(fileObj);
                cb();
            });
        },
        saveFile : function (id, data, cb) {
            server.fileManager.saveFile({
                id : id,
                data: data
            }, cb);
        },
        getJSON : function (id, cb) {
            console.log('getJSON: ask for project file');
            server.jsonFileManager.getJSON(id, function (fileObj) {
                console.log('getJSON:', fileObj);
                cb && cb();
            });
        },
        saveJSON : function (id, data, cb) {
            server.jsonFileManager.saveJSON(id, data, cb);
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