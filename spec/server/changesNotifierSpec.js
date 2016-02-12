describe('changesNotifier', () => {

    function newListener() {
        return {
            id :  Math.trunc(Math.random() * Math.pow(10, 10)),
            onSomethingHappened : function() {}
        };
    };

    var changesNotifier,
        listener1 = newListener(),
        listener2 = newListener();

    beforeEach((done) => {
        changesNotifier = require('../../lib/server/changesNotifier.js')();
        done();
    });

    describe('registerListener', () => {

        describe('adding when listeners list still empty', () => {

            it('should add have added listener to registry on registerListener call', (done) => {

                changesNotifier.registerListener(listener1);

                expect(changesNotifier.listenerCount()).toEqual(1);

                done();
            });
        });

        describe('adding when there are already listeners in the list', () => {

            beforeEach((done) => {
                changesNotifier.registerListener(listener1);
                done();
            });

            it('should add new listener to registry on registerListener call', (done) => {
                changesNotifier.registerListener(listener2);
                expect(changesNotifier.listenerCount()).toEqual(2);
                done();
            });
        });
    });

    describe('deregisterListener', () => {

        describe('removing only listener', () => {

            beforeEach((done) => {
                changesNotifier.registerListener(listener1);
                done();
            });

            it('listener should have been removed', (done) => {
                changesNotifier.deregisterListener(listener1.id);
                expect(changesNotifier.listenerCount()).toEqual(0);
                done();
            });

        });

        describe('removing one out of many listeners', () => {

            beforeEach((done) => {
                changesNotifier.registerListener(listener1);
                changesNotifier.registerListener(listener2);
                done();
            });

            it('listener should have been removed', (done) => {
                changesNotifier.deregisterListener(listener2.id);
                expect(changesNotifier.listenerCount()).toEqual(1);
                done();
            });

        });

    });

});