const regExPunc = new RegExp(/([\.,\s!;?:\"]|\{(.*?)\})+/gi)

/**
 * Count amount of words in a given String
 * @param str
 * @returns Number
 */
module.exports.countWordsInString = function countWordsInString(str) {
    if (str) {
        return str.replace(regExPunc, ' ').trim().split(' ').length;
    }
    return 0;
}