module.exports = {
  id: "android",
  initialize:function() {
    var channel = require("cordova/channel"),
        cordova = require('cordova'),
        callback = require('cordova/plugin/android/callback'),
        polling = require('cordova/plugin/android/polling'),
        exec = require('cordova/exec');

    channel.onDestroy.subscribe(function() {
      cordova.shuttingDown = true;
    });

    // Start listening for XHR callbacks
    // Figure out which bridge approach will work on this Android
    // device: polling or XHR-based callbacks
    setTimeout(function() {
      if (cordova.UsePolling) {
        polling();
      }
      else {
        var isPolling = prompt("usePolling", "gap_callbackServer:");
        cordova.UsePolling = isPolling;
        if (isPolling == "true") {
          cordova.UsePolling = true;
          polling();
        } else {
          cordova.UsePolling = false;
          callback();
        }
      }
    }, 1);

    // Inject a listener for the backbutton on the document.
    var backButtonChannel = cordova.addDocumentEventHandler('backbutton', {
      onSubscribe:function() {
        // If we just attached the first handler, let native know we need to override the back button.
        if (this.handlers.length === 1) {
          exec(null, null, "App", "overrideBackbutton", [true]);
        }
      },
      onUnsubscribe:function() {
        // If we just detached the last handler, let native know we no longer override the back button.
        if (this.handlers.length === 0) {
          exec(null, null, "App", "overrideBackbutton", [false]);
        }
      }
    });

    // Add hardware MENU and SEARCH button handlers
    cordova.addDocumentEventHandler('menubutton');
    cordova.addDocumentEventHandler('searchbutton');

    // Let native code know we are all done on the JS side.
    // Native code will then un-hide the WebView.
    channel.join(function() {
      prompt("", "gap_init:");
    }, [channel.onCordovaReady]);

    // Figure out if we need to shim-in localStorage and WebSQL
    // support from the native side.
    var storage = require('cordova/plugin/android/storage');

    // First patch WebSQL if necessary
    if (typeof window.openDatabase == 'undefined') {
      // Not defined, create an openDatabase function for all to use!
      window.openDatabase = storage.openDatabase;
    } else {
      // Defined, but some Android devices will throw a SECURITY_ERR -
      // so we wrap the whole thing in a try-catch and shim in our own
      // if shit hits the fan.
      var originalOpenDatabase = window.openDatabase;
      window.openDatabase = function(name, version, desc, size) {
          var db = null;
          try {
              db = originalOpenDatabase(name, version, desc, size);
          } 
          catch (ex) {
              db = null;
          }

          if (db === null) {
            // TOOD: this is wrong
              setupDroidDB();
              return storage.openDatabase(name, version, desc, size);
          }
          else {
              return db;
          }
        
      };
    }

    // Patch localStorage if necessary
    if (typeof window.localStorage == 'undefined' || window.localStorage === null) {
        window.localStorage = new storage.CupCakeLocalStorage();
    }
  },
  objects: {
    cordova: {
      children: {
        JSCallback:{
          path:"cordova/plugin/android/callback"
        },
        JSCallbackPolling:{
          path:"cordova/plugin/android/polling"
        }
      }
    },
    navigator: {
      children: {
        app:{
          path: "cordova/plugin/android/app"
        }
      }
    },
    device:{
      path: "cordova/plugin/android/device"
    },
    File: { // exists natively on Android WebView, override
      path: "cordova/plugin/File"
    }
  }
};
