var fs = require('fs');

var testReg = function(file,key,value,callback){
    var file = file,key = key, value = value;
    var cb = callback;
//    var reg = new RegExp('([a-zA-Z\d_\.]*)=(.*)[\n\r]*','g');
    var reg = new RegExp('(.*)'+key+'=(.*)([\n\r]*.*)','g');

    fs.readFile(file,'utf8', function (err, data) {
        if (err) throw err;
        var result = data.replace(reg,'$1'+key+'='+value+'$3');
        console.log('regex: '+reg);
        console.log(result);
        console.log('-------\n\n');
        fs.writeFile(file,result,'utf8',function(err){
            if (err) return console.log(err);
            cb('write success');
        });
    });
}

testReg(__dirname+'/static/messages.properties','key_1','THIS IS ONE HERE',function(){
    console.log('success');
    testReg(__dirname+'/static/messages.properties','key_2','THIS IS TWO HERE',function(){
        console.log('success');
        testReg(__dirname+'/static/messages.properties','key_3','THIS IS THREE HERE',function(){
            console.log('success');
        });
    });
});
