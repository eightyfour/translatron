var fileMgr = require('resourceHandler');
/**
 * Each client need a client object
 *  - register onclose and remove if client connection is lost
 *
 *  bowserClient = {
 *      id : '',
 *      broadCast : {fromBundle : null, toBundle : null},
 *      updateKey : fc()
 *  }
 */
var client = function(dirName){

    var dirName = dirName,
        me = [],
        connections = 0,

        broadcast = function(notForId,bundleName,obj){

            var actualClientId = notForId,distributeObj = obj;
            me.forEach(function(client,idx){
                if(client.id != actualClientId || obj.value == ''){
                    if(client.client.broadCast.fromBundle == bundleName || client.client.broadCast.toBundle == bundleName){
//                        console.log('update client with id: '+client.id)
                        client.client.updateKey(bundleName,distributeObj);
                    }
                }
            })
        }
    return {
        getMessageBundle : function (bundle,callback) {
            var cb = callback;
            var stringBack;
            fileMgr.readFile(dirName+'/static/'+bundle+'.properties',function(obj){
                stringBack = JSON.stringify(obj);
                if(stringBack){
                    cb(stringBack);
                }
            });
        },
        sendResource : function(id,bundle,data,cb){
            var cb = cb,id=id,bundle=bundle;
            fileMgr.writeFile(dirName+'/static/'+bundle+'.properties',data.key,data.value,function(key,value){
                broadcast(id,bundle,{key: key,value:value});
                cb(key);
            });
        },
        setupClient : function(client,cb){
            var id = 'id_'+connections++;
            me.push({id:id,client:client});
            cb(id);
        }
    }
}

module.exports = client;