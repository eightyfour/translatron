/*global */
/*jslint browser: true*/

var canny = require('canny'),
    flag = require('./flag'),
    texts = require('./texts'),
    uiEvents = require('../uiEventManager.js');

/**
 * E.g.: canny-mod="flowControl" canny-var="{'view' : 'viewToShow'}"
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
        showAsJSONQueue = [],
        selectLanguageQueue = [],
        bundleName = window.domOpts.params.bundle,
        modViews = {
            main : function (node) {
                mainNode = node;
            },
            menuToggleButton : function (node) {
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
                }, {
                    easing : mina.elastic, speed: 1200, size : {w : '4em', h : '4em'}
                });
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
                    // alert('This mode is only developers. Keep in mind that the file changes you made are not synced to the other clients.');
//                    canny.flowControl.show('fileManager');
                    canny.layoutManager.showOverlay('editorModeView');
                });

            },
            createNewProject : function (node) {
                node.addEventListener('click', function () {
                    canny.layoutManager.showOverlay('createNewProjectView');
                });

            },
            showJSONBundle : function(node) {
                node.addEventListener('click', function() {
                    canny.layoutManager.showOverlay('messagesExportOverlay');
                    showAsJSONQueue.forEach(function(callback) {
                        callback();
                    });
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

    /**
     *
     * @param locales []
     * @param node
     */
    function setLocale(locales, node) {
        var ul = node.querySelector('.languages'), li, languageNameNode, progressNode, flagIC;
        if (ul) {
            // remove all existing children first
            [].slice.call(ul.querySelectorAll('li')).forEach(function (elem) {
                ul.removeChild(elem);
            });
        } else {
            ul = window.domOpts.createElement('ul', null, 'navigationMenu languages');
        }
        locales.forEach(function (key) {
            var numOfTransKeys = window.domOpts.createElement('span', null, 'numOfTransKeys'),
                maxKeyNode = window.domOpts.createElement('span', null, 'maxKey');
            li = window.domOpts.createElement('li');
            languageNameNode = window.domOpts.createElement('span');
            progressNode = window.domOpts.createElement('span', null, 'progress');
            numOfTransKeys.appendChild(document.createTextNode('-'));
            numOfTransKeys.domAppendTo(progressNode);
            progressNode.appendChild(document.createTextNode('/'));
            maxKeyNode.appendChild(document.createTextNode('-'));
            maxKeyNode.domAppendTo(progressNode);

            li.classList.add('lang', key);

            li.addEventListener('click', function () {
                var isInactive = true,
                    isActive = this.classList.contains('c-active');

                if (isActive) {
                    this.classList.toggle('c-inactive');
                    isInactive = this.classList.contains('c-inactive');
                } else {
                    // has no state
                }

                selectLanguageQueue.forEach(function (fc) {
                    fc({
                        isActive : isActive,
                        isInactive : isInactive,
                        project : bundleName,
                        language: key
                    });
                });
            });

            languageNameNode.innerHTML = texts.getLanguageNames(key);
            languageNameNode.className = 'langName';
            languageNameNode.domAppendTo(li);
            progressNode.domAppendTo(li);
            flagIC = flag.getFlag(key);
            flagIC.classList.add('icon', 'octicon', 'octicon-plus');
            flagIC.domAppendTo(li);
            li.domAppendTo(ul);
        });
        ul.domAppendTo(node);
    }

    /**
     * update all language max keys for all languages
     * @param keys
     * @param node
     */
    function updateMaxKeys(keys, node) {
        [].slice.call(node.querySelectorAll('.languages .lang')).forEach(function(langNode) {
            langNode.querySelector('.maxKey').innerHTML = keys;
        });
    }

    /**
     * update a specific language
     * @param key
     * @param lang
     * @param node
     */
    function updateNumberOfLangKeys(key, lang, node) {
        console.log('projectMainNavigation:updateNumberOfLangKeys', key, lang);
        node.querySelector('.languages .lang.' + lang + ' .numOfTransKeys').innerHTML = key;
    }

    function setProjects(projects, node) {
        var ul = node.querySelector('.projects'), li;
        if (ul) {
            // remove all existing children first
            [].slice.call(ul.querySelectorAll('li')).forEach(function (elem) {
                ul.removeChild(elem);
            });
        } else {
            ul = window.domOpts.createElement('ul', null, 'navigationMenu projects');
        }

        projects.forEach(function (projectName) {
            var span = window.domOpts.createElement('span');
            li = window.domOpts.createElement('li');
            li.addEventListener('click', function () {
                uiEvents.callUievent('projectSelected', projectName);
            });
            span.innerHTML = projectName;
            span.domAppendTo(li);
            li.domAppendTo(ul);

        });
        ul.domAppendTo(node);
    }

    function addProject(projectName, node) {
        var ul = node.querySelector('.projects'), li,
            span = window.domOpts.createElement('span');

        li = window.domOpts.createElement('li');
        li.addEventListener('click', function () {
            uiEvents.callUievent('projectSelected', projectName);
        });
        span.innerHTML = projectName;
        span.domAppendTo(li);
        li.domAppendTo(ul);
        ul.domAppendTo(node);
    }

    return {
        setNumberOfTranslationMaxKeys : function (maxKeys) {
            updateMaxKeys(maxKeys, modViews.from.node);
        },
        setNumberOfTranslatedLanguageKey : function (numberOfKeys, lang) {
            updateNumberOfLangKeys(numberOfKeys, lang, modViews.from.node);
        },
        onLanguageSelect : function (fc) {
            selectLanguageQueue.push(fc);
        },
        onShowAsJSON: function(fc) {
            showAsJSONQueue.push(fc);
        },
        activateLang : function (lang) {
            var node = mainNode.querySelector('li.' + lang);
            node.classList.remove('c-inactive');
            node.classList.add('c-active');
        },
        deActivateLang : function (lang) {
            var node = mainNode.querySelector('li.' + lang);
            node.classList.add('c-inactive');
        },
        setActivatedProjectLanguages : function (projectConfig) {
            // first remove all actives
            console.log('projectMainNavigation:setActivatedProjectLanguages', projectConfig);
            [].slice.call(mainNode.querySelectorAll('li')).forEach(function (node) {
                var progressNode = node.querySelector('.progress');
                node.classList.remove('c-active');
                if (progressNode) {
                    progressNode.children[0].innerHTML = "-";
                    progressNode.children[1].innerHTML = "-";
                }
            });

            Object.keys(projectConfig.languages).forEach(function (key) {
                [].slice.call(mainNode.querySelectorAll('li.' + key)).forEach(function (node) {
                    var progressNode = node.querySelector('.progress');
                    node.classList.add('c-active');
                    if (progressNode) {
                       progressNode.children[0].innerHTML = projectConfig.languages[key].translated;
                       progressNode.children[1].innerHTML = projectConfig.numberOfKeys;
                    }
                });

            })
        },
        setAvailableLanguages : function (languages) {
            setLocale(languages, modViews.from.node);
        },
        setAvailableProjects : function (projects) {
            setProjects(projects, modViews.projects.node);
        },
        addAvailableProjects : function (projectName) {
            addProject(projectName, modViews.projects.node);
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