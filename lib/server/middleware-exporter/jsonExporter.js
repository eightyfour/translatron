/**
 * Reads a project JSON and returns the data as raw file format back to the client
 */
var express = require('express'),
    router = express.Router(),
    parser = require('../unicode-parser'),
    dao;


function stringify(keysObject) {
    var bundle = '';
    Object.keys(keysObject).forEach((key) => {
        var value = keysObject[key];
        bundle += key.toString() + '=' + parser.escapeUnicode(value.toString()) + '\n';
    });
    return bundle;
}

router.use('*.json', function(req, res) {
    console.log('jsonExporter:path', req.query);
    var id = req.originalUrl.replace('.json', '');

    // return the project as JSON
    dao.loadProject(id, function (json) {
        var obj = {};
        if (json) {
            Object.keys(json.keys).forEach(function (lang) {
                obj[lang] = {};
                Object.keys(json.keys[lang]).forEach(function (key) {
                    obj[lang][key] = parser.escapeUnicode(json.keys[lang][key]);
                });
            });
            res.set('Content-Type', 'text/plain');
            console.log('jsonExporter:obj', obj);
            var s = JSON.stringify(obj, null, 2);
            console.log('jsonExporter:s', s);
            // while s contains double slash remove them all
            while (/\\\\/.test(s)) {
                s = s.replace('\\\\', '\\');
            }
            res.send(s);
        } else {
            res.status(404)        // HTTP status 404: NotFound
                .send('Not found');
        }
    })
});

module.exports = function (dataAccessObject) {
    dao = dataAccessObject;
    return router
};