module.exports = {
  id: "android",
  initialize:function() {
    var channel = require("phonegap/channel"),
        phonegap = require('phonegap'),
        callback = require('phonegap/plugin/android/callback'),
        polling = require('phonegap/plugin/android/polling'),
        exec = require('phonegap/exec');

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

    // Inject a listener for the backbutton on the document.
    var backButtonChannel = phonegap.addDocumentEventHandler('backbutton', {
      onSubscribe:function() {
        // If we just attached the first handler, let native know we need to override the back button.
        if (this.handlers.length === 1) {
          exec(null, null, "App", "overrideBackbutton", [true]);
        }
      },
      onUnsubscribe:function() {
        // If we just detached the last handler, let native know we no longer override the back button.
        if (this.handlers.lenght === 0) {
          exec(null, null, "App", "overrideBackbutton", [false]);
        }
      }
    });

    // Let native code know we are all done on the JS side.
    // Native code will then un-hide the WebView.
    channel.join(function() {
      prompt("", "gap_init:");
    }, [channel.onPhoneGapReady]);
  },
  objects: {
    PhoneGap: {
      children: {
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
        }
      }
    },
    device:{
      path: "phonegap/plugin/android/device"
    }
  }
};
