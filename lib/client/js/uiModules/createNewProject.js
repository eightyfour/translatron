var onCreateNewProject = function() { console.warn('createNewProject.onCreateNewProject not set')},
    onCreateNewDirectory = function() { console.warn('createNewProject.onCreateNewDirectory not set')};

var projectNameInputNode,
    directoryNameInputNode;

function noSpaces(node) {
    node.addEventListener('keypress', function (e) {
        const key = e.keyCode || e.which
        if (key === 32) e.returnValue = false
        return true
    })
    return node
}

function isValidProjectName(projectName) {
    return (projectName.length > 0 && projectName.search('\\.|,| ') === -1) ? true : false;
}

function isValidDirectoryName(directoryName) {
    // TBD more forbidden characters?
    return (directoryName.length > 0 && directoryName.search('/') === -1) ? true : false;
}

module.exports = {
    add : function(node, attribute) {
        switch (attribute) {
            case 'createNewProjectInputProject' :
                projectNameInputNode = node;
                break;
            case 'newDirectoryNameInput' :
                directoryNameInputNode = noSpaces(node)
                break;
            case 'createNewProjectSubmit' :
                node.addEventListener('click', function() {
                    var projectName = projectNameInputNode.value;
                    if (isValidProjectName(projectName)) {
                        onCreateNewProject(projectName);
                    } else {
                        projectNameInputNode.classList.add('error');
                    }
                });
                break;
            case 'createNewDirectorySubmit' :
                node.addEventListener('click', function() {
                    var directoryName = directoryNameInputNode.value;
                    if (isValidDirectoryName(directoryName)) {
                        onCreateNewDirectory(directoryName);
                    } else {
                        directoryNameInputNode.classList.add('error');
                    }
                });
                break;
            case 'cancel':
                node.addEventListener('click', function() {
                    canny.displayManager.hide(this.dataset.view)
                })
                break;
        }
    },
    /**
     * Pass in listener for execution of creating new project.
     * @param func
     */
    onCreateNewProject : function(func) {
        onCreateNewProject = func;
    },
    /**
     * Pass in listener for execution of creating a new directory.
     * @param func
     */
    onCreateNewDirectoy : function(func) {
        onCreateNewDirectory = func;
    }
};
