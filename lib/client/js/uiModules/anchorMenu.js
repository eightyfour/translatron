/**
 * anchorMenu
 *
 * TODO show the actual frame:
 *  * detect which dome categories in dom are in view and add a classes to the menu ul category.
 *      * the expected effect will be look like a frame which categories are in view
 *      * first-child border-top last-child border bottom and the rest border left and right will give a frame effect
 *
 *  do it for all c-anchorMenu-parent element which could be found in view
 *
 * The anchor menu shows all elements which have the class c-anchorMenu-parent as parent and searches for children
 * with class c-anchorMenu-child. It renders a ul li list and registered a click call to throw a click event with the id.
 *
 * @type {exports}
 */
var util = require('../util/url'),
    rootNode,
    parentNodeList = [],
    onSelect = function () {},
    shrinkOffsetForViewDetection = 100,
    highlightTopMostKey = (function() {

        var highlightedItem;

        /**
         * check if node is aligned top most in the browser view
         * @param obj
         */
        return function() {

            var firstOpenCategory = rootNode.querySelector('li.c-inView'),
                currentMainViewCategoryNode,
                currentMainViewCategoryChildNodes,
                mainViewTopMostKeyNode;

            if (!firstOpenCategory) {
                return;
            }

            // Reset previous highlighted item
            if (highlightedItem) {
                highlightedItem.classList.remove('c-key-highlight');
            }

            // Highlight topmost item
            currentMainViewCategoryNode = document.body.querySelector('#' + firstOpenCategory.attributes.data.nodeValue);
            currentMainViewCategoryChildNodes = currentMainViewCategoryNode.querySelectorAll('.c-anchorMenu-child');
            mainViewTopMostKeyNode = getFirstElementInViewport(currentMainViewCategoryChildNodes);

            if (mainViewTopMostKeyNode) {
                highlightedItem = rootNode.querySelector('[data=' + mainViewTopMostKeyNode.id + ']');
                highlightedItem.classList.add('c-key-highlight');
            }
        }
    })();

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
        li.setAttribute('data', catObj.id);
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

/**
 * check is the node is in the view
 * @param node
 */
function isNodeInView(node) {
    var w = {
            top: window.scrollY,
            bottom : window.scrollY + window.innerHeight
        },
        bodyRect = document.body.getBoundingClientRect(),
        elemRect = node.getBoundingClientRect(),
        offset = elemRect.top - bodyRect.top + shrinkOffsetForViewDetection,
        nodeHeight = offset + node.offsetHeight - (shrinkOffsetForViewDetection * 2);
    return offset > w.top && offset < w.bottom ||    // is top frame in view
        nodeHeight > w.top && nodeHeight < w.bottom ||  // is bottom frame in view
        offset < w.top && nodeHeight > w.bottom;    // is top frame above view and bottom frame below view
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

function expandCategoriesInView()     {
    parentNodeList.forEach(function (obj) {
        var li = rootNode.querySelector('[data=' + obj.id + ']');
        if (isNodeInView(obj.node)) {
            li.classList.add('c-inView');
        } else {
            li.classList.remove('c-inView');
        }
    });
}

function getFirstElementInViewport(nodes) {
    var keyNode,
        pageScrollOffset = document.body.scrollTop,
        i = nodes.length,
        nodeMargin;

    while(i--) {
        keyNode = nodes[i];
        nodeMargin = parseInt(window.getComputedStyle(keyNode, null).marginBottom, 10);
        if(getPageOffsetForElement(keyNode) - nodeMargin * 2 <= pageScrollOffset) {
            return keyNode;
        }
    }

    // Return first key node for current active category
    return nodes[0];
}

function getPageOffsetForElement(elem) {
    var bodyRect = document.body.getBoundingClientRect(),
        elemRect = elem.getBoundingClientRect();
    return elemRect.top - bodyRect.top;
}

module.exports = {
    focusElement : function (id) {
        var li = rootNode.querySelector('[data=' + id + ']');
        if (li) {
            focusElement(id,li);
        }
    },
    onSelect : function (fc) {
        onSelect = fc;
    },
    renderMenu : function () {
        var catObj = [];
        // clear parent node list
        parentNodeList = [];

        [].slice.call(document.querySelectorAll('.c-anchorMenu-parent')).forEach(function (parent) {
            var id = parent.getAttribute('id'),
                children = [];
            // collect parents
            parentNodeList.push({node : parent, id : id});

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
        rootNode.children[0].style.height = window.innerHeight - 125 + 'px';
        
        // time delayed trigger the init view
        setTimeout(function () {
            expandCategoriesInView();
            highlightTopMostKey();
        }, 1000)
    },
    add : function (node, attr) {
        rootNode = node;
    },
    ready : function () {
        window.addEventListener('scroll', function (e) {
            expandCategoriesInView();
            highlightTopMostKey();
        });
        window.addEventListener('resize', function () {
            if (rootNode.children[0]) {
                rootNode.children[0].style.height = window.innerHeight - 125 + 'px';
            }
        });
        // init the menu with a time delay
        setTimeout(function () {
            expandCategoriesInView();
            highlightTopMostKey();
        }, 1500)

    }
};