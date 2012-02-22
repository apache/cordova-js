var webworks = require('cordova/plugin/webworks/manager'),
    Cordova = require('cordova'),
    plugins = {};

function _exec(win, fail, clazz, action, args) {
    var callbackId = clazz + Cordova.callbackId++,
        origResult,
        evalResult,
        execResult;

    try {

        if (win || fail) {
            Cordova.callbacks[callbackId] = {success: win, fail: fail};
        }

        // Note: Device returns string, but for some reason emulator returns object - so convert to string.
        origResult = "" + org.apache.cordova.JavaPluginManager.exec(clazz, action, callbackId, JSON.stringify(args), true);

        // If a result was returned
        if (origResult.length > 0) {
            eval("evalResult = " + origResult + ";");

            // If status is OK, then return evalResultalue back to caller
            if (evalResult.status === Cordova.callbackStatus.OK) {

                // If there is a success callback, then call it now with returned evalResultalue
                if (win) {
                    // Clear callback if not expecting any more results
                    if (!evalResult.keepCallback) {
                        delete Cordova.callbacks[callbackId];
                    }
                }
            } else if (evalResult.status === Cordova.callbackStatus.NO_RESULT) {

                // Clear callback if not expecting any more results
                if (!evalResult.keepCallback) {
                    delete Cordova.callbacks[callbackId];
                }
            } else {
                // If there is a fail callback, then call it now with returned evalResultalue
                if (fail) {

                    // Clear callback if not expecting any more results
                    if (!evalResult.keepCallback) {
                        delete Cordova.callbacks[callbackId];
                    }
                }
            }
            execResult = evalResult;
        } else {
            // Asynchronous calls return an empty string. Return a NO_RESULT
            // status for those executions.
            execResult = {"status" : Cordova.callbackStatus.NO_RESULT,
                    "message" : ""};
        }
    } catch (e) {
        console.log("BlackBerryPluginManager Error: " + e);
        execResult = {"status" : Cordova.callbackStatus.ERROR,
                      "message" : e.message};
    }

    return execResult;
}

module.exports = {
    exec: function (win, fail, clazz, action, args) {
        var result = webworks.exec(win, fail, clazz, action, args);

        //We got a sync result or a not found from WW that we can pass on to get a native mixin
        //For async calls there's nothing to do
        if (result.status === Cordova.callbackStatus.CLASS_NOT_FOUND_EXCEPTION  ||
                result.status === Cordova.callbackStatus.INVALID_ACTION ||
                result.status === Cordova.callbackStatus.OK) {
            if (plugins[clazz]) {
                return plugins[clazz].execute(result.message, action, args, win, fail);
            } else {
                result = _exec(win, fail, clazz, action, args);
            }
        }

        return result;
    },
    resume: org.apache.cordova.JavaPluginManager.resume,
    pause: org.apache.cordova.JavaPluginManager.pause,
    destroy: org.apache.cordova.JavaPluginManager.destroy
};
