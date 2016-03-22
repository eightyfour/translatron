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
    bodyParser = require('body-parser'),
    changesNotifier = require('./lib/server/changesNotifier.js')(),
    busboy = require('connect-busboy'),
    mkdir = require('./lib/server/mkdir-p');

var app = express();

// use bodyParser middleware for handling request bodies (express does *not* provide that feature out-of-the-box).
// since we only have one case of that (POST to /login where username, password are in the body) and that one is url-encoded,
// we only need that flavor of bodyParser. about the "extended" property, see https://github.com/expressjs/body-parser#bodyparserurlencodedoptions
app.use(bodyParser.urlencoded({ extended: false }));
// same for parsing cookie
app.use(cookieParser());

app.use(busboy());

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

mkdir(__dirname, '/dist/upload');
app.use(require('./lib/server/upload')(__dirname + '/dist/upload'));

// jade.compileFile is not like a full compilation - it is more like a parsing of the jade code. only the execution
// of the returned function pointer (with optional passing of locals) will do the actual compilation.
var indexPage = jade.compileFile('./lib/client/jade/index.jade')(),
    projectOverviewPage = jade.compileFile('./lib/client/jade/projectOverview.jade');

/*
    The main router handles all URLs for viewing/editing projects/directories and the export routes
 */
var mainRouter = express.Router();
// TODO add middleware to mainRouter which will check if a project or directory with that id exists
mainRouter.use(require('./lib/server/middleware-exporter/jpmbfExporter')(dao));
mainRouter.use(require('./lib/server/middleware-exporter/jsonExporter')(dao));
mainRouter.get('*', (req, res) => {
    res.send(jade.compileFile('./lib/client/jade/index.jade')());
});

var toLoginIfUnauthenticated = function(req, res, next) {
    if (enableAuth && !req.user) {
        // TODO sending the login page only makes sense for browser requests. if anybody is e.g. using curl to
        // retrieve message bundles, we should only return a 401 but no content
        res.send(jade.compileFile('./lib/client/jade/login.jade')());
    } else {
        next();
    }
};
app.get(/\/(?:\w\/)*(?:\w+\.\w+)?/, toLoginIfUnauthenticated, mainRouter);

// catch-all route + handler if no route matched, just return 404
app.all('*', (req, res) => {
    res.status(404).send('Not found');
});

var server = app.listen(serverPort);

var Operations = require('./lib/server/operations.js');
var websocketServer = shoe(function (stream) {
    "use strict";

    var operations = Operations(dao, changesNotifier);
    var d = dnode(operations);

    // handle errors from processing commands from clients: at least log them
    // if we didn't have this error handler, errors would propagate up the stack and effectively close down the
    // application
    d.on('error', (err) => {
       console.error(err.message, err.stack);
    });
    d.on('end', () => {
        operations.detachClientCallbacks();
    });

    d.pipe(stream).pipe(d);
});
// "/trade" identifies the websocket connection
websocketServer.install(server, '/trade');

console.log("start server ", serverPort);