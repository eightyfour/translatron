/*global */
/*jslint browser: true*/

var canny = require('canny');

/**
 * E.g.: gd-module="flowControl" gd-attr="{'view' : 'viewToShow'}"
 *
 * you can activate a initial view with a anchor in the URL e.g.: yourdomain.html#viewToShow
 * Or pass a comma separated module list for activate more module #viewToShow,otherView
 *
 * TODO made it possible to summarize views with one identifier.
 * Instead of call: gdom.flowControl.show('view1', 'view2', 'view3') call gdom.flowControl.show('view').
 */
var projectMainNavigation = (function () {
    "use strict";

    var mainNode,
        // TODO make configurable via project.json
        localTexts = {
            da: 'Danmark',
            de: 'Deutschland',
            fr: 'France',
            nl: 'Nederland',
            en: 'United States (Default)',
            en_GB: 'United Kingdom',
            sv: 'Sverige',
            es: 'Espanol'
        },
        path = document.location.origin + document.location.pathname,
        bundleName = window.domOpts.params.bundle,
        fromTranslation = window.domOpts.params.from || 'de',
        toTranslation = window.domOpts.params.to,
        modViews = {
            main : function (node) {
                mainNode = node;
            },
            menuToggleButton : function (node) {
                var svgIconNode = node.querySelector('.si-icon');
                new svgIcon(node, {
                    hamburgerCross : {
                        url : 'animatedSVG/svg/hamburger.svg',
                        animation : [
                            {
                                el : 'path:nth-child(1)',
                                animProperties : {
                                    from : { val : '{"path" : "m 5.0916789,20.818994 53.8166421,0"}' },
                                    to : { val : '{"path" : "M 12.972944,50.936147 51.027056,12.882035"}' }
                                }
                            },
                            {
                                el : 'path:nth-child(2)',
                                animProperties : {
                                    from : { val : '{"transform" : "s1 1", "opacity" : 1}', before : '{"transform" : "s0 0"}' },
                                    to : { val : '{"opacity" : 0}' }
                                }
                            },
                            {
                                el : 'path:nth-child(3)',
                                animProperties : {
                                    from : { val : '{"path" : "m 5.0916788,42.95698 53.8166422,0"}' },
                                    to : { val : '{"path" : "M 12.972944,12.882035 51.027056,50.936147"}' }
                                }
                            }
                        ]
                    }
                }, { easing : mina.elastic, speed: 1200 ,
                    size : {
                        w : '4em',
                        h : '4em'
                    }} );
                node.addEventListener('click', function () {
                    if (mainNode.classList.contains('c-open')) {
                        mainNode.classList.remove('c-open');
                    } else {
                        mainNode.classList.add('c-open');
                    }
                })
            },
            showResourceBundleEditor : function (node) {
                // reload the page because the files are not synced
                node.setAttribute('href', '#');
                node.addEventListener('click', function () {
                    location.reload();
                });
            },
            showFileEditor : function (node) {
                node.setAttribute('href', '#');
                node.addEventListener('click', function () {
                    alert('This mode is only developers. Keep in mind that the file changes you made are not synced to the other clients.');
                    canny.flowControl.show('fileManager');
                });

            },
            createNewProject : function (node) {
                node.setAttribute('href', '#');
                node.addEventListener('click', function () {
                    var bundle = prompt("Please enter the Task number:");
                    if (bundle) {
                        location.href = '/?bundle=' + bundle;
                    }
                });

            },
            from : function (node) {
                this.from.node = node;
            },
            to : function (node) {
                this.to.node = node;
            },
            projects : function (node) {
                this.projects.node = node;
            }
        };

    function setLocale(locales, node, domValue) {
        var ul = window.domOpts.createElement('ul', 'navigationMenu'), li, from, to,a ;
        locales.forEach(function (key) {

            if (localTexts.hasOwnProperty(key)) {

                li = window.domOpts.createElement('li');
                a = window.domOpts.createElement('a');

                if (domValue === 'from') {
                    from = key;
                    to = toTranslation;
                } else {
                    to = key;
                    from = fromTranslation;
                }
                if (to) {
                    a.setAttribute('href', path + '?bundle=' + bundleName + '&from=' + from + "&to=" + to);
                } else {
                    a.setAttribute('href', path + '?bundle=' + bundleName + '&from=' + from);
                }
                a.innerHTML = localTexts[key];
                a.domAppendTo(li);
                li.domAppendTo(ul);
            }

        });
        ul.domAppendTo(node);
    }

    function setProjects(projects, node) {
        var ul = window.domOpts.createElement('ul', 'navigationMenu'), li, a;
        projects.forEach(function (projectName) {

            li = window.domOpts.createElement('li');
            a = window.domOpts.createElement('a');
            a.setAttribute('href', path + '?bundle=' + projectName);
            a.innerHTML = projectName;
            a.domAppendTo(li);
            li.domAppendTo(ul);

        });
        ul.domAppendTo(node);
    }

    return {
        setAvailableLanguages : function (languages) {
            setLocale(languages, modViews.from.node, 'from');
            setLocale(languages, modViews.to.node);
        },
        setAvailableProjects : function (projects) {
            setProjects(projects, modViews.projects.node);
        },
        ready : function () {
            console.log('nav-controller ready event');
        },
        add : function (node, attr) {    // part of api
            if (modViews.hasOwnProperty(attr)) {
                modViews[attr](node);
            } else {
                console.log('LINK NOT IMPLEMENTED');
            }
        }
    };
}());

module.exports =  projectMainNavigation;