var express = require('express'),
    router = express.Router(),
    sessionStore = require('../sessionStore');
/**
 * This can be used:
 * * to keep the session for the user on the server alive - each call to this method will also refresh the session for the user
 * * to check if the user is authenticated (it will return a 401 if not and 204 if everything ok)
 *
 * make sure that this code is only executed if the server has an enabled session handling - otherwise all calls
 * to this method will be answered with a 401
 */
router.get('/touchSession', function(req, res, next) {
    if (req.session)
        sessionStore.get(req.session.id, function (err, session) {
            if (session)
                res.status(204).send()
            else
                res.status(401).send()
        })
    else
        res.status(401).send()
});

module.exports = router;