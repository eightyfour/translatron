/**
 * TODO handle the browser back and next button and load the correct view
 */
function processAjaxData(response, urlPath){
    document.title = response.pageTitle;
    window.history.pushState({"html":response.html,"pageTitle":response.pageTitle},"", urlPath);
}
/**
 * just the implementation of the callbacks
 *
 * @type {{getJSON: getJSON}}
 */
module.exports = {
    onLoadProject : function (data) {
        // add the project path to the URL
        if (data.project) {
            processAjaxData({pageTitle : data.project, html:''}, data.projectId + '.prj');
        }
    }
};