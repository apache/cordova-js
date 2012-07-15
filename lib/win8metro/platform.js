var cordova = require('cordova'),
    exec = require('cordova/exec'),
    channel = cordova.require("cordova/channel");
  
module.exports = {
    id: "win8metro",
    initialize:function() {

    console.log("win8metro initialize");
    //window.alert = require("cordova/plugin/notification").alert;

    // INject a lsitener for the backbutton, and tell native to override the flag (true/false) when we have 1 or more, or 0, listeners
    // var backButtonChannel = cordova.addDocumentEventHandler('backbutton', {
    //   onSubscribe:function() {
    //     if (this.numHandlers === 1) {
    //         exec(null, null, "CoreEvents", "overridebackbutton", [true]);
    //     }
    //   },
    //   onUnsubscribe:function() {
    //     if (this.numHandlers === 0) {
    //       exec(null, null, "CoreEvents", "overridebackbutton", [false]);
    //     }
    //   }
    // });

    },
    objects: {
        navigator: {
            children: {
                device: {
                    path: "cordova/plugin/device",
                    children:{
                        capture:{
                            path:"cordova/plugin/capture"
                        }
                    }
                },
                console: {
                    path: "cordova/plugin/win8metro/console"

                }
            }
        },
        device:{
          path:"cordova/plugin/win8metro/device"
        }
        // ,
        // console:{
        //   path: "cordova/plugin/win8metro/console"
        // }
    }
};