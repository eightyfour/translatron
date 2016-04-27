var node;
module.exports = {
    add : function (elem ,attr) {
        node = elem;
    },
    addDescriptions : function (keyDescriptions) {
        Object.keys(keyDescriptions).forEach(function (key) {
            var parent = document.getElementById(key),
                child;
            if (parent) {
                child = parent.querySelector('.js-text');
                if (child) {
                    child.innerHTML = keyDescriptions[key];
                }
            }
        })
    }
}