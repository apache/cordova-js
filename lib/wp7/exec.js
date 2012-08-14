var cordova = require('cordova');

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

module.exports = function(success, fail, service, action, args) {

    var callbackId = service + cordova.callbackId++;
    if (typeof success == "function" || typeof fail == "function") {
        cordova.callbacks[callbackId] = {success:success, fail:fail};
    }
    // generate a new command string, ex. DebugConsole/log/DebugConsole23/["wtf dude?"]
    for(var n = 0; n < args.length; n++)
    {
        if(typeof args[n] !== "string")
        {
            args[n] = JSON.stringify(args[n]);
        }
    }
    var command = service + "/" + action + "/" + callbackId + "/" + JSON.stringify(args);
    // pass it on to Notify
    try {
        if(window.external) {
            window.external.Notify(command);
        }
        else {
            console.log("window.external not available :: command=" + command);
        }
    }
    catch(e) {
        console.log("Exception calling native with command :: " + command + " :: exception=" + e);
    }
};

