var projectFolder = __dirname + '/fixtures/',
    fileMgr = require('../../lib/server/legacy/jsonFileManager')(projectFolder),
    fs = require('fs');

describe('Check that the jsonFileManager works', () => {

    var persistObj = {
        deepFoo : {
            foo : "deepFoo foo"
        },
        foo : "foo"
    }, saveResult;

    beforeAll((done) => {
        fileMgr.saveJSON('/jsonFileManager/test', persistObj, (err) => {
            saveResult = err;
        	done();
        });
    });

    it("should save a json file", () => {
        expect(saveResult).toEqual(null);
    });

    afterAll((done) => {
        Promise.all([
            new Promise((fulFill, reject) =>
                fs.unlink(projectFolder + "/jsonFileManager/test.json", fulFill)
            ),
            new Promise((fulFill, reject) =>
                fs.rmdir(projectFolder + "/jsonFileManager", fulFill)
            )
        ]).then(done)
            .catch((err) => console.log('jsonFileManagerSpec:err', err));
    });
});