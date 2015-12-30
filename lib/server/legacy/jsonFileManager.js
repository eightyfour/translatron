"use strict";
var fs = require('fs'),
    mkdirP = require('../mkdir-p'),
    fileMgr =  {};

/**
 * TODO add the extension here and pass only the file path without extension to keep
 * it consistent to saveJSON.
 * @param file
 * @param cb
 */
fileMgr.getJSON = function (file, cb) {
    var jsonFile = projectFolder + file;
    fs.exists(jsonFile, function (exists) {
        if (exists) {
            fs.readFile(jsonFile, 'utf8', function (err, data) {
                if (err) throw err;
                try {
                    cb(JSON.parse(data));
                } catch (ex) {
                    cb(false);
                }
            });
        } else {
            cb(false);
        }
    });
};
/**
 * saves a object as JSON format in a file. If there is no existing json or folder it will create a new one.
 * You can pass the complete json file name path to it without the .json extension.
 * The path must start with a / and will be relative to the configured projectFolder.
 *
 * @param projectId e.g.: /projectName/project or just /project
 * @param obj
 * @param cb
 */
fileMgr.saveJSON = function (projectId, obj, cb) {
    var split= projectId.split('/'),
        path = split.slice(0, split.length - 1).join('/');
    mkdirP(projectFolder, path, function () {
        fs.writeFile(projectFolder + projectId + '.json', JSON.stringify(obj, null, 2), cb);
    });
};

module.exports = fileMgr;
