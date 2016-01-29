var canny = require('canny');

/**
 * just the implementation of the callbacks
 *
 * @type {{getJSON: getJSON}}
 */
module.exports = {
    onLoadProject : function (data) {
        if (data.hasOwnProperty('project')) {
            // project specific config
            canny.texts.setTexts({projectName : data.projectId});
        }

        if (data.hasOwnProperty('description')) {
            // project specific config
            canny.texts.setTexts({projectDescription : data.description});
        }
    },
    onNewDirectoryCreated : function(data) {
        canny.texts.setTexts({
            projectName : data.directoryId
        });
    },
    onNewProjectCreated : function(data) {
        canny.texts.setTexts({
           projectName : data.projectId
        });
    }
};