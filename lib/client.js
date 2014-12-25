var fileMgr = require('./resourceHandler');
/**
 * Each client need a client object
 *  - register onclose and remove if client connection is lost
 *
 *  bowserClient = {
 *      id : '',
 *      broadCast : {fromBundle : null, toBundle : null},
 *      updateKey : fc()
 *  }
 */
var client = function (dirName) {
    "use strict";

    var me = [],
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
                if (bundle1.bundle === bundle2.bundle && bundle1.locale === bundle2.locale) {
                    return true;
                }
                return false;
            }
        },
        broadcast = function (notForId, bundleName,  obj) {

            var actualClientId = notForId, distributeObj = obj;
            me.forEach(function (client, idx) {
                if (client.id !== actualClientId || obj.value === '') {
                    if (fc.isBundleEqual(client.client.broadCast.fromBundle, bundleName) ||
                            fc.isBundleEqual(client.client.broadCast.toBundle, bundleName)) {
                        client.client.updateKey(bundleName, distributeObj);
                    }
                }
            });
        };
    return {
        getMessageBundle : function (bundle, cb) {
            var stringBack;
            fileMgr.readFile(fc.generatePathName(bundle), function (obj) {
                stringBack = JSON.stringify(obj);
                if (stringBack) {
                    cb(stringBack);
                }
            });
        },
        sendResource : function (id, bundle, data, cb) {

            fileMgr.writeFile(fc.generatePathName(bundle), data.key, data.value, function (key, value) {
                broadcast(id, bundle, {key: key, value: value});
                cb(key);
            });

        },
        setupClient : function (client, cb) {
            var id = 'id_' + connections++;
            me.push({id: id, client: client});
            cb(id);
        }
    };
};

module.exports = client;