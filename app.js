/*global console */
/*jslint node: true */
var projectFolder = __dirname + '/static',
    express = require('express'),
    fs = require('fs'),
    shoe = require('shoe'),
    dnode = require('dnode'),
    dao = require('./lib/server/dao.js')(projectFolder),
    fileManager = require('./lib/server/legacy/fileManager.js')(projectFolder),
    bash = require('./lib/server/legacy/bash.js'),
    serverPort = process.env.npm_package_config_port || 3000,
    jsonFileManager = require('./lib/server/legacy/jsonFileManager')(projectFolder);

var app = express();

app.use('/dist',express.static(__dirname + '/dist'));
app.use('/bower_components',  express.static(__dirname + '/bower_components'));

/**
 * match except for folder dist and bower_components
 *
 * If the URL has a dot inside it expect to send a files. Otherwise it sends the index.
 */
app.get(/^((?!(\/dist|\/bower_components)).)*$/,  function (req, res) {
//    if (/\./.test(req.originalUrl)) {
//        // contains a . - looks like a file request so check the files system
//        fs.exists(__dirname + '/static' + req.originalUrl, function (exists) {
//            if (exists) {
//                res.sendFile(__dirname + '/files' + req.originalUrl);
//            } else {
//                // no file found - send 404 file
////                res.sendFile(__dirname + '/dist/404.html');
//                res.send('404');
//            }
//        });
//
//    } else {
    // TODO check the extension

    // if the extension is .prj it is a project file
    if (/\.prj/.test(req.originalUrl)) {
        res.sendFile(__dirname + '/dist/index.html');
    } else {
        // else if there is no extension just show the project overview page
        // for the first send index so far we have nothing else
        res.sendFile(__dirname + '/dist/index.html');
    }

    //}
});

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

var conTrade,
    trade = shoe(function (stream) {
        "use strict";

        var d = dnode({
            /**
             * TODO rename method to something common (the client side needs also to be refactored (controller methods and so on))
             * @param projectPath
             * @param cb
             */
            getMessageBundle : function (path, projectName, cb) {
                // read the project JSON and format the data into the old format {data:{}, language:""}
                // TODO format can be changed later if we want
                dao.getProjectTranslation(path, projectName, cb);
            },
            sendResource : function (id, bundleObj, data, cb) {
                dao.sendResource.apply(null, [].slice.call(arguments));
            },
            renameKey : function () {
                dao.renameKey.apply(null, [].slice.call(arguments));
            },
            removeKey : function () {
                dao.removeKey.apply(null, [].slice.call(arguments));
            },
            createNewProject : function (id, path, projectName, obj, cb) {
                dao.createNewProject(id, path, projectName, obj, cb);
            },
            /**
             * initial call - all client methods are saved here.
             * returns a id as callback. The client needs this as identifier.
             */
            setupClient : function () {
                // TODO draft: authenticate the client - and pass the name to the setupClient
                dao.setupClient.apply(null, [].slice.call(arguments));
            },
            /**
             *  TODO refactor - do it only if the client ask for - methods are saved in client
             *  Rename init in getPathList
             */
            init : function (clientEvents) {
                //bash.exec({
                //    comand : C.BASH.LS,
                //    path : '.'
                //}, function (obj) {
                //    console.log('app:sendPathList', obj);
                //    clientEvents.sendPathList(obj);
                //});
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
                    // TODO save this in the description field from the [project name].json
                    //if (merge) {
                    //    jsonFileManager.getJSON('/' + projectName + '/project.json', function (oldData) {
                    //        Object.keys(data).forEach(function (key) {
                    //            oldData[key] = data[key];
                    //        });
                    //        jsonFileManager.saveJSON(projectName + '/project', oldData, cb);
                    //        console.log('app:saveJSON', projectName, oldData);
                    //    });
                    //} else {
                    //    jsonFileManager.saveJSON(projectName + '/project', oldData, cb);
                    //    console.log('app:saveJSON', projectName, data);
                    //}
                };

                /**
                 * Refactor this function - it do multiple jobs
                 * param: projectName(optional - otherwise take main project.json), callback
                 */
                ret.getJSON = function (path, projectName, p1) {
                    // only a callback is passed
                    var cb = p1 || projectName;
                    // if the second parameter a function the client asks for the actual projects in this path
                    // TODO change it to a separate function call or find a better solution (e.g. server pre render with JADE)
                    if (typeof projectName === 'function') {
                        // first bring project JSON up to date
                        fileManager.readDir(path, function (filesAndFolders) {
                            var folders = [];
                            // if the folder is not exists then the value is undefined
                            if (filesAndFolders.value) {
                                filesAndFolders.value.forEach(function (folder) {
                                    if (!folder.d && folder.name !== 'project.json' && /\.json/.test(folder.name)) {
                                        folders.push(folder.name.split('.')[0]);
                                    }
                                });
                            }
                            // load the default root project.json
                            jsonFileManager.getJSON('/project.json', function (data) {
                                data.projects = folders;
                                cb(data);
                            });
                        })

                    } else if (/\.prj/.test(projectName)) {
                        // ask for a project JSON
                        (function loadProjectJSON() {
                            var prjName = projectName.split('.')[0];

                            jsonFileManager.getJSON('/' + path + '/' + prjName + '.json', function (data) {
                                if (data) {
                                    // initialize all languages with default -1
                                    Object.keys(data.keys).forEach(function (lang) {
                                        data.languages[lang] = {translated : -1};
                                    });
                                    cb(data);
                                } else {
                                    console.log('app:getJSON the project specific project.json is missing for project', projectName);
                                    cb(false);
                                }
                            });
                        }());
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