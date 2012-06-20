describe("FileTransfer", function() {
    var FileTransfer = new (require('cordova/plugin/FileTransfer'))();
    describe("download", function() {
        it("should throw an exception if source or target is not defined", function() {
            var win = jasmine.createSpy(),
                fail = jasmine.createSpy();

            expect(function() {
                FileTransfer.download(null, null, win, fail);
            }).toThrow();
            expect(function() {
                FileTransfer.download(undefined, undefined, win, fail);
            }).toThrow();
            expect(function() {
                FileTransfer.download(null, undefined, win, fail);
            }).toThrow();
            expect(function() {
                FileTransfer.download(undefined, null, win, fail);
            }).toThrow();
            expect(function() {
                FileTransfer.download("test.txt", undefined, win, fail);
            }).toThrow();
            expect(function() {
                FileTransfer.download(undefined, "http://google.com/robots.txt", win, fail);
            }).toThrow();
        });
    });

    describe("upload", function() {
        it("should throw an exception if filePath or server is not defined", function() {
            var win = jasmine.createSpy(),
                fail = jasmine.createSpy();

            expect(function() {
                FileTransfer.upload(null, null, win, fail);
            }).toThrow();
            expect(function() {
                FileTransfer.upload(undefined, undefined, win, fail);
            }).toThrow();
            expect(function() {
                FileTransfer.upload(null, undefined, win, fail);
            }).toThrow();
            expect(function() {
                FileTransfer.upload(undefined, null, win, fail);
            }).toThrow();
            expect(function() {
                FileTransfer.upload("test.txt", undefined, win, fail);
            }).toThrow();
            expect(function() {
                FileTransfer.upload(undefined, "http://google.com/robots.txt", win, fail);
            }).toThrow();
        });
    });
});
