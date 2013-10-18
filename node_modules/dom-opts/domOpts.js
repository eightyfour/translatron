var domOpts = {};

domOpts.params = (function(){
    var params = {};
    if (location.search) {
        var parts = location.search.substring(1).split('&');
        for (var i = 0; i < parts.length; i++) {
            var nv = parts[i].split('=');
            if (!nv[0]) continue;
            params[nv[0]] = nv[1] || true;
        }
    }
    return params;
})();

domOpts.createElement = function(tag,id,classes){
    var newNode = document.createElement(tag);
    if(id){newNode.setAttribute('id',id);}
    if(classes){newNode.setAttribute('class',classes);}
    return newNode;
};
module.exports =  domOpts;

// dom operations:
HTMLElement.prototype.domAddClass = function(addClasses){
    console.log('add class und so');
    this.setAttribute('class',this.getAttribute('class')+' '+addClasses);
    return this;
}
HTMLElement.prototype.domRemoveClass = function(removeableClasses){
    var removeClasses = (removeableClasses && removeableClasses.split(' ')) || this.getAttribute('class').split(' ');
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
HTMLElement.prototype.domRemove = function(){
    this.parentNode.removeChild(this);
}

HTMLElement.prototype.domAppendTo = function(node){
    node.appendChild(this);
    return this;
}