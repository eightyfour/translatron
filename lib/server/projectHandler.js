const fs = require('fs')
const directoryTree = require('directory-tree')
const defaulProjectsObject = {
    "projects" : {}
}
const config = {
    projectJSON : '',
    projectFolder : ''
}
// holds all projects to reduce file requests
let projects = {}

/**
 * This handles the project.json
 * The project.json contains the knowledge about all projects and there paths. It translate the project ID's to
 * paths/url and back.
 *
 * How it works:
 * * all projects are saved in one single id-folder [id]/projectName.json
 * * this file maps the projects to human readable file structure
 * * project id are unique and will stay as long as the project exists
 * * project moving will only change the path in the project.json the project ID will be the same
 *
 * Perspective:
 * in future it will be possible to save the projects in a database. So we get rid of the file storage
 *
 * @type {{init: init, read: read, save: save}}
 */
module.exports = {
    init,
    read,
    save,
    listFiles,
    // copyProject,
    // deleteProject
}

function assignRecursiveOldProjects(obj, projectFolder, children) {
    children.forEach(child => {
        const path = child.path.replace(projectFolder, '')
        // actually we expect only .json files in here
        const pathWithoutExtension = path.replace('.json', '')

        if (child.type === 'file') {
            if (!obj[pathWithoutExtension])
                obj[pathWithoutExtension] = {
                    name: child.name.replace('.json', ''),
                    url: pathWithoutExtension,
                    file: path
                }
            else console.log('project already exists!!', pathWithoutExtension)

        } else if (child.hasOwnProperty('children')) {
            obj = Object.assign(obj, assignRecursiveOldProjects(obj, projectFolder, child.children))
        } else {
            console.log('empty directory?!', pathWithoutExtension)
        }
    })
    return obj
}

/**
 * Initialize the project.json
 *
 *  * creates fallback if file doesn't exists
 *  * reads old file structure projects and make them available for the new structure ( backward compatibility )
 *
 * @param projectJSON
 * @param projectFolder
 * @returns {Promise.<TResult>}
 */
function init({projectJSON, projectFolder}) {
    config.projectJSON = projectJSON
    config.projectFolder = projectFolder

    return read().then((data) => {
        // parse directory for old projects ...
        const dTree = directoryTree(projectFolder)
        // ...and add them to the projects
        console.log('projectHandler:tree' , dTree)
        data.projects = assignRecursiveOldProjects(data.projects, projectFolder, dTree.children)

        return data
    }).then(data => projects = data).then(data => save(data))
}

/**
 * reads the project file
 *
 * @returns {Promise.<TResult>}
 */
function read() {
    return new Promise(resolve => {
        fs.readFile(config.projectJSON, 'utf8', (err, data) => {
            if (err) {
                resolve(JSON.stringify(defaulProjectsObject))
            } else {
                resolve(data)
            }
        })
    }).then(data => JSON.parse(data))
}

/**
 * saves the projects file (no merge just save what it passed in - be careful with overwriting existing data)
 * @param data
 */
function save(data) {
    // TODO handle/protect two save calls in parallel
    return new Promise(resolve => {
        fs.writeFile(config.projectJSON, JSON.stringify(data, null, 2), (err) => {
            if (err) {
                throw err
            }
            resolve()
        })
    })
}

function listFiles(dir) {
    const dirToCompare = dir[dir.length -1] === '/' ? dir : dir += '/';

    return new Promise(resolve => {
        resolve(Object.keys(projects.projects).filter(id => {
            const b = projects.projects[id].url.split('/').slice(0, -1).join('/')
            return dir === (b + '/')
        }).map(id => {
            return {
                name : projects.projects[id].name,
                id
            }
        }))
    })
}

function getProject() {}

function addProject() {}

function copyProject() {}
function deleteProject() {}

