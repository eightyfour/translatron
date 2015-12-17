"use strict";
var fs = require('fs'),
    mkdirP = require('../mkdir-p'),
    fileMgr =  {};

fileMgr.getJSON = function (file, cb) {
    var jsonFile = projectFolder + '/' + file;
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
 *
 * @param jsonFileName e.g.: projectName/project.json or just project.json
 * @param obj
 * @param cb
 */
fileMgr.saveJSON = function (jsonFileName, obj, cb) {
    mkdirP(projectFolder, jsonFileName, function () {
        fs.writeFile(projectFolder + '/' + jsonFileName, JSON.stringify(obj), cb);
    });
};

module.exports = fileMgr;
