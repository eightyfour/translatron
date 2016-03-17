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

        function callChangeList(id, value, fc) {
            onChangeAllList.forEach(function (cb) {
                return cb(id, value, fc);
            });
        }

        function editWithTextarea(node, id) {
            var open = false,
                divWrapper = document.createElement('div'),
                button = document.createElement('button'),
                cancelButton = document.createElement('button'),
                area = document.createElement('textarea'),
                originText;

            function close() {
                divWrapper.classList.add('textEditor-hide');
                open = false;
            }

            function edit() {
                open = true;
                originText = node.querySelector('.js-text').childNodes[0] || {textContent : ''};
                area.value = originText.textContent;
                setTimeout(function () {
                    divWrapper.classList.remove('textEditor-hide')
                }, 300);
            }

            // set classes
            cancelButton.className = 'textEditor-button-cancel octicon octicon-x';
            button.className = 'textEditor-button-change octicon octicon-check';
            area.className = 'textEditor-area';
            divWrapper.className = 'textEditor-wrap-area textEditor-hide';

            // register listeners
            cancelButton.addEventListener('click', close);
            button.addEventListener('click', function () {
                var val = area.value,
                    ret = callChangeList(id, val, function (success) {
                        if (success) {
                            originText.textContent = val;
                            close();
                        } else {
                            console.warn('textEditor:toTextareaNode text not accepted! Ignore changes.');
                        }
                    });

//                if (ret === true) {
//                    originText.textContent = val;
//                    close();
//                } else if (ret === false) {
//                    console.warn('textEditor:toTextareaNode text not accepted! Ignore changes.');
//                }
            });
            node.addEventListener('dblclick', edit);

            // set titles
            node.setAttribute('title', texts.originText);
            cancelButton.setAttribute('title', texts.cancelBtn);
            button.setAttribute('title', texts.changeBtn);

            // append to wrapper div
            divWrapper.appendChild(area);
            divWrapper.appendChild(button);
            divWrapper.appendChild(cancelButton);

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
            add : function (node, id) {
                var editIconButton;
//                if (id) {
                    editIconButton = document.createElement('div');
                    editIconButton.className = 'textEditor-editButton octicon octicon-pencil';
                    editIconButton.addEventListener('click', editWithTextarea(node, id));
                    editIconButton.setAttribute('title', texts.editBtn);
                    // append editIconButton to parent
                    node.classList.add('textEditor-main-wrap');
                    node.appendChild(editIconButton);
//                } else {
//                    console.error('textEditor:add the id attribute is required!');
//                }
            }
        }
    }());

    // export as module or bind to global
    if (typeof module !== 'undefined' && module.hasOwnProperty('exports')) { module.exports = textEditor; } else {canny.add('textEditor', textEditor); }

}());