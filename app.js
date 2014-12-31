/*global console */
/*jslint node: true */
var express = require('express'),
    fs = require('fs'),
    shoe = require('shoe'),
    dnode = require('dnode'),
    client = require('./lib/client.js')(__dirname),
    C = require('./lib/CONST.js'),
    fileManager = require('./lib/server/fileManager.js'),
    bash = require('./lib/server/bash.js'),
    serverPort = process.env.npm_package_config_port || 3000,
    jsonFileManager = require('./lib/server/jsonFileManager');

var app = express();

global.projectFolder = __dirname + '/static';

app.use(express.static(__dirname + '/fe'));



var server = app.listen(serverPort);

//var conDnode;
//var dnodeCon = shoe(function (stream) {
//    "use strict";
//    var d = dnode(client);
//    d.pipe(stream).pipe(d);
//    conDnode = stream;
//
//    conDnode.on('end', function () {
//        console.log('end');
//    });
//});
//dnodeCon.install(server, '/dnode');

function getMessageBundleLanguages(filesAndFolders) {
    var availableLanguages = {},
        reg = new RegExp('messages_(.*)\.properties'),
        regResult;
    filesAndFolders.forEach(function (file) {
        if (!file.d) {
            regResult = reg.exec(file.name);
            if (regResult && regResult[1]) {
                availableLanguages[regResult[1]] = {translated : -1};
            }
        }
    });
    return availableLanguages;
}

var conTrade,
    trade = shoe(function (stream) {
        "use strict";
        var d = dnode({
            getMessageBundle : function (projectName, cb) {
                fileManager.readDir(projectName, function (filesAndFolders) {
                    var availableLanguages = getMessageBundleLanguages(filesAndFolders.value);
                    Object.keys(availableLanguages).forEach(function (lang) {
                        client.getMessageBundle({
                            bundle : projectName,
                            locale : lang
                        }, cb);
                    })
                });
            },
            sendResource : function () {
                client.sendResource.apply(null, [].slice.call(arguments));
            },
            setupClient : function () {
                client.setupClient.apply(null, [].slice.call(arguments));
            },
            init : function (clientEvents) {
                bash.exec({
                    comand : C.BASH.LS,
                    path : '.'
                }, function (obj) {
                    clientEvents.sendPathList(obj);
                });
            },
            bash : bash,
            fileManager : fileManager,
            jsonFileManager : (function () {
                var ret = {};

                Object.keys(jsonFileManager).forEach(function (key) {
                    ret[key] = function () {
                        jsonFileManager[key].apply(null, [].slice.call(arguments));
                    };
                });

                /**
                 * param: projectName(optional), callback
                 */
                ret.getJSON = function (p0, p1) {
                    // only a callback is passed
                    var cb = p1 || p0;
                    if (typeof p0 === 'function') {
                        // first bring project JSON up to date
                        fileManager.readDir('', function (filesAndFolders) {
                            var folders = [];
                            filesAndFolders.value.forEach(function (folder) {
                                if (folder.d) {
                                    folders.push(folder.name);
                                }
                            });
                            jsonFileManager.getJSON('project.json', function (data) {
                                data.projects = folders;
                                cb(data);
                            });
                        })

                    } else {
                        // first bring project JSON up to date
                        fileManager.readDir(p0, function (filesAndFolders) {
                            var availableLanguages = getMessageBundleLanguages(filesAndFolders.value);
                            jsonFileManager.getJSON(p0 + '/project.json', function (data) {
                                Object.keys(availableLanguages).forEach(function (key) {
                                    if (!data.languages.hasOwnProperty(key)) {
                                        data.languages[key] = availableLanguages[key];
                                    }
                                });
                                cb(data);
                            });
                        });
                    }
                };
                return ret;
            }())
        });
    d.pipe(stream).pipe(d);
    conTrade = stream;

    conTrade.on('end', function () {
        console.log('end');
    });
});
trade.install(server, '/trade');

console.log("start server ", serverPort);