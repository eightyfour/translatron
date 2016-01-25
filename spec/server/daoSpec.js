var projectFolder = __dirname + '/fixtures/',
    dao = require('../../lib/server/dao')(projectFolder),
    fs = require('fs');

/**
 * TODO add the whole description tests for dao - if a key was renamed or deleted the description needs also to be updated
 */
describe('Check that the dao.js do the job correctly', () => {

    it('should have a dao instance', () => expect(dao).toBeDefined());

    describe("the loadProject method", () => {

        var project1;

        beforeAll((done) => {
            dao.loadProject('/project1', (data) => {
                project1 = data;
                done();
            });
        });

        it("should fail if the project is not exists", (done) => {
            dao.loadProject('/noneExistingProject', (data) => {
                expect(data).toBeFalsy();
                done();
            });
        });

        it("should load a project from a sub directory", (done) => {
            dao.loadProject('/subFolder/project2', (data) => {
                expect(data.keys).toBeDefined();
                done();
            });
        });

        it("should load a project from root with /", () => {
            expect(project1).toBeDefined();
        });

        it("should get the data DE correct formatted", () => {
            expect(project1.keys.de.first_key_1).toEqual('test Schluessel Nummer Eins');
            expect(project1.keys.de.first_key_2).toEqual('test Schluessel Nummer Zwei');
        });

        it("should get the data EN correct formatted", () => {
            expect(project1.keys.en.first_key_1).toEqual('test key number one');
            expect(project1.keys.en.first_key_2).toEqual('test key number two');
            expect(project1.keys.en.first_key_3).toEqual('test key number three');
        });

        it("should have a project name", () => {
            expect(project1.project).toEqual('project1');
        });

        it("should have a projectId", () => {
            expect(project1.projectId).toEqual('/project1');
        });

        it("should have a keyDescriptions field", () => {
            expect(project1.keyDescriptions).toBeDefined();
        });

        it("should have a defaultLanguage field", () => {
            expect(project1.defaultLanguage).toEqual('en');
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
                dao.loadProject(folder + '/test', (data) => {
                    // check if false is ok... the project exists but contains no keys for translation
                    expect(data.keys).toEqual({});
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
                dao.loadProject(folder + '/test', (data) => {
                    expect(data.keys).toBeDefined();
                    expect(data.keys.de).toBeDefined();
                    expect(data.keys.de.key_1).toEqual('test text DE');
                    expect(data.keys.en).toBeDefined();
                    expect(data.keys.en.key_1).toEqual('test text EN');
                    expect(data.defaultLanguage).toEqual('en');
                    done();
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
                dao.loadProject(folder + '/test', (data) => {
                    expect(data.keys.en.key_1).toBeUndefined();
                    done();
                });
            });

            it("should have created a new key", (done) => {
                dao.loadProject(folder + '/test', (data) => {
                    expect(data.keys.en.key_1_new).toBeDefined();
                    done();
                });
            });

            it("should have updated all existing languages", (done) => {
                dao.loadProject(folder + '/test', (data) => {
                    expect(data.keys.de.key_1_new).toEqual('test text DE');
                    expect(data.keys.en.key_1_new).toEqual('test text EN');
                    done()
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
                dao.loadProject(folder + '/test', (data) => {
                    expect(data.keys.de.key_1).toBeUndefined();
                    expect(data.keys.en.key_1).toBeUndefined();
                    done();
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

    describe("the getDirectory method ", () => {

        it("should return the sub projects from /", (done) => {
            dao.getDirectory("/", (obj) => {
                expect(obj.projects.length).toEqual(1);
                expect(obj.projects).toEqual([{
                    name : 'project1',
                    id : '/project1'
                }]);
                done();
            });
        });

        it("should return the sub directories from /", (done) => {
            dao.getDirectory("/", (obj) => {
                expect(obj.dirs.length).toEqual(1);
                expect(obj.dirs).toEqual([{
                    name : 'subFolder',
                    id : '/subFolder'
                }]);
                done();
            });
        });

        it("should return the contents from sub folder", (done) => {
            dao.getDirectory("/subFolder", (obj) => {
                expect(obj.projects.length).toEqual(1);
                expect(obj.projects).toEqual([{
                    name : 'project2',
                    id : '/subFolder/project2'
                }]);
                expect(obj.parentDirectory).toEqual('/');
                expect(obj.currentDirectory).toEqual('/subFolder');
                expect(obj.dirs).toEqual([{
                        name: 'emptySubFolder',
                        id: '/subFolder/emptySubFolder'
                    },{
                        name: 'subSubFolder',
                        id: '/subFolder/subSubFolder'
                    }]);
                done();
            });
        });

        it("should return false if path does not exists", (done) => {
            dao.getDirectory("/noneExistingPath", (obj) => {
                expect(obj).toBeFalsy();
                done();
            });
        });

        it('should return itself as the parent directory if already at top level', (done) => {
           dao.getDirectory("/", (obj) => {
                expect(obj.parentDirectory).toEqual('/');
               expect(obj.currentDirectory).toEqual('/');
               done();
           });
        });

        it('should return the correct parent directory if there is a parent', (done) => {
            dao.getDirectory("/subFolder", (obj) => {
                expect(obj.parentDirectory).toEqual('/');
                expect(obj.currentDirectory).toEqual('/subFolder');
                done();
            });
        });

        it('should return the correct parent directory from a sub sub directory', (done) => {
            dao.getDirectory("/subFolder/subSubFolder", (obj) => {
                expect(obj.parentDirectory).toEqual('/subFolder');
                expect(obj.currentDirectory).toEqual('/subFolder/subSubFolder');
                done();
            });
        });

        it('should have expected IDs', (done) => {
            dao.getDirectory('/', (obj) => {
                expect(obj.projects.length).toEqual(1);
                expect(obj.projects[0].id).toEqual('/project1');
                done();
            });
        });

        //it('should return empty object if directory has no items', (done) => {
        //    dao.getDirectory('/', (obj) => {
        //        expect(obj.projects.length).toEqual(0);
        //        expect(obj.dirs.length).toEqual(0);
        //        done();
        //    });
        //});
    });
});