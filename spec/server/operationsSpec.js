var fixturesDirectory = __dirname + '/fixtures/';

describe('operations', () => {

    var operations, dao, changesNotifier, clientCallbacks;

    beforeAll((done) => {

        dao = require('../../lib/server/dao')(fixturesDirectory + 'empty_rootfolder');
        changesNotifier = require('../../lib/server/changesNotifier.js')();
        operations = require('../../lib/server/operations.js')(dao, changesNotifier);
        clientCallbacks = {
            onSomethingHappened : function() {}
        };

        done();
    });

    describe('attachClientCallbacks', () => {

        beforeEach((done) => {

            spyOn(changesNotifier, 'addListener');

            done();
        });

        it('attachClientCallbacks will add listener to changesNotifier', (done) => {

            operations.attachClientCallbacks(clientCallbacks);

            // matching on the first parameter is not perfect: we're using a number here but could be any string
            expect(changesNotifier.addListener).toHaveBeenCalledWith(jasmine.any(Number), clientCallbacks);

            done();
        });

        it('attachClientCallbacks will return the assigned client listener id', (done) => {
            var clientListenerId = operations.attachClientCallbacks(clientCallbacks);

            expect(clientListenerId).toBeDefined();

            done();
        });
    });

    describe('detachClientCallbacks', () => {

        var clientListenerId;

        beforeEach((done) => {

            clientListenerId = operations.attachClientCallbacks(clientCallbacks);

            spyOn(changesNotifier, 'removeListener');

            done();
        });

        it('detachClientCallbacks will remove listener from changesNotifier', (done) => {

            operations.detachClientCallbacks(clientListenerId);

            // matching on the first parameter is not perfect: we're using a number here but could be any string
            expect(changesNotifier.removeListener).toHaveBeenCalledWith(clientListenerId);

            done();
        })
    });
});
