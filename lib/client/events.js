/**
 * Created by han.
 *
 * All server events. Multiple clients can register on each event
 * and will be notified if method is called from server.
 *
 * TODO RENAME FILE
 */
var events = (function () {
    "use strict";
    var eventQueue = {},
        callQueue = function (name, args) {
            if (eventQueue.hasOwnProperty(name)) {
                eventQueue[name].map(function (fc) {
                    fc.apply(null, args);
                });
            }
        };
    return {
        serverEvents : {
            sendFile : function () {
                callQueue('sendFile', [].slice.call(arguments));
            },
            sendPathList : function () {
                callQueue('sendPathList', [].slice.call(arguments));
            }
        },
        addServerListener : function (name, cb) {
            if (eventQueue.hasOwnProperty(name)) {
                eventQueue[name].push(cb);
            } else {
                eventQueue[name] = [cb];
            }
        }
    };
}());

module.exports = events;