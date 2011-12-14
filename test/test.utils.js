describe("utils", function () {
    var utils = require('phonegap/utils');

    describe("clone", function () {
        it("can clone null", function () {
            expect(utils.clone(null)).toBeNull();
        });
    });
});
