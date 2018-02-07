const C = require('./CONST')
const connectionLost = require('./uiModules/connectionLost')

/**
 * Refresh the user session and detects if the user is not authenticated anymore
 * useful for:
 *  * session keep alive
 *  * detect if the user is not authenticated anymore
 *  * detects server shut down
 */
module.exports = function handleSessionTimeOut() {
    const connectionLostUi = connectionLost({
        onReload : () => location.reload(),
        onClose : () => connectionLostUi.destroy()
    })
    const interval = setInterval(function() {
        fetch(location.protocol + '//' + location.host + '/touchSession', {
            credentials: "same-origin"
        }).then(d => {
            if (d.status === 401) {
                clearInterval(interval)
                // whoops server has no authentication anymore...
                connectionLostUi.render('AUTH')
            }
        }).catch(e => {
            clearInterval(interval)
            connectionLostUi.render('SERVER_DOWN', 'Maybe a server restart happens. Please try to login again in few minutes')
        })
    }, C.SESSION.renewal_interval_in_ms);
}