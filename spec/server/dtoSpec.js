var dto = require('../../lib/server/dto')(__dirname + '/spec/server/fixtures/'),
    fs = require('fs');

global.projectFolder = __dirname + '/fixtures';

describe('Check that the dto.js do the job correctly', () => {

    it('should have a dto instance', () => expect(dto).toBeDefined());

    describe("the getProjectTranslation method", () => {

        function testDE(data) {
            expect(data.first_key_1).toEqual('test Schluessel Nummer Eins');
            expect(data.first_key_2).toEqual('test Schluessel Nummer Zwei');
        }
        function testEN(data) {
            expect(data.first_key_1).toEqual('test key number one');
            expect(data.first_key_2).toEqual('test key number two');
            expect(data.first_key_3).toEqual('test key number three');
        }

        it("should load a project from root with /", (done) => {
            dto.getProjectTranslation('/', 'project1', (data) => {
                expect(data.data).toBeDefined();
                done();
            });
        });

        it("should load a project from root without /", (done) => {
            dto.getProjectTranslation('', 'project1', (data) => {
                expect(data.data).toBeDefined();
                done();
            });
        });

        it("should load a project from subFolder with first and last /", (done) => {
            dto.getProjectTranslation('/subFolder/', 'project2', (data) => {
                expect(data.data).toBeDefined();
                done();
            });
        });

        it("should load a project from subFolder without front /", (done) => {
            dto.getProjectTranslation('subFolder/', 'project2', (data) => {
                expect(data.data).toBeDefined();
                done();
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

        it("should get the data correct formatted", (done) => {

            dto.getProjectTranslation('/', 'project1', (data) => {

                expect(data.data).toBeDefined();

                if (data.language === 'de') {
                    testDE(data.data);
                } else {
                    testEN(data.data);
                }
                done();
            });
        });

    });

    describe("and", () => {
        var project,
            folder = '/dummy';

        beforeAll((done) => {
            // id, path, projectName, obj, cb
            dto.createNewProject('id_0', folder, 'test', {}, (data) => {
                project = data;
                done();
            });
        });

        describe("create a project", () => {


            it("should return the JSON", () => {
                expect(project).toBeDefined();
            });

            it("should have the correct default values", () => {
                expect(project.description).toEqual('');
                expect(project.languages).toEqual({});
                expect(project.keyDescriptions).toEqual({});
                expect(project.numberOfKeys).toEqual(0);
                expect(project.keys).toEqual({});
                expect(project.project).toEqual('test');
                expect(project.projectId).toEqual('/dummy/test');
            });

            it("should accept a default description", (done) => {
                // id, path, projectName, obj, cb
                dto.createNewProject('id_0', folder, 'test2', {description : 'My default description!'}, (data) => {
                    expect(data.description).toEqual('My default description!');
                    done();
                });
            });

            it("should save the json to the file system", (done) => {
                dto.getProjectTranslation(folder, 'test', (data) => {
                    // check if false is ok... the project exists but contains no keys for translation
                    expect(data).toEqual(false);
                    done();
                });
            });
        });

        describe("and update the resources", () => {

            var key_1;

            beforeAll((done) => {
                dto.sendResource("xx", {projectId : project.projectId, locale : 'de'}, {key: "key_1", value : "test text DE"}, (key) => {
                    key_1 = key;
                    done();
                });
            });

            it("should return the updated key", () => {
                expect(key_1).toEqual('key_1');
            });

            it("should have persist it", (done) => {
                dto.getProjectTranslation(folder, 'test', (data) => {
                    expect(data.data).toEqual({'key_1': 'test text DE'});
                    expect(data.language).toEqual('de');
                    done();
                });
            });

        });

        // delete the created files
        afterAll((done) => {
            Promise.resolve()
                .then(() => new Promise((fulFill, reject) =>
                    fs.unlink(projectFolder + folder + "/test.json", fulFill)
                ))
                .then(() => new Promise((fulFill, reject) =>
                    fs.unlink(projectFolder + folder + "/test2.json", fulFill)
                ))
                .then(done)
                .catch((err) => console.log('dtoSpec:err', err));
        });
    });
});