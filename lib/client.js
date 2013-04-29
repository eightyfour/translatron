var fileMgr = require('resourceHandler');
/**
 * simple session handling:
 *  - just use a id identifier starts by 0 for each client
 *  -- saved on both: server and client
 *
 *  Requirements
 *  - setupClient for first connection
 *
 *  each Method has first the client and than optional attributes
 *
 */
/**
 * Each client need a client object
 *  - create array of clients
 *  - register onclose and remove if client connection is lost
 *  - save identifier for each client
 */
var client = function(dirName){

    var dirName = dirName,
        me = [],
        connections = 0

    return {
        getMessageBundle : function (callback) {
            var cb = callback;
            var stringBack;
            fileMgr.readFile(dirName+'/static/messages.properties',function(obj){
                stringBack = JSON.stringify(obj);
    //            console.log("STRING BACK: "+stringBack);
                if(stringBack){
                    cb(stringBack);
                }
            });
        },
        sendResource : function(id,data,cb){
            var cb = cb;
            console.log('sendResource: '+id);
            console.log('sendResource: '+data.key);
            console.log('sendResource: '+data.value);
            fileMgr.writeFile(dirName+'/static/messages.properties',data.key,data.value,cb);
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