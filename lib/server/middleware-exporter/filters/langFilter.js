module.exports = {
    filter: function(data) {
        var mod = {},
            obj = data.json,
            language = data.paramValue;

        // If ?lang=[language] is existing in project.keys    
        if (obj[language]) {
            mod[language] = obj[language];
        }
        return mod;
    }
};