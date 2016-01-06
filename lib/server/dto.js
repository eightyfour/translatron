var keyValueFileManager = require('./keyValueFileManager'),
    jsonFileManager = require('./legacy/jsonFileManager'),
    sm = require('../util/stringManipulator.js'),
    defaultProject = require('../../static/project.json');

// TODO move the create project in a separate file
function getDefaultProjectJson(projectName, obj, cb) {
    var projectObj = {};
    Object.assign(projectObj, defaultProject);

    projectObj.project = projectName;
    projectObj.description = obj.description || defaultProject.description;
    // overwrite the languages - the view doesn't accept actually a array
    projectObj.languages = {};
    cb(projectObj);
}

/**
 * Each client need a client object
 *  - register onclose and remove if client connection is lost
 *
 *  browserClient = {
 *      id : '',
 *      broadCast : {fromBundle : null, toBundle : null},
 *      updateKey : fc()
 *  }
 */
var dto = function (dirName) {
    "use strict";
    // TODO remove the clientMap layer from here and have it between app.js and dto. See LODEV-4284
    var clientMap = [],    // contains all clients connections
        connections = 0;

    /**
     *
     * @param notForId
     * @param bundleName
     * @param obj
     */
    function broadcast(notForId, bundleName,  obj) {
        var actualClientId = notForId, distributeObj = obj;
        Object.keys(clientMap).forEach(function (id) {
            var client = clientMap[id];
            if (id !== actualClientId || obj.value === '') {
                // if (client.projectName === bundleName) {
                    console.log('broadcast: call client updateKey');
                    client.updateKey(bundleName, distributeObj);
                // }
            }
        })
    }
    /**
     *
     * @param notForId
     * @param bundleName
     * @param obj
     */
     function broadcastRemoveKey(notForId, bundleName,  obj) {
        Object.keys(clientMap).forEach(function (id) {
            var client = clientMap[id];
            if (id !== notForId) {
                console.log('broadcast: call client keyRemoved');
                // TODO rename to removeKey or keyDeleted
                client.keyRemoved(bundleName, obj);
            }
        });
    }

    /**
     * legacy
     * @param bundleObj
     * @returns {string}
     */
    function generatePathName(bundleObj) {
        var fileName = 'messages';
        if (bundleObj.locale) {
            fileName += '_' + bundleObj.locale;
        }
        return dirName + bundleObj.bundle + '/' + fileName + '.properties';
    }

    return {
        /**
         *
         * TODO refactor path and project and instead use the projectId.
         *
         * @param path
         * @param project
         * @param cb
         */
        getProjectTranslation : function (path, project, cb) {
            jsonFileManager.getJSON(sm.addFirstAndLastSlash(path) + project + '.json', function (data) {
                if (data) {
                    if (Object.keys(data.keys).length === 0) {
                        // TODO not sure if false is OK - the project exists but contains no translations
                        cb(false);
                    }
                    Object.keys(data.keys).forEach((lang) => {
                        cb({
                            data : data.keys[lang],
                            language : lang
                        })
                    })
                } else {
                    // the project doesn't exists
                    cb(false);
                }
            });
        },
        /**
         * The id is currently not used but it's important for the broadcast implementation to notifier all other
         * clients about this new project.
         *
         * Creates a new [project name].json from the default project.json template.
         *
         * @param id (legacy)
         * @param path
         * @param projectName
         * @param obj
         * @param cb
         */
        createNewProject : function (id, path, projectName, obj, cb) {
            var nPath = sm.addFirstAndLastSlash(path);
            getDefaultProjectJson(projectName, obj, (json) => {
                // send back
                json.projectId = nPath + projectName;
                jsonFileManager.saveJSON(json.projectId, json, function (err) {
                    if (err === null) {
                        cb(json);
                    } else {
                        // TODO handle error in a better way
                        cb(false);
                    }
                });
            });
        },
        /**
         *
         * @param id
         * @param bundle
         * @param data
         * @param cb
         */
        sendResource : function (id, bundle, data, cb) {
            jsonFileManager.getJSON(bundle.projectId + '.json', (projectObj) => {
                if (projectObj) {
                    // check if lang exists
                    if (!projectObj.keys[bundle.locale]) {
                        projectObj.keys[bundle.locale] = {};
                    }
                    projectObj.keys[bundle.locale][data.key] = data.value;
                    jsonFileManager.saveJSON(bundle.projectId, projectObj, (err) => {
                        cb(data.key);
                        broadcast(id, bundle, {key: data.key, value: data.value});
                    });
                } else {
                    // project doesn't exists
                    cb(false);
                }
            });
        },
        /**
         * rename a key
         *
         * @param id
         * @param projectId
         * @param data {oldKey : String, newKey : String}
         * @param cb
         */
        renameKey : function (id, projectId, data, cb) {
            jsonFileManager.getJSON(projectId + '.json', (projectObj) => {
                if (projectObj.keys) {
                    Object.keys(projectObj.keys).forEach((lang) => {
                        if (projectObj.keys[lang][data.oldKey]) {
                            projectObj.keys[lang][data.newKey] = projectObj.keys[lang][data.oldKey];
                            delete projectObj.keys[lang][data.oldKey];
                        }
                    });
                    jsonFileManager.saveJSON(projectId, projectObj, (err) => {
                        cb(data.oldKey, data.newKey);
                        // change it: send a rename kay instead of create a new one and mark the old as deleted
                        // broadcast(id, bundle, {key: data.key, value: data.value});
                    });
                }
            });
        },
        /**
         * remove a key
         * @param id
         * @param bundleObj
         * @param data
         * @param cb
         */
        removeKey : function (id, bundleObj, data, cb) {
            var l = 0;
            if (bundleObj.locales) {
                l = bundleObj.locales.length;
                bundleObj.locales.forEach(function (lang) {
                    keyValueFileManager.removeKey(generatePathName({bundle : bundleObj.bundle, locale: lang}), data.key, function (key) {
                        l--;
                        if (l <= 0) {
                            cb(key);
                            broadcastRemoveKey(null, {bundle : bundleObj.bundle, locale: lang}, {key: key});
                        }
                    });
                });
            }
        },
        setupClient : function (client, cb) {
            var id = 'id_' + connections++;
            clientMap[id] = client;
            cb(id);
        }
    };
};

module.exports = dto;