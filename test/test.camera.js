describe("camera", function () {
    var camera = require('cordova/plugin/Camera'),
        constants = require('cordova/plugin/CameraConstants');

    describe("constants", function() {
        it("should be defined on the base camera plugin", function() {
            for (var type in constants) {
                expect(camera[type]).toBe(constants[type]);
            }
        });
    });
});

