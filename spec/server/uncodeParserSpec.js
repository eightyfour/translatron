var parser = require('../../lib/server/unicode-parser');

// TODO add all test for all character which we have problems with
describe('parser', () => {
    it('should escape characters correctly', () => {
        expect(parser.escapeUnicode('Immer Ärger hat öfter der der Klöße aß.')).toEqual('Immer \\u00c4rger hat \\u00f6fter der der Kl\\u00f6\\u00dfe a\\u00df.');
    });
});