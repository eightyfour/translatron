/**
 * Parse a string and escape all special characters with unicodes.
 */

module.exports = {
    escapeUnicode : function (str) {
        return str.replace(/[\u0080-\uFFFF]/g, function(m) {
            return "\\u" + ("0000" + m.charCodeAt(0).toString(16)).slice(-4);
        });
    }
}
