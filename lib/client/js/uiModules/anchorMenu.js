
var util = require('../util/url'),
    rootNode,
    onSelect = function () {};

function focusElement(elem) {
    [].slice.call(rootNode.querySelectorAll('.c-active')).forEach(function (n) {
        n.classList.remove('c-active');
    });
    elem.classList.add('c-active');
    elem.parentNode.parentNode.classList.add('c-active');
}
/**
 *
 * @param items [{id : string, children : [string]}]
 */
function addItems(root, items) {
    var ul = document.createElement('ul'),
        anchor = util.getAnchor();
    root.appendChild(ul);
    items.forEach(function (catObj) {
        var li = document.createElement('li'),
            cat = catObj,
            span = document.createElement('span');
        if (typeof catObj === 'object') {
            cat = catObj.value || catObj.id;
        }
        span.appendChild(document.createTextNode(cat));
        li.appendChild(span);
        span.addEventListener('click', function () {
            onSelect(catObj.id);
            focusElement(li);
        });

        if (catObj.children) {
            addItems(li, catObj.children)
        }
        ul.appendChild(li);
        if ('#' + catObj.id === anchor) {
            li.classList.add('c-active');
            li.parentNode.parentNode.classList.add('c-active');
        }
    });
}

module.exports = {
    onSelect : function (fc) {
        onSelect = fc;
    },
    /**
     *
     * @param items [{cat : string, children : [string]}]
     */
    addCategories : function (items) {
        [].slice.call(rootNode.children).forEach(function (child) {
            child.remove();
        });
        addItems(rootNode, items);
    },
    add : function (node, attr) {
        rootNode = node;
    }
}
