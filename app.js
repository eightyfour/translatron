var express = require('express'),
    fs = require('fs'),
    shoe = require('shoe'),
    dnode = require('dnode'),
    client = require('./lib/client.js')(__dirname);
var app = express();


app.use(express.static(__dirname + '/resources'));


app.get('/:bundle?/:templateLang?/:lang?',function(request,response,next){

    console.log("bundle attribute: "+request.params.bundle);
    console.log("templateLang attribute: "+request.params.templateLang);
    console.log("Lang attribute: "+request.params.lang);

    var req = request;
//    var fileName = req.originalUrl.split(':')[0];
    var fileName = '/'; //load allways index
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
                fs.readFile(__dirname+'/html'+fileName+htmlExtension, function(err, data){
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

var con;
var sock = shoe(function (stream) {
    var d = dnode(client);
    d.pipe(stream).pipe(d);
    con = stream;

    con.on('end',function(){
        console.log('end');
    })
});
var inst = sock.install(server, '/dnode');

console.log("start server 3000");