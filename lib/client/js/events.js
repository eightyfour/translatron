/**
 * Created by eightyfour.
 *
 * All server events. Multiple clients can register on each event
 * and will be notified if method is called from server.
 *
 * TODO RENAME FILE
 * TODO to what? :)
 * What about "externalChangeNotifications"?
 */
var events = (function () {
    "use strict";
    var eventQueue = {},
        callQueue = function (name, args) {
            console.log('got notification for ', name, 'with payload', args);
            if (eventQueue.hasOwnProperty(name)) {
                eventQueue[name].map(function (fc) {
                    fc.apply(null, args);
                });
            }
        };
    return {
        serverEvents : {
            // TBD can be removed?
            sendFile : function () {
                callQueue('sendFile', [].slice.call(arguments));
            },
            // TBD can be removed?
            sendPathList : function () {
                callQueue('sendPathList', [].slice.call(arguments));
            },
            keyUpdated : function (projectId, language, keyName, keyValue) {
                callQueue('keyUpdated', [ projectId, language, keyName, keyValue ]);
            },
            keyRenamed : function(projectId, oldKeyName, newKeyName) {
                callQueue('keyRenamed', [ projectId, oldKeyName, newKeyName ]);
            },
            /**
             * @param bundleObj {locale: string, bundle: string}
             * @param data {oldKey:string, newKey: string}
             */
            keyDeleted : function (projectId, keyName) {
                callQueue('keyDeleted', [ projectId, keyName ]);
            },
            newProjectWasCreated : function (projectId) {
                callQueue('newProjectWasCreated', [ projectId ]);
            },
            newDirectoryCreated : function (directoryId) {
                callQueue('newDirectoryCreated', [ directoryId ]);
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