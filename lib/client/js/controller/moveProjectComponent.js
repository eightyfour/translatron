const whisker = require('canny/mod/whisker')
const canny = require('canny')
const displayManager = canny.displayManager
const trade = require('../trade')
const ERRORS = require('../../../ERRORS')

const inputNodes = {
    name : undefined,
    url : undefined,
}
// whisker callback for rendering the ui module
let renderUi
// save the actual loaded project config - needed for comparision
let project

function noReturn(node) {
    node.addEventListener('keypress', function (e) {
        const key = e.keyCode || e.which
        if (key === 13) e.returnValue = false
        return true
    })
    return node
}

function noSpaces(node) {
    node.addEventListener('keypress', function (e) {
        const key = e.keyCode || e.which
        if (key === 32) e.returnValue = false
        return true
    })
    return node
}

function submit() {
    trade.moveProject({
        id : project.id,
        url : inputNodes.url.value || ui.url,
        name : inputNodes.name.value || ui.name
    }, (err, {id, name, url}) => {
        if (err) {
            displayManager.hide('moveProject')
            if (ERRORS[err.error]) {
                toast.showMessage(`Changing ${inputNodes.name.value} failed: ${err.message}`)
                toast.showMessage(err.error)
            } else {
                toast.showMessage(`Failure ${inputNodes.name.value} failed: ${err.message}`)
                toast.showMessage(`ERROR UNKNOWN`)
            }
            
        } else {
            displayManager.hide('moveProject')
            // show/reload actual directory
            trade.getDirectory(url)
            if (project.url !== url)
                toast.showMessage(`Change project location successfully to ${url}`)
            if (project.name !== name)
                toast.showMessage(`Rename project successfully to ${name}`)
        }
    })
}

const ui = {
    inputName : n => inputNodes.name = noReturn(n),
    inputUrl : n => inputNodes.url = noReturn(noSpaces(n)),
    submit : n => n.addEventListener('click', () => submit()),
    cancel : n => n.addEventListener('click', () => displayManager.hide('moveProject')),
    name : '',
    url : '',
    id: '',
    projectLink: ''
}

canny.add('moveProject', {
    add : (node => {
        whisker.add(node, fc => {
            renderUi = fc
            renderUi(ui)
        })
    })
})

module.exports = {
    show : ({id, url, name}) => {
        
        project = {id, url, name}
        
        renderUi({
            id,
            url,
            name,
            projectLink : `/${id}.prj`
        })
        displayManager.show('moveProject')
    }
}