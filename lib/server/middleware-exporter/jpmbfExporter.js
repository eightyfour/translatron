/**
 * Reads a project JSON and returns the data as raw file format back to the client
 */
var express = require('express'),
    router = express.Router(),
    parser = require('../unicode-parser'),
    dao;

function keysToMessageBundle(keysObject) {
    var bundle = '';
    Object.keys(keysObject).forEach((key) => {
        var value = keysObject[key];
        bundle += key.toString() + '=' + parser.escapeUnicode(value.toString()) + '\n';
    });
    return bundle;
}

router.use('*messageBundle.properties', function(req, res, next) {
    console.log('jpmbfExporter:path', req.originalUrl);
    var projectId = req.originalUrl.replace('/messageBundle.properties', '');
    dao.loadProject(projectId, function (projectData) {
        res.set('Content-Type', 'text/plain');
        // TODO for now we'll only use "en" but will become dynamic later
        res.send(keysToMessageBundle(projectData.keys.de));
    });
});

module.exports = function (dataAccessObject) {
    dao = dataAccessObject;
    return router;
};