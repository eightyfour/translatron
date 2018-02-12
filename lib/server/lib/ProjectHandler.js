const fs = require('fs')
const directoryTree = require('directory-tree')
const defaulProjectsObject = {
    "projects" : {}
}

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
 * @param projectJSON
 * @param projectFolder
 * @returns {{init: init, read: read, save: save, listFiles: listFiles}}
 * @constructor
 */
module.exports = function ProjectHandler ({projectJSON, projectFolder}) {
    
    const config = {
        projectJSON,
        projectFolder
    }
    
    // holds all projects to reduce file requests
    let projects = {}
    
    function assignRecursiveOldProjects(obj, children) {
        children.forEach(child => {
            // skip own project.json file
            if (config.projectJSON === child.path) return
            
            const path = child.path.replace(config.projectFolder, '')
            // actually we expect only .json files in here
            const pathWithoutExtension = path.replace('.json', '')
            // remove first / from 'pathWithoutExtension' as id
            const projectId = pathWithoutExtension.replace('/', '')
            if (child.type === 'file') {
                if (!obj[projectId]) {
                    // remove last item (is the project name) from URL
                    let projectUrl = pathWithoutExtension.split('/').slice(0, -1).join('/')
                    obj[projectId] = {
                        name: child.name.replace('.json', ''),
                        url: projectUrl || '/',
                        file: path
                    }
                } else console.log('project already exists!!', projectId)
                
            } else if (child.hasOwnProperty('children')) {
                obj = Object.assign(obj, assignRecursiveOldProjects(obj, child.children))
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
     * @returns {Promise.<TResult>}
     */
    function init() {
        
        return read().then((data) => {
            // parse directory for old projects ...
            const dTree = directoryTree(projectFolder)
            // ...and add them to the projects
            data.projects = assignRecursiveOldProjects(data.projects, dTree.children)
            
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
        if (!data || !data.hasOwnProperty('projects'))
            throw "save data has not the correct format"

        projects = data
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
        // make sure that the dir has a slash at the end
        const dirToCompare = dir[dir.length - 1] === '/' ? dir : dir += '/'
        
        return new Promise(resolve => {
            resolve(Object.keys(projects.projects).filter(id => {
                const b = projects.projects[id].url
                return dirToCompare === (b[b.length -1] === '/' ? b : b + '/')
            }).map(id => {
                return {
                    name: projects.projects[id].name,
                    id
                }
            }))
        })
    }
    
    function getProject() {
    }
    
    function addProject() {
    }
    
    function copyProject() {
    }
    
    function deleteProject() {
    }
    
    return {
        init,
        read,
        save,
        listFiles,
        // copyProject,
        // deleteProject
    }
}