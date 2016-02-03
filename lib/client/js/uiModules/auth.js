var onLogout = function () {console.log('auth:onLogout is not handled')},
    brain = {
        logoutButton : function (node) {
            node.addEventListener('click', onLogout);
        }
    };

module.exports = {
    onLogout : function (fc) {
        onLogout = fc;
    },
    add : function (node, attr) {
        if (brain.hasOwnProperty(attr)) {
            brain[attr](node);
        }
    }
};