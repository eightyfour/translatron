var C = {
    FILE_MANAGER : {
        FILE_TYPES : {
            IMAGE : 'image',
            FILE  : 'file'
        },
        ENCODING : {
            image : 'base64',
            file : 'utf8'
        }
    },
    SESSION : {
        renewal_interval_in_ms: 1000 * 15
    }
};

module.exports = C;
