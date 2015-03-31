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

// TODO move the create project in a separate file
function getDefaultProjectJson(projectName, obj) {
    var cb = function () {
        console.log('Second function param callback: DEFAULT');
    };

    jsonFileManager.getJSON('project.json', function (data) {
        cb({
            "project" : projectName,
            "description" : obj.description || "",
            "images" : [],
            "defaultLanguage" : data.defaultLanguage || "en",
            "numberOfKeys" : "0",
            "languages" : {},
            "keys" : {}
        });
    });
    return function (fc) {
        cb = fc;
        console.log('Second function param callback: CALLED');
    }
}


/**
 * If no project exists I ignore the bundle attribute and open the project create view with the bundle name as default...
 * Only if the create project is triggered only than create a new project.
 *
 * TODO
 *  * add create project server interface
 *  * and implement view handling
 * @type {http.Server}
 */

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
                    if (!filesAndFolders) {
                        // there are no message bundles actually
                        cb(false);
                    } else {
                        var availableLanguages = getMessageBundleLanguages(filesAndFolders.value);
                        Object.keys(availableLanguages).forEach(function (lang) {
                            client.getMessageBundle({
                                bundle: projectName,
                                locale: lang
                            }, cb);
                        })
                    }
                });
            },
            sendResource : function () {
                client.sendResource.apply(null, [].slice.call(arguments));
            },
            createNewProject : function (id, projectName, obj, cb) {
                // TODO instead of read save the project here
                // Add project.json template in main project.json
                getDefaultProjectJson(projectName, obj)(function (json) {
                    // send back
                    cb(json);
                    client.createNewProject(id, projectName);
                    // and save config
                    jsonFileManager.saveJSON(projectName + '/project.json', json);
                });
            },
            /**
             * initial call - all client methods are saved here.
             * returns a id as callback. The client needs this as identifier.
             */
            setupClient : function () {
                client.setupClient.apply(null, [].slice.call(arguments));
            },
            /**
             *  TODO refactor - do it only if the client ask for - methods are saved in client
             *  Rename init in getPathList
             */
            init : function (clientEvents) {
                bash.exec({
                    comand : C.BASH.LS,
                    path : '.'
                }, function (obj) {
                    clientEvents.sendPathList(obj);
                });
            },
            /**
             * TODO remove bash
             */
            bash : bash,
            fileManager : fileManager,
            jsonFileManager : (function () {
                var ret = {};
                // lo0ks like a listener :-)
                Object.keys(jsonFileManager).forEach(function (key) {
                    ret[key] = function () {
                        jsonFileManager[key].apply(null, [].slice.call(arguments));
                    };
                });
                /**
                 * currently the merge flag supports only flat merge - TODO deep merge
                 *
                 * @param projectName
                 * @param data
                 * @param merge
                 * @param cb
                 */
                ret.saveJSON = function (projectName, data, merge, cb) {
                    if (merge) {
                        jsonFileManager.getJSON(projectName + '/project.json', function (oldData) {
                            Object.keys(data).forEach(function (key) {
                                oldData[key] = data[key];
                            });
                            jsonFileManager.saveJSON(projectName + '/project.json', oldData, cb);
                            console.log('app:saveJSON', projectName, oldData);
                        });
                    } else {
                        jsonFileManager.saveJSON(projectName + '/project.json', oldData, cb);
                        console.log('app:saveJSON', projectName, data);
                    }
                };

                /**
                 * param: projectName(optional - otherwise take main project.json), callback
                 */
                ret.getJSON = function (projectName, p1) {
                    // only a callback is passed
                    var cb = p1 || projectName;
                    if (typeof projectName === 'function') {
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
                        fileManager.readDir(projectName, function (filesAndFolders) {
                            var availableLanguages;
                            if (filesAndFolders === false) {
                                console.log('app:getJSON The project does not exists', projectName);
                                cb(false);
                            } else {
                                availableLanguages = getMessageBundleLanguages(filesAndFolders.value);
                                jsonFileManager.getJSON(projectName + '/project.json', function (data) {
                                    if (data) {
                                        Object.keys(availableLanguages).forEach(function (key) {
                                            if (!data.languages.hasOwnProperty(key)) {
                                                data.languages[key] = availableLanguages[key];
                                            }
                                        });
                                        cb(data);
                                    } else {
                                        console.log('app:getJSON the project specific project.json is missing for project', projectName);
                                        cb(false);
                                    }
                                });
                            }

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