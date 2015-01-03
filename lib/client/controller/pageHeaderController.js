var canny = require('canny');

/**
 * just the implementation of the callbacks
 *
 * @type {{getJSON: getJSON}}
 */
module.exports = {
    getJSON : function (data) {
        if (data.hasOwnProperty('project')) {
            // project specific config
            canny.texts.setTexts({projectName : data.project});
        }
    }
};