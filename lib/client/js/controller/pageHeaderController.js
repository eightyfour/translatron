var canny = require('canny');

/**
 * just the implementation of the callbacks
 *
 */
module.exports = {
    onLoadProject : function (data) {
        if (data.hasOwnProperty('project')) {
            // project specific config
            canny.texts.setTexts({projectName : data.project});
        }
        // TODO this want work anymore
        if (data.hasOwnProperty('keyDescriptions') && data.keyDescriptions['__description']) {
            // project specific config
            canny.texts.setTexts({projectDescription : data.keyDescriptions['__description']});
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