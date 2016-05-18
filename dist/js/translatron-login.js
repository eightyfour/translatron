(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var canny = require('canny');
canny.add('loginAnchor', require('./uiModules/loginAnchor.js'));
},{"./uiModules/loginAnchor.js":2,"canny":3}],2:[function(require,module,exports){
var loginAnchor = (function () {
		"use strict";

		return {
			add: function (node) {

				var location = document.location.href,
					anchor = '';

				if (location.indexOf('#') > -1) {
					anchor = '#' + location.split('#').pop();
				}

				node.setAttribute('type', 'hidden');
				node.setAttribute('name', 'from');
				node.setAttribute('value', anchor);
			}
		};

	}());

module.exports = loginAnchor;
},{}],3:[function(require,module,exports){
/*global */
/*jslint browser: true*/
/**
 *
 * E.g.:
 *  canny-mod="moduleObj" canny-var="{'propertyKey':'value'}"
 *  canny-mod="moduleString" canny-var="button"
 *
 * Instead of canny-var you can use the module name to avoid conflicts like:
 * E.g.: canny-mod="mod1 mod2" canny-mod1={'foo':'123456', 'bar':'654321'} canny-mod2="mod2Property"
 *
 * ---------------------------------------------------------------------------- eightyfour
 */
(function (global) {
    "use strict";
    var canny = (function () {
        var readyQueue = [],
            readyQueueInit = false,
            moduleQueue = []; // save modules to call the ready method once

        /**
         * Find the single quotes and replace them with double quotes except string which
         * are part of the property string.
         *
         * @param string
         * @returns {string}
         */
        function escapeStringForJSON(string) {
            var s = string
                .replace(/\{\s*\'/g,'{"').replace(/\'\s*\}/g,'"}')
                .replace(/:\s*\'/g,':"').replace(/\'\s*:/g,'":')
                .replace(/,\s*\'/g,',"').replace(/\'\s*,/g,'",')
                .replace(/\[\s*\'/g,'["').replace(/\'\s*\]/g,'"]');
            return s;
        }

        function escapeStringForJSONArray(string) {
            var s = string
                .replace(/,\s*\'/g,',"').replace(/\'\s*,/g,'",')
                .replace(/\[\s*\'/g,'["').replace(/\'\s*\]/g,'"]');
            return s;
        }

        function callMethodQueue(queue) {
            (function reduce() {
                var fc = queue.pop();
                if (fc) {
                    fc();
                    reduce();
                } else {
                    queue = [];
                }
            }());
        }

        function parseNode(node, name, cb) {
            var that = this, gdModuleChildren = [].slice.call(node.querySelectorAll('[' + name + '-mod]')), prepareReadyQueue = {};

            gdModuleChildren.forEach(function (node) {
                var attribute = node.getAttribute(name + '-mod'), attr, viewPart, attributes, cannyVar;

                attributes = attribute.split(' ');

                attributes.forEach(function (moduleName) {
                    if (that[moduleName]) {
                        if (node.getAttribute(name + '-mod')) {
                            if (node.getAttribute(name + '-' + moduleName)) {
                                cannyVar = node.getAttribute(name + '-' + moduleName);
                            } else {
                                cannyVar = node.getAttribute(name + '-var');
                            }
                            if (cannyVar) {
                                // simple JSON test
                                if (/\{\s*\'|\".*:.*\}/.test(cannyVar)) {
                                    attr = escapeStringForJSON(cannyVar);
                                    // could be a JSON
                                    try {
                                        viewPart = JSON.parse(attr);
                                    } catch (ex) {
                                        console.error("canny can't parse passed JSON for module: " + moduleName, node);
                                    }
                                } else if (/\[\s*\'|\".*\'|\"\]/.test(cannyVar)) {
                                    attr = escapeStringForJSONArray(cannyVar);
                                    try {
                                        viewPart = JSON.parse(attr);
                                    } catch (ex) {
                                        console.error("canny can't parse passed JSON for module: " + moduleName, node);
                                    }
                                } else {
                                    viewPart = cannyVar;
                                }
                            }
                        }
                        // has module a ready function than save it for calling
                        if (that[moduleName].hasOwnProperty('ready')) {
                            // TODO or call it immediately?
                            prepareReadyQueue[moduleName] = that[moduleName].ready;
                        }
                        if (that.hasOwnProperty(moduleName)) {
                            that[moduleName].add(node, viewPart);
                        }
                    } else {
                        console.warn('canny parse: module with name ´' + moduleName + '´ is not registered');
                    }
                });
            });
            // add ready callback to moduleQueue
            Object.keys(prepareReadyQueue).forEach(function (name) {
                moduleQueue.push(prepareReadyQueue[name]);
            });
            cb && cb();
        }

        document.addEventListener('DOMContentLoaded', function cannyDomLoad() {
            document.removeEventListener('DOMContentLoaded', cannyDomLoad);

            parseNode.apply(canny, [document, 'canny']);

            callMethodQueue(moduleQueue);
            // call registered ready functions
            readyQueueInit = true;
            callMethodQueue(readyQueue);
        }, false);

        return {
            add : function (name, module) {
                var moduleApi = module;
                if (!this.hasOwnProperty(name)) {
                    if (typeof module === 'function') {
                        moduleApi = module(this); // initialize the module with the actual canny instance
                    }
                    this[name] = moduleApi;
                } else {
                    console.error('canny: Try to register module with name ' + name + ' twice');
                }
            },
            ready : function (fc) {
                if (!readyQueueInit) {
                    readyQueue.push(fc);
                } else {
                    fc();
                }
            },
            cannyParse : function (node, name, cb) {
                // TODO needs a callback
                if (typeof name === 'function') {
                    cb = name;
                    name = "canny";
                }
                parseNode.apply(this || canny, [node, name || 'canny', function () {
                    callMethodQueue(moduleQueue);
                    cb && cb();
                }]);
            }
        };
    }());
    // export as module or bind to global
    if (typeof module !== 'undefined' && module.hasOwnProperty('exports')) { module.exports = canny; } else {global.canny = canny; }
}(this));
},{}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJsaWIvY2xpZW50L2pzL2xvZ2luLmpzIiwibGliL2NsaWVudC9qcy91aU1vZHVsZXMvbG9naW5BbmNob3IuanMiLCJub2RlX21vZHVsZXMvY2FubnkvY2FubnkuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBOztBQ0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwidmFyIGNhbm55ID0gcmVxdWlyZSgnY2FubnknKTtcbmNhbm55LmFkZCgnbG9naW5BbmNob3InLCByZXF1aXJlKCcuL3VpTW9kdWxlcy9sb2dpbkFuY2hvci5qcycpKTsiLCJ2YXIgbG9naW5BbmNob3IgPSAoZnVuY3Rpb24gKCkge1xuXHRcdFwidXNlIHN0cmljdFwiO1xuXG5cdFx0cmV0dXJuIHtcblx0XHRcdGFkZDogZnVuY3Rpb24gKG5vZGUpIHtcblxuXHRcdFx0XHR2YXIgbG9jYXRpb24gPSBkb2N1bWVudC5sb2NhdGlvbi5ocmVmLFxuXHRcdFx0XHRcdGFuY2hvciA9ICcnO1xuXG5cdFx0XHRcdGlmIChsb2NhdGlvbi5pbmRleE9mKCcjJykgPiAtMSkge1xuXHRcdFx0XHRcdGFuY2hvciA9ICcjJyArIGxvY2F0aW9uLnNwbGl0KCcjJykucG9wKCk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRub2RlLnNldEF0dHJpYnV0ZSgndHlwZScsICdoaWRkZW4nKTtcblx0XHRcdFx0bm9kZS5zZXRBdHRyaWJ1dGUoJ25hbWUnLCAnZnJvbScpO1xuXHRcdFx0XHRub2RlLnNldEF0dHJpYnV0ZSgndmFsdWUnLCBhbmNob3IpO1xuXHRcdFx0fVxuXHRcdH07XG5cblx0fSgpKTtcblxubW9kdWxlLmV4cG9ydHMgPSBsb2dpbkFuY2hvcjsiLCIvKmdsb2JhbCAqL1xuLypqc2xpbnQgYnJvd3NlcjogdHJ1ZSovXG4vKipcbiAqXG4gKiBFLmcuOlxuICogIGNhbm55LW1vZD1cIm1vZHVsZU9ialwiIGNhbm55LXZhcj1cInsncHJvcGVydHlLZXknOid2YWx1ZSd9XCJcbiAqICBjYW5ueS1tb2Q9XCJtb2R1bGVTdHJpbmdcIiBjYW5ueS12YXI9XCJidXR0b25cIlxuICpcbiAqIEluc3RlYWQgb2YgY2FubnktdmFyIHlvdSBjYW4gdXNlIHRoZSBtb2R1bGUgbmFtZSB0byBhdm9pZCBjb25mbGljdHMgbGlrZTpcbiAqIEUuZy46IGNhbm55LW1vZD1cIm1vZDEgbW9kMlwiIGNhbm55LW1vZDE9eydmb28nOicxMjM0NTYnLCAnYmFyJzonNjU0MzIxJ30gY2FubnktbW9kMj1cIm1vZDJQcm9wZXJ0eVwiXG4gKlxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBlaWdodHlmb3VyXG4gKi9cbihmdW5jdGlvbiAoZ2xvYmFsKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgdmFyIGNhbm55ID0gKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHJlYWR5UXVldWUgPSBbXSxcbiAgICAgICAgICAgIHJlYWR5UXVldWVJbml0ID0gZmFsc2UsXG4gICAgICAgICAgICBtb2R1bGVRdWV1ZSA9IFtdOyAvLyBzYXZlIG1vZHVsZXMgdG8gY2FsbCB0aGUgcmVhZHkgbWV0aG9kIG9uY2VcblxuICAgICAgICAvKipcbiAgICAgICAgICogRmluZCB0aGUgc2luZ2xlIHF1b3RlcyBhbmQgcmVwbGFjZSB0aGVtIHdpdGggZG91YmxlIHF1b3RlcyBleGNlcHQgc3RyaW5nIHdoaWNoXG4gICAgICAgICAqIGFyZSBwYXJ0IG9mIHRoZSBwcm9wZXJ0eSBzdHJpbmcuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSBzdHJpbmdcbiAgICAgICAgICogQHJldHVybnMge3N0cmluZ31cbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIGVzY2FwZVN0cmluZ0ZvckpTT04oc3RyaW5nKSB7XG4gICAgICAgICAgICB2YXIgcyA9IHN0cmluZ1xuICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9cXHtcXHMqXFwnL2csJ3tcIicpLnJlcGxhY2UoL1xcJ1xccypcXH0vZywnXCJ9JylcbiAgICAgICAgICAgICAgICAucmVwbGFjZSgvOlxccypcXCcvZywnOlwiJykucmVwbGFjZSgvXFwnXFxzKjovZywnXCI6JylcbiAgICAgICAgICAgICAgICAucmVwbGFjZSgvLFxccypcXCcvZywnLFwiJykucmVwbGFjZSgvXFwnXFxzKiwvZywnXCIsJylcbiAgICAgICAgICAgICAgICAucmVwbGFjZSgvXFxbXFxzKlxcJy9nLCdbXCInKS5yZXBsYWNlKC9cXCdcXHMqXFxdL2csJ1wiXScpO1xuICAgICAgICAgICAgcmV0dXJuIHM7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBlc2NhcGVTdHJpbmdGb3JKU09OQXJyYXkoc3RyaW5nKSB7XG4gICAgICAgICAgICB2YXIgcyA9IHN0cmluZ1xuICAgICAgICAgICAgICAgIC5yZXBsYWNlKC8sXFxzKlxcJy9nLCcsXCInKS5yZXBsYWNlKC9cXCdcXHMqLC9nLCdcIiwnKVxuICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9cXFtcXHMqXFwnL2csJ1tcIicpLnJlcGxhY2UoL1xcJ1xccypcXF0vZywnXCJdJyk7XG4gICAgICAgICAgICByZXR1cm4gcztcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGNhbGxNZXRob2RRdWV1ZShxdWV1ZSkge1xuICAgICAgICAgICAgKGZ1bmN0aW9uIHJlZHVjZSgpIHtcbiAgICAgICAgICAgICAgICB2YXIgZmMgPSBxdWV1ZS5wb3AoKTtcbiAgICAgICAgICAgICAgICBpZiAoZmMpIHtcbiAgICAgICAgICAgICAgICAgICAgZmMoKTtcbiAgICAgICAgICAgICAgICAgICAgcmVkdWNlKCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcXVldWUgPSBbXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KCkpO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gcGFyc2VOb2RlKG5vZGUsIG5hbWUsIGNiKSB7XG4gICAgICAgICAgICB2YXIgdGhhdCA9IHRoaXMsIGdkTW9kdWxlQ2hpbGRyZW4gPSBbXS5zbGljZS5jYWxsKG5vZGUucXVlcnlTZWxlY3RvckFsbCgnWycgKyBuYW1lICsgJy1tb2RdJykpLCBwcmVwYXJlUmVhZHlRdWV1ZSA9IHt9O1xuXG4gICAgICAgICAgICBnZE1vZHVsZUNoaWxkcmVuLmZvckVhY2goZnVuY3Rpb24gKG5vZGUpIHtcbiAgICAgICAgICAgICAgICB2YXIgYXR0cmlidXRlID0gbm9kZS5nZXRBdHRyaWJ1dGUobmFtZSArICctbW9kJyksIGF0dHIsIHZpZXdQYXJ0LCBhdHRyaWJ1dGVzLCBjYW5ueVZhcjtcblxuICAgICAgICAgICAgICAgIGF0dHJpYnV0ZXMgPSBhdHRyaWJ1dGUuc3BsaXQoJyAnKTtcblxuICAgICAgICAgICAgICAgIGF0dHJpYnV0ZXMuZm9yRWFjaChmdW5jdGlvbiAobW9kdWxlTmFtZSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhhdFttb2R1bGVOYW1lXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG5vZGUuZ2V0QXR0cmlidXRlKG5hbWUgKyAnLW1vZCcpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG5vZGUuZ2V0QXR0cmlidXRlKG5hbWUgKyAnLScgKyBtb2R1bGVOYW1lKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYW5ueVZhciA9IG5vZGUuZ2V0QXR0cmlidXRlKG5hbWUgKyAnLScgKyBtb2R1bGVOYW1lKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYW5ueVZhciA9IG5vZGUuZ2V0QXR0cmlidXRlKG5hbWUgKyAnLXZhcicpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoY2FubnlWYXIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gc2ltcGxlIEpTT04gdGVzdFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoL1xce1xccypcXCd8XFxcIi4qOi4qXFx9Ly50ZXN0KGNhbm55VmFyKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0ciA9IGVzY2FwZVN0cmluZ0ZvckpTT04oY2FubnlWYXIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gY291bGQgYmUgYSBKU09OXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZpZXdQYXJ0ID0gSlNPTi5wYXJzZShhdHRyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGV4KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcImNhbm55IGNhbid0IHBhcnNlIHBhc3NlZCBKU09OIGZvciBtb2R1bGU6IFwiICsgbW9kdWxlTmFtZSwgbm9kZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoL1xcW1xccypcXCd8XFxcIi4qXFwnfFxcXCJcXF0vLnRlc3QoY2FubnlWYXIpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRyID0gZXNjYXBlU3RyaW5nRm9ySlNPTkFycmF5KGNhbm55VmFyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmlld1BhcnQgPSBKU09OLnBhcnNlKGF0dHIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBjYXRjaCAoZXgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiY2FubnkgY2FuJ3QgcGFyc2UgcGFzc2VkIEpTT04gZm9yIG1vZHVsZTogXCIgKyBtb2R1bGVOYW1lLCBub2RlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZpZXdQYXJ0ID0gY2FubnlWYXI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBoYXMgbW9kdWxlIGEgcmVhZHkgZnVuY3Rpb24gdGhhbiBzYXZlIGl0IGZvciBjYWxsaW5nXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhhdFttb2R1bGVOYW1lXS5oYXNPd25Qcm9wZXJ0eSgncmVhZHknKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFRPRE8gb3IgY2FsbCBpdCBpbW1lZGlhdGVseT9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmVwYXJlUmVhZHlRdWV1ZVttb2R1bGVOYW1lXSA9IHRoYXRbbW9kdWxlTmFtZV0ucmVhZHk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhhdC5oYXNPd25Qcm9wZXJ0eShtb2R1bGVOYW1lKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoYXRbbW9kdWxlTmFtZV0uYWRkKG5vZGUsIHZpZXdQYXJ0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybignY2FubnkgcGFyc2U6IG1vZHVsZSB3aXRoIG5hbWUgwrQnICsgbW9kdWxlTmFtZSArICfCtCBpcyBub3QgcmVnaXN0ZXJlZCcpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIC8vIGFkZCByZWFkeSBjYWxsYmFjayB0byBtb2R1bGVRdWV1ZVxuICAgICAgICAgICAgT2JqZWN0LmtleXMocHJlcGFyZVJlYWR5UXVldWUpLmZvckVhY2goZnVuY3Rpb24gKG5hbWUpIHtcbiAgICAgICAgICAgICAgICBtb2R1bGVRdWV1ZS5wdXNoKHByZXBhcmVSZWFkeVF1ZXVlW25hbWVdKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgY2IgJiYgY2IoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCBmdW5jdGlvbiBjYW5ueURvbUxvYWQoKSB7XG4gICAgICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgY2FubnlEb21Mb2FkKTtcblxuICAgICAgICAgICAgcGFyc2VOb2RlLmFwcGx5KGNhbm55LCBbZG9jdW1lbnQsICdjYW5ueSddKTtcblxuICAgICAgICAgICAgY2FsbE1ldGhvZFF1ZXVlKG1vZHVsZVF1ZXVlKTtcbiAgICAgICAgICAgIC8vIGNhbGwgcmVnaXN0ZXJlZCByZWFkeSBmdW5jdGlvbnNcbiAgICAgICAgICAgIHJlYWR5UXVldWVJbml0ID0gdHJ1ZTtcbiAgICAgICAgICAgIGNhbGxNZXRob2RRdWV1ZShyZWFkeVF1ZXVlKTtcbiAgICAgICAgfSwgZmFsc2UpO1xuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBhZGQgOiBmdW5jdGlvbiAobmFtZSwgbW9kdWxlKSB7XG4gICAgICAgICAgICAgICAgdmFyIG1vZHVsZUFwaSA9IG1vZHVsZTtcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMuaGFzT3duUHJvcGVydHkobmFtZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBtb2R1bGUgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1vZHVsZUFwaSA9IG1vZHVsZSh0aGlzKTsgLy8gaW5pdGlhbGl6ZSB0aGUgbW9kdWxlIHdpdGggdGhlIGFjdHVhbCBjYW5ueSBpbnN0YW5jZVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHRoaXNbbmFtZV0gPSBtb2R1bGVBcGk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcignY2Fubnk6IFRyeSB0byByZWdpc3RlciBtb2R1bGUgd2l0aCBuYW1lICcgKyBuYW1lICsgJyB0d2ljZScpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICByZWFkeSA6IGZ1bmN0aW9uIChmYykge1xuICAgICAgICAgICAgICAgIGlmICghcmVhZHlRdWV1ZUluaXQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVhZHlRdWV1ZS5wdXNoKGZjKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBmYygpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBjYW5ueVBhcnNlIDogZnVuY3Rpb24gKG5vZGUsIG5hbWUsIGNiKSB7XG4gICAgICAgICAgICAgICAgLy8gVE9ETyBuZWVkcyBhIGNhbGxiYWNrXG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBuYW1lID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAgICAgICAgIGNiID0gbmFtZTtcbiAgICAgICAgICAgICAgICAgICAgbmFtZSA9IFwiY2FubnlcIjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcGFyc2VOb2RlLmFwcGx5KHRoaXMgfHwgY2FubnksIFtub2RlLCBuYW1lIHx8ICdjYW5ueScsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FsbE1ldGhvZFF1ZXVlKG1vZHVsZVF1ZXVlKTtcbiAgICAgICAgICAgICAgICAgICAgY2IgJiYgY2IoKTtcbiAgICAgICAgICAgICAgICB9XSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfSgpKTtcbiAgICAvLyBleHBvcnQgYXMgbW9kdWxlIG9yIGJpbmQgdG8gZ2xvYmFsXG4gICAgaWYgKHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnICYmIG1vZHVsZS5oYXNPd25Qcm9wZXJ0eSgnZXhwb3J0cycpKSB7IG1vZHVsZS5leHBvcnRzID0gY2Fubnk7IH0gZWxzZSB7Z2xvYmFsLmNhbm55ID0gY2Fubnk7IH1cbn0odGhpcykpOyJdfQ==
