var express = require('express'),
    fs = require('fs'),
    shoe = require('shoe'),
    dnode = require('dnode'),
    fileMgr = require('resourceHandler');
var app = express();



//app.use('/',function(req,res,next){
//    console.log("/html - call next");
//        next();
//});

// GET /javascripts/jquery.js
// GET /style.css
// GET /favicon.ico
app.use(express.static(__dirname + '/resources'));

app.use('/',function(request,response,next){

    var req = request;
    var fileName = req.originalUrl;
    var res = response;
    var htmlExtension = '.html';
    var next = next;

    fs.exists(__dirname+'/html'+ (fileName == '/' ? fileName : fileName+htmlExtension),function(exists){

        if(exists){
            if(fileName == '/'){
                fs.readFile(__dirname+'/html/index.html', function(err, data){
                    res.writeHead(200, {'Content-Type':'text/html'});
                    res.write(data);
                    res.end();
                });
            } else {
                fs.readFile(__dirname+'/ui'+fileName+htmlExtension, function(err, data){
                    res.writeHead(200, {'Content-Type':'text/html'});
                    res.write(data);
                    res.end();
                });
            }
        } else {
            next();
//            fs.readFile(__dirname+'/ui/error.html', function(err, data){
//                res.writeHead(200, {'Content-Type':'text/html',title:'Thinkuseful'});
//                res.end("<h1>File not found</h1><a href='/'>Back to home</a>");
//            });
        }
    });
});

var server = app.listen(3000);
/**
 * Each client need a client object
 *  - create array of clients
 *  - register onclose and remove if client connection is lost
 *  - save identifier for each client
 */
var client; // connection to client use same on server

var connection = {
    transform : function (s, callback) {
        var cb = callback;
        var stringBack;
        fileMgr(__dirname+'/static/messages.properties',function(obj){
            stringBack = JSON.stringify(obj);
//            console.log("STRING BACK: "+stringBack);
            if(stringBack){
                cb(stringBack);
            }
        });
    },
    sendResource : function(data,cb){
//        console.log('hello: '+data);
        cb('Server says also hello');
    },
    setupClient : function(obj){
        console.log('setupClient');
        client = obj;
    },
    meHello : function(s){
        console.log('meHello');
        client.helloMe(s);
    },
    allHello : function(s){
        console.log('allHello');
        client.helloAll(s);
    }
}

var con;
var sock = shoe(function (stream) {
    var d = dnode(connection);
    d.pipe(stream).pipe(d);
    con = stream;
//    console.log(stream);
    sendToclient();
    con.on('end',function(){
        console.log('end');
    })
});
var inst = sock.install(server, '/dnode');
console.log("SOCKET:");
console.log(sock)

var sendToclient = function (){

//    setTimeout(function(){
//        console.log('send inervall');
//        client.intervall("send intervall: "+i);
//        sendToclient();
//    },2000);
}

console.log("start server 3000");