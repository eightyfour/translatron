var projectFolder = __dirname + '/fixtures/',
    fs = require('fs'),
    path = require('path');

var MOCK_CONNECTION_ID = 'xx';

describe('dao general tests', function() {
    var dao;

    beforeAll((done) => {
        dao = require('../../lib/server/dao')(projectFolder + 'valid_project_in_rootfolder');
        done();
    });

    it('a dao instance can be created', function(done) {
        expect(dao).toBeDefined();
        done();
    });
});

describe('dao general loading of project from root folder', () => {
    var dao,
        project;

    beforeAll((done) => {
        dao = require('../../lib/server/dao')(projectFolder + 'valid_project_in_rootfolder');
        dao.loadProject('/project1', (projectData) => {
            project = projectData;
            done();
        });
    });

    it('a project can be loaded', (done) => {
        expect(project).toBeDefined();
        expect(project.projectId).toBeDefined();
        expect(project.projectId).toEqual('/project1');
        done();
    });

    it("project data must contain expected keys", (done) => {
        expect(Object.keys(project.keys.de).length).toEqual(2);
        expect(project.keys.de.first_key_1).toEqual('test Schluessel Nummer Eins');
        expect(project.keys.de.first_key_2).toEqual('test Schluessel Nummer Zwei');
        expect(Object.keys(project.keys.en).length).toEqual(3);
        expect(project.keys.en.first_key_1).toEqual('test key number one');
        expect(project.keys.en.first_key_2).toEqual('test key number two');
        expect(project.keys.en.first_key_3).toEqual('test key number three');

        done();
    });

    it('project data must include important project properties', (done) => {
        expect(project.project).toEqual('project1');
        expect(project.projectId).toEqual('/project1');
        expect(project.defaultLanguage).toEqual('en');
       done();
    });

    it('project must include descriptions', (done) => {
        expect(project.keyDescriptions).toBeDefined();
        done();
    });
});

describe('dao does not choke when trying to load nonexisting projects', () => {
    var dao;

    beforeAll((done) => {
        dao = require('../../lib/server/dao')(projectFolder + 'valid_project_in_rootfolder');
        done();
    });

    it('a nonexisting project cannot be loaded', (done) => {
        dao.loadProject('/noneExistingProject', (returnValue) => {
            expect(returnValue).toBeFalsy();
            done();
        });
    });
});

describe('dao loading corner cases', () => {
    var dao;

    beforeAll((done) => {
        dao = require('../../lib/server/dao')(projectFolder + 'invalid_project_in_rootfolder');
        done();
    });

    it('should not choke on malformed projects', (done) => {
        dao.loadProject('/invalid_project.prj', (cbValue) => {
            expect(cbValue).toBeFalsy();
            done();
        });
    });
});

describe('dao project creation', () => {
    var dao,
        storageFolder = projectFolder + 'empty_rootfolder/',
        directory = '/',
        projectName = 'newProject',
        project;

    beforeAll((done) => {
        dao = require('../../lib/server/dao')(storageFolder);
        done();
    });

    beforeEach((done) => {
        dao.createNewProject(MOCK_CONNECTION_ID, directory, projectName, {}, (data) => {
            expect(data).toBeTruthy();
            project = data;
            done();
        });
    });

    afterEach((done) => {
        fs.unlink(storageFolder + projectName + '.json', (err) => {
            expect(err).toBeFalsy();
            done();
        });
    });

    it('should create a new project with expected defaults', (done) => {
       expect(project).toBeDefined();
       expect(project.projectId).toEqual('/' + projectName);
       expect(project.project).toEqual(projectName);
       expect(project.description).toEqual('');
       expect(project.languages).toEqual({});
       expect(project.availableLanguages.length).toEqual(8);
       expect(project.keyDescriptions).toEqual({});
       expect(project.numberOfKeys).toEqual(0);
       expect(project.keys).toEqual({});
       done();
    });

    it('should save json file for new project', (done) => {
        dao.createNewProject(MOCK_CONNECTION_ID, directory, projectName, {}, (data) => {
            dao.loadProject(directory + projectName, (data) => {
                expect(data).toBeDefined();
                expect(data.projectId).toEqual('/newProject');
                done();
            });
        });
    });
});

