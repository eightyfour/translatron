function getAnchor() {
    var href = location.href;
    if (/#/.test(href)) {
        return '#' + location.href.replace(/.*#/, '');
    }
    return '';
}

module.exports = {
    getAnchor : getAnchor,
    hasAnchor : function () {
        return getAnchor() !== '';
    }
}