/**
 * Created by eightyfour.
 *
 * All server events. Multiple clients can register on each event
 * and will be notified if method is called from server.
 *
 * TODO RENAME FILE
 * TODO to what? :)
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
            },
            /**
             *
             * @param bundleObj {locale: string, bundle: string}
             * @param data {key:string, value: string}
             */
            updateKey : function () {
                callQueue('updateKey', [].slice.call(arguments));
            },
            /**
             * @param bundleObj {locale: string, bundle: string}
             * @param data {oldKey:string, newKey: string}
             */
            keyRemoved : function () {
                callQueue('keyRemoved', [].slice.call(arguments));
            },
            newProjectWasCreated : function () {
                callQueue('newProjectWasCreated', [].slice.call(arguments));
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