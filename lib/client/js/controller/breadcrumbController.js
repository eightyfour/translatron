var breadcrumb = require('canny').breadcrumb,
    trade = require('../trade.js'),
    uiEvents = require('../uiEventManager.js');

module.exports = {
    getDirectory: function (data) {
       breadcrumb.updateFolders(data.parentDirectories);
    }
}
