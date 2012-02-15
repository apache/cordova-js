describe("builder", function () {

    var builder = require('cordova/builder');

    it("includes the module into the target", function () {

        var target = {},
            objects = {
                foo: {
                    path: "cordova/plugin/compass"
                }
            };

        
        builder.build(objects).intoAndClobberTheFOutOf(target);
        expect(target.foo).toBeDefined();
        expect(target.foo).toBe(require("cordova/plugin/compass"));
    });

    it("returns an empty object literal if no path", function () {
        var target = {},
            objects = {cat: {}};

        builder.build(objects).intoButDontClobber(target);

        expect(target.cat).toBeDefined();
    });

    it("builds out the children", function () {

        var target = {},
            objects = {
               homer: {
                   children: {
                       bart: {},
                       lisa: {},
                       maggie: {
                           path: "cordova/plugin/compass"
                       }
                   }
               } 
            };

        builder.build(objects).intoButDontClobber(target);

        expect(target.homer.bart).toBeDefined();
        expect(target.homer.maggie).toBe(require('cordova/plugin/compass'));
        expect(target.homer.lisa).toBeDefined();
    });
});
