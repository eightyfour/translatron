/**
 * Reads a project JSON and returns the data as raw file format back to the client
 */
var express = require('express'),
    router = express.Router(),
    parser = require('../unicode-parser'),
    dao;

router.use('*.json', function(req, res, next) {
    console.log('jsonExporter:path', req.originalUrl);
    var id = req.originalUrl.replace('.property', '');
    // return the project as JSON
    dao.loadProject(id, function (json) {
        var obj = {};
        Object.keys(json.keys.de).forEach(function(key) {
            obj[key] = parser.escapeUnicode(json.keys.de[key]);
        });

        res.set('Content-Type', 'text/plain');
        console.log('jsonExporter:obj', obj);
        res.send(JSON.stringify(obj, null, 2));
    })
});

module.exports = function (dataAccessObject) {
    dao = dataAccessObject;
    return router
};