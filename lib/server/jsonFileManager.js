"use strict";
var fs = require('fs');
/*
    TODO Error handling
    file write is not save - it could be outsynced if two writes to the content
*/
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

function saveJSON(file, obj, cb) {
    console.log('saveJSON', file, obj);
    cb(false);
}


module.exports = fileMgr;
