var uiEvent = (function () {
    var eventQueues = {
            activateLanguage : [],
            deActivateLanguage : [],
            addLanguage: [],
            showExportDialog: [],
            projectSelected: [],
            updateKey: []
        };
    return {
        addUiEventListener : function (obj) {
            Object.keys(obj).forEach(function (key) {
                if (eventQueues.hasOwnProperty(key)) {
                    eventQueues[key].push(obj[key]);
                }
            });
        },
        callUievent : function (eventName, args) {
            var argsList = [].slice.call(arguments, 1, arguments.length);
            if (eventQueues.hasOwnProperty(eventName)) {
                if (eventName === 'projectSelected') {
                    argsList = [args + '.prj'];
                }
                eventQueues[eventName].forEach(function (fc) {
                   fc.apply(null, argsList);
                });
            }
        }
    }
}());

module.exports = uiEvent;
