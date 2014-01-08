/*global console */
/*jslint node: true */
var express = require('express'),
    fs = require('fs'),
    shoe = require('shoe'),
    dnode = require('dnode'),
    client = require('./lib/client.js')(__dirname),
    C = require('./lib/CONST.js'),
    fileManager = require('./lib/server/fileManager.js'),
    bash = require('./lib/server/bash.js');

var app = express();

global.projectFolder = __dirname + '/static';

app.use(express.static(__dirname + '/fe'));



var server = app.listen(3000);

var conDnode;
var dnodeCon = shoe(function (stream) {
    "use strict";
    var d = dnode(client);
    d.pipe(stream).pipe(d);
    conDnode = stream;

    conDnode.on('end', function () {
        console.log('end');
    });
});
dnodeCon.install(server, '/dnode');


var conTrade;
var trade = shoe(function (stream) {
    "use strict";
    var d = dnode({
        init : function (clientEvents) {
            console.log('HALLO: ' + clientEvents);

            bash.exec({
                comand : C.BASH.LS,
                path : '.'
            }, function (obj) {
                clientEvents.sendPathList(obj);
            });
        },
        bash : bash,
        fileManager : fileManager
    });
    d.pipe(stream).pipe(d);
    conTrade = stream;

    conTrade.on('end', function () {
        console.log('end');
    });
});
trade.install(server, '/trade');

console.log("start server 3000");