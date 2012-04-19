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
var cordova = require('cordova');

module.exports = function(success, fail, service, action, args) {
  try {
    var callbackId = service + cordova.callbackId++;
    if (success || fail) {
        cordova.callbacks[callbackId] = {success:success, fail:fail};
    }

    var r = prompt(JSON.stringify(args), "gap:"+JSON.stringify([service, action, callbackId, true]));

    // If a result was returned
    if (r.length > 0) {
        var v;
        eval("v="+r+";");

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
