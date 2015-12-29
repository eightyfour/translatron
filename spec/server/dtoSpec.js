var dto = require('../../server/dto')(__dirname + '/spec/server/fixtures/');

global.projectFolder = __dirname + '/fixtures';

describe('Check that the dto.js do the job correctly', function() {

    it('should have a dto instance', function () {
        expect(dto).toBeDefined();
    });

    describe("the getProjectTranslation method", function() {

        function testDE(data) {
            expect(data.first_key_1).toEqual('test Schluessel Nummer Eins');
            expect(data.first_key_2).toEqual('test Schluessel Nummer Zwei');
        }
        function testEN(data) {
            expect(data.first_key_1).toEqual('test key number one');
            expect(data.first_key_2).toEqual('test key number two');
            expect(data.first_key_3).toEqual('test key number three');
        }

        it("should load a project from root with /", function (fc) {
            dto.getProjectTranslation('/', 'project1', function (data) {
                expect(data.data).toBeDefined();
                fc();
            });
        });

        it("should load a project from root without /", function (fc) {
            dto.getProjectTranslation('', 'project1', function (data) {
                expect(data.data).toBeDefined();
                fc();
            });
        });

        it("should load a project from subFolder with first and last /", function (fc) {
            dto.getProjectTranslation('/subFolder/', 'project2', function (data) {
                expect(data.data).toBeDefined();
                fc();
            });
        });

        it("should load a project from subFolder without front /", function (fc) {
            dto.getProjectTranslation('subFolder/', 'project2', function (data) {
                expect(data.data).toBeDefined();
                fc();
            });
        });

        //it("should load a project from subFolder without last /", function (fc) {
        //    dto.getProjectTranslation('/subFolder', 'project2', function (data) {
        //        expect(data.data).toBeDefined();
        //        fc();
        //    });
        //});
        //
        //it("should load a project from subFolder without any /", function (fc) {
        //    dto.getProjectTranslation('/subFolder', 'project2', function (data) {
        //        expect(data.data).toBeDefined();
        //        fc();
        //    });
        //});

        it("should get the data correct formatted", function (fc) {

            dto.getProjectTranslation('/', 'project1', function (data) {

                expect(data.data).toBeDefined();

                if (data.language === 'de') {
                    testDE(data.data);
                } else {
                    testEN(data.data);
                }
                fc();
            });
        });

    });
});