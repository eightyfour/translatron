var changesNotifier = function() {
    'use strict';

    var listeners = {};

    return {
        /**
         *
         * @param listenerId an arbitrary but unique id
         * @param listener the callback interface, i.e. an object where each function implements the callback for an event
         * (meaning event name == function name)
         */
        addListener: function (listenerId, listener) {
            console.log('Adding listener', listenerId, listener);
            listeners[listenerId] = listener;
        },
        /**
         *
         * @param listenerId the id which was used when adding the listener
         */
        removeListener: function (listenerId) {
            console.log('Removing listener', listenerId);
            delete listeners[listenerId];
        },
        /**
         *
         * @returns {*|Number}
         */
        listenerCount : function () {
            return Object.keys(listeners).length;
        },
        /**
         *
         * @param event name of the event
         * @param eventPayload payload for the event (depending on individual events)
         * @param eventSource id (i.e. listenerId) of the client where the action which triggered the event originated.
         * Omit this parameter if all listeners should be notified.
         */
        notify: function (event, eventPayload, eventSourceListenerId) {
            Object.keys(listeners).forEach( (listenerId) => {
                // next line must not check using === because listenerId was born as a property name so it is a
                // string but what was is passed in here as eventSourceListenerId may also be a number
                if (listenerId == eventSourceListenerId) {
                    return;
                }

                var listener = listeners[listenerId];

                if (listener.hasOwnProperty(event)) {
                    console.log('Notifying listener', listenerId, 'about', event);
                    listener[event](eventPayload);
                };
            });
        }
    };
};

module.exports = changesNotifier;
