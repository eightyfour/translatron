var changesNotifier = function() {

    var listeners = {};

    return {
        registerListener: function (listener) {
            if (!listener.id) {
                console.error('Cannot register listener', listener, ', id is missing');
                return;
            }
            console.log('Adding listener', listener.id);
            listeners[listener.id] = listener;
        },
        deregisterListener: function (listenerId) {
            console.log('Removing listener', listenerId);
            delete listeners[listenerId];
        },
        listenerCount : function () {
            return Object.keys(listeners).length;
        },
        notify: function () {

        }
    };
};

module.exports = changesNotifier;
