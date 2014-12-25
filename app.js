/*global console */
/*jslint node: true */
var express = require('express'),
    fs = require('fs'),
    shoe = require('shoe'),
    dnode = require('dnode'),
    client = require('./lib/client.js')(__dirname),
    C = require('./lib/CONST.js'),
    fileManager = require('./lib/server/fileManager.js'),
    bash = require('./lib/server/bash.js'),
    serverPort = process.env.npm_package_config_port || 3000,
    jsonFileManager = require('./lib/server/jsonFileManager');

var app = express();

global.projectFolder = __dirname + '/static';

app.use(express.static(__dirname + '/fe'));



var server = app.listen(serverPort);

//var conDnode;
//var dnodeCon = shoe(function (stream) {
//    "use strict";
//    var d = dnode(client);
//    d.pipe(stream).pipe(d);
//    conDnode = stream;
//
//    conDnode.on('end', function () {
//        console.log('end');
//    });
//});
//dnodeCon.install(server, '/dnode');


var conTrade;
var trade = shoe(function (stream) {
    "use strict";
    var d = dnode({
        getMessageBundle : function () {
            client.getMessageBundle.apply(null, [].slice.call(arguments));
        },
        sendResource : function () {
            client.sendResource.apply(null, [].slice.call(arguments));
        },
        setupClient : function () {
            client.setupClient.apply(null, [].slice.call(arguments));
        },
        init : function (clientEvents) {
            bash.exec({
                comand : C.BASH.LS,
                path : '.'
            }, function (obj) {
                clientEvents.sendPathList(obj);
            });
        },
        bash : bash,
        fileManager : fileManager,
        jsonFileManager : jsonFileManager
    });
    d.pipe(stream).pipe(d);
    conTrade = stream;

    conTrade.on('end', function () {
        console.log('end');
    });
});
trade.install(server, '/trade');

console.log("start server ", serverPort);