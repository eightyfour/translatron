var canny = require('canny');

canny.projectMainNavigation.onLanguageSelect(function (obj) {
    console.log('Click on language', obj);
});
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
            canny.projectMainNavigation.setActivatedProjectLanguages(data);
            // project specific config
        }
    }
};