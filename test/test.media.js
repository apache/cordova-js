describe("media", function () {
    describe("MediaError object + error codes", function () {
        var MediaError = require('cordova/plugin/MediaError');
        it("should have no problem instantiating a MediaError object with the zero code", function () {
            var err = new MediaError(0);
            expect(err.code).toBe(0);
        });
    });
});
