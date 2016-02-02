var repeatFcPointer;

module.exports = {
    add : function (node, attr) {},
    /**
     *
     * @param parentDirectories [String]
     */
    updateFolders : function (parentDirectories) {
        repeatFcPointer(parentDirectories);
    },
    /**
     * for canny repeat to get
     */
    registerCannyRepeat : function (fc) {
        repeatFcPointer = fc;
    }
}
