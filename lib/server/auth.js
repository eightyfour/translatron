var passport = require('passport'),
    LdapStrategy = require('passport-ldapauth').Strategy,
    fs = require('fs');

passport.use(new LdapStrategy({
    server: {
        url: 'ldaps://gdoffice.gameduell.de:3269',
        bindDn: 'CN=trac-bind-user,CN=Users,DC=gdoffice,DC=gameduell,DC=de',
        bindCredentials: 'rGt2EJuY',
        searchBase: 'ou=people,DC=gdoffice,DC=gameduell,DC=de',
        searchFilter: '(sAMAccountName={{username}})',
        tlsOptions: {
            ca: [
                fs.readFileSync('gameduellCA.crt')
            ]
        }
    }
}));

// we need the next 2 functions if we want to use passport sessions
// what is passed to done as the 2nd parameter gets serialized
passport.serializeUser(function(user, done) {
    done(null, user);
});
passport.deserializeUser(function(user, done) {
    done(null, user);
});

module.exports = function (app) {

    app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));
    app.use(passport.initialize());
    app.use(passport.session());

    // The route below will redirect to "/" on successful login. For a failure, it will simply display "Unauthorized". Now
    // there seems to be a way to already pass the correct redirect targets to authenticate: http://passportjs.org/docs/authenticate#redirects
    // But this does not seem to work: if we add the redirects to the options object and omit the route callback (because
    // we don't need this now, right?), then a login success will bring us back to the login page! The problem seems to be
    // that request.user is not set - no idea why. Maybe the ldapauth module does not support this?
    app.post('/login', passport.authenticate('ldapauth', {session: true}), function(req, res) {
        console.log('Successful login for user', req.user);
        // TODO this (i.e. the redirect) will be not so practical once we start using "entry urls" for the applications, i.e.
        // a query param points to a project and calling the url will take you directly to the project. But when doing the
        // redirect, we would loose that parameter.
        res.redirect('/');
    });

    return function (res, req, next) {
        next();
    }
}