"use strict";
"use strict";
var fs = require('fs'),
    mkdirP = require('../mkdir-p'),
    fileMgr =  {};

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
    mkdirP(projectFolder, jsonFileName, function () {
        fs.writeFile(projectFolder + '/' + jsonFileName, JSON.stringify(obj), cb);
    });
};

module.exports = fileMgr;
