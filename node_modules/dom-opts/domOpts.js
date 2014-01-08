/*global HTMLElement */
/*jslint browser: true */

var domOpts = {};

domOpts.params = (function () {
    "use strict";
    var params = {}, i, nv, parts;
    if (location.search) {
        parts = location.search.substring(1).split('&');
        for (i = 0; i < parts.length; i++) {
            nv = parts[i].split('=');
            if (nv[0]) {
                params[nv[0]] = nv[1] || true;
            }
        }
    }
    return params;
}());

domOpts.createElement = function (tag, id, classes) {
    "use strict";
    var newNode = document.createElement(tag);
    if (id) {newNode.setAttribute('id', id); }
    if (classes) {newNode.setAttribute('class', classes); }
    return newNode;
};
module.exports =  domOpts;

// dom operations:
HTMLElement.prototype.domAddClass = function (addClasses) {
    "use strict";
    var attrClass = this.getAttribute('class'),
        addClassesList = addClasses.split(' '), newClasses = [], i;
    for (i = 0; i < addClassesList.length; i++) {
        if (!this.domHasClass(addClassesList[i])) {
            newClasses.push(addClassesList[i]);
        }
    }
    this.setAttribute('class', attrClass !== null ? attrClass + ' ' + newClasses.join(' ') : newClasses.join(' '));
    return this;
};
// TODO remove all classes with same name
HTMLElement.prototype.domRemoveClass = function (removeableClasses) {
    "use strict";
    var removeClasses = (removeableClasses && removeableClasses.split(' ')) || this.getAttribute('class').split(' '),
        attrClass = this.getAttribute('class'),
        currentClasses,
        i,
        idx;
    if (attrClass !== null) {
        currentClasses = attrClass.split(' ');
        for (i = 0; i < removeClasses.length; i++) {
            idx = currentClasses.indexOf(removeClasses[i]);
            if (idx >= 0) {
                currentClasses = currentClasses.slice(0, idx).concat(currentClasses.slice(idx + 1, currentClasses.length - 1));
            }
        }
        this.setAttribute('class', currentClasses.join(' '));
    }
    return this;
};

// dom operations:
HTMLElement.prototype.domHasClass = function (className) {
    "use strict";
    var classes = this.getAttribute('class'), currentClasses, i;
    if (classes !== null) {
        currentClasses = classes.split(' ');
        for (i = 0; i < currentClasses.length; i++) {
            if (currentClasses[i] === className) {return true; }
        }
    }
    return false;
};

HTMLElement.prototype.domRemove = function () {
    "use strict";
    this.parentNode.removeChild(this);
};

HTMLElement.prototype.domAppendTo = function (elem) {
    "use strict";
    var node = elem;
    if (typeof node === 'string') {
        node = document.getElementById(node);
    }
    node.appendChild(this);
    return this;
};

HTMLElement.prototype.domChildTags = function (tag) {
    "use strict";
    var tags = [];
    Array.prototype.slice.call(this.children).forEach(function (e) {
        if (e.tagName.toLowerCase() === tag.toLowerCase()) {
            tags.push(e);
        }
    });
    return tags;
};