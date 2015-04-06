"use strict";
var fs = require('fs');
var encoding = 'utf8';
/*
    TODO Error handling
    file write is not save - it could be outsynced if two writes to the content
*/
var fileMgr =  {},
    // TODO can not create multiple sub directories
    createFileWithPath = function (filePath, cb) {
        var directories = filePath.split('/'), dir;

        dir = directories.splice(0, directories.length - 1).join('/');

        fs.mkdir(dir, function () {
            fs.open(filePath, 'w', cb);
        });
    },
    getObjectList = function (data) {
        var reg = new RegExp('#.*[\n\r]*|([a-zA-Z0-9\d_\.]*)=(.*)[\n\r]*', 'g'),
            match = data.split(reg),
            list = [],
            tmp,
            i;
        for (i = 0; i < match.length - 1; i += 3) {
            if (match[i] === undefined || match[i + 1] === undefined || match[i + 2] === undefined) {
                console.log('SKIP COMMENT');
            } else {
                console.log("-------- " + i + " ------------");
                console.log(match[i] + " : " + match[i + 2]);
                console.log('\n' + match[i + 1]);
                tmp = match[i].length > 0 ? match[i] : match[i + 1];
                list.push({
                    key : tmp,
                    value: match[i + 2]
                });
            }
        }
        return {data : list};
    },
    getObject = function (data) {
        var objList = getObjectList(data),
            obj = {};
        objList.data.forEach(function (item) {
            obj[item.key] = item.value;
        });
        return obj;
    };

fileMgr.readFile = function (file, cb) {
    fs.exists(file, function (exists) {
        if (exists) {
            fs.readFile(file, encoding, function (err, data) {
                if (err) throw err;
                cb(getObjectList(data));
            });
        } else {
            cb(false);
        }
    });
};

fileMgr.getFileSource = function (file, callBack) {

    fs.exists(file, function (exists) {

        if (!exists) {
            // create file
            createFileWithPath(file, function (){
                fs.readFile(file, encoding, function (err, data) {
                    if (err) throw err;
                    callBack(data);
                });
            });
        } else {
            fs.readFile(file, encoding, function (err, data) {
                if (err) throw err;
                callBack(data);
            });
        }
    });
};

fileMgr.setFileSource = function (file, data, callBack) {

    fs.exists(file, function (exists) {
        if (exists){
            fs.writeFile(file, data, encoding, function (err) {
                if (err) {
                    console.log(err);
                    callBack(false);
                } else {
                    callBack(true);
                }

            });
        }
    });
};

function writeFile(file, key, value, cb) {
    var reg = new RegExp('(.*)' + key + '=(.*)([\n\r]*.*)', 'g');

    fs.readFile(file, encoding, function (err, data) {

        if (err) {throw err; }
        var result = data.replace(reg, '$1' + key + '=' + value + '$3'),
            findKeyRegEx;

        if (result === '') {
            result = key + "=" + value;
        } else if (result == data) {
            // check if key not exists
            findKeyRegEx = new RegExp(key + '=', 'g');
            if (result.match(findKeyRegEx) === null) {
                // add new key
                result += '\n' + key + "=" + value;
            }
        }

        fs.writeFile(file, result, encoding, function (err) {
            if (err) {
                console.log(err);
                cb(false);
            }
            cb(key, value);
        });
    });
}
/**
 *
 * @param file
 * @param key
 * @param value
 * @param cb
 */
fileMgr.saveAsKeyEqualsValue = function (file, key, value, cb) {
    fs.exists(file, function (exists) {
        if (!exists) {
            createFileWithPath(file, function () {
                writeFile(file, key, value, cb);
            });
        } else {
            writeFile(file, key, value, cb);
        }
    });
};

fileMgr.renameKey = function (file, newKey, oldKey, cb) {
    var reg = new RegExp('(.*)' + oldKey + '=(.*)([\n\r]*.*)', 'g');

    fs.readFile(file, encoding, function (err, data) {

        if (err) {throw err; }

        var result = data.replace(reg, '$1' + newKey + '=$2$3');

        if (result === '') {
            console.log('Can not rename key! Key does not exists with name:', oldKey);
            cb && cb(false);
        } else {
            fs.writeFile(file, result, encoding, function (err) {
                var value;
                if (err) {
                    console.log(err);
                    cb && cb(false);
                }
                value = getObject(result);

                console.log('fileManager:value', value, newKey);
                cb && cb(newKey, oldKey, value[newKey] || '');
            });
        }
    });
};


module.exports = fileMgr;
