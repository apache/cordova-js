module.exports = {
  id: "android",
  initialize:function() {
    var channel = require("phonegap/channel"),
        phonegap = require('phonegap'),
        callback = require('phonegap/plugin/android/callback'),
        polling = require('phonegap/plugin/android/polling');

    channel.onDestroy.subscribe(function() {
      phonegap.shuttingDown = true;
    });

    // Start listening for XHR callbacks
    // Figure out which bridge approach will work on this Android
    // device: polling or XHR-based callbacks
    setTimeout(function() {
      if (phonegap.UsePolling) {
        polling();
      }
      else {
        var isPolling = prompt("usePolling", "gap_callbackServer:");
        phonegap.UsePolling = isPolling;
        if (isPolling == "true") {
          phonegap.UsePolling = true;
          polling();
        } else {
          phonegap.UsePolling = false;
          callback();
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
          path: "phonegap/exec"
        },
        JSCallback:{
          path:"phonegap/plugin/android/callback"
        },
        JSCallbackPolling:{
          path:"phonegap/plugin/android/polling"
        }
      }
    },
    navigator: {
      children: {
        device: {
          path: "phonegap/plugin/android/device"
        },
        app:{
          path: "phonegap/plugin/android/app"
        },
        battery: {
          path: "phonegap/plugin/android/battery"
        }
      }
    },
    device:{
      path: "phonegap/plugin/android/device"
    }
  }
};
