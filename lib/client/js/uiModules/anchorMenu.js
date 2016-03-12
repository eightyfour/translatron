
var util = require('../util/url'),
    rootNode,
    onSelect = function () {};

function focusElement(elem) {
    [].slice.call(rootNode.querySelectorAll('.c-active')).forEach(function (n) {
        n.classList.remove('c-active');
    });
    elem.classList.add('c-active');
}

function addItems(items) {
    var ul = document.createElement('ul'),
        anchor = util.getAnchor();

    items.forEach(function (item) {
        var li = document.createElement('li');
        li.appendChild(document.createTextNode(item));
        li.addEventListener('click', function () {
            onSelect(item);
            focusElement(li);
        });
        if ('#' + item === anchor) {
            li.classList.add('c-active');
        }
        ul.appendChild(li);
    });
    rootNode.appendChild(ul);
}

module.exports = {
    onSelect : function (fc) {
        onSelect = fc;
    },
    /**
     *
     * @param items
     */
    addCategories : function (items) {
        [].slice.call(rootNode.children).forEach(function (child) {
            child.remove();
        });
        addItems(items);
    },
    add : function (node, attr) {
        rootNode = node;
    }
}
