var express = require('express'),
    router = express.Router(),
    fs = require('fs'),
    mkdir = require('./mkdir-p'),
    acceptedImageExtensions = ['jpeg','jpg','png','gif'],
    directory,
    fileUploadCb;

router.post('/uploadFile',  function (req, res) {
    var fstream, folder = req.query.projectId, key = req.query.key, project = req.query.project;

    req.pipe(req.busboy);
    req.busboy.on('file', function (fieldname, file, filename) {
        // replace all spaces with underscores and prefix it with the project name
        var fName = project + '_' + filename.split(' ').join('_');

        function writeFile() {
            console.log('app:writeFile' + directory + folder + '/' + fName);
            fstream = fs.createWriteStream(directory + folder + '/' + fName);
            file.pipe(fstream);
            fstream.on('close', function () {
                // TODO add correct type
                var extension = fName.split('.')[1];
                if (acceptedImageExtensions.indexOf(extension) !== -1) {
                    res.status(200).send({file: folder + '/' + fName, name : fName, type: 'image/jpg'});
                } else {
                    res.status(200).send({file: folder + '/' + fName, name : fName, type: extension});
                }
                fileUploadCb(folder, key, fName);
            });
        }
        console.log('uploadFile', '/' + folder);
        mkdir(directory, '/' + folder, writeFile);
    });
});

module.exports = function (dirName, fileUploadCallback) {
    fileUploadCb = fileUploadCallback;
    directory = dirName;
    return router
};