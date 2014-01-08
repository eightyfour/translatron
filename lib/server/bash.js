/**
 * Provide all bash functionality and execute function which returns the result.
 */
var C = require('../CONST.js');
var sys = require('sys');
var exec = require('child_process').exec;
//function puts(error, stdout, stderr) {
//    "use strict";
//    sys.puts(stdout);
//}
//exec("/home/han/dev/nodejs/execute_bash_test.sh", puts);
//console.log('start script done');


function logOut(error, stdout, stderr) {
    "use strict";
    console.log('+++ LOG SYS +++');
    sys.puts(stdout);
    console.log('+++ LOG ARGUMENTS +++');
    console.log([].slice.call(arguments));
}

// TODO handle files with spaces
var bash = (function () {
    "use strict";
    var commands = {};

    commands[C.BASH.LS] = function (path, cb) {
        exec("ls -l " + projectFolder + '/' + path, function (error, stdout, stderr) {
            var res;
            if (stdout) {
                res = stdout.split('\n');
                res = res.slice(1); // kick first element
                res = res.map(function (e) {
                    var split;
                    if (e) {
                        split = e.split(' ');
                        return {d : /d/.test(split[0]), name : split[split.length - 1]};
                    }
                    return {};
                });
                cb({value : res, fail : false});
            } else {
                cb({value : [], fail : true});
            }
        });
    };

    return {
        exec : function (obj, cb) {
            console.log('COMMAND: ' + obj.comand);
            commands[obj.comand](obj.path, cb);
        }
    };
}());

module.exports = bash;
