function cutCategories(val) {
    var split = val.split('_');
    if (split.length > 1) {
        split.splice(0, 1);
    }
    return {
        id : val,
        value : split.join('_')
    }
}
module.exports = {
    getCategoryNamesFromKeys : function (keys) {
        var catObj = {};
        Object.keys(keys).forEach(function (lang) {
            Object.keys(keys[lang]).forEach(function (key) {
                var subKeyName = key.split('_'),
                    cat;
                if (subKeyName.length > 1) {
                    cat = subKeyName.slice(0, 1);
                }
                if (!catObj[cat]) {
                    catObj[cat] = {};
                }
                catObj[cat][subKeyName.join('_')] = undefined;
            })
        });

        return Object.keys(catObj).map(function (cat) {
            return {id: cat, children: Object.keys(catObj[cat]).map(cutCategories)};
        });
    }
}