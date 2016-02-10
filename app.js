/*global console */
/*jslint node: true */
var projectFolder = __dirname + '/static',
    packageJSON = require('./package.json'),
    express = require('express'),
    shoe = require('shoe'),
    dnode = require('dnode'),
    dao = require('./lib/server/dao.js')(projectFolder),
    fileManager = require('./lib/server/legacy/fileManager.js')(projectFolder),
    serverPort = packageJSON.config.port || 3000,
    enableAuth = packageJSON.config.enableAuth,
    jade = require('jade'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser');

var app = express();

// use bodyParser middleware for handling request bodies (express does *not* provide that feature out-of-the-box).
// since we only have one case of that (POST to /login where username, password are in the body) and that one is url-encoded,
// we only need that flavor of bodyParser. about the "extended" property, see https://github.com/expressjs/body-parser#bodyparserurlencodedoptions
app.use(bodyParser.urlencoded({ extended: false }));
// same for parsing cookie
app.use(cookieParser());

// activate the LDAP auth
if (enableAuth) {
    app.use(require('./lib/server/auth')(app));
}

app.use(function(req, res, next) {
    console.log(req.method, req.url, req.query, req.user ? req.user.name : '-');
    next();
});

// configure routes for static content
app.use('/dist',
    express.static(__dirname + '/dist'));
app.use('/bower_components',
    express.static(__dirname + '/bower_components'));

// jade.compileFile is not like a full compilation - it is more like a parsing of the jade code. only the execution
// of the returned function pointer (with optional passing of locals) will do the actual compilation.
var indexPage = jade.compileFile('./lib/client/jade/index.jade')(),
    projectOverviewPage = jade.compileFile('./lib/client/jade/projectOverview.jade');

// configure the main route: matches all GETs for a query path which identifies either a directory or a project: for a
// directory, the path starts with the root "/" followed by zero to N directories (each ending  on a "/"). For a project,
// the path is like the path for a directory but with an appended project id (e.g. "project.prj")
// we can add this route as a wildcard route because all other routes are already handled before and request processing
// for other routes should never arrive here
// if for any reason we can no longer use a wildcard route here, simply change to a route which uses the pattern
// "\/(?:\w\/)*"
app.use(
    function (req, res) {
        if (enableAuth && !req.user) {
            res.send(jade.compileFile('./lib/client/jade/login.jade')());
        } else {
            res.send(jade.compileFile('./lib/client/jade/index.jade')());
        }
    }
);

var server = app.listen(serverPort);

var websocketServer = shoe(function (stream) {
    "use strict";

    // TODO introduce clientConnectionId var - must/need not be passed from client (positive side effect: closed a
    // security hole)

    // QUESTION: any reason why we have to define all the functions of the API in an object literal here? why not
    // directly pass a dao.js instance of dnode? ANSWER: no, as of now this has become unneccessary. BUT: we'll be adding
    // authorization and the logic for broadcasting changes (refactored out of dao.js) here so we need this layer then.
    var d = dnode({
        loadProject : function (projectId, cb) {
            dao.loadProject(projectId, cb);
        },
        saveKey : function(id, projectId, language, keyAndValue, cb) {
            dao.saveKey(id, projectId, language, keyAndValue, cb);
        },
        renameKey : function () {
            dao.renameKey.apply(null, [].slice.call(arguments));
        },
        removeKey : function () {
            dao.removeKey.apply(null, [].slice.call(arguments));
        },
        createNewProject : function (id, path, projectName, obj, cb) {
            dao.createNewProject(id, path, projectName, obj, cb);
        },
        getDirectory : function(dir, cb) {
            dao.getDirectory(dir, cb);
        },
        createNewDirectory : function(id, directoryName, path, cb) {
            dao.createNewDirectory(id, directoryName, path, cb);
        },
        /**
         * initial call - all client methods are saved here.
         * returns a id as callback. The client needs this as identifier.
         */
        setupClient : function () {
            // TODO draft: authenticate the client - and pass the name to the setupClient
            dao.setupClient.apply(null, [].slice.call(arguments));
        },
        saveProjectDescription : function(id, projectId, description, callback) {
            dao.saveProjectDescription(id, projectId, description, callback);
        }
    });

    // handle errors from processing commands from clients: at least log them
    // if we didn't have this error handler, errors would propagate up the stack and effectively close down the
    // application
    d.on('error', function(err) {
       console.error(err.message, err.stack);
    });

    d.pipe(stream).pipe(d);
});
// "/trade" identifies the websocket connection
websocketServer.install(server, '/trade');

console.log("start server ", serverPort);