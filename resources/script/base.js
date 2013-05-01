var domready = require('domready');
var shoe = require('shoe');
var dnode = require('dnode');
var dest = require('resourceHandler');
HTMLElement.prototype.domAddClass = function(addClasses){
//    addClass : function(addClasses){
        this.setAttribute('class',this.getAttribute('class')+' '+addClasses);
//    }
    return this;
}
HTMLElement.prototype.domRemoveClass = function(removeableClasses){
    var removeClasses = removeableClasses.split(' ');
    var currentClasses = this.getAttribute('class').split(' ');
    for (var i = 0; i < removeClasses.length; i++) {
        var idx = currentClasses.indexOf(removeClasses[i]);
        if(idx >=0 ){
            currentClasses = currentClasses.slice(0,idx).concat(currentClasses.slice(idx+1,currentClasses.length-1))
        }
    }
    this.setAttribute('class',currentClasses.join(' '));
    return this;
}

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
            base.con.sendResource(_rootKey,newValue);
        });
    }

    // used on server side to call clients
    var client = {
        id : undefined, // set on server side
        updateKey : function(v){
            var message = v;
            console.log("updateKey: ",message);
            document.getElementById(message.key+_conf.inputPrefix).value = message.value;
            ui.updateInputFields(message.key);
        }
    }
    var ui = {
        css : {
            sendSuccess : 'sendSuccess',
            updateKey : 'updateKey'
        },
        sendSuccess : function(key){
            ui.removeStateClasses(document.getElementById(key)).domAddClass(ui.css.sendSuccess);
            ui.removeStateClasses(document.getElementById(key+_conf.inputPrefix)).domAddClass(ui.css.sendSuccess);
        },
        updateInputFields : function(key){
            ui.removeStateClasses(document.getElementById(key+_conf.inputPrefix)).domAddClass(ui.css.updateKey);
        },
        removeStateClasses : function(node){
            var classes = '';
            for (var cssState in ui.css) {
                classes+=cssState+' ';
            }
            node.domRemoveClass(classes);
            return node;
        }
    }
    // methods needs to be implemented on server side
    var con = {
        sendResource : function(key,value){
            base.server.sendResource(client.id,{key: key,value:value},function(key){
                console.log('send success');
                ui.sendSuccess(key);
            })
        },
        sendNewKey : function(key,value){
            base.server.sendNewKey(client.id,{key: key,value:value},function(){
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

                keyNode.setAttribute('id', data.key);
                keyNode.setAttribute('class', 'keyField');
                keyNode.setAttribute('readonly', 'true');
                keyNode.value =  data.key;

                textNode.value =  data.data;
                textNode.setAttribute('id', data.key+_conf.inputPrefix);
                textNode.setAttribute('type', 'text');
                textNode.setAttribute('class', 'textField');

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
        client : client,
        ui : ui
    }
    return fc
};

var stream = shoe('/dnode');
var d = dnode();


domready(function () {
    d.on('remote', function (server) {
        base.server = server;
        base.server.setupClient(base.client,function(id){
            base.client.id = id;
        });
        console.log('Connected!',server);
        base.server.getMessageBundle(function (s) {
            var obj = JSON.parse(s);
            base.printBundle(obj.data);
        });
    });
    d.pipe(stream).pipe(d);
});