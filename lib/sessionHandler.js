/**
 * Just saves objects and handle it with an id
 * TODO: generate id with timestamp
 */

var sessionHandler = function (idPrefix) {
    "use strict";

    var id = 0,
        session = {},
        ids = {};

    return {
        save : function (object, objId) {
            var gId = idPrefix + id, ret;
            if (objId && ids.hasOwnProperty(objId)) {
                ret = ids[objId];
            } else {
                id++;
                session[gId] = object;
                ids[objId] = gId;
                ret = gId;
            }

            return ret;
        },
        session : session,
        ids : ids
    };
};

module.exports = sessionHandler;