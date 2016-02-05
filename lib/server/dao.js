var jsonFileManagerObj = require('./legacy/jsonFileManager'),
    fileManagerObj = require('./legacy/fileManager'),
    sm = require('../util/stringManipulator.js'),
    defaultProject = require('../../static/project.json'),
    fs = require('fs'),
    path = require('path');

// TODO move the create project in a separate file
function getDefaultProjectJson(projectName, obj, cb) {
    var projectObj = {};
    Object.assign(projectObj, defaultProject);

    projectObj.project = projectName;
    projectObj.description = obj.description || defaultProject.description;
    // overwrite the languages - the view doesn't accept actually a array
    projectObj.languages = {};
    projectObj.availableLanguages = defaultProject.languages;
    cb(projectObj);
}

/**
 * Calculates the parent directory structure and returns them as array
 *
 * The first element is the root - with a / as id and no name.
 *
 * @param dir
 * @returns {Array|string}
 */
function getParentDirs(dir) {
    var d = dir.split('/'),
        idx = d.length,
        ret = [];

    for (var i = 0; i < d.length; i++, idx++) {
        var obj = {id: d.slice(0, i + 1).join('/'), name : d[i]};
        if (i === 0 && obj.id === '') {
            obj.id = "/";
            obj.name = "";
            ret.push(obj);
        }
        if (obj.id !== '/') {
            ret.push(obj);
        }
    }
    return ret;
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
 *
 * @param storageDirectory the full path of the directory where projects files are saved.
 */
var dao = function (storageDirectory) {
    "use strict";
    // TODO remove the clientMap layer from here and have it between app.js and dao. See LODEV-4284
    var clientMap = [],    // contains all clients connections
        /**
         * What is this needed for? Number of connections in only increased (in setupClient) but never decreased or
         * read/displayed!
         * @type {number}
         */
        connections = 0,
        jsonFileManager = jsonFileManagerObj(storageDirectory),
        fileManager = fileManagerObj(storageDirectory);

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
     *
     * @param path
     * @returns {XML|void|string|*}
     */
    function computeIdFromPath(path) {
        var s = path;
        // while // remove al double slashes
        while(/\/\//.test(s)) {
            s = path.replace('//', '/');
        }
        // remove .json extension from file if exists
        return s.replace('.json','');
    }

    return {
        /**
         * Loads the whole project json file
         *
         * @param projectId
         * @param cb
         */
        loadProject : function (projectId, cb) {
            var  fullPath = path.normalize(storageDirectory + '/' + projectId + '.json');
            // QUESTION: "new Promise" - is there an alternative to using the constructor here? because we don't need
            // to put the Promise into a variable
            // TODO I am not sure that i have understood the flow for all cases in this Promise...
            new Promise(function(resolve, reject) {
                fs.stat(fullPath, function(err, stats) {
                    if (err || !stats.isFile()) {
                        reject(fullPath +  'does not exist');
                    } else {
                        resolve();
                    }
                });
            }).then(function() {
                return new Promise(function (resolve, reject) {
                    fs.readFile(fullPath, 'utf8', (err, data) => {
                        err && reject(err) || resolve(JSON.parse(data));
                    });
                });
            }).then(function(data) {
                !data.availableLanguages && (data.availableLanguages = defaultProject.languages);
                cb(data);
            }).catch(function() {
                cb(false);
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
            // TBD shouldn't we ensure here that projectID ends with ".json"?
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
        createNewDirectory : function(id, directoryName, parentDirectory, cb) {
            var fullParentDirPath = path.normalize(storageDirectory + '/' + parentDirectory);
            var fullPath = fullParentDirPath + '/' + directoryName;
            console.log('dao.createNewDirectory: request to create ' + fullPath);

            // let's do the checks if directories exists/don't exist synchronously, these are quick operations.
            // if we'd do all of this asynchronously, we would need to have a overcomplicated callback hierarchy
            if (!fs.existsSync(fullParentDirPath)) {
                console.error('dao.createNewDirectory: cannot create directory ' + fullPath + ', parent directory does not exist');
                cb(false);
                return;
            }

            if (fs.existsSync(fullPath)) {
                console.error('dao.createNewDirectory: cannot create directory ' + fullPath + ', exists already');
                cb(false);
                return;
            }

            fs.mkdir(fullPath, function(exception) {
                if (exception) {
                    console.error('dao.createNewDirectory: error creating directory ' + fullPath + ': ' + exception);
                    cb(false);
                } else {
                    console.log('dao.createNewDirectory: ' + fullPath + ' created');
                    cb({
                        directoryId : path.normalize(parentDirectory + '/' + directoryName),
                        parentDirectoryId : parentDirectory
                    });
                }
            });
        },
        /**
         *
         * @param id
         * @param project id
         * @param language
         * @param keyAndValue
         * @param cb
         */
        saveKey : function (id, projectId, language, keyAndValue, cb) {
            jsonFileManager.getJSON(projectId + '.json', (projectObj) => {
                if (projectObj) {
                    // check if lang exists
                    if (!projectObj.keys[language]) {
                        projectObj.keys[language] = {};
                    }
                    projectObj.keys[language][keyAndValue.key] = keyAndValue.value;
                    jsonFileManager.saveJSON(projectId, projectObj, (err) => {
                        cb(keyAndValue.key, keyAndValue.value);
                        broadcast(id, { projectId : projectId, languages: language }, keyAndValue);
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
            var keyFound = 0;
            jsonFileManager.getJSON(projectId + '.json', (projectObj) => {
                if (projectObj.keys) {
                    Object.keys(projectObj.keys).forEach((lang) => {
                        if (projectObj.keys[lang][data.oldKey]) {
                            projectObj.keys[lang][data.newKey] = projectObj.keys[lang][data.oldKey];
                            delete projectObj.keys[lang][data.oldKey];
                            keyFound++;
                        }
                    });
                    if (keyFound === 0) {
                        // then no key was updated so the key could not be renamed
                        cb(false);
                    } else {
                        jsonFileManager.saveJSON(projectId, projectObj, (err) => {
                            cb(data.oldKey, data.newKey);
                            //  broadcastRemoveKey(null, {bundle : bundleObj.bundle, locale: lang}, {key: oldKey});
                            // change it: send a rename kay instead of create a new one and mark the old as deleted
                            // broadcast(id, bundle, {key: data.key, value: data.value});
                        });
                    }
                }
            });
        },
        /**
         * remove a key
         * @param id
         * @param projectId
         * @param data
         * @param cb
         */
        removeKey : function (id, projectId, keyName, cb) {
            jsonFileManager.getJSON(projectId + '.json', (projectObj) => {
                if (projectObj.keys) {
                    Object.keys(projectObj.keys).forEach((lang) => {
                        if (projectObj.keys[lang][keyName]) {
                            delete projectObj.keys[lang][keyName];
                        }
                    });
                    jsonFileManager.saveJSON(projectId, projectObj, (err) => {
                        cb(keyName);
                        //broadcastRemoveKey(null, {bundle : bundleObj.bundle, locale: lang}, {key: key});
                    });
                } else {
                    cb(false);
                }
            });
        },
        /**
         * dir should always start with a slash!
         * @param dir
         * @param cb
         */
        getDirectory : function(dir, cb) {
            if (dir[0] === '/') {
                fileManager.listDir(dir, function (entry) {
                    var directories = [],
                        projects = [];
                    if (entry) {
                        entry.value.forEach((item) => {
                            if (item.d) {
                                directories.push({
                                    name: item.name,
                                    id: computeIdFromPath(item.id)
                                });
                                // TODO exclude project.json file - if project.json is remove from project folder please
                                // remove this check - otherwise no projects with name project could be exists
                            } else if (/\.json/.test(item.name) && item.name !== 'project.json') {
                                projects.push({
                                    name: item.name.replace('.json', ''),
                                    id: computeIdFromPath(item.id)
                                });
                            }
                        });
                        // TBD do not include parentDir if there is none (this would make the decision in the client if user
                        //      can go to a parent dir more transparent: instead of checking for "/" just check for null)
                        cb({
                            projects: projects,
                            dirs: directories,
                            parentDirectory: fileManager.getParentDirectory(dir),
                            currentDirectory: dir,
                            parentDirectories : getParentDirs(dir)
                        });
                    } else {
                        cb(false);
                    }
                });
            } else {
                console.error('dao:ask for a not valid directory type - all directories must be start with a slash!');
                cb(false);
            }
        },
        setupClient : function (client, cb) {
            var id = 'id_' + connections++;
            clientMap[id] = client;
            cb(id);
        }
    };
};

module.exports = dao;