describe('dao can create projects where description is given', () => {
    var dao,
        storageFolder = projectFolder + 'empty_rootfolder/',
        directory = '/',
        projectName = 'newProject',
        project;

    beforeAll((done) => {
        dao = require('../../lib/server/dao')(storageFolder);
        done();
    });

    afterEach((done) => {
        fs.unlink(storageFolder + projectName + '.json', (err) => {
            expect(err).toBeFalsy();
            done();
        });
    });

    it('a description can be passed for new project', (done) => {
        var description = "My special description";
        dao.createNewProject(MOCK_CONNECTION_ID, directory, projectName, {description : description}, (data) => {
            expect(data.description).toEqual(description);
            done();
        });
    });
});

describe('dao.saveKey for new keys', () => {
    var storageFolder = projectFolder + 'empty_rootfolder/';
    var dao;
    var projectId = '/newProject';

    beforeAll((done) => {
        dao = require('../../lib/server/dao')(storageFolder);
        done();
    });

    beforeEach((done) => {
         dao.createNewProject(MOCK_CONNECTION_ID, '/', 'newProject', {}, (data) => {
             done();
         });
    });

    afterEach((done) => {
        fs.unlink(storageFolder + 'newProject.json', (err) => {
            expect(err).toBeFalsy();
            done();
        });
    });

    it('should save new key in project file', (done) => {
        var language = 'de';
        var keyName = 'key_1';
        var keyValue = 'test text DE';
        var change = {key: keyName, value : keyValue };
        dao.saveKey(MOCK_CONNECTION_ID, projectId, language, change, (savedKey) => {
            dao.loadProject(projectId, (projectData) => {
                expect(projectData.keys[language]).toBeDefined();
                expect(projectData.keys[language][keyName]).toBeDefined();
                expect(projectData.keys[language][keyName]).toEqual(keyValue);
                done();
            });
        });
    });

    it('should return saved key', (done) => {
        var language = 'de';
        var keyName = 'key_1';
        var keyValue = 'test text DE';
        var change = {key: keyName, value : keyValue };
        dao.saveKey(MOCK_CONNECTION_ID, projectId, language, change, (savedKeyName, savedKeyValue) => {
            expect(savedKeyName).toEqual(keyName);
            expect(savedKeyValue).toEqual(keyValue);
            done();
        });
    });
});

describe('dao.saveKey for existing keys', () => {
    var storageFolder = projectFolder + 'empty_rootfolder/';
    var dao;
    var projectId = '/newProject';
    var language = 'de';
    var keyName = 'key_1';
    var keyOldValue = 'test text DE';
    var keyNewValue = 'test text DE_changed';

    beforeAll((done) => {
        dao = require('../../lib/server/dao')(storageFolder);
        done();
    });

    beforeEach((done) => {
        dao.createNewProject(MOCK_CONNECTION_ID, '/', 'newProject', {}, (data) => {
            dao.saveKey(MOCK_CONNECTION_ID, projectId, language, { key : keyName, value : keyOldValue }, (savedKeyName, savedKeyValue) => {
                done();
            });
        });
    });

    afterEach((done) => {
        fs.unlink(storageFolder + 'newProject.json', (err) => {
            expect(err).toBeFalsy();
            done();
        });
    });

    it('should still have key in project after update', (done) => {
        var change = { key : keyName, value : keyNewValue };
        dao.saveKey(MOCK_CONNECTION_ID, projectId, language, change, (savedKeyName, savedKeyValue) => {
            dao.loadProject(projectId, (projectData) => {
                expect(projectData.keys[language][keyName]).toBeDefined();
                done();
            });
        });
    });

    it('should have changed the key to the new value', (done) => {
        var change = { key : keyName, value : keyNewValue };
        dao.saveKey(MOCK_CONNECTION_ID, projectId, language, change, (savedKeyName, savedKeyValue) => {
            dao.loadProject(projectId, (projectData) => {
                expect(projectData.keys[language][keyName]).toEqual(keyNewValue);
                done();
            });
        });
    });
});

describe('dao.renameKey', () => {
    var storageFolder = projectFolder + 'empty_rootfolder/';
    var dao;
    var projectId = '/newProject';
    var languageDE = 'de';
    var languageEN = 'en';
    var keyOldName = 'key_1';
    var keyNewName = 'key_1_changed';
    var keyValueDE = 'test text DE';
    var keyValueEN = 'test text EN';

    beforeAll((done) => {
        dao = require('../../lib/server/dao')(storageFolder);
        done();
    });

    beforeEach((done) => {
        dao.createNewProject(MOCK_CONNECTION_ID, '/', 'newProject', {}, (data) => {
            dao.saveKey(MOCK_CONNECTION_ID, projectId, languageDE, { key : keyOldName, value : keyValueDE }, () => {
                dao.saveKey(MOCK_CONNECTION_ID, projectId, languageEN, { key : keyOldName, value : keyValueEN }, () => {
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
        var keyRename = { oldKey : keyOldName, newKey : keyNewName };
        dao.renameKey(MOCK_CONNECTION_ID, projectId, keyRename, () => {
            dao.loadProject(projectId, (projectData) => {
                expect(projectData.keys[languageDE][keyOldName]).toBeUndefined();
                expect(projectData.keys[languageEN][keyOldName]).toBeUndefined();
                done();
            });
        });
    });

    it('should have changed occurrences of the key for all languages', (done) => {
        var keyRename = { oldKey : keyOldName, newKey : keyNewName };
        dao.renameKey(MOCK_CONNECTION_ID, projectId, keyRename, () => {
            dao.loadProject(projectId, (projectData) => {
                expect(projectData.keys[languageDE][keyNewName]).toBeDefined();
                expect(projectData.keys[languageEN][keyNewName]).toBeDefined();
                done();
            });
        });
    });

    it('should not have changed the key value', (done) => {
        var keyRename = { oldKey : keyOldName, newKey : keyNewName };
        dao.renameKey(MOCK_CONNECTION_ID, projectId, keyRename, () => {
            dao.loadProject(projectId, (projectData) => {
                expect(projectData.keys[languageDE][keyNewName]).toEqual(keyValueDE);
                expect(projectData.keys[languageEN][keyNewName]).toEqual(keyValueEN);
                done();
            });
        });
    });

    // TODO add missing tests for renaming key in descriptions property
});

describe('dao.removeKey', () => {
    var storageFolder = projectFolder + 'empty_rootfolder/';
    var dao;
    var projectId = '/newProject';
    var languageDE = 'de';
    var languageEN = 'en';
    var keyName = 'key_1';
    var keyValueDE = 'test text DE';
    var keyValueEN = 'test text EN';

    beforeAll((done) => {
        dao = require('../../lib/server/dao')(storageFolder);
        done();
    });

    beforeEach((done) => {
        dao.createNewProject(MOCK_CONNECTION_ID, '/', 'newProject', {}, (data) => {
            dao.saveKey(MOCK_CONNECTION_ID, projectId, languageDE, { key : keyName, value : keyValueDE }, () => {
                dao.saveKey(MOCK_CONNECTION_ID, projectId, languageEN, { key : keyName, value : keyValueEN }, () => {
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
        dao.removeKey(MOCK_CONNECTION_ID, projectId, keyName, (deletedKeyName) => {
            dao.loadProject(projectId, (projectData) => {
                expect(projectData.keys[languageDE][keyName]).toBeUndefined();
                expect(projectData.keys[languageEN][keyName]).toBeUndefined();
                done();
            });
        });
    });
});

describe('dao.createNewDirectory', () => {
    var storageFolder = projectFolder + 'valid_projects_in_subfolder/';
    var dao;

    beforeAll((done) => {
        dao = require('../../lib/server/dao')(storageFolder);
        done();
    });

    afterAll((done) => {
        fs.rmdir(storageFolder + '/' + 'newDirectory');
        done();
    });

    it('should fail if the parent directory does not exist', (done) => {
        // TODO how to add an assert that the parent really does not exist?
        dao.createNewDirectory(MOCK_CONNECTION_ID,
            'newDirectory', 'nonexistingDirectory', (obj) => {
                expect(obj).toEqual(false);
                done();
        });
    });

    it('should fail if the directory to create exists already ', (done) => {
        dao.createNewDirectory(MOCK_CONNECTION_ID,
            'subFolder', '/', (obj) => {
                expect(obj).toEqual(false);
                done();
        });
    });

    it('should create the new directory if all preconditions are met ', (done) => {
        dao.createNewDirectory(MOCK_CONNECTION_ID,
            'newDirectory', '/', (obj) => {
                expect(obj.directoryId).toEqual('/' + 'newDirectory');
                expect(obj.parentDirectoryId).toEqual('/');
                expect(fs.existsSync(path.normalize(storageFolder + '/' + obj.directoryId))).toEqual(true);
                done();
        });
    });
});

describe('dao.getDirectory', () => {
    var storageFolder = projectFolder + 'valid_projects_in_subfolder/';
    var dao;

    beforeAll((done) => {
        dao = require('../../lib/server/dao')(storageFolder);
        done();
    });

    // create an empty folder
    beforeAll((done) => {
        fs.mkdir(storageFolder + 'subFolder/emptySubFolder', done);
    });

    afterAll((done) => {
        fs.rmdir(storageFolder + 'subFolder/emptySubFolder', done);
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


//

//    describe("the getDirectory method ", () => {
//
//        // create an empty folder
//        beforeAll((done) => {
//            fs.mkdir(projectFolder + 'subFolder/emptySubFolder', done);
//        });
//
//        afterAll((done) => {
//            fs.rmdir(projectFolder + 'subFolder/emptySubFolder', done);
//        });
//
//        it("should return the sub projects from /", (done) => {
//            dao.getDirectory("/", (obj) => {
//                expect(obj.projects.length).toEqual(1);
//                expect(obj.projects).toEqual([{
//                    name : 'project1',
//                    id : '/project1'
//                }]);
//                done();
//            });
//        });
//
//        it("should return the sub directories from /", (done) => {
//            dao.getDirectory("/", (obj) => {
//                expect(obj.dirs.length).toEqual(1);
//                expect(obj.dirs).toEqual([{
//                    name : 'subFolder',
//                    id : '/subFolder'
//                }]);
//                done();
//            });
//        });
//
//        it("should return the contents from sub folder", (done) => {
//            dao.getDirectory("/subFolder", (obj) => {
//                expect(obj.projects.length).toEqual(1);
//                expect(obj.projects).toEqual([{
//                    name : 'project2',
//                    id : '/subFolder/project2'
//                }]);
//                expect(obj.parentDirectory).toEqual('/');
//                expect(obj.currentDirectory).toEqual('/subFolder');
//                expect(obj.dirs).toEqual([{
//                        name: 'emptySubFolder',
//                        id: '/subFolder/emptySubFolder'
//                    },{
//                        name: 'subSubFolder',
//                        id: '/subFolder/subSubFolder'
//                    }]);
//                done();
//            });
//        });
//
//        it("should return false if path does not exists", (done) => {
//            dao.getDirectory("/noneExistingPath", (obj) => {
//                expect(obj).toBeFalsy();
//                done();
//            });
//        });
//
//        it('should return itself as the parent directory if already at top level', (done) => {
//           dao.getDirectory("/", (obj) => {
//                expect(obj.parentDirectory).toEqual('/');
//               expect(obj.currentDirectory).toEqual('/');
//               done();
//           });
//        });
//
//        it('should return the correct parent directory if there is a parent', (done) => {
//            dao.getDirectory("/subFolder", (obj) => {
//                expect(obj.parentDirectory).toEqual('/');
//                expect(obj.currentDirectory).toEqual('/subFolder');
//                done();
//            });
//        });
//
//        it('should return the correct parent directory from a sub sub directory', (done) => {
//            dao.getDirectory("/subFolder/subSubFolder", (obj) => {
//                expect(obj.parentDirectory).toEqual('/subFolder');
//                expect(obj.currentDirectory).toEqual('/subFolder/subSubFolder');
//                done();
//            });
//        });
//
//        it('should have expected IDs', (done) => {
//            dao.getDirectory('/', (obj) => {
//                expect(obj.projects.length).toEqual(1);
//                expect(obj.projects[0].id).toEqual('/project1');
//                done();
//            });
//        });
//
//        it('should return empty lists if a directory has no items', (done) => {
//            dao.getDirectory('/subFolder/emptySubFolder', (obj) => {
//                expect(obj.projects.length).toEqual(0);
//                expect(obj.dirs.length).toEqual(0);
//                done();
//            });
//        });
//
//        it('should have parent directories wit correct name', (done) => {
//            dao.getDirectory('/subFolder/emptySubFolder', (obj) => {
//                expect(obj.parentDirectories[0].name).toEqual('');
//                expect(obj.parentDirectories[1].name).toEqual('subFolder');
//                expect(obj.parentDirectories[2].name).toEqual('emptySubFolder');
//                done();
//            });
//        });
//
//        it('should have parent directories wit correct id', (done) => {
//            dao.getDirectory('/subFolder/emptySubFolder', (obj) => {
//                expect(obj.parentDirectories[0].id).toEqual('/');
//                expect(obj.parentDirectories[1].id).toEqual('/subFolder');
//                expect(obj.parentDirectories[2].id).toEqual('/subFolder/emptySubFolder');
//                done();
//            });
//        });
//
//    });
//});