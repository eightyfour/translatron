var canny = require('canny');

/**
 * just the implementation of the callbacks
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

    // FIXME: Categories should not be named "__description" as they would override the project description
    if (data.hasOwnProperty('keyDescriptions')) {
        // project specific config - if property is present
        canny.texts.setTexts({
            projectDescription : (data.keyDescriptions['__description'] ? data.keyDescriptions['__description'] : '')
        });
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