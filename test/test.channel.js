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
        });
    });
});
