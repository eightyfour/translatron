var onCreateNewProject = function() { console.warn('createNewProject.onCreateNewProject not implemented')};

var projectNameInputNode;

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
                    // TODO validate projectName not empty, etc.
                    onCreateNewProject(projectNameInputNode.value);
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
