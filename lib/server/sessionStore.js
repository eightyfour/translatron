module.exports = (function() {

    var store = {};

    return {
        getValue: function(key) {
            return store[key];
        },
        add: function(key, value) {
            store[key] = value;
        },
        remove: function(key) {
            if (store.hasOwnProperty(key)) {
                delete store[key];
            }
        },
        toString: function() {
            return JSON.stringify(store);
        }
    };

}());