/**
 * Created by eightyfour.
 *
 * All server events. Multiple clients can register on each event
 * and will be notified if method is called from server.
 *
 * TODO RENAME FILE
 * TODO to what? :)
 * What about "externalChangeNotifications"?
 *
 * TBD why don't we integrate this one with ui events? that would cut down on the number of components we have and we "only" (?)
 * have to do some sensible renaming of events, like renaming all events handled here by adding "external" or similar
 * (e.g. "keyUpdated" becomes "keyUpdatedExternally").
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
            onKeyCloned : function(projectId, data) {
                callQueue('onKeyCloned', [projectId, data]);
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
            imageRemoved : function (projectId, categoryName) {
                callQueue('imageRemoved', [ projectId, categoryName ]);
            },
            newProjectWasCreated : function (projectId) {
                callQueue('newProjectWasCreated', [ projectId ]);
            },
            newDirectoryCreated : function (directoryId) {
                callQueue('newDirectoryCreated', [ directoryId ]);
            },
            projectDescriptionUpdated : function (projectId, id, description) {
                callQueue('projectDescriptionUpdated', [ projectId, id, description ]);
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