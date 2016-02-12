var projectFolder = __dirname + '/../../static',
    dao = require('./dao.js')(projectFolder),
    shoe = require('shoe'),
    dnode = require('dnode');

module.exports = function(changesNotifier) {

    return shoe(function (stream) {
        "use strict";

        var clientListenerId = Math.trunc(Math.random() * Math.pow(10, 10));

        // QUESTION: any reason why we have to define all the functions of the API in an object literal here? why not
        // directly pass a dao.js instance of dnode? ANSWER: no, as of now this has become unneccessary. BUT: we'll be adding
        // authorization and the logic for broadcasting changes (refactored out of dao.js) here so we need this layer then.
        var d = dnode({
            loadProject: function (projectId, cb) {
                dao.loadProject(projectId, cb);
            },
            saveKey: function (projectId, language, keyAndValue, cb) {
                dao.saveKey(projectId, language, keyAndValue, cb);
            },
            renameKey: function () {
                dao.renameKey.apply(null, [].slice.call(arguments));
            },
            removeKey: function () {
                dao.removeKey.apply(null, [].slice.call(arguments));
            },
            createNewProject: function (path, projectName, obj, cb) {
                dao.createNewProject(path, projectName, obj, function(success, projectData) {
                    if (success) {
                        cb(projectData);
                        changesNotifier.notify('newProjectWasCreated', projectName, clientListenerId);
                    } else {
                        cb(false);
                    }
                });
            },
            getDirectory: function (dir, cb) {
                dao.getDirectory(dir, cb);
            },
            createNewDirectory: function (directoryName, path, cb) {
                dao.createNewDirectory(directoryName, path, cb);
            },
            /**
             * initial call - all client methods are saved here.
             * returns a id as callback. The client needs this as identifier.
             */
            setupClient: function (clientsideCallbacks) {
                changesNotifier.addListener(clientListenerId, clientsideCallbacks);
            },
            /**
             * QUESTION: can we do this (technically)? would be nice if clients could programmatically log off from
             * server, saves the server some cycles before it would detect a connection close
             */
            disconnectClient : function () {

            },
            saveProjectDescription: function (projectId, description, callback) {
                dao.saveProjectDescription(projectId, description, callback);
            }
        });

        // handle errors from processing commands from clients: at least log them
        // if we didn't have this error handler, errors would propagate up the stack and effectively close down the
        // application
        d.on('error', function (err) {
            console.error(err.message, err.stack);
        });

        d.pipe(stream).pipe(d);
    });
};