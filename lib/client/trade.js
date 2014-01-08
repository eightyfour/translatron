/*jslint browser: true */
/**
 * handle the connection between server and client
 */
var domready = require('domready'),
    C = require('../CONST.js'),
    events = require('./events.js'),
    shoe = require('shoe'),
    dnode = require('dnode'),
    stream = shoe('/trade'),
    d = dnode();

window.domOpts = window.domOpts || require('dom-opts');

console.log('CREATE TRADE INSTANCE');

var trade = (function () {
    "use strict";
    // ready queue call registered call backs when trade is ready
    var cbs = [],
        server;

    return {
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
        }
    };
}());

domready(function () {
    "use strict";
    d.on('remote', function (server) {
        trade.init(server);
    });
    d.pipe(stream).pipe(d);
});

module.exports = trade;