var domready = require('domready');
var shoe = require('shoe');
var dnode = require('dnode');
//var fileMgr = require('fileManager.js');

var base = (function(){

    var selectors = {
        root : "resourceBundleTable",
        debug : "debugIncomming",
        tpl : {
            tableBody : 'tableBody'
        }
    }

    /*
        TODO send data backto server and save it in the resource bundle
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
        });

        textInputNode.addEventListener('change',function(e){
            console.log("Old: "+textList[textIdx]);
            var newValue = this.value;
            if(textList[textIdx] !== newValue){
                textList.push(newValue);
                textIdx++;
            }
            console.log(textList);
        });
    }

    var fc = {

        printBundle : function(args){
            console.log(args);
            var addData = function(node,data){
                var keyNode = document.createElement("input");
                var textNode = document.createElement("input");

                keyNode.textContent =  data.key;
                textNode.textContent =  data.data;
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
        }
    }
    return fc;
}());

domready(function () {
    var stream = shoe('/dnode');

    var d = dnode();
    d.on('remote', function (remote) {
        remote.transform('beep', function (s) {
            var obj = JSON.parse(s);

            base.printBundle(obj.data);
        });
    });
    d.pipe(stream).pipe(d);
});