var cordova = require('cordova'),
    exec = require('cordova/exec'),
    channel = cordova.require("cordova/channel");

module.exports = {
    id: "windows8",
    initialize:function() {

    },
    objects: {
        navigator: {
            children: {
                device: {
                    path:"cordova/plugin/windows8/device",
                    children:{
                        capture:{
                            path:"cordova/plugin/capture"
                        }
                    }
                },
                console: {
                    path: "cordova/plugin/windows8/console"
                }
            }
        }

    },
    merges: {
        file: {
            path: 'cordova/plugin/windows8/file'
        },
        navigator: {
            children: {
                geolocation: {
                    path: 'cordova/plugin/windows8/geolocation'
                }
            }
        }
    }
};
