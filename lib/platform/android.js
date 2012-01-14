module.exports = {
    id: "android",
    initialize:function() {
      var channel = require("phonegap/channel");
      channel.onDestroy.subscribe(function() {
        PhoneGap.shuttingDown = true;
      });

      // Start listening for XHR callbacks
      setTimeout(function() {
        if (PhoneGap.UsePolling) {
          PhoneGap.JSCallbackPolling();
        }
        else {
          var polling = prompt("usePolling", "gap_callbackServer:");
          PhoneGap.UsePolling = polling;
          if (polling == "true") {
            PhoneGap.UsePolling = true;
            PhoneGap.JSCallbackPolling();
          }
          else {
            PhoneGap.UsePolling = false;
            PhoneGap.JSCallback();
          }
        }
      }, 1);

      // Let native code know we are all done on the JS side.
      // Native code will then un-hide the WebView.
      channel.join(function() {
        prompt("", "gap_init:");
      }, [channel.onPhoneGapReady]);
    },
    objects: {
        PhoneGap: {
            path: "phonegap",
            children: {
                exec: {
                    path: "phonegap/exec/android"
                },
                JSCallback:{
                  path:"phonegap/plugin/android/callback"
                },
                JSCallbackPolling:{
                  path:"phonegap/plugin/android/callbackpolling"
                }
            }
        },
        navigator: {
          children: {
            device: {
                path: "phonegap/plugin/android/device"
            }
          }
        },
        device:{
          path: "phonegap/plugin/android/device"
        }
    }
};
