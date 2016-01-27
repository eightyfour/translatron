var onCreateNewProject = function() { console.warn('createNewProject.onCreateNewProject not implemented')};

var projectNameInputNode;

function isValidProjectName(projectName) {
    return (projectName.length > 0 && projectName.search('\\.|,| ') === -1) ? true : false;
}

module.exports = {
    add : function(node, attribute) {
        switch (attribute) {
            case 'createNewProjectInputProject' :
                projectNameInputNode = node;
                break;
            case 'createNewProjectProjectDescription' :
                // TBD what for?
                break;
            case 'createNewProjectSubmit' :
                node.addEventListener('click', function() {
                    var projectName = projectNameInputNode.value;
                    if (isValidProjectName(projectName)) {
                        onCreateNewProject(projectNameInputNode.value);
                    } else {
                        projectNameInputNode.style.backgroundColor = '#ff4444';
                    }
                });
                break;
        }
    },
    /**
     * Pass in listener for execution of creating new project.
     * @param func
     */
    onCreateNewProject : function(func) {
        onCreateNewProject = func;
    }
};
