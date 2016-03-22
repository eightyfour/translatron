var express = require('express'),
    router = express.Router(),
    fs = require('fs'),
    acceptedImageExtensions = ['jpeg','jpg','png','gif'];


/**
 *
 * TODO refactor this and use the common one from translatron
 *
 * check if folder exists - otherwise create one
 * @param folder
 * @param cb
 */
function createFolder(rootFolder, folder, cb) {
    var folders = [],
        actualFolder = "";
    // create array
    folder.split('/').forEach(function (f) {
        // remove empty strings like ''
        if (f !== '') {
            folders.push(f);
        }
    });

    (function create(idx) {
        if (idx < folders.length) {
            actualFolder += '/' + folders[idx];
            fs.exists(rootFolder + actualFolder, function (exists) {
                if (exists) {
                    create(idx + 1);
                } else {
                    fs.mkdir(rootFolder + actualFolder, function () {
                        create(idx + 1);
                    });
                }
            });
        } else {
            cb();
        }
    }(0));
}

router.post('/uploadFile',  function (req, res) {
    var fstream, folder = req.query.projectId;

    req.pipe(req.busboy);
    req.busboy.on('file', function (fieldname, file, filename) {
        // replace all spaces with underscores
        var fName = filename.split(' ').join('_');

        function writeFile() {
            console.log('app:writeFile' + __dirname + '/files' + folder + fName);
            fstream = fs.createWriteStream(__dirname + '/files' + folder + fName);
            file.pipe(fstream);
            fstream.on('close', function () {
                // TODO add correct type
                var extension = fName.split('.')[1];
                if (acceptedImageExtensions.indexOf(extension) !== -1) {
                    res.status(200).send({file: '/files' + folder + fName, name : fName, type: 'image/jpg'});
                } else {
                    res.status(200).send({file: '/files' + folder + fName, name : fName, type: extension});
                }
            });
        }
        console.log('uploadFile', '/files' + folder);
        createFolder(__dirname, '/files' + folder, writeFile);
    });
});

module.exports = router;