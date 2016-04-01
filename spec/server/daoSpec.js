var fixturesDirectory = __dirname + '/fixtures/',
    fs = require('fs'),
    path = require('path');

describe('dao', () => {
    var dao;

    describe('constructor', () => {

        beforeEach((done) => {
            dao = require('../../lib/server/dao')(fixturesDirectory + 'valid_project_in_rootfolder');
            done();
        });

        it('should return a new dao instance', function(done) {
            expect(dao).toBeDefined();
            done();
        });
    });

    describe('loadProject', () => {

        var sampleProjectId = '/project1';

        describe('success cases', () => {

            beforeEach((done) => {
                dao = require('../../lib/server/dao')(fixturesDirectory + 'valid_project_in_rootfolder');
                done();
            });

            it('project data is returned', (done) => {
                dao.loadProject(sampleProjectId, (projectData) => {
                    expect(projectData).toBeDefined();
                    expect(projectData.projectId).toBeDefined();
                    expect(projectData.projectId).toEqual(sampleProjectId);
                    expect(projectData.project).toEqual('project1');
                    expect(projectData.defaultLanguage).toEqual('en');
                    done();
                });
            });

            it("sample keys are present", (done) => {
                dao.loadProject(sampleProjectId, (projectData) => {
                    expect(Object.keys(projectData.keys.de).length).toEqual(2);
                    expect(projectData.keys.de.first_key_1).toEqual('test Schluessel Nummer Eins');
                    expect(projectData.keys.de.first_key_2).toEqual('test Schluessel Nummer Zwei');

                    expect(Object.keys(projectData.keys.en).length).toEqual(3);
                    expect(projectData.keys.en.first_key_1).toEqual('test key number one');
                    expect(projectData.keys.en.first_key_2).toEqual('test key number two');
                    expect(projectData.keys.en.first_key_3).toEqual('test key number three');

                    done();
                });
            });

            it('sample key descriptions are present', (done) => {
                dao.loadProject(sampleProjectId, (projectData) => {
                    expect(projectData.keyDescriptions).toBeDefined();
                    done();
                });
            });
        });

        describe('error cases', () => {

            describe('nonexisting project', () => {
                beforeEach((done) => {
                    dao = require('../../lib/server/dao')(fixturesDirectory + 'valid_project_in_rootfolder');
                    done();
                });

                it('should not choke on it', (done) => {
                    dao.loadProject('/noneExistingProject', (projectData) => {
                        expect(projectData).toBeFalsy();
                        done();
                    });
                });
            });

            describe('malformed project file', () => {

                beforeEach((done) => {
                    dao = require('../../lib/server/dao')(fixturesDirectory + 'invalid_project_in_rootfolder');
                    done();
                });

                it('should not choke on it', (done) => {
                    dao.loadProject('/invalid_project.prj', (cbValue) => {
                        expect(cbValue).toBeFalsy();
                        done();
                    });
                });

            });
        });
    });

    describe('getDirectory', () => {
        var storageFolder = fixturesDirectory + 'valid_projects_in_subfolder/';

        // create an empty folder
        beforeAll((done) => {
            fs.mkdir(storageFolder + 'subFolder/emptySubFolder', done);
        });

        afterAll((done) => {
            fs.rmdir(storageFolder + 'subFolder/emptySubFolder', done);
        });

        beforeEach((done) => {
            dao = require('../../lib/server/dao')(storageFolder);
            done();
        });

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

        it('should return empty lists if a directory has no items', (done) => {
            dao.getDirectory('/subFolder/emptySubFolder', (obj) => {
                expect(obj.projects.length).toEqual(0);
                expect(obj.dirs.length).toEqual(0);
                done();
            });
        });

        it('should have parent directories wit correct name', (done) => {
            dao.getDirectory('/subFolder/emptySubFolder', (obj) => {
                expect(obj.parentDirectories[0].name).toEqual('');
                expect(obj.parentDirectories[1].name).toEqual('subFolder');
                expect(obj.parentDirectories[2].name).toEqual('emptySubFolder');
                done();
            });
        });

        it('should have parent directories wit correct id', (done) => {
            dao.getDirectory('/subFolder/emptySubFolder', (obj) => {
                expect(obj.parentDirectories[0].id).toEqual('/');
                expect(obj.parentDirectories[1].id).toEqual('/subFolder');
                expect(obj.parentDirectories[2].id).toEqual('/subFolder/emptySubFolder');
                done();
            });
        });
    });

    describe('createNewProject', () => {
        var storageFolder = fixturesDirectory + 'empty_rootfolder/',
            directory = '/',
            projectName = 'newProject';

        beforeEach((done) => {
            dao = require('../../lib/server/dao')(storageFolder);
            done();
        });

        afterEach((done) => {
            fs.unlink(storageFolder + projectName + '.json', (err) => {
                expect(err).toBeFalsy();
                done();
            });
        });

        it('should create a new project with expected defaults', (done) => {
            dao.createNewProject(directory, projectName, {}, (err, projectData) => {
                expect(err).toBeFalsy();
                expect(projectData).toBeTruthy();
                expect(projectData).toBeDefined();
                expect(projectData.projectId).toEqual('/' + projectName);
                expect(projectData.project).toEqual(projectName);
                expect(projectData.description).toEqual('');
                expect(projectData.languages).toEqual({});
                expect(projectData.availableLanguages.length).toEqual(8);
                expect(projectData.keyDescriptions).toEqual({});
                expect(projectData.numberOfKeys).toEqual(0);
                expect(projectData.keys).toEqual({});
                done();
            });
        });

        it('should save json file for new project', (done) => {
            dao.createNewProject(directory, projectName, {}, (err, projectData) => {
                var expectedProjectPath = storageFolder + '/' + directory + '/' + projectName + '.json';
                fs.stat(expectedProjectPath, (err, stats) => {
                    expect(err).toBeFalsy();
                    expect(stats.isFile()).toBeTruthy();

                    dao.loadProject(directory + projectName, (projectData) => {
                        expect(projectData).toBeDefined();
                        expect(projectData.projectId).toEqual('/newProject');
                        done();
                    });
                });
            });
        });

        it('should include a given project description in the created config', (done) => {
            var description = "My special description";
            dao.createNewProject(directory, projectName, {description : description}, (err, projectData) => {
                expect(err).toBeFalsy();
                expect(projectData.description).toEqual(description);
                done();
            });
        });
    });

    describe('createNewDirectory', () => {
        var storageFolder = fixturesDirectory + 'valid_projects_in_subfolder/';
        var subDirectoryName = 'newDirectory';

        beforeEach((done) => {
            dao = require('../../lib/server/dao')(storageFolder);
            done();
        });

        afterEach((done) => {
            fs.rmdir(storageFolder + '/' + subDirectoryName, done);
        });

        it('should fail if the parent directory does not exist', (done) => {
            // TODO how to add an assert that the parent really does not exist?
            dao.createNewDirectory(subDirectoryName, 'nonexistingDirectory', (err, directoryData) => {
                expect(err).toBeTruthy();
                expect(directoryData).toBeUndefined();
                done();
            });
        });

        it('should fail if the directory to create exists already ', (done) => {
            dao.createNewDirectory('subFolder', '/', (err, directoryData) => {
                expect(err).toBeTruthy();
                expect(directoryData).toBeFalsy();
                done();
            });
        });

        it('should create the new directory if all preconditions are met ', (done) => {
            dao.createNewDirectory(subDirectoryName, '/', (err, directoryData) => {
                expect(err).toBeFalsy();
                expect(directoryData).toBeDefined();
                expect(directoryData.directoryId).toEqual('/' + subDirectoryName);
                expect(directoryData.parentDirectoryId).toEqual('/');
                expect(fs.existsSync(path.normalize(storageFolder + '/' + directoryData.directoryId))).toEqual(true);
                done();
            });
        });
    });

    describe('saveKey', () => {
        var storageFolder = fixturesDirectory + 'empty_rootfolder/';
        var projectId = '/newProject';
        var language = 'de';
        var keyName = 'key_1';

        beforeEach((done) => {
            dao = require('../../lib/server/dao')(storageFolder);

            dao.createNewProject('/', 'newProject', {}, (err, projectData) => {
                expect(err).toBeFalsy();
                done();
            });
        });

        afterEach((done) => {
            fs.unlink(storageFolder + projectId + '.json', (err) => {
                expect(err).toBeFalsy();
                done();
            });
        });

        describe('new keys', () => {
            it('should save new key in project file', (done) => {
                var keyValue = 'test text DE';
                var change = {key: keyName, value : keyValue };
                dao.saveKey(projectId, language, change, (err, savedKey, savedValue) => {
                    expect(err).toBeFalsy();
                    dao.loadProject(projectId, (projectData) => {
                        expect(projectData.keys[language]).toBeDefined();
                        expect(projectData.keys[language][keyName]).toBeDefined();
                        expect(projectData.keys[language][keyName]).toEqual(keyValue);
                        done();
                    });
                });
            });

            it('should return saved key', (done) => {
                var keyValue = 'test text DE';
                var change = {key: keyName, value : keyValue };
                dao.saveKey(projectId, language, change, (err, savedKeyName, savedKeyValue) => {
                    expect(err).toBeFalsy();
                    expect(savedKeyName).toEqual(keyName);
                    expect(savedKeyValue).toEqual(keyValue);
                    done();
                });
            });
        });

        describe('existing keys', () => {
            var keyOldValue = 'test text DE';
            var keyNewValue = 'test text DE_changed';

            beforeAll((done) => {
                dao.saveKey(projectId, language, { key : keyName, value : keyOldValue }, (savedKeyName, savedKeyValue) => {
                    done();
                });
            });

            it('should still have key in project after update', (done) => {
                var change = { key : keyName, value : keyNewValue };
                dao.saveKey(projectId, language, change, (err, savedKeyName, savedKeyValue) => {
                    expect(err).toBeFalsy();
                    dao.loadProject(projectId, (projectData) => {
                        expect(projectData.keys[language][keyName]).toBeDefined();
                        done();
                    });
                });
            });

            it('should have changed the key to the new value', (done) => {
                var change = { key : keyName, value : keyNewValue };
                dao.saveKey(projectId, language, change, (err, savedKeyName, savedKeyValue) => {
                    expect(err).toBeFalsy();
                    dao.loadProject(projectId, (projectData) => {
                        expect(projectData.keys[language][keyName]).toEqual(keyNewValue);
                        done();
                    });
                });
            });

        });
    });

    describe('removeKey', () => {
        var storageFolder = fixturesDirectory + 'empty_rootfolder/';
        var projectId = '/newProject';
        var languageDE = 'de';
        var languageEN = 'en';
        var keyName = 'key_1';
        var keyValueDE = 'test text DE';
        var keyValueEN = 'test text EN';

        beforeEach((done) => {
            dao = require('../../lib/server/dao')(storageFolder);

            dao.createNewProject('/', 'newProject', {}, (err, projectData) => {
                expect(err).toBeFalsy();
                dao.saveKey(projectId, languageDE, { key : keyName, value : keyValueDE }, () => {
                    dao.saveKey(projectId, languageEN, { key : keyName, value : keyValueEN }, () => {
                        done();
                    })
                });
            });
        });

        afterEach((done) => {
            fs.unlink(storageFolder + 'newProject.json', (err) => {
                expect(err).toBeFalsy();
                done();
            });
        });

        it('should have removed all entries of the key', (done) => {
            dao.removeKey(projectId, keyName, (deletedKeyName) => {
                dao.loadProject(projectId, (projectData) => {
                    expect(projectData.keys[languageDE][keyName]).toBeUndefined();
                    expect(projectData.keys[languageEN][keyName]).toBeUndefined();
                    done();
                });
            });
        });
    });

    describe('renameKey', () => {
        var storageFolder = fixturesDirectory + 'empty_rootfolder/';
        var projectId = '/newProject';
        var languageDE = 'de';
        var languageEN = 'en';
        var keyOldName = 'key_1';
        var keyNewName = 'key_1_changed';
        var keyValueDE = 'test text DE';
        var keyValueEN = 'test text EN';

        var keyRename = { oldKey : keyOldName, newKey : keyNewName };

        beforeEach((done) => {
            dao = require('../../lib/server/dao')(storageFolder);
            dao.createNewProject('/', 'newProject', {}, (err, projectData) => {
                expect(err).toBeFalsy();
                dao.saveKey(projectId, languageDE, { key : keyOldName, value : keyValueDE }, () => {
                    dao.saveKey(projectId, languageEN, { key : keyOldName, value : keyValueEN }, () => {
                        done();
                    })
                });
            });
        });

        afterEach((done) => {
            fs.unlink(storageFolder + 'newProject.json', (err) => {
                expect(err).toBeFalsy();
                done();
            });
        });

        it('should have removed entry with old key name', (done) => {
            dao.renameKey(projectId, keyRename, (err, oldKeyName, newKeyName) => {
                expect(err).toBeFalsy();
                dao.loadProject(projectId, (projectData) => {
                    expect(projectData.keys[languageDE][keyOldName]).toBeUndefined();
                    expect(projectData.keys[languageEN][keyOldName]).toBeUndefined();
                    done();
                });
            });
        });

        it('should have changed occurrences of the key for all languages', (done) => {
            dao.renameKey(projectId, keyRename, (err, oldKeyName, newKeyName) => {
                expect(err).toBeFalsy();
                dao.loadProject(projectId, (projectData) => {
                    expect(projectData.keys[languageDE][keyNewName]).toBeDefined();
                    expect(projectData.keys[languageEN][keyNewName]).toBeDefined();
                    done();
                });
            });
        });

        it('should not have changed the key value', (done) => {
            dao.renameKey(projectId, keyRename, (err, oldKeyName, newKeyName) => {
                expect(err).toBeFalsy();
                dao.loadProject(projectId, (projectData) => {
                    expect(projectData.keys[languageDE][keyNewName]).toEqual(keyValueDE);
                    expect(projectData.keys[languageEN][keyNewName]).toEqual(keyValueEN);
                    done();
                });
            });
        });

        it('should return old and new key name with callback', (done) => {
            dao.renameKey(projectId, keyRename, (err, oldKeyName, newKeyName) => {
                expect(err).toBeFalsy();
                expect(oldKeyName).toEqual(keyOldName);
                expect(newKeyName).toEqual(keyNewName);
                done();
            });
        });

        // TODO add missing tests for renaming key in descriptions property
    });

    describe('saveDescription', () => {
        var storageFolder = fixturesDirectory + 'empty_rootfolder';
        var projectFolder = '/';
        var projectName = 'testProject_saveDescription';
        var projectId;

        beforeEach((done) => {
            dao = require('../../lib/server/dao')(storageFolder);
            done();
        });

        afterEach((done) => {
            fs.unlink(storageFolder + projectFolder + projectName + '.json', (err) => {
                expect(err).toBeFalsy();
                done();
            });
        });

        describe('with no existing description', () => {

            beforeEach((done) => {
                dao.createNewProject(projectFolder, projectName, {}, (err, projectData) => {
                    expect(err).toBeFalsy();
                    expect(projectData).toBeDefined();
                    projectId = projectData.projectId;
                    done();
                });
            });

            it('should save description if project had none before', (done) => {
                var id = '__description';
                var description = 'testdescription';
                dao.saveProjectDescription(projectId, id, description, (err) => {
                    expect(err).toBeFalsy();
                    dao.loadProject(projectId, (projectData) => {
                        // TODO: Is this intended to be, i.e. key description is empty string?
                        expect(projectData.keyDescriptions[id]).toEqual(description);
                        done();
                    });
                });
            });

        });

        describe('with existing description', () => {

            var initialDescription = 'initialDescription';
            var projectInitialValues = {
                description : initialDescription
            };

            beforeEach((done) => {
                dao.createNewProject(projectFolder, projectName, projectInitialValues, (err, projectData) => {
                    expect(err).toBeFalsy();
                    expect(projectData).toBeDefined();
                    projectId = projectData.projectId;
                    done();
                });
            });

            it('should save description if project had one before', (done) => {
                var id = '__description';
                var description = 'new_description';
                dao.saveProjectDescription(projectId, id, description, (err) => {
                    expect(err).toBeFalsy();
                    dao.loadProject(projectId, (projectData) => {
                        // TODO: Is this intended to be, i.e. key description is empty string?
                        expect(projectData.keyDescriptions[id]).toEqual(description);
                        done();
                    });
                });
            });
        });
    });
});

