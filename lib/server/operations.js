module.exports = function(dao, changesNotifier) {
    "use strict";

    var clientListenerId = Math.trunc(Math.random() * Math.pow(10, 10));

    return {
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
         * returns the client listener id
         * @param clientsideCallbacks
         * @returns {*}
         */
        setupClient: function (clientsideCallbacks) {
            changesNotifier.addListener(clientListenerId, clientsideCallbacks);
            return clientListenerId;
        },
        /**
         * QUESTION: can we do this (technically)? would be nice if clients could programmatically log off from
         * server, saves the server some cycles before it would detect a connection close
         */
        disconnectClient : function () {
            changesNotifier.removeListener(clientListenerId);
        },
        saveProjectDescription: function (projectId, description, callback) {
            dao.saveProjectDescription(projectId, description, callback);
        }
    };
};
