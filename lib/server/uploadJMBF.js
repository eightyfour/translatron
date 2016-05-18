var express = require('express'),
    router = express.Router(),
    fs = require('fs'),
    mkdir = require('./mkdir-p'),
    fileUploadCb;

// takes the content of a properties file and returns it as json
function convertPropertiesToJson(data) {
    var asJson = {};
    // parse every line and store key-value-pairs as json
    data.split('\n').forEach(function(line) {
        var splitted;
        // skip comments and empty strings
        if (line.indexOf('#') === -1 && line.length > 2) {
            splitted = line.split('=');
            // prototype
            asJson[splitted[0]] = splitted[1];
        }
    });
    return asJson;
}

function getLanguage(fileName) {
    var lang = fileName.split('.')[0].split('_')
    return lang.length > 1 ? lang[1] : undefined; 
}

router.post('/uploadJMBFFile',  function (req, res) {
    var fstream, projectId = req.query.projectId, key = req.query.key, project = req.query.project;

    req.pipe(req.busboy);
    req.busboy.on('file', function (fieldname, file, filename) {
        // replace all spaces with underscores and prefix it with the project name
        // var fName = project + '_' + filename.split(' ').join('_');
        var string = '';
        console.log('uploadJMBF:folder', projectId); // /sub/sub1
        console.log('uploadJMBF:project', project); // sub1
        console.log('uploadJMBF:filename', filename); // messages.properties

        file.on('data', function(data) {
            string += data.toString();
        });
        file.on('end', function() {
            var asJSON = convertPropertiesToJson(string);
            console.log('File [' + fieldname + '] Finished', asJSON);
            fileUploadCb(projectId, getLanguage(filename), asJSON);
            res.status(200).send({projectId: projectId});
        });

    });
});

module.exports = function (fileUploadCallback) {
    fileUploadCb = fileUploadCallback;
    return router
};