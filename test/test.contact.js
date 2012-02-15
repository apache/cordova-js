describe("Contact", function () {
    var Contact = require('cordova/plugin/Contact'),
        exec = require('cordova/exec');

    describe("save", function () {
        it("calls exec when saving", function () {
            var c = new Contact(),
                s = jasmine.createSpy(),
                e = jasmine.createSpy();

            c.save(s, e);
            expect(exec).toHaveBeenCalledWith(s, e, "Contacts", "save", [c]);
        });
    });
});
