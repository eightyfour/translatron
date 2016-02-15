/**
 * A client's interface to the backend API, instantiated on a per client base. To receive notifications about operations
 * by other clients, use attachClientCallbacks.
 * @param dao
 * @param changesNotifier
 * @returns {{loadProject: loadProject, saveKey: saveKey, renameKey: renameKey, removeKey: removeKey, createNewProject: createNewProject, getDirectory: getDirectory, createNewDirectory: createNewDirectory, attachClientCallbacks: attachClientCallbacks, detachClientCallbacks: detachClientCallbacks, saveProjectDescription: saveProjectDescription}}
 */
module.exports = function(dao, changesNotifier) {
    'use strict';

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
        /**
         *
         * @param path
         * @param projectName
         * @param obj default values for the project (as now of, only 'description' is supported)
         * @param cb
         */
        createNewProject: function (path, projectName, obj, cb) {
            dao.createNewProject(path, projectName, obj, function(err, projectData) {
                if (!err) {
                    cb(null, projectData);
                    changesNotifier.notify('newProjectWasCreated', projectData.projectId, clientListenerId);
                } else {
                    cb(err);
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
        attachClientCallbacks: function (clientsideCallbacks) {
            changesNotifier.addListener(clientListenerId, clientsideCallbacks);
            return clientListenerId;
        },
        /**
         * QUESTION: can we do this (technically)? would be nice if clients could programmatically log off from
         * server, saves the server some cycles before it would detect a connection close
         */
        detachClientCallbacks : function () {
            changesNotifier.removeListener(clientListenerId);
        },
        saveProjectDescription: function (projectId, description, callback) {
            dao.saveProjectDescription(projectId, description, callback);
        }
    };
};