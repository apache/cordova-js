var cordova = require('cordova'),
    exec = require('cordova/exec'),
    channel = cordova.require("cordova/channel");

module.exports = {
    id: "win8metro",
    initialize:function() {

    },
    objects: {
        navigator: {
            children: {
                device: {
                    path:"cordova/plugin/win8metro/device",
                    children:{
                        capture:{
                            path:"cordova/plugin/capture"
                        }
                    }
                },
                console: {
                    path: "cordova/plugin/win8metro/console"

                },
                notification: {
                    path: 'cordova/plugin/notification'
                }
            }

        }
    }
};
