"use strict";
var fs = require('fs');
var fileMgr =  {},
    // TODO can not create multiple sub directories
    createFileWithPath = function (filePath, cb) {
        var directories = filePath.split('/'), file, dir;

        dir = directories.splice(0, directories.length - 1).join('/');

        fs.mkdir(dir, function () {
            fs.open(filePath, 'w', cb);
        });
    };

fileMgr.getJSON = function (file, cb) {
    var jsonFile = projectFolder + '/' + file;
    console.log('getJSON from:', jsonFile);
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
 * saves a object as JSON format in a file.
 *
 * @param jsonFileName e.g.: projectName/project.json or just project.json
 * @param obj
 * @param cb
 */
fileMgr.saveJSON = function (jsonFileName, obj, cb) {
    console.log('jsonFileManager:saveJSON', jsonFileName, obj);
    createFileWithPath(projectFolder + '/' + jsonFileName, function () {
        fs.writeFile(projectFolder + '/' + jsonFileName, JSON.stringify(obj), cb);
    });
};

module.exports = fileMgr;