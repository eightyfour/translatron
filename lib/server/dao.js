var fileManagerObj = require('./legacy/fileManager'),
    fs = require('fs'),
    path = require('path');

/**
 * Template for new project configs.
 * @type {{description: string, numberOfKeys: number, defaultLanguage: string, availableLanguages: string[], languages: {}, keys: {}, keyDescriptions: {}}}
 */
var projectConfigTemplate = {
    description : '',
    // TBD compute on the fly? if not possible, add explanation why
    numberOfKeys : 0,
    defaultLanguage : 'en',
    /**
     * The list of languages supported/allowed for a project
     */
    availableLanguages : [
        "en",
        "de",
        "fr",
        "es",
        "nl",
        "da",
        "sv",
        "en_GB"
    ],
    // Each property is a language and has one property "translated" which is the number of translated keys for that language
    // TBD do we really need this? wouldn't we be faster if we computed that on the fly? Or are there any other concerns
    // which make this necessary?
    languages : {},
    /**
     * The translated keys. keys are properties, their values are maps where keys are i18n keys and values are the translations
     * for the language.
     */
    keys : {},
    /**
     * TODO describe this structure
     */
    keyDescriptions : {}
};

/**
 *
 * @param projectName
 * @param obj Optional objecct with
 */
function createInitialProjectConfig(projectName, obj) {
    var projectObj = {};
    Object.assign(projectObj, projectConfigTemplate);

    projectObj.project = projectName;
    projectObj.description = obj && obj.description || projectConfigTemplate.description;
    return projectObj;
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
 *
 * @param storageDirectory the full path of the directory where projects files are saved.
 */
var dao = function (storageDirectory) {
    "use strict";

    // a simple call to statSync will already throw an error if the directory does not exist
    if (!fs.statSync(storageDirectory).isDirectory()) {
        throw new Error('dao.storageDirectory ' + storageDirectory + ' is not a directory');
    };

    var fileManager = fileManagerObj(storageDirectory);

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

    /**
     * Persist a project as a file below "storageDirectory". "projectData" should be complete and well-formed (especially
     * the projectId).
     * Please note: this function will overwrite an existing file without warning!
     * @param projectData
     * @param callback - will be called with either "true" if project file was written successfully, "false" otherwise.
     */
    function writeProjectConfigFile(projectData, callback) {
        var whitespacesSize = 2;
        var stringifiedProject = JSON.stringify(projectData, null, whitespacesSize);
        var projectFilePath = storageDirectory + '/' + projectData.projectId + '.json';
        fs.writeFile(projectFilePath, stringifiedProject, (err) => {
            if (err) {
                console.warn('Error writing project file', projectData, ':', err);
            }
            callback(err ? false : true);
        });
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
                // QUESTION: which purpose does this Promise have? is it only about passing resolve and reject handlers
                // into the function? or does it somehow link to the outer Promise?
                return new Promise(function (resolve, reject) {
                    fs.readFile(fullPath, 'utf8', (err, data) => {
                        if (err) {
                            reject(err);
                        } else {
                            try {
                                resolve(JSON.parse(data));
                            } catch(ex) {
                                reject(ex);
                            }
                        }
                    });
                });
            }).then(function(data) {
                !data.availableLanguages && (data.availableLanguages = projectConfigTemplate.languages);
                cb(data);
            }).catch(function() {
                cb(false);
            });
        },
        /**
         *
         * Creates a new [project name].json from the default template (see projectConfigTemplate).
         *
         * @param parentDirectory
         * @param projectName (without .json appendix)
         * @param obj
         * @param cb
         */
        createNewProject : function (parentDirectory, projectName, obj, cb) {
            var projectData = createInitialProjectConfig(projectName, obj);
            projectData.projectId = parentDirectory + projectName;
            writeProjectConfigFile(projectData, (success) => {
                if (success) {
                    cb(true, projectData);
                } else {
                    cb(false);
                }
            });
        },
        createNewDirectory : function(directoryName, parentDirectory, cb) {
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
        saveProjectDescription : function(projectId, description, callback) {
            this.loadProject(projectId, (projectData) => {
                if (!projectData) {
                    console.warn('Project', projectId, 'does not exist, cannot update decription');
                    callback(false);
                    return;
                }

                projectData.description = description;

                writeProjectConfigFile(projectData, (success) => {
                    if (success) {
                        callback(true);
                    } else {
                        callback(false);
                    }
                });
            });
        },
        /**
         *
         * @param project id
         * @param language
         * @param keyAndValue
         * @param cb
         */
        saveKey : function (projectId, language, keyAndValue, cb) {
            this.loadProject(projectId, (project) => {
                if (!project) {
                    console.warn('Project', projectId, 'does not exist, key', keyAndValue, 'cannot be saved');
                    cb(false);
                    return;
                }

                // check if language exists, provide empty object if needed
                if (!project.keys[language]) {
                    project.keys[language] = {};
                }
                project.keys[language][keyAndValue.key] = keyAndValue.value;

                writeProjectConfigFile(project, (success) => {
                    if (false) {
                        cb(false);
                    } else {
                        cb(keyAndValue.key, keyAndValue.value);
                    }
                });
            });
        },
        /**
         * rename a key
         *
         * @param projectId
         * @param data {oldKey : String, newKey : String}
         * @param cb
         */
        renameKey : function (projectId, data, cb) {
            var keyFound = 0;
            this.loadProject(projectId, (projectObj) => {
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
                        console.warn('No keys have been renamed');
                        cb(false);
                    } else {
                        writeProjectConfigFile(projectObj, (success) => {
                           if (success) {
                               cb(data.oldKey, data.newKey);
                           } else {
                               cb(false);
                           }
                        });
                    }
                }
            });
        },
        /**
         * remove a key
         * @param projectId
         * @param data
         * @param cb
         */
        removeKey : function (projectId, keyName, cb) {
            this.loadProject(projectId, (projectObj) => {
                if (projectObj.keys) {
                    Object.keys(projectObj.keys).forEach((lang) => {
                        if (projectObj.keys[lang][keyName]) {
                            delete projectObj.keys[lang][keyName];
                        }
                    });
                    writeProjectConfigFile(projectObj, (success) => {
                        if (success) {
                            cb(keyName);
                            //broadcastRemoveKey(null, {bundle : bundleObj.bundle, locale: lang}, {key: key});
                        } else {
                            cb(false);
                        }
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
            cb(Date.now());
        }
    };
};

module.exports = dao;