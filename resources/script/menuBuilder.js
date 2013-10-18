var domready = require('domready');
window.domOpts = require('dom-opts');


var menuBuilder = (function () {

      var domOperations = {
          addNavigationMenu : function (nodeToAppend) {
              console.log('START GENERATE MENU');
              var ul = domOpts.createElement('ul', 'navigationMenu'), li,
                  locals = {
                      da : 'Danmark',
                      fr : 'France',
                      nl : 'Nederland',
                      en : 'US (Default)',
                      en_GB : 'UK',
                      sv : 'Sverige',
                      es : 'Espanol'
                  },obj, a,
                  path = document.location.origin + document.location.pathname,
                  bundleName = domOpts.params.bundle;
                  fromTranslation = domOpts.params.from || 'de';

              for (obj in locals) {
                  if (locals.hasOwnProperty(obj)) {
                      li = domOpts.createElement('li');
                      a = domOpts.createElement('a');
                      a.setAttribute('href', path + '?bundle=' + bundleName + '&from=' + fromTranslation + "&to=" + obj);
                      a.innerText = locals[obj];
                      a.domAppendTo(li);
                      li.domAppendTo(ul);
                  }
              }

              ul.domAppendTo(nodeToAppend);

          }
      };

    return {
        init : function () {
            var menuBuilderList = [].slice.call(document.querySelectorAll('[menu-builder]'));
            menuBuilderList.forEach(function (node) {
                var attribute = node.getAttribute('menu-builder');
                if (domOperations.hasOwnProperty(attribute)) {
                    domOperations[attribute](node);
                }
            })
        }
    }
}());


module.exports = menuBuilder;
