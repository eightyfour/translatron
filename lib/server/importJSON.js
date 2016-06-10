var express = require('express'),
    router = express.Router(),
    importJsonCallback;

router.post('/importJSON', function(req, res) {
    var projectId = req.query.projectId;

    req.pipe(req.busboy);
    req.busboy.on('file', function(fieldname, file, filename) {
        var string = '';

        file.on('data', function(data) {
            string += data.toString();
        });

        file.on('end', function() {
            try {
                importJsonCallback(projectId, JSON.parse(string), function(success) {
                    if (success) {
                        res.status(200).send({projectId: projectId});
                    } else {
                        res.status(406).send({projectId: projectId});
                    }
                });
            } catch(err) {
                res.set({
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                });
                res.status(406).send({success: false, msg: 'Valid JSON required.', projectId: projectId});
            }
        });

    });
});

module.exports = function(cb) {
    importJsonCallback = cb;
    return router
};