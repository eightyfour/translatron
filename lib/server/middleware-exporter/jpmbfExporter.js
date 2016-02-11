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
    var projectId = req.baseUrl.replace('/messageBundle.properties', ''),
        // TODO read default language from main project config
        lang = req.query.lang || 'en';
    dao.loadProject(projectId, function (projectData) {
        if (projectData && projectData.keys.hasOwnProperty(lang)) {
            res.set('Content-Type', 'text/plain');
            // TODO for now we'll only use "en" but will become dynamic later
            res.send(keysToMessageBundle(projectData.keys[lang]));
        } else {
            res.status(404)        // HTTP status 404: NotFound
                .send('Not found');
        }
    });
});

module.exports = function (dataAccessObject) {
    dao = dataAccessObject;
    return router;
};