/**
 * TODO fade out when maxLengthOfMessages exceeded looks not so nice
 * @param id
 * @return {Object}
 * @constructor
 */
var toast = new (function Toast(id){
    var DELAY = 4000,
    opacityFadeSteps = 0.04,
    maxLengthOfMessages = 4,
    toastNode = document.getElementById(id),
    isReadyForStartAgain = true,
    newMessage = true,
    initToast = function(){
        var rootNode = document.getElementsByTagName('body')[0];
        toastNode = document.createElement('div');
        toastNode.id = id;
        toastNode.style.cssText = "position:fixed;z-index:999;top:30px;right:10px;border-radius:5px;color:#fff;font-size:15px;font-weight:bold;background-color:black;"
        rootNode.appendChild(toastNode);
    }
    ,toast = {
        fadeOut : function(_node,_done){
            var node = _node;
            var done = _done;
            var opacity = 1;
            (function decrementOpacity(){
                if(opacity > opacityFadeSteps){
                    opacity = opacity - opacityFadeSteps;
                    node.style.opacity = opacity;
                    setTimeout(function(){
                        decrementOpacity();
                    },40);
                }else{
                    console.log('PARENT NODE:');
                    console.log(node);
                    console.log(node.parentNode);
                    if(node.parentNode != null){
                        node.parentNode.removeChild(node);
                    }
                    done();
                }
            })();
        },
        showMessage : function(msg){
            if(!toastNode){
                initToast()
            }
            toastNode.style.opacity = 1;
            var p = document.createElement('p');
            p.style.cssText = "padding:0px 10px";
            p.innerHTML = msg;
            toastNode.insertBefore(p,toastNode.firstChild);
            (function fadeOutToMuchMessages(){
                if(toastNode.childNodes.length > maxLengthOfMessages){
                    toast.fadeOut(toastNode.children[toastNode.children.length-1],function(){
                        fadeOutToMuchMessages();
                    });
                }
            })();
            var timeOut = DELAY;
            newMessage = true;
            function fadeOut(_fc){
                var fc = _fc;
                var opacity = toastNode.style.opacity;
                if(opacity > opacityFadeSteps){
                    if(newMessage) {
                        // resetMessage
                        newMessage = false;
                        timeOut = DELAY;
                        toastNode.style.opacity = 1;
                    }else {
                        opacity = opacity-opacityFadeSteps;
                        toastNode.style.opacity = opacity;
                        timeOut = 40;
                    }
                    // start timer
                    setTimeout(function(){
                        fadeOut(fc);
                    },timeOut);
                }else{
                    while( toastNode.firstChild ){
                        toastNode.removeChild( toastNode.firstChild );
                    }
                    // callback
                    fc(true);
                }
            }
            if(isReadyForStartAgain){
                isReadyForStartAgain = false;
                timeOut = DELAY;
                fadeOut(function(_b){
                    isReadyForStartAgain = true;
                });
            }
        }
    };
    return toast;
})('toast');

if(typeof module != "undefined"){
    console.log('exports');
    module.exports = toast;
}else {
    console.log('asign to global scope');
    window.toast = toast;
}