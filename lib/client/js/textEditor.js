/**
 * textEditor
 */
(function () {
    "use strict";

    var textEditor = (function () {

        var texts = {
            originText : 'Double click to edit this text',
            editBtn : 'Edit',
            cancelBtn : 'Cancel',
            changeBtn : 'Save changes'
        },
        onChangeAllList = [];

        function findClosestAncestorWithId(element) {
            while ((element = element.parentElement) && !element.id) {}
            return element;
        }

        function callChangeList(id, value, fc) {
            onChangeAllList.forEach(function (cb) {
                return cb(id, value, fc);
            });
        }

        function editWithTextarea(node, buttonWrap, obj) {
            var open = false,
                divWrapper = document.createElement('div'),
                button = document.createElement('div'),
                cancelButton = document.createElement('div'),
                area = document.createElement('textarea'),
                jsTextN;

            if (obj && obj.hasOwnProperty('placeholder')) {
                area.setAttribute('placeholder', obj.placeholder);
            }

            function close() {
                node.classList.add('textEditor-hide');
                open = false;
            }

            function edit() {
                if (!open) {
                    jsTextN = node.querySelector('.js-text');
                    open = true;
                    area.value = jsTextN.innerHTML;
                    setTimeout(function () {
                        node.classList.remove('textEditor-hide')
                    }, 100);
                }
            }

            // set classes
            cancelButton.className = 'textEditor-button textEditor-button-cancel octicon octicon-x';
            button.className = 'textEditor-button textEditor-button-change octicon octicon-check';
            area.className = 'textEditor-area';
            divWrapper.className = 'textEditor-wrap-area';
            node.classList.add('textEditor-hide');

            // register listeners
            cancelButton.addEventListener('click', close);
            button.addEventListener('click', function () {
                var val = area.value,
                    id = findClosestAncestorWithId(this).id,
                    ret = callChangeList(id, val, function (success) {
                        if (success) {
                            jsTextN.innerHTML = val;
                            close();
                        } else {
                            console.warn('textEditor:toTextareaNode text not accepted! Ignore changes.');
                        }
                    });
            });
            node.addEventListener('dblclick', edit);

            // set titles
            node.setAttribute('title', texts.originText);
            cancelButton.setAttribute('title', texts.cancelBtn);
            button.setAttribute('title', texts.changeBtn);

            // append to wrapper div
            divWrapper.appendChild(area);
            buttonWrap.appendChild(cancelButton);
            buttonWrap.appendChild(button);

            // append to parent
            node.appendChild(divWrapper);

            // return click function
            return function () {
                if (!open) { // show input
                    edit();
                } else { // show text
                    close();
                }
            }
        }

        return {
            /**
             * Register a function to a specific editor.
             * If the function returns undefined than the editor expect that the passed callback
             * is called with true or false. If the method returns true the text will change.
             * If the method returns false the text is not changed.
             *
             * @param id
             * @param fc <- is called with (textValue, callbackFunction) can return undefined, false and true
             */
            onChange : function (fc) {
                onChangeAllList.push(fc);

            },
            /**
             *
             * @param node
             * @param id
             */
            add : function (node, obj) {
                var buttonWrap = document.createElement('div'),
                    editIconButton =  document.createElement('div');
                buttonWrap.className ='textEditor-buttonWrap';
                editIconButton.className = 'textEditor-button textEditor-button-edit octicon octicon-pencil';
                editIconButton.addEventListener('click', editWithTextarea(node, buttonWrap, obj));
                editIconButton.setAttribute('title', texts.editBtn);
                // append editIconButton to parent
                node.classList.add('textEditor-main-wrap');
                buttonWrap.appendChild(editIconButton);
                node.appendChild(buttonWrap);
            }
        }
    }());

    // export as module or bind to global
    if (typeof module !== 'undefined' && module.hasOwnProperty('exports')) { module.exports = textEditor; } else {canny.add('textEditor', textEditor); }

}());