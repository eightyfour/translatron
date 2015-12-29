var keyValueFileManager = require('./keyValueFileManager'),
    jsonFileManager = require('./legacy/jsonFileManager'),
    sm = require('../util/stringManipulator.js');
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
 *  TODO instead of save the project JSON in the folder
 */
var dto = function (dirName) {
    "use strict";

    var clientMap = [],    // contains all clients connections
        connections = 0,
        fc = {
            generatePathName : function (bundleObj) {
                var fileName = 'messages';
                if (bundleObj.locale) {
                    fileName += '_' + bundleObj.locale;
                }
                return dirName + bundleObj.bundle + '/' + fileName + '.properties';
            },
            isBundleEqual : function (bundle1, bundle2) {
                return bundle1 === bundle2
            }
        },
        /**
         *
         * @param notForId
         * @param bundleName
         * @param obj
         */
        broadcast = function (notForId, bundleName,  obj) {
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
        },
        /**
         *
         * @param notForId
         * @param bundleName
         * @param obj
         */
        broadcastRemoveKey = function (notForId, bundleName,  obj) {
            Object.keys(clientMap).forEach(function (id) {
                var client = clientMap[id];
                if (id !== notForId) {
                    console.log('broadcast: call client keyRemoved');
                    // TODO rename to removeKey or keyDeleted
                    client.keyRemoved(bundleName, obj);
                }
            });
        };
    return {
        /**
         *
         * @param projectPath
         * @param cb
         */
        getProjectTranslation : function (path, project, cb) {
            jsonFileManager.getJSON(path + project + '.json', function (data) {
                if (data) {
                    Object.keys(data.keys).forEach(function (lang) {
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
         *
         */
        createNewProject : function (id, path, projectName, json) {
            console.log('client:createNewProject', id, path, projectName);
            jsonFileManager.saveJSON(sm.removeAllDoubleSlashes(path + '/' ), projectName + '.json', json);
        },
        /**
         *
         * @param id
         * @param bundle
         * @param data
         * @param cb
         */
        sendResource : function (id, bundle, data, cb) {
            jsonFileManager.getJSON(bundle.projectId + '.json', function (projectObj) {
                console.log('dto:data', data);
                var split = bundle.projectId.split('/');
                // check if lang exists
                if (!projectObj.keys[bundle.locale]) {
                    projectObj.keys[bundle.locale] = {};
                }
                projectObj.keys[bundle.locale][data.key] = data.value;
                var url = split.slice(0, split.length - 1).join('/');
                jsonFileManager.saveJSON(url === '' ? '/' : url, bundle.project + '.json', projectObj , function (err) {
                    cb(data.key);
                    broadcast(id, bundle, {key: data.key, value: data.value});
                });

            //keyValueFileManager.saveAsKeyEqualsValue(fc.generatePathName(bundle), data.key, data.value, function (key, value) {
            //
            //});
            });
        },
        /**
         * rename a key
         *
         * @param id
         * @param bundleObj
         * @param data
         * @param cb
         */
        renameKey : function (id, bundleObj, data, cb) {
            var l = 0;
            if (bundleObj.locales) {
                l = bundleObj.locales.length;
                bundleObj.locales.forEach(function (lang) {
                    keyValueFileManager.renameKey(fc.generatePathName({bundle : bundleObj.bundle, locale: lang}), data.newKey, data.oldKey, function (newKey, oldKey, value) {
                        l--;
                        if (l <= 0) {
                            cb(newKey, oldKey, value);
                            broadcastRemoveKey(null, {bundle : bundleObj.bundle, locale: lang}, {key: oldKey});
                        }
                        broadcast(null, {bundle : bundleObj.bundle, locale: lang}, {key: newKey, oldKey: oldKey, value: value});
                    });
                });
            }
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
                    keyValueFileManager.removeKey(fc.generatePathName({bundle : bundleObj.bundle, locale: lang}), data.key, function (key) {
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