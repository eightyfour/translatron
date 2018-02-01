const whisker = require('canny/mod/whisker')
const template = require('./index.html')
const TEXTS = function (code) {
    switch(code) {
        case 'RECONNECT_FAIL' :
            return 'can\'t create a connection'
        default:
            return 'whooops... server connection lost'
    }
}
/**
 *
 * @param onReload
 * @param onReconnect
 * @returns {{render: (function(string)), destroy: (function())}}
 */
module.exports = function ({onReload, onReconnect, onClose}) {
    // saves the active node
    let ui;

    function render({errorCode}) {
        if (ui) ui.remove()
        const d = document.createElement('div')
        d.innerHTML = template
        whisker.add(d.children[0], {
            reconnect : n => {
                if (errorCode === 'RECONNECT_FAIL')
                    return false
                n.addEventListener('click', onReconnect)
            },
            close : n => n.addEventListener('click', onClose),
            reload : n => n.addEventListener('click', onReload),
            errorCode,
            title : TEXTS(errorCode)
        })
        document.body.appendChild(ui = d.children[0])
    }

    return {
        /**
         * Show the module
         * @param {string} err - error code to print on the view
         */
        render : err => render({errorCode : err}),
        /**
         * Remove the module from ui
         */
        destroy : () => {
            ui.remove()
            ui = undefined
        },
        /**
         * indicates that the view is busy
         */
        showProgress : () => {
            ui.classList.add('progress')
        }
    }
}