var cordova = require('cordova');

module.exports = {
    download: function (args, win, fail) {
        var source = args[0],
            target = args[1];

        blackberry.io.filetransfer.download(source, target, win, fail);
        return { "status" : cordova.callbackStatus.NO_RESULT, "message" : "async"};
    },

    upload: function (args, win, fail) {
        var path = args[0],
            server = args[1],
            options = {
                fileKey: args[2],
                fileName: args[3],
                mimeType: args[4],
                params: args[5],
                chunkedMode: args[6]
            };

        blackberry.io.filetransfer.upload(path, server, win, fail, options);
        return { "status" : cordova.callbackStatus.NO_RESULT, "message" : "async"};
    }
};
