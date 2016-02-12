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
    changesNotifier = require('./lib/server/changesNotifier.js')();

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

// TODO route only for GET
// TODO only if authenticated
// RE TODO no I wouldn t
app.use(require('./lib/server/middleware-exporter/jpmbfExporter')(dao));
app.use(require('./lib/server/middleware-exporter/jsonExporter')(dao));

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
var websocketServer = require('./lib/server/websocketServer')(changesNotifier);
// "/trade" identifies the websocket connection
websocketServer.install(server, '/trade');

console.log("start server ", serverPort);