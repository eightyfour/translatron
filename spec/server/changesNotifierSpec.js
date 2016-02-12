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

    describe('addListener', () => {

        describe('adding when listeners list still empty', () => {

            it('should add have added listener to registry on addListener call', (done) => {

                changesNotifier.addListener(listener1.id, listener1);

                expect(changesNotifier.listenerCount()).toEqual(1);

                done();
            });
        });

        describe('adding when there are already listeners in the list', () => {

            beforeEach((done) => {
                changesNotifier.addListener(listener1.id, listener1);
                done();
            });

            it('should add new listener to registry on addListener call', (done) => {
                changesNotifier.addListener(listener2.id, listener2);
                expect(changesNotifier.listenerCount()).toEqual(2);
                done();
            });
        });
    });

    describe('removeListener', () => {

        describe('removing only listener', () => {

            beforeEach((done) => {
                changesNotifier.addListener(listener1.id, listener1);
                done();
            });

            it('listener should have been removed', (done) => {
                changesNotifier.removeListener(listener1.id);
                expect(changesNotifier.listenerCount()).toEqual(0);
                done();
            });

        });

        describe('removing one out of many listeners', () => {

            beforeEach((done) => {
                changesNotifier.addListener(listener1.id, listener1);
                changesNotifier.addListener(listener2.id, listener2);
                done();
            });

            it('listener should have been removed', (done) => {
                changesNotifier.removeListener(listener2.id);
                expect(changesNotifier.listenerCount()).toEqual(1);
                done();
            });

        });

    });

});