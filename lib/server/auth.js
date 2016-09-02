var passport = require('passport'),
    LdapStrategy = require('passport-ldapauth').Strategy,
    fs = require('fs'),
    session = require('express-session');

/*
    Please note: this module expects that the following middlewares are used by express (on the default route):
    - bodyParser (for parsing the form body when POSTing to /login)
    - cookieParser (for parsing the session cookie on each request)
 */

// we need the next 2 functions if we want to use passport sessions
// what is passed to done as the 2nd parameter gets serialized
passport.serializeUser(function(user, done) {
    done(null, user);
});
passport.deserializeUser(function(user, done) {
    done(null, user);
});

module.exports = function (app, authConfig) {

    passport.use(new LdapStrategy({
        server: authConfig
    }));

    app.use(session({
            store: require('./sessionStore'),
            name: 'translatron_session',
            // secret is used for signing the cookie so that nobody can create fake cookies
            secret: authConfig.secret,
            // if true session would be updated (in store) on every request (even without changes to session) and
            // recommended default is false, anyway
            resave: false,
            // see https://github.com/expressjs/session#user-content-saveuninitialized
            saveUninitialized: false,
            rolling: true,
            cookie: {
                httpOnly: false,
                maxAge: 1000 * 60 * 60 * 2
            }
        })
    );
    app.use(passport.initialize());
    app.use(passport.session());

    // if login is successful, the user info will be saved in a connect.sid cookie
    app.post('/login',
        passport.authenticate('ldapauth', {
            session: true,
            // not optimal - so we will loose the Referer after wrong login
            failureRedirect : '/?failure=true'

        }),
        function(req, res) {
            var backURL = req.header('Referer') || '/';

            if (req.body.from && req.body.from.length > 0) {
                backURL += req.body.from;
            }

            req.session.fullName = req.session.passport.user.name;
            req.session.ldapName = req.session.passport.user.uid;
            req.session.isAdmin = (req.session.passport.user.memberOf.indexOf('CN=TranslatronAdmininistrator,OU=Translation,OU=Services,OU=groups,DC=gdoffice,DC=gameduell,DC=de') !== -1);

            res.redirect(backURL);
        }
    );

    // logout - page reload is handled on client side
    app.post('/logout', function(req, res) {
        req.logout();
        res.send('logout');
    });

    return function (res, req, next) {
        next();
    }
};