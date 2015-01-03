var canny = require('canny'),
    uiEvents = require('../uiEventManager.js');

canny.projectMainNavigation.onLanguageSelect(function (obj) {
    var eventName;
    if (obj.isActive) {
        eventName = obj.isInactive ? 'deActivateLanguage' : 'activateLanguage';
        uiEvents.callUievent(eventName, obj.language);
    }
    console.log('Click on language', obj);
});
/**
 * just the implementation of the callbacks
 *
 * @type {{getJSON: getJSON}}
 */
module.exports = {
    getJSON : function (data) {
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