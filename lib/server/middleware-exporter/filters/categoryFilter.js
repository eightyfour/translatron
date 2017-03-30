module.exports = {
    filter: function(data) {
        var mod = {},
            obj = data.json,
            applyFilter = data.paramValue;

        // If ?category anything else than "true"
        if (applyFilter !== 'true') {
            return obj;
        }

        Object.keys(obj).forEach(function(language) {
            this[language] = {};
            Object.keys(obj[language]).forEach(function(key) {
                var splitted = key.split('_'),
                    categoryName = splitted.shift(),
                    keyName = splitted.join('_');
                this[categoryName] = this[categoryName] || {};
                this[categoryName][keyName] = obj[language][key];
            }, this[language]);
        }, mod);
        return mod;
    }
};