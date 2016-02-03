var repeatFcPointer,
    onClick = function (item) {
        console.warn('breadcrumb:click handler not registered', item);
    };

module.exports = {
    onClick : function (fc) {
        onClick = fc;
    },
    add : function (node, attr) {},
    /**
     *
     * @param parentDirectories [String]
     */
    updateFolders : function (parentDirectories) {
        repeatFcPointer(parentDirectories.map(function (item) {
            return {name : item.name, onClick : function () {
                onClick(item.id);
            }}
        }));
    },
    /**
     * for canny repeat to get
     */
    registerCannyRepeat : function (fc) {
        repeatFcPointer = fc;
    }
}
