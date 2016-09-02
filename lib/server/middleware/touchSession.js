var express = require('express'),
    router = express.Router(),
    sessionStore = require('../sessionStore');

router.get('/touchSession', function(req, res, next) {

    req.session.touch(function(err) {
        console.log(err);
        res.redirect('/login');
    });

    next();
});

module.exports = router;