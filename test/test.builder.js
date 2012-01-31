describe("builder", function () {

    var builder = require('phonegap/builder');

    it("includes the module into the target", function () {

        var target = {},
            objects = {
                foo: {
                    path: "phonegap/plugin/compass"
                }
            };

        
        builder.build(objects).intoAndClobberTheFOutOf(target);
        expect(target.foo).toBeDefined();
        expect(target.foo).toBe(require("phonegap/plugin/compass"));
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
                           path: "phonegap/plugin/compass"
                       }
                   }
               } 
            };

        builder.build(objects).intoButDontClobber(target);

        expect(target.homer.bart).toBeDefined();
        expect(target.homer.maggie).toBe(require('phonegap/plugin/compass'));
        expect(target.homer.lisa).toBeDefined();
    });
});
