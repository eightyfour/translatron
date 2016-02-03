var fs = require('fs');
/**
 * check if folder exists - otherwise create one
 *
 * @param rootFolder - start folder
 * @param folder - folder to check and create
 * @param cb - callback
 */
module.exports = function createFolder(rootFolder, folder, cb) {
    var folders = [],
        actualFolder = "";
    // create array
    folder.split('/').forEach(function (f) {
        // remove empty strings like ''
        if (f !== '') {
            folders.push(f);
        }
    });

    (function create(idx) {
        if (idx < folders.length) {
            actualFolder += '/' + folders[idx];
            fs.exists(rootFolder + actualFolder, function (exists) {
                if (exists) {
                    create(idx + 1);
                } else {
                    fs.mkdir(rootFolder + actualFolder, function () {
                        create(idx + 1);
                    });
                }
            });
        } else {
            cb();
        }
    }(0));
};