var domready = require('domready');
var shoe = require('shoe');
var dnode = require('dnode');
var dest = require('resourceHandler');

window.base = new function(){

    var selectors = {
        root : "resourceBundleTable",
        debug : "debugIncomming",
        tpl : {
            tableBody : 'tableBody'
        }
    },
    _conf = {
        inputPrefix : "_value"
    };

    /*
     *   TODO send data back to server and save it in the resource bundle
     */

    // todo add textinput node
    function SaveOnLeave(keyInputNode,textInputNode,key,text){
        var _rootKey = key; // use this key for identifier on the server
        var keyList = [key];
        var textList = [text];
        var keyIdx = 0;
        var textIdx = 0;

        keyInputNode.addEventListener('change',function(e){
            console.log("Old: "+keyList[keyIdx]);
            var newValue = this.value;
            if(keyList[keyIdx] !== newValue){
                // TODO check if key vallid?  use same on server
                keyList.push(newValue);
                keyIdx++;
            }
            console.log(keyList);
            base.con.sendNewKey(_rootKey,newValue);
        });

        textInputNode.addEventListener('change',function(e){
            console.log("Old: "+textList[textIdx]);
            var newValue = this.value;
            if(textList[textIdx] !== newValue){
                textList.push(newValue);
                textIdx++;
            }
            console.log(textList);
            base.con.sendResource(_rootKey,newValue,function(s){
                console.log(s);
            });
        });
    }

    // used on server side
    var sendServer = {
        updateKey : function(v){
            var value = JSON.parse(v);
            console.log("updateKey: ",value);
            document.getElementById(value.key+_conf.inputPrefix).value = value.data;;
        }
    }
    // methods needs to be implemented on server side
    var con = {
        sendResource : function(key,value){
            base.server.sendResource(base.id,{key: key,value:value},function(){
                console.log('send success');
            })
        },
        sendNewKey : function(key,value){
            base.server.sendNewKey(base.id,{key: key,value:value},function(){
                console.log('send success');
            })
        }

    }

    var fc = {
        printBundle : function(args){
            console.log(args);
            var addData = function(node,data){
                var keyNode = document.createElement("input");
                var textNode = document.createElement("input");

                keyNode.setAttribute("id", data.key);
                keyNode.value =  data.key;
                textNode.value =  data.data;
                textNode.setAttribute("id", data.key+_conf.inputPrefix);
                new SaveOnLeave(keyNode,textNode,data.key,data.data);
                var td = document.createElement('td');
                    td.appendChild(keyNode);
                node.appendChild(td);
                td = document.createElement('td');
                    td.appendChild(textNode);
                node.appendChild(td);
            }

            var node = document.getElementById(selectors.tpl.tableBody);

            for (var i = 0; i < args.length; i++) {
                var tr = document.createElement("tr");
                addData(tr,args[i]);
                node.appendChild(tr);
            }
        },
        con : con,
        server : {},
        id : ''
    }
    return fc
};

var stream = shoe('/dnode');
var d = dnode();


domready(function () {
    d.on('remote', function (server) {
        base.server = server;
        base.server.setupClient(base.server,function(id){
            base.id = id;
        });
        console.log(server);
        base.server.getMessageBundle(function (s) {
            var obj = JSON.parse(s);
            base.printBundle(obj.data);
        });

    });
    d.pipe(stream).pipe(d);
});