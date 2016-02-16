describe('changesNotifier', () => {

    function newListener() {
        return {
            id :  Math.trunc(Math.random() * Math.pow(10, 10)),
            notificationCount : 0,
            onSomethingHappened : function() {
                this.notificationCount++;
            }
        };
    };

    var changesNotifier, listener1, listener2;

    beforeEach((done) => {

        listener1 = newListener();
        listener2 = newListener();

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

    describe('notify', () => {

        var dummyPayload = {
            aSimpleValueProperty : 3434.34,
            aNestedProperty : {
                aStringProperty : 'asjkdfkl',
                aIntListProperty : [ 3, 55, 6, 89 ]
            }
        };

        describe('notify with only one listener registered', () => {

            beforeEach((done) => {
                changesNotifier.addListener(listener1.id, listener1);

                spyOn(listener1, 'onSomethingHappened');

                done();
            });

            it('single registered listener should not receive notification', (done) => {
                changesNotifier.notify('onSomethingHappened', [dummyPayload], listener1.id);
                expect(listener1.onSomethingHappened).not.toHaveBeenCalled();
                done();
            });

        });

        describe('notify with multiple listeners registered', () => {

            beforeEach((done) => {
                changesNotifier.addListener(listener1.id, listener1);
                changesNotifier.addListener(listener2.id, listener2);

                spyOn(listener1, 'onSomethingHappened');
                spyOn(listener2, 'onSomethingHappened');

                done();
            });

            it('only other listeners should receive notification', (done) => {
                changesNotifier.notify('onSomethingHappened', [dummyPayload], listener1.id);

                expect(listener2.onSomethingHappened).toHaveBeenCalled();
                expect(listener1.onSomethingHappened).not.toHaveBeenCalled();
                done();
            });

            it('notify passes expected payload', (done) => {
                changesNotifier.notify('onSomethingHappened', [dummyPayload], listener1.id);

                expect(listener2.onSomethingHappened).toHaveBeenCalledWith(dummyPayload);

                done();
            });

        });

    });

});