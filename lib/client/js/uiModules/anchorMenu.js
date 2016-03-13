
var util = require('../util/url'),
    rootNode,
    onSelect = function () {};

function focusElement(id, elem) {
    var dom;
    // handle the active class from menu
    [].slice.call(rootNode.querySelectorAll('.c-active')).forEach(function (n) {
        n.classList.remove('c-active');
    });
    elem.classList.add('c-active');
    elem.parentNode.parentNode.classList.add('c-active');
    // handle the common dom active class
    [].slice.call(document.querySelectorAll('.c-anchorMenu-focus')).forEach(function (n) {
        n.classList.remove('c-anchorMenu-focus');
    });
    dom = document.getElementById(id);
    if (dom) {
        dom.classList.add('c-anchorMenu-focus');
    }
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
            focusElement(catObj.id, li);
        });

        if (catObj.children) {
            addItems(li, catObj.children)
        }
        ul.appendChild(li);
        if ('#' + catObj.id === anchor) {
            focusElement(catObj.id, li);
        }
    });
}

function cutCategories(val) {
    var split = val.split('_');
    if (split.length > 1) {
        split.splice(0, 1);
    }
    return {
        id : val,
        value : split.join('_')
    }
}

module.exports = {
    onSelect : function (fc) {
        onSelect = fc;
    },
    renderMenu : function () {
        var catObj = [];
        [].slice.call(document.querySelectorAll('.c-anchorMenu-parent')).forEach(function (parent) {
            var id = parent.getAttribute('id'),
                children = [];
            if (id) {
                [].slice.call(parent.querySelectorAll('.c-anchorMenu-child')).forEach(function (child) {
                    var id = child.getAttribute('id');
                    if (id) {
                        children.push(cutCategories(id));
                    }
                });
                catObj.push({id : id, children : children});
            }
        });
        [].slice.call(rootNode.children).forEach(function (child) {
            child.remove();
        });
        addItems(rootNode, catObj);
    },
    add : function (node, attr) {
        rootNode = node;
    }
};
