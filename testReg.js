var fs = require('fs');

var testReg = function(file,key,value,callback){
    var file = file,key = key, value = value;
    var cb = callback;
//    var reg = new RegExp('([a-zA-Z\d_\.]*)=(.*)[\n\r]*','g');
    var reg = new RegExp('[\n\r]('+key+'=.*)[\n\r]*','g');
    fs.readFile(file,'utf8', function (err, data) {
        if (err) throw err;
        var result = key+'='+data.replace(reg, value)+'\n';
        console.log('regex: '+reg);
        console.log('writeFile: '+result);
//        fs.writeFile(file,result,'utf8',function(err){
//            if (err) return console.log(err);
//            cb('write success');
//        });
    });
}

testReg(__dirname+'/static/messages.properties','key_2','new string',function(){
    console.log('success');
});