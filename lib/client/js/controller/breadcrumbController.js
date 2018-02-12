var breadcrumb = require('../uiModules/breadcrumb'),
    canny = require('canny'),
    trade = require('../trade'),
    uiEvents = require('../uiEventManager');

canny.add('breadcrumb', breadcrumb)

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
    setPath : (url) => {
        let path = '/'
        breadcrumb.updateFolders(url.split('/').map(folder => {
                path = path[path.length - 1] !== '/' ? path + '/' + folder : path + folder
                return {
                    id: path , name: folder
                }
            }
        ))
    },
    getDirectory: function (data) {
        console.log('breadcrumbController:parentDirectories', data.parentDirectories);
        breadcrumb.updateFolders(data.parentDirectories);
    }
};
