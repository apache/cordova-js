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
    // generate a new command string, ex. DebugConsole/log/DebugConsole23/{"message":"wtf dude?"}
     var command = service + "/" + action + "/" + callbackId + "/" + JSON.stringify(args);
     // pass it on to Notify
     window.external.Notify(command);
};

// TODO: is this what native side invokes?
// if so pluginize under plugin/wp7
cordovaCommandResult = function(status,callbackId,args,cast) {
    if(status === "backbutton") {

        cordova.fireEvent(document,"backbutton");
        return "true";

    } else if(status === "resume") {

        cordova.onResume.fire();
        return "true";

    } else if(status === "pause") {

        cordova.onPause.fire();
        return "true";  
    }
    
    var safeStatus = parseInt(status, 10);
    if(safeStatus === cordova.callbackStatus.NO_RESULT ||
       safeStatus === cordova.callbackStatus.OK) {
        cordova.CallbackSuccess(callbackId,args,cast);
    }
    else
    {
        cordova.CallbackError(callbackId,args,cast);
    }
};
