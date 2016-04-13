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
            dao.saveKey(projectId, language, keyAndValue, (err, keyName, keyValue) => {
                if (!err) {
                    cb(null, keyName, keyValue);
                    changesNotifier.notify('keyUpdated', [projectId, language, keyName, keyValue], clientListenerId);
                } else {
                    cb(err);
                }
            });
        },
        renameKey: function (projectId, renameData, cb) {
            dao.renameKey(projectId, renameData, (err, oldKeyName, newKeyName) => {
                if (!err) {
                    cb(null, oldKeyName, newKeyName);
                    changesNotifier.notify('keyRenamed', [ projectId, oldKeyName, newKeyName ], clientListenerId);
                } else {
                    cb(err);
                }
            });
        },
        removeKey: function (projectId, keyName, cb) {
            dao.removeKey(projectId, keyName, (err) => {
                if (!err) {
                    cb(null, keyName);
                    changesNotifier.notify('keyDeleted', [ projectId, keyName ], clientListenerId);
                } else {
                    cb(err);
                }
            });
        },
        /**
         * On success, this function will do a broadcast of "newProjectWasCreated", with projectId as the payload.
         * @param path
         * @param projectName
         * @param obj default values for the project (as now of, only 'description' is supported)
         * @param cb
         */
        createNewProject: function (path, projectName, obj, cb) {
            dao.createNewProject(path, projectName, obj, (err, projectData) => {
                if (!err) {
                    cb(null, projectData);
                    changesNotifier.notify('newProjectWasCreated', [ projectData.projectId ], clientListenerId);
                } else {
                    cb(err);
                }
            });
        },
        getDirectory: function (dir, cb) {
            dao.getDirectory(dir, cb);
        },
        /**
         *
         * @param directoryName
         * @param path
         * @param cb a callback function where first parameter is an optional error and 2nd parameter of directory data
         * (see dao.createNewDirectory) if successful.
         */
        createNewDirectory: function (directoryName, path, cb) {
            dao.createNewDirectory(directoryName, path, (err, directoryData) => {
                if (!err) {
                    cb(null, directoryData);
                    changesNotifier.notify('newDirectoryCreated', [ directoryData.directoryId ], clientListenerId);
                } else {
                    cb(err);
                }
            });
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
         * Call when the connection to client closes, changesNotifier will no longer send updates to that client.
         */
        detachClientCallbacks : function () {
            changesNotifier.removeListener(clientListenerId);
        },
        /**
         *
         * @param projectId
         * @param description
         * @param id
         * @param callback a callback function, will be called without any arguments on success and with Error parameter
         * on failure.
         */
        saveProjectDescription: function (projectId, id, description, callback) {
            dao.saveProjectDescription(projectId, id, description, (err) => {
                if (!err) {
                    callback();
                    changesNotifier.notify('projectDescriptionUpdated', [ projectId, id, description ], clientListenerId);
                } else {
                    callback(err);
                }
            });
        },
        addImage : function (projectId, id, fileName) {
            dao.addImage(projectId, id, fileName, (err) => {
                if (!err) {
                    changesNotifier.notify('addImage', [projectId, id, fileName], clientListenerId);
                }
            });
        },
        removeImage: function (projectId, categoryName, cb) {
            dao.removeImage(projectId, categoryName, (err) => {
                if (!err) {
                    cb(null, categoryName);
                    changesNotifier.notify('imageRemoved', [ projectId, categoryName ], clientListenerId);
                } else {
                    cb(err);
                }
            });
        }
    };
};
