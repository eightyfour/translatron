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

router.get(/.?\/(\w|-)+\.properties/, function(req, res) {
    var projectId = req.path.replace('.properties', '').replace('/', ''),
        // TODO read default language from main project config
        lang = req.query.lang || 'en';
    dao.loadProject(projectId, function (projectData, {id, name, url, file}) {
        if (projectData) {
            if (projectData.keys.hasOwnProperty(lang)) {
                res.set('Content-Type', 'text/plain');
                res.send(keysToMessageBundle(projectData.keys[lang]));
            } else {
                res.status(404).send('# No keys have been defined for ' + lang);
            }
        } else {
            res.status(404).send('Project ' + projectId + ' not found');
        }
    });
});

module.exports = function (dataAccessObject) {
    dao = dataAccessObject;
    return router;
};