var express = require('express'),
    router = express.Router(),
    sessionStore = require('../sessionStore');

router.get('/usersOnline', function(req, res) {
    sessionStore.all(function(err, sessions) {
        var users = [];
        if (!err) {
            for (var item in sessions) {
                users.push(sessions[item].ldapName);
            }
            res.send(users);
        } else {
            res.redirect('/');
        }
    });
});

module.exports = router;