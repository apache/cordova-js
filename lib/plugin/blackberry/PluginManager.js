/*
 * PhoneGap is available under *either* the terms of the modified BSD license *or* the
 * MIT License (2008). See http://opensource.org/licenses/alphabetical for full text.
 *
 * Copyright (c) 2011, Research In Motion Limited.
 */
if (!window.phonegap) { window.phonegap = {}; }

var PluginManager = (function () {
    "use strict";

    var retInvalidAction = { "status" : PhoneGap.callbackStatus.INVALID_ACTION, "message" : "Action not found" },

        loggerAPI = {
            execute: function (webWorksResult, action, args, win, fail) {
                switch (action) {
                case 'log':
                    com.phonegap.Logger.log(args);
                    return {"status" : PhoneGap.callbackStatus.OK,
                            "message" : 'Message logged to console: ' + args};
                }
                return retInvalidAction;
            }
        },
        plugins = {'Logger': loggerAPI};

    phonegap.BlackBerryPluginManager = function () {
    };

    phonegap.BlackBerryPluginManager.prototype.exec = function (win, fail, clazz, action, args) {
        var result = phonegap.WebWorksPluginManager.exec(win, fail, clazz, action, args);

        //We got a sync result or a not found from WW that we can pass on to get a native mixin
        //For async calls there's nothing to do
        if (result.status === PhoneGap.callbackStatus.CLASS_NOT_FOUND_EXCEPTION  ||
                result.status === PhoneGap.callbackStatus.INVALID_ACTION ||
                result.status === PhoneGap.callbackStatus.OK) {
            if (plugins[clazz]) {
                return plugins[clazz].execute(result.message, action, args, win, fail);
            } else {
                result = this.subExec(win, fail, clazz, action, args);
            }
        }

        return result;
    };

    phonegap.BlackBerryPluginManager.prototype.subExec = function (win, fail, clazz, action, args) {
        var callbackId = clazz + PhoneGap.callbackId++,
            origResult,
            evalResult,
            execResult;

        try {

            if (win || fail) {
                PhoneGap.callbacks[callbackId] = {success: win, fail: fail};
            }

            // Note: Device returns string, but for some reason emulator returns object - so convert to string.
            origResult = "" + com.phonegap.JavaPluginManager.exec(clazz, action, callbackId, JSON.stringify(args), true);

            // If a result was returned
            if (origResult.length > 0) {
                eval("evalResult = " + origResult + ";");

                // If status is OK, then return evalResultalue back to caller
                if (evalResult.status === PhoneGap.callbackStatus.OK) {

                    // If there is a success callback, then call it now with returned evalResultalue
                    if (win) {
                        // Clear callback if not expecting any more results
                        if (!evalResult.keepCallback) {
                            delete PhoneGap.callbacks[callbackId];
                        }
                    }
                } else if (evalResult.status === PhoneGap.callbackStatus.NO_RESULT) {

                    // Clear callback if not expecting any more results
                    if (!evalResult.keepCallback) {
                        delete PhoneGap.callbacks[callbackId];
                    }
                } else {
                    console.log("Error: Status=" + evalResult.status + " Message=" + evalResult.message);

                    // If there is a fail callback, then call it now with returned evalResultalue
                    if (fail) {

                        // Clear callback if not expecting any more results
                        if (!evalResult.keepCallback) {
                            delete PhoneGap.callbacks[callbackId];
                        }
                    }
                }
                execResult = evalResult;
            } else {
                // Asynchronous calls return an empty string. Return a NO_RESULT
                // status for those executions.
                execResult = {"status" : PhoneGap.callbackStatus.NO_RESULT,
                        "message" : ""};
            }
        } catch (e) {
            console.log("BlackBerryPluginManager Error: " + e);
            execResult = {"status" : PhoneGap.callbackStatus.ERROR,
                          "message" : e.message};
        }

        return execResult;
    };

    phonegap.BlackBerryPluginManager.prototype.resume = com.phonegap.JavaPluginManager.resume;
    phonegap.BlackBerryPluginManager.prototype.pause = com.phonegap.JavaPluginManager.pause;
    phonegap.BlackBerryPluginManager.prototype.destroy = com.phonegap.JavaPluginManager.destroy;

    //Instantiate it
    return new phonegap.BlackBerryPluginManager();
}());

module.exports = PluginManager;

//HACK: this shouldn't go here but we need to and I am so sorry ;)
window.phonegap.PluginManager = PluginManager;
