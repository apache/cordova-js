/**
 * Execute a cordova command.  It is up to the native side whether this action
 * is synchronous or asynchronous.  The native side can return:
 *      Synchronous: PluginResult object as a JSON string
 *      Asynchrounous: Empty string ""
 * If async, the native side will cordova.callbackSuccess or cordova.callbackError,
 * depending upon the result of the action.
 *
 * @param {Function} success    The success callback
 * @param {Function} fail       The fail callback
 * @param {String} service      The name of the service to use
 * @param {String} action       Action to be run in cordova
 * @param {String[]} [args]     Zero or more arguments to pass to the method
 */
var cordova = require('cordova'),
    callback = require('cordova/plugin/android/callback'),
    polling = require('cordova/plugin/android/polling'),
    jsToNativeBridgeMode,
    nativeToJsBridgeMode,
    jsToNativeModes = {
        PROMPT: 0,
        JS_OBJECT: 1,
        LOCATION_CHANGE: 2  // Not yet implemented
    },
    nativeToJsModes = {
        // Polls for messages using the prompt() bridge.
        POLLING: 0,
        // Does an XHR to a local server, which will send back messages. This is
        // broken on ICS when a proxy server is configured.
        HANGING_GET: 1,
        // For LOAD_URL to be viable, it would need to have a work-around for
        // the bug where the soft-keyboard gets dismissed when a message is sent.
        LOAD_URL: 2,
        // For the ONLINE_EVENT to be viable, it would need to intercept all event
        // listeners (both through addEventListener and window.ononline) as well
        // as set the navigator property itself.
        ONLINE_EVENT: 3,
        // Uses reflection to access private APIs of the WebView that can send JS
        // to be executed.
        // Requires Android 3.2.4 or above.
        PRIVATE_API: 4
    };

function androidExec(success, fail, service, action, args) {
    // Set default bridge modes if they have not already been set.
    if (jsToNativeBridgeMode === undefined) {
        androidExec.setJsToNativeBridgeMode(jsToNativeModes.PROMPT);
    }
    if (nativeToJsBridgeMode === undefined) {
        if (callback.isAvailable()) {
            androidExec.setNativeToJsBridgeMode(nativeToJsModes.HANGING_GET);
        } else {
            androidExec.setNativeToJsBridgeMode(nativeToJsModes.POLLING);
        }
    }
    try {
      var callbackId = service + cordova.callbackId++,
          argsJson = JSON.stringify(args),
          result;
      if (success || fail) {
          cordova.callbacks[callbackId] = {success:success, fail:fail};
      }

      if (jsToNativeBridgeMode == jsToNativeModes.JS_OBJECT) {
          // Explicit cast to string is required on Android 2.1 to convert from
          // a Java string to a JS string.
          result = '' + _cordovaExec.exec(service, action, callbackId, argsJson);
      } else {
          result = prompt(argsJson, "gap:"+JSON.stringify([service, action, callbackId, true]));
      }

      // If a result was returned
      if (result.length > 0) {
          var v = JSON.parse(result);

          // If status is OK, then return value back to caller
          if (v.status === cordova.callbackStatus.OK) {

              // If there is a success callback, then call it now with
              // returned value
              if (success) {
                  try {
                      success(v.message);
                  } catch (e) {
                      console.log("Error in success callback: " + callbackId  + " = " + e);
                  }

                  // Clear callback if not expecting any more results
                  if (!v.keepCallback) {
                      delete cordova.callbacks[callbackId];
                  }
              }
              return v.message;
          }

          // If no result
          else if (v.status === cordova.callbackStatus.NO_RESULT) {
              // Clear callback if not expecting any more results
              if (!v.keepCallback) {
                  delete cordova.callbacks[callbackId];
              }
          }

          // If error, then display error
          else {
              console.log("Error: Status="+v.status+" Message="+v.message);

              // If there is a fail callback, then call it now with returned value
              if (fail) {
                  try {
                      fail(v.message);
                  }
                  catch (e1) {
                      console.log("Error in error callback: "+callbackId+" = "+e1);
                  }

                  // Clear callback if not expecting any more results
                  if (!v.keepCallback) {
                      delete cordova.callbacks[callbackId];
                  }
              }
              return null;
          }
      }
    } catch (e2) {
      console.log("Error: "+e2);
    }
};

function onOnLineEvent(e) {
    while (polling.pollOnce());
}

androidExec.jsToNativeModes = jsToNativeModes;
androidExec.nativeToJsModes = nativeToJsModes;

androidExec.setJsToNativeBridgeMode = function(mode) {
    if (mode == jsToNativeModes.JS_OBJECT && !window._cordovaExec) {
        console.log('Falling back on PROMPT mode since _cordovaExec is missing.');
        mode = jsToNativeModes.PROMPT;
    }
    jsToNativeBridgeMode = mode;
};

androidExec.setNativeToJsBridgeMode = function(mode) {
    if (mode == nativeToJsBridgeMode) {
        return;
    }
    if (nativeToJsBridgeMode == nativeToJsModes.POLLING) {
        polling.stop();
    } else if (nativeToJsBridgeMode == nativeToJsModes.HANGING_GET) {
        callback.stop();
    } else if (nativeToJsBridgeMode == nativeToJsModes.ONLINE_EVENT) {
        window.removeEventListener('online', onOnLineEvent, false);
        window.removeEventListener('offline', onOnLineEvent, false);
    }

    nativeToJsBridgeMode = mode;
    // Tell the native side to switch modes.
    prompt(mode, "gap_bridge_mode:");

    if (mode == nativeToJsModes.POLLING) {
        polling.start();
    } else if (mode == nativeToJsModes.HANGING_GET) {
        callback.start();
    } else if (mode == nativeToJsModes.ONLINE_EVENT) {
        window.addEventListener('online', onOnLineEvent, false);
        window.addEventListener('offline', onOnLineEvent, false);
    }
};

module.exports = androidExec;
