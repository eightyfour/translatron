"use strict";
var fs = require('fs'),
    mkdirP = require('../mkdir-p');

module.exports = (projectFolder) => {

    return {
        /**
         * saves a object as JSON format in a file. If there is no existing json or folder it will create a new one.
         * You can pass the complete json file name path to it without the .json extension.
         * The path must start with a / and will be relative to the configured projectFolder.
         *
         * @param projectId e.g.: /projectName/project or just /project
         * @param obj
         * @param cb
         */
        saveJSON : (projectId, obj, cb) => {
            var split= projectId.split('/'),
                path = split.slice(0, split.length - 1).join('/');
            mkdirP(projectFolder, path, () => {
                fs.writeFile(projectFolder + projectId + '.json', JSON.stringify(obj, null, 2), cb);
            });
        }
    }
};