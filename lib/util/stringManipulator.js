
function removeAllDoubleSlashes(s) {
    var i = 0, endString = "";
    while(s[i]) {
        if (s[i] === '/' && s[i + 1] === '/') {
            endString += s.slice(++i, 1);
        } else {
            endString += s[i];
            i++;

        }
    }
    return endString;
}
/**
 * add a slash at the first and last and removes all double slasheses
 * @param s
 */
function addFirstAndLastSlash(s) {

    if (s[0] !== '/') {
        s = '/' + s;
    }

    if (s[s.length -1] !== '/') {
        s += '/';
    }

    return removeAllDoubleSlashes(s);
}

module.exports = {
    removeAllDoubleSlashes : removeAllDoubleSlashes,
    addFirstAndLastSlash : addFirstAndLastSlash
}