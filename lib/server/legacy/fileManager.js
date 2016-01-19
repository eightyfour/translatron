/*global projectFolder */
/**
 * fileManager
 *
 * The file manager saves the message bundles from the editor view.
 *
 */
var fs = require('fs'),
    path = require('path'),
    C = require('../CONST.js');


// TODO move the id handling in filter layer
function toUTF8Array(str) {
    "use strict";
    var i, arr = [];
    for (i = 0; i < str.length; i++) {
        arr.push(str.charCodeAt(i));
    }
    return arr;
}

function fromUTF8toString(uArr) {
    "use strict";
    var i, arr = '';
    for (i = 0; i < uArr.length; i++) {
        arr += String.fromCharCode(uArr[i]);
    }
    return arr;
}

function pathToId(path) {
    "use strict";
    var utf8A = toUTF8Array(path);
    return utf8A.join('I');
}

function idToPath(id) {
    "use strict";
    return fromUTF8toString(id.split('I'));
}

var fileManager = function (projectFolder) {
    "use strict";
    /*
     * file type could be
     * TODO add all possible extensions
     */
    var getFileType = function (file) {
            var extension = file.slice(file.lastIndexOf('.') + 1);
            return /png|jpg|jpeg|jpe|ico|icon|bmp/.test(extension) ? C.FILE_MANAGER.FILE_TYPES.IMAGE : C.FILE_MANAGER.FILE_TYPES.FILE;
        },
        getFileName = function (filePath) {
            var split = filePath.split('/');
            return split[split.length - 1];
        },
        getFileSource = function (file, callBack) {
            var fileType = getFileType(file);
            fs.exists(file, function (exists) {
                if (exists) {
                    fs.readFile(file, C.FILE_MANAGER.ENCODING[fileType], function (err, data) {
                        if (err) {throw err; }
                        callBack({
                            data: data,
                            filePath : file,
                            fileType: getFileType(file),
                            name : getFileName(file)
                        });
                    });
                }
            });
        },
        setFileSource = function (file, data, callBack) {
            fs.exists(file, function (exists) {
                if (exists) {
                    fs.writeFile(file, data, C.FILE_MANAGER.ENCODING.file, function (err) {
                        if (err) {return callBack(false); }
                        callBack(true);
                    });
                } else {
                    callBack(false);
                }
            });
        },
        readDir = function (path, cb) {
            var res = [], count;

            console.log('readDir: ', path);
            fs.readdir(path, function (err, files) { // '/' denotes the root folder
                if (err) {
                    cb(false)
                } else {
                    count = files.length;
                    if (count === 0) {
                        cb({value: [], fail: false});
                    }
                    files.forEach(function (file) {
                        fs.lstat(path + '/' + file, function (err, stats) {
                            if (!err) { //conditing for identifying folders
                                res.push({d: stats.isDirectory(), name: file, id: pathToId(path + '/' + file)});
                            } else {
                                console.log('fileManager:readDir :: ERROR');
                            }
                            count--;
                            if (count <= 0) {
                                cb({value: res, fail: false});
                            }
                        });
                    });
                }
            });
        };

    return {
        getFile : function (id, cb) {
            var filePath = idToPath(id);
            getFileSource(filePath, function (obj) {
                obj.id = id;
                cb(obj);
            });
//            cb(obj, code);
        },
        saveProjectJSON : function (path) {

        },
        saveFile : function (obj, cb) {
            setFileSource(idToPath(obj.id), obj.data, cb);
        },
        /**
         *
         * @param obj
         * @param cb
         */
        readDir : function (obj, cb) {
            readDir(isNaN(obj[0]) ? projectFolder + '/' + obj : idToPath(obj), cb);
        },
        getParentDirectory : function(aPath) {
            return path.dirname(aPath);
        }
    };

};

module.exports = fileManager;