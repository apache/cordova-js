var cordova = require('cordova'),
      exec = require('cordova/exec');

// specifically require the following patches :

// localStorage+SessionStorage APIs
require("cordova/plugin/wp7/DOMStorage");

// Fix XHR calls to local file-system
require("cordova/plugin/wp7/XHRPatch");


module.exports = {
    id: "wp7",
    initialize:function() {

    window.alert = require("cordova/plugin/notification").alert;

    // INject a lsitener for the backbutton, and tell native to override the flag (true/false) when we have 1 or more, or 0, listeners
    var backButtonChannel = cordova.addDocumentEventHandler('backbutton', {
      onSubscribe:function() {
        if (this.numHandlers === 1) {
            exec(null, null, "CoreEvents", "overridebackbutton", [true]);
        }
      },
      onUnsubscribe:function() {
        if (this.numHandlers === 0) {
          exec(null, null, "CoreEvents", "overridebackbutton", [false]);
        }
      }
    });
    },
    objects: {
        CordovaCommandResult: {
            path:"cordova/plugin/wp7/CordovaCommandResult"
        },
        CordovaMediaonStatus: {
            path:"cordova/plugin/wp7/CordovaMediaonStatus"
        },
        navigator: {
            children: {
                device: {
                    path: "cordova/plugin/wp7/device",
                    children:{
                        capture:{
                            path:"cordova/plugin/capture"
                        }
                    }
                },
                console: {
                    path: "cordova/plugin/wp7/console"

                }
            }
        },
        device:{
          path:"cordova/plugin/wp7/device"
        },
        console:{
          path: "cordova/plugin/wp7/console"
        },
        FileTransfer: {
            path: 'cordova/plugin/wp7/FileTransfer'
        }
    }
};