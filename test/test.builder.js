describe("builder", function () {

    var builder = require('phonegap/builder');

    it("includes the module into the target", function () {

        var target = {},
            objects = {
                foo: {
                    path: "phonegap/plugin/navigator"
                }
            };

        
        builder.build(objects).into(target);

        expect(target.foo).toBeDefined();
        expect(target.foo).toBe(require("phonegap/plugin/navigator"));
    });

    it("returns an empty object literal if no path", function () {
        var target = {},
            objects = {cat: {}};

        builder.build(objects).into(target);
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
                           path: "phonegap/plugin/navigator"
                       }
                   }
               } 
            };

        builder.build(objects).into(target);

        expect(target.homer.bart).toBeDefined();
        expect(target.homer.maggie).toBe(require('phonegap/plugin/navigator'));
        expect(target.homer.lisa).toBeDefined();
    });
});
