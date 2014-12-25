
function Value(key,data){
    console.log('CREATE FILE Value');
    this.key = key;
    this.data = data;
}
function Resources(){
    var list = [];
    console.log('CREATE FILE Resources');
    return {
        push : function(value){
            list.push(value);
        }
    }
}

module.exports = {
    getResources : function(){
        return new Resources()
    },
    getValue : function(key,value){
       return  new Value(key,value);
    }
}
