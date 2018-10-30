/**
 * Parse a string and escape all special characters with unicodes.
 * \u0000 - \u019 - Control chars, e.g. Carriage Return, New Line etc.
 * \u0022 - Quotation mark
 * \u0027 - Apostrophe
 * \u0060 - Grave Accent
 * \u0080 - \uFFFF - Non basic latin characters + control chars
 */

module.exports = {
    escapeUnicode : function (str) {
        return str.replace(/[\u0000-\u0019|\u0022|\u0027|\u0060|\u0080-\uFFFF]/g, function(m) {
            return "\\u" + ("0000" + m.charCodeAt(0).toString(16)).slice(-4);
        });
    }
}
