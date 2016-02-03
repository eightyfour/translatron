var async = require('canny/mod/async'),
    auth = require('canny').auth;

auth.onLogout(function () {
    async.doAjax({
        path : '/logout',
        onSuccess : function (response) {
            location.reload();
        }
    })
});

module.exports = {};