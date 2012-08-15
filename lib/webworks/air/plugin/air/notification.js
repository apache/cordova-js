var cordova = require('cordova');

module.exports = {
    alert: function (args, win, fail) {
        if (args.length !== 3) {
            return {"status" : 9, "message" : "Notification action - alert arguments not found"};
        }

        //Unpack and map the args
        var msg = args[0],
            title = args[1],
            btnLabel = args[2];

        blackberry.ui.dialog.customAskAsync.apply(this, [ msg, [ btnLabel ], win, { "title" : title } ]);
        return { "status" : cordova.callbackStatus.NO_RESULT, "message" : "WebWorks Is On It" };
    },
    confirm: function (args, win, fail) {
        if (args.length !== 3) {
            return {"status" : 9, "message" : "Notification action - confirm arguments not found"};
        }

        //Unpack and map the args
        var msg = args[0],
            title = args[1],
            btnLabel = args[2],
            btnLabels = btnLabel.split(",");

        blackberry.ui.dialog.customAskAsync.apply(this, [msg, btnLabels, win, {"title" : title} ]);
        return { "status" : cordova.callbackStatus.NO_RESULT, "message" : "WebWorks Is On It" };
    }
};
