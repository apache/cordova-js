describe("channel", function () {
    var channel = require('cordova/channel'),
        c;

    beforeEach(function() {
        c = null;
        c = channel.create('masterexploder');
    });

    describe("subscribe method", function() {
        it("should throw an exception if no function is provided", function() {
            expect(function() {
                c.subscribe();
            }).toThrow();

            expect(function() {
                c.subscribe(null);
            }).toThrow();

            expect(function() {
                c.subscribe(undefined);
            }).toThrow();

            expect(function() {
                c.subscribe({apply:function(){},call:function(){}});
            }).toThrow();
        });
        it("should not change number of handlers if no function is provided", function() {
            var initialLength = c.numHandlers;

            try {
                c.subscribe();
            } catch(e) {}

            expect(c.numHandlers).toEqual(initialLength);

            try {
                c.subscribe(null);
            } catch(e) {}

            expect(c.numHandlers).toEqual(initialLength);
        });
        it("should not change number of handlers when subscribing same function multiple times", function() {
            var initialLength = c.numHandlers;
            var handler = function(){};

            c.subscribe(handler);
            c.subscribe(handler);
            c.subscribe(handler);

            expect(c.numHandlers).toEqual(initialLength+1);
        });
    });

    describe("unsubscribe method", function() {
        it("should throw an exception if passed in null or undefined", function() {
            expect(function() {
                c.unsubscribe();
            }).toThrow();
            expect(function() {
                c.unsubscribe(null);
            }).toThrow();
        });
        it("should not decrement numHandlers if unsubscribing something that does not exist", function() {
            var initialLength = c.numHandlers;
            c.unsubscribe('blah');
            expect(c.numHandlers).toEqual(initialLength);
            c.unsubscribe(2);
            expect(c.numHandlers).toEqual(initialLength);
            c.unsubscribe({balls:false});
            expect(c.numHandlers).toEqual(initialLength);
        });
        it("should change the handlers length appropriately", function() {
            var firstHandler = function() {};
            var secondHandler = function() {};
            var thirdHandler = function() {};

            c.subscribe(firstHandler);
            c.subscribe(secondHandler);
            c.subscribe(thirdHandler);

            var initialLength = c.numHandlers;

            c.unsubscribe(thirdHandler);

            expect(c.numHandlers).toEqual(initialLength - 1);

            c.unsubscribe(firstHandler);
            c.unsubscribe(secondHandler);

            expect(c.numHandlers).toEqual(0);
        });
        it("should not decrement handlers length more than once if unsubing a single handler", function() {
            var firstHandler = function(){};
            c.subscribe(firstHandler);

            expect(c.numHandlers).toEqual(1);

            c.unsubscribe(firstHandler);
            c.unsubscribe(firstHandler);
            c.unsubscribe(firstHandler);
            c.unsubscribe(firstHandler);

            expect(c.numHandlers).toEqual(0);
        });
        it("should not unregister a function registered with a different handler", function() {
            var cHandler = function(){};
            var c2Handler = function(){};
            var c2 = channel.create('jables');
            c.subscribe(cHandler);
            c2.subscribe(c2Handler);

            expect(c.numHandlers).toEqual(1);
            expect(c2.numHandlers).toEqual(1);

            c.unsubscribe(c2Handler);
            c2.unsubscribe(cHandler);

            expect(c.numHandlers).toEqual(1);
            expect(c2.numHandlers).toEqual(1);
        });
    });

    describe("fire method", function() {
        it("should fire all subscribed handlers", function() {
            var handler = jasmine.createSpy();
            var anotherOne = jasmine.createSpy();

            c.subscribe(handler);
            c.subscribe(anotherOne);

            c.fire();

            expect(handler).toHaveBeenCalled();
            expect(anotherOne).toHaveBeenCalled();
        });
        it("should not fire a handler that was unsubscribed", function() {
            var handler = jasmine.createSpy();
            var anotherOne = jasmine.createSpy();

            c.subscribe(handler);
            c.subscribe(anotherOne);
            c.unsubscribe(handler);

            c.fire();

            expect(handler).not.toHaveBeenCalled();
            expect(anotherOne).toHaveBeenCalled();
        });
        it("should not fire a handler more than once if it was subscribed more than once", function() {
            var count = 0;
            var handler = jasmine.createSpy().andCallFake(function() { count++; });

            c.subscribe(handler);
            c.subscribe(handler);
            c.subscribe(handler);

            c.fire();

            expect(handler).toHaveBeenCalled();
            expect(count).toEqual(1);
        });
        it("handler should be called when subscribed, removed, and subscribed again", function() {
            var count = 0;
            var handler = jasmine.createSpy().andCallFake(function() { count++; });

            c.subscribe(handler);
            c.unsubscribe(handler);
            c.subscribe(handler);

            c.fire();

            expect(handler).toHaveBeenCalled();
            expect(count).toEqual(1);

        });
        it("should instantly trigger the callback if the event has already been fired", function () {
            var chan = channel.create("foo"),
                before = jasmine.createSpy('before'),
                after = jasmine.createSpy('after');

            chan.subscribe(before);
            chan.fire();
            chan.subscribe(after);

            expect(before).toHaveBeenCalled();
            expect(after).toHaveBeenCalled();
        });
    });
});
