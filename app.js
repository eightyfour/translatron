/*global console */
/*jslint node: true */
var projectFolder = __dirname + '/static',
    express = require('express'),
    fs = require('fs'),
    shoe = require('shoe'),
    dnode = require('dnode'),
    dao = require('./lib/server/dao.js')(projectFolder),
    fileManager = require('./lib/server/legacy/fileManager.js')(projectFolder),
    serverPort = process.env.npm_package_config_port || 3000,
    jsonFileManager = require('./lib/server/legacy/jsonFileManager')(projectFolder),
    jade = require('jade');

var app = express();

// configure static URL's for static:
app.use('/dist',express.static(__dirname + '/dist'));
// and bower files:
app.use('/bower_components',  express.static(__dirname + '/bower_components'));

// jade.compileFile is not like a full compilation - it is more like a parsing of the jade code. only the execution
// of the returned function pointer (with optional passing of locals) will do the actual compilation.
var indexPage = jade.compileFile('./lib/client/jade/index.jade')(),
    projectOverviewPage = jade.compileFile('./lib/client/jade/projectOverview.jade');
/**
 * match except for folder dist and bower_components
 *
 * If the URL has a dot inside it expect to send a files. Otherwise it sends the index.
 */
app.get(/^((?!(\/dist|\/bower_components)).)*$/,  function (req, res) {
    //res.send(jade.compileFile('./lib/client/jade/projectOverview.jade')());
    res.send(jade.compileFile('./lib/client/jade/index.jade')());
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
            loadProject : function (projectId, cb) {
                dao.loadProject(projectId, cb);
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
            receivedProjectsAndDirectories : function (dir, cb) {
                dao.receivedProjectsAndDirectories(dir, cb);
            },
            /**
             * initial call - all client methods are saved here.
             * returns a id as callback. The client needs this as identifier.
             */
            setupClient : function () {
                // TODO draft: authenticate the client - and pass the name to the setupClient
                dao.setupClient.apply(null, [].slice.call(arguments));
            },
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
                        console.log('app:does not support prj files for getJSON calls');
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