var canny = require('canny');
/**
 * just the implementation of the callbacks
 *
 * @type {{getJSON: getJSON}}
 */
module.exports = {
    getJSON : function (data) {
        console.log('getJson:', data);
        if (data.hasOwnProperty('projects')) {
            // main project config
            canny.projectMainNavigation.setAvailableProjects(data.projects);
            canny.projectMainNavigation.setAvailableLanguages(data.languages);
        } else {
            // project specific config
        }
    }
};