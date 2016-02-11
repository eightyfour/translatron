/**
 * Reads a project JSON and returns the data as raw file format back to the client
 */
var express = require('express'),
    router = express.Router(),
    dao;

router.use('*.property', function(req, res, next) {
    console.log('jpmbfExporter:path', req.originalUrl);
    var id = req.originalUrl.replace('.property', '');
    // return the project as JSON
    dao.loadProject(id, function (json) {
        var msg = JSON.stringify(json.keys.en, 4, '\t');
        res.set('Content-Type', 'text/plain');
        res.send(msg);
    })
});

module.exports = function (dataAccessObject) {
    dao = dataAccessObject;
    return router
};