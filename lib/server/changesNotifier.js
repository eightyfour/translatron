var changesNotifier = function() {

    var listeners = {};

    return {
        addListener: function (listenerId, listener) {
            console.log('Adding listener', listenerId, listener);
            listeners[listenerId] = listener;
        },
        removeListener: function (listenerId) {
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
