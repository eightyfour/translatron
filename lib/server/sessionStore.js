var MemoryStore = require('express-session').MemoryStore;

module.exports = (function() {
    return new MemoryStore();
}());