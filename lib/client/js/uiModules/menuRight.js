
var rootNode;

module.exports = {
    show : function () {
        rootNode.classList.add('c-show');
    },
    hide : function () {
        rootNode.classList.remove('c-show');
    },
    add : function (node, attr) {
        if (attr === 'button') {
            node.addEventListener('click', function () {
               if (rootNode.classList.contains('c-show')) {
                   rootNode.classList.remove('c-show');
               } else {
                   rootNode.classList.add('c-show');
               }
            });
        } else {
            rootNode = node;
        }
    }
};
