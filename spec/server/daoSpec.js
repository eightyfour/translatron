var projectFolder = __dirname + '/fixtures/',
    dao = require('../../lib/server/dao')(projectFolder),
    fs = require('fs');

/**
 * TODO add the whole description tests for dao - if a key was renamed or deleted the description needs also to be updated
 */
describe('Check that the dao.js do the job correctly', () => {

    it('should have a dao instance', () => expect(dao).toBeDefined());

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
            dao.getProjectTranslation('/', 'project1', (data) => {
                expect(data.data).toBeDefined();
                done();
            });
        });

        it("should load a project from root without /", (done) => {
            dao.getProjectTranslation('', 'project1', (data) => {
                expect(data.data).toBeDefined();
                done();
            });
        });

        it("should load a project from subFolder with first and last /", (done) => {
            dao.getProjectTranslation('/subFolder/', 'project2', (data) => {
                expect(data.data).toBeDefined();
                done();
            });
        });

        it("should load a project from subFolder without front /", (done) => {
            dao.getProjectTranslation('subFolder/', 'project2', (data) => {
                expect(data.data).toBeDefined();
                done();
            });
        });

        //it("should load a project from subFolder without last /", function (fc) {
        //    dao.getProjectTranslation('/subFolder', 'project2', function (data) {
        //        expect(data.data).toBeDefined();
        //        fc();
        //    });
        //});
        //
        //it("should load a project from subFolder without any /", function (fc) {
        //    dao.getProjectTranslation('/subFolder', 'project2', function (data) {
        //        expect(data.data).toBeDefined();
        //        fc();
        //    });
        //});

        it("should get the data correct formatted", (done) => {
            var testBoth = 0;
            dao.getProjectTranslation('/', 'project1', (data) => {

                expect(data.data).toBeDefined();

                if (data.language === 'de') {
                    testBoth++;
                    testDE(data.data);
                } else if (data.language === 'en') {
                    testBoth++;
                    testEN(data.data);
                }
                if (testBoth === 2) {
                    done();
                }
            });
        });

    });

    describe("and", () => {
        var project,
            folder = '/dummy';

        beforeAll((done) => {
            // id, path, projectName, obj, cb
            dao.createNewProject('id_0', folder, 'test', {}, (data) => {
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
                dao.createNewProject('id_0', folder, 'test2', {description : 'My default description!'}, (data) => {
                    expect(data.description).toEqual('My default description!');
                    done();
                });
            });

            it("should save the json to the file system", (done) => {
                dao.getProjectTranslation(folder, 'test', (data) => {
                    // check if false is ok... the project exists but contains no keys for translation
                    expect(data).toEqual(false);
                    done();
                });
            });
        });

        describe("and update the resources", () => {

            var key_1;

            beforeAll((done) => {
                // create DE key
                dao.sendResource("xx", {projectId : project.projectId, locale : 'de'}, {key: "key_1", value : "test text DE"}, (key) => {
                    key_1 = key;
                    // create EN key
                    dao.sendResource("xx", {projectId : project.projectId, locale : 'en'}, {key: "key_1", value : "test text EN"}, (key) => {
                        done();
                    });
                });
            });

            it("should return the updated key", () => {
                expect(key_1).toEqual('key_1');
            });

            it("should have persist it", (done) => {
                var testBoth = 0;
                dao.getProjectTranslation(folder, 'test', (data) => {

                    expect(data.data).toBeDefined();
                    done();
                    if (data.language === 'de') {
                        expect(data.data.key_1).toEqual('test text DE');
                        testBoth++;
                    } else if (data.language === 'en') {
                        expect(data.data.key_1).toEqual('test text EN');
                        expect(data.language).toEqual('en');
                        testBoth++;

                    }
                    if (testBoth === 2) {
                        done();
                    }
                });
            });

        });

        /**
         * TODO The rename key needs also to rename the key in the description section.
         */
        describe("and rename a key", () => {

            var returnOldKey, returnNewKey;

            beforeAll((done) => {
                dao.renameKey("xx", project.projectId, {newKey: "key_1_new", oldKey : "key_1"}, (oldKey, newKey) => {
                    returnOldKey = oldKey;
                    returnNewKey = newKey;
                    done();
                });
            });

            it("should call the callback with the old and new key", () => {
                expect(returnOldKey).toEqual('key_1');
                expect(returnNewKey).toEqual('key_1_new');
            });

            it("should have deleted the old key", (done) => {
                dao.getProjectTranslation(folder, 'test', (data) => {
                    expect(data.data.key_1).toBeUndefined();
                    done();
                });
            });

            it("should have created a new key", (done) => {
                dao.getProjectTranslation(folder, 'test', (data) => {
                    expect(data.data.key_1_new).toBeDefined();
                    done();
                });
            });

            it("should have updated all existing languages", (done) => {
                var testBoth = 0;
                dao.getProjectTranslation(folder, 'test', (data) => {
                    if (data.language === 'de') {
                        expect(data.data.key_1_new).toEqual('test text DE');
                        testBoth++;
                    } else if (data.language === 'en') {
                        expect(data.data.key_1_new).toEqual('test text EN');
                        testBoth++;
                    }
                    if (testBoth === 2) {
                        done();
                    }
                });
            });

            afterAll((done) => {
                // rename the key_1_new back to key_1
                dao.renameKey("xx", project.projectId, {newKey: "key_1", oldKey : "key_1_new"}, (oldKey, newKey) => {
                    done();
                });
            });
        });


        /**
         * TODO The removeKey needs also to remove the key in the description section.
         */
        describe("and remove a key", () => {

            var returnKey;

            beforeAll((done) => {
                dao.removeKey("xx", project.projectId, "key_1", (keyName) => {
                    returnKey = keyName;
                    done();
                });
            });

            it("should call the callback with the removed key", () => {
                expect(returnKey).toEqual('key_1');
            });

            it("should have removed all keys from all existing languages", (done) => {
                var testBoth = 0;
                dao.getProjectTranslation(folder, 'test', (data) => {
                    if (data.language === 'de') {
                        expect(data.data.key_1).toBeUndefined();
                        testBoth++;
                    } else if (data.language === 'en') {
                        expect(data.data.key_1).toBeUndefined();
                        testBoth++;
                    }
                    if (testBoth === 2) {
                        done();
                    }
                });
            });

            afterAll((done) => {
                // restore the removed keys
                dao.sendResource("xx", {projectId : project.projectId, locale : 'de'}, {key: "key_1", value : "test text DE"}, () => {
                    // create EN key
                    dao.sendResource("xx", {projectId : project.projectId, locale : 'en'}, {key: "key_1", value : "test text EN"}, () => {
                        done();
                    });
                });
            });
        });

        // delete the created files
        afterAll((done) => {
            //done();
            //return;
            Promise.all([
                new Promise((fulFill, reject) =>
                    fs.unlink(projectFolder + folder + "/test.json", fulFill)
                ),
                new Promise((fulFill, reject) =>
                    fs.unlink(projectFolder + folder + "/test2.json", fulFill)
                )
            ])
                .then(() => new Promise((fulFill, reject) =>
                    fs.rmdir(projectFolder + folder, fulFill)
                ))
                .then(done)
                .catch((err) => console.log('dtoSpec:err', err));
        });
    });

    describe("the receivedProjectsAndDirectories method ", () => {

        it("should return the sub projects from /", (done) => {
            dao.receivedProjectsAndDirectories("/", (obj) => {
                expect(obj.projects).toEqual(['project1']);
                expect(obj.dirs).toEqual(['subFolder']);
                done();
            });
        });

        it("should return the sub directories from sub folder", (done) => {
            dao.receivedProjectsAndDirectories("/subFolder", (obj) => {
                expect(obj.projects).toEqual(['project2']);
                expect(obj.dirs).toEqual([]);
                done();
            });
        });

        it("should return false if path does not exists", (done) => {
            dao.receivedProjectsAndDirectories("/noneExistingPath", (obj) => {
                expect(obj).toBeFalsy();
                done();
            });
        });

        it('should return itself as the parent directory if already at top level', (done) => {
           dao.receivedProjectsAndDirectories("/", (obj) => {
                expect(obj.parentDirectory).toEqual('/');
                done();
           });
        });

        it('should return the correct parent directory if there is a parent', (done) => {
            dao.receivedProjectsAndDirectories("/subFolder", (obj) => {
                expect(obj.parentDirectory).toEqual('/');
                done();
            });
        });

        it('should have expected IDs', (done) => {
            dao.getDirectory('/', (obj) => {
                expect(obj.projects.length).toEqual(1);
                expect(obj.projects[0].id).toEqual('/project1.json');
                done();
            });
        });

    });
});