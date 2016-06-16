describe('exportJson', () => {
    var originalData,
        expectedCategorySplitData;

    beforeEach((done) => {
        originalData = {
            "de": {
                "first_key_1": "test Schluessel Nummer Eins",
                "first_key_2": "test Schluessel Nummer Zwei"
            },
            "en": {
                "first_key_1": "test key number one",
                "first_key_2": "test key number two",
                "first_key_3": "test key number three"
            },
            "fr": {}
        };

        expectedCategorySplitData = {
            "de": {
                "first": {
                    "key_1": "test Schluessel Nummer Eins",
                    "key_2": "test Schluessel Nummer Zwei"
                }
            },
            "en": {
                "first": {
                    "key_1": "test key number one",
                    "key_2": "test key number two",
                    "key_3": "test key number three"
                }
            },
            "fr": {}
        };
        done();
    });

    describe('categoryFilter should return json data where categories are transformed into objects', () => {
        var categoryFilter = require('../../lib/server/middleware-exporter/filters/categoryFilter.js');

        it('if paramValue is set to true {String}', (done) => {
            var result = categoryFilter.filter({
                json: originalData,
                paramValue: 'true'
            });

            expect(JSON.stringify(result)).toBe(JSON.stringify(expectedCategorySplitData));
            done();
        });

        it('UNLESS paramValue is set to false {String}', (done) => {
            var result = categoryFilter.filter({
                json: originalData,
                paramValue: 'false'
            });

            // originalData is not transformed and stays as it was
            expect(JSON.stringify(result)).toBe(JSON.stringify(result));
            done();
        });

        it('UNLESS paramValue is undefined {String}', (done) => {
            var result = categoryFilter.filter({
                json: originalData,
                paramValue: undefined
            });

            // originalData is not transformed and stays as it was
            expect(JSON.stringify(result)).toBe(JSON.stringify(result));
            done();
        });

        it('UNLESS paramValue is empty {String}', (done) => {
            var result = categoryFilter.filter({
                json: originalData,
                paramValue: ''
            });

            // originalData is not transformed and stays as it was
            expect(JSON.stringify(result)).toBe(JSON.stringify(result));
            done();
        });
    });

    describe('langFilter should filter and return json data by given language code', () => {
        var langFilter = require('../../lib/server/middleware-exporter/filters/langFilter.js');

        it('if the requested language is existent in the project', (done) => {
            var expectedData = {
                    "de": {
                        "first_key_1": "test Schluessel Nummer Eins",
                        "first_key_2": "test Schluessel Nummer Zwei"
                    }
                },
                result = langFilter.filter({
                    json: originalData,
                    paramValue: 'de'
                });

            expect(JSON.stringify(result)).toBe(JSON.stringify(expectedData));
            done();
        });

        it('UNLESS the requested language is NOT existent in the project => returning an empty object', (done) => {
            var expectedData = {},
                result = langFilter.filter({
                    json: originalData,
                    paramValue: 'es'
                });

            expect(JSON.stringify(result)).toBe(JSON.stringify(expectedData));
            done();
        });

        it('UNLESS the requested language is just a bs containing string => returning an empty object', (done) => {
            var expectedData = {},
                result = langFilter.filter({
                    json: originalData,
                    paramValue: 'b***s***'
                });

            expect(JSON.stringify(result)).toBe(JSON.stringify(expectedData));
            done();
        });
    });
});