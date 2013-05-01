var fileMgr = require('resourceHandler');
/**
 * Each client need a client object
 *  - register onclose and remove if client connection is lost
 */
var client = function(dirName){

    console.log('NEW CLIENT');

    var dirName = dirName,
        me = [],
        connections = 0,

        broadcast = function(notForId,obj){
            console.log(notForId+" - "+obj);
            var actualClientId = notForId,distributeObj = obj;
            me.forEach(function(client,idx){
                console.log(client);
                if(client.id != actualClientId){
                    console.log('update client with id: '+client.id+' data: '+distributeObj.key+' : '+distributeObj.value)
                    client.client.updateKey(distributeObj);
                }
            })
        }

    return {
        getMessageBundle : function (callback) {
            var cb = callback;
            var stringBack;
            fileMgr.readFile(dirName+'/static/messages.properties',function(obj){
                stringBack = JSON.stringify(obj);
                if(stringBack){
                    cb(stringBack);
                }
            });
        },
        sendResource : function(id,data,cb){
            var cb = cb,id=id;
            console.log('sendResource: '+id);
            console.log('sendResource: '+data.key);
            console.log('sendResource: '+data.value);
            fileMgr.writeFile(dirName+'/static/messages.properties',data.key,data.value,function(key,value){
                broadcast(id,{key: key,value:value});
                cb(key);
            });
        },
        sendNewKey : function(client,data,cb){
            console.log('sendResource: '+data);
            cb('Server says also hello');
        },
        setupClient : function(client,cb){
            var id = 'id_'+connections++;
            me.push({id:id,client:client});
            cb(id);
            console.log('setupClient: '+id);
        }
    }
}

module.exports = client;