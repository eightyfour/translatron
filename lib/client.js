var keyValueFileManager = require('./keyValueFileManager');
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
var client = function (dirName) {
    "use strict";

    var clientMap = [],    // contains all clients connections
        connections = 0,
        fc = {
            generatePathName : function (bundleObj) {
                var fileName = 'messages';
                if (bundleObj.locale) {
                    fileName += '_' + bundleObj.locale;
                }
                return dirName + '/static/' + bundleObj.bundle + '/' + fileName + '.properties';
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
         * @param obj {bundle: string, locale: string}
         * @param cb
         */
        getMessageBundle : function (obj, cb) {
            console.log('getMessageBundle', obj);
            keyValueFileManager.readFile(fc.generatePathName(obj), function (objKeyValues) {
                console.log('getMessageBundle callback ', objKeyValues);
                if (objKeyValues) {
                    cb({
                        data : objKeyValues.data,
                        language : obj.locale
                    });
                }
            });
        },
        /**
         *
         */
        createNewProject : function (id, projectName) {
            console.log('client:createNewProject', id, projectName);
            Object.keys(clientMap).forEach(function (clientIds) {
                var client = clientMap[clientIds];
                if (clientIds !== id) {
                    // if (client.projectName === bundleName) {
                    console.log('createNewProject: call client about new projectName');
                    client.newProjectWasCreated(projectName);
                    // }
                }
            })
        },
        /**
         *
         * @param id
         * @param bundle
         * @param data
         * @param cb
         */
        sendResource : function (id, bundle, data, cb) {
            keyValueFileManager.saveAsKeyEqualsValue(fc.generatePathName(bundle), data.key, data.value, function (key, value) {
                cb(key);
                broadcast(id, bundle, {key: key, value: value});
            });
        },
        /**
         * rename a key
         *
         * TODO get the correct value and call the 'delete key' method
         *
         * @param id
         * @param bundle
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
                        }
                        broadcast(null, {bundle : bundleObj.bundle, locale: lang}, {key: newKey, oldKey: oldKey, value: value});
                        broadcastRemoveKey(null, {bundle : bundleObj.bundle, locale: lang}, {key: oldKey});
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

module.exports = client;