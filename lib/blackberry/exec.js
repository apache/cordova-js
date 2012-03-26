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
var blackberry = require('cordova/plugin/blackberry/manager'),
    cordova = require('cordova'),
    utils = require('cordova/utils');

module.exports = function(success, fail, service, action, args) {
    try {
        var v = blackberry.exec(success, fail, service, action, args);

        // If status is OK, then return value back to caller
        if (v.status == cordova.callbackStatus.OK) {

            // If there is a success callback, then call it now with returned value
            if (success) {
                try {
                    success(v.message);
                }
                catch (e) {
                    console.log("Error in success callback: "+ service + "." + action + " = "+e);
                }

            }
            return v.message;
        } else if (v.status == cordova.callbackStatus.NO_RESULT) {

        } else {
            // If error, then display error
            console.log("Error: " + service + "." + action + " Status="+v.status+" Message="+v.message);

            // If there is a fail callback, then call it now with returned value
            if (fail) {
                try {
                    fail(v.message);
                }
                catch (e) {
                    console.log("Error in error callback: " + service + "." + action + " = "+e);
                }
            }
            return null;
        }
    } catch (e) {
        utils.alert("Error: "+e);
    }
};
