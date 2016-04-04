var canny = require('canny');

/**
 * just the implementation of the callbacks
 *
 */

/**
 * Apply project description data to dom elements
 * @param data: Project configuration data
 */
function applyProjectData(data) {
    if (data.hasOwnProperty('project')) {
        // project specific config
        canny.texts.setTexts({projectName : data.project});
    }
    // TODO this won't work anymore
    if (data.hasOwnProperty('keyDescriptions') && data.keyDescriptions['__description']) {
        // project specific config
        canny.texts.setTexts({projectDescription : data.keyDescriptions['__description']});
    }
}

module.exports = {
    onNewProjectCreated : applyProjectData,
    onLoadProject : applyProjectData,
    onNewDirectoryCreated : function(data) {
        canny.texts.setTexts({
            projectName : data.directoryId
        });
    }
};