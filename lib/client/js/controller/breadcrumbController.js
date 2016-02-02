var breadcrumb = require('canny').breadcrumb,
    trade = require('../trade.js'),
    uiEvents = require('../uiEventManager');

breadcrumb.onClick(function (directoryId) {
    trade.getDirectory(directoryId, function (err) {
        if (err !== false ) {
            // TODO call the
            uiEvents.callUievent('showOverviewPage');
        } else {
            console.log('breadcrumbController:getDirectory can not load project for directory name:', directoryId);
        }
    });
});

module.exports = {
    getDirectory: function (data) {
        console.log('breadcrumbController:parentDirectories', data.parentDirectories);
        breadcrumb.updateFolders(data.parentDirectories);
    }
};
