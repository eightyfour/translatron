
module.exports = (function () {
    "use strict";
    var node,
        projectSelectedQueue = [];

    function arrange(count, center, radiusFunc){

        function pointOnCircumference(_angle, _radius, _center) {
            if(!_center) _center = { 'x' : 0, 'y' : 0 };
            return {
                'x' : _center.x + _radius * Math.cos(_angle),
                'y' : _center.y + _radius * Math.sin(_angle)
            };
        }
        var arr = [];
        var a = 0;
        var s = (2 * Math.PI) / count;
        for(var i = 0; i < count; i++){
            arr.push(pointOnCircumference(a, radiusFunc() ,center));
            a += s;
        }

        return arr;

    }

    function blossom(flower) {
        var children = [].slice.call(flower.children);
        var length = children.length;
        var p = arrange(length, 0, function () {return 200;});
        for (var i = 0; i < length; i++) {
            var child = children[i];
            child.style.top = p[i].x + 'px';
            child.style.left = p[i].y + 'px';
        }
    }

    return {
        onProjectSelected : function (fc) {
            projectSelectedQueue.push(fc);
        },
        addProjects : function (projectNames) {
            projectNames.forEach(function (name) {
                var divPrj = domOpts.createElement('div', null, 'projectName');
                divPrj.innerHTML = name;
                divPrj.addEventListener('click', function () {
                    projectSelectedQueue.forEach(function (fc) {
                        fc(name);
                    })
                });
                node.domAppendChild(divPrj);
            });
        },
        show : function () {
            setTimeout(function () {
                blossom(node);
            }, 200);
        },
        add : function (elem, attr) {
            node = elem;
        },
        ready : function () {
            console.log('initialView ready!');
        }
    };
}());