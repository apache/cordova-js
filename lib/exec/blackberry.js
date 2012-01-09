/**
 * Execute a PhoneGap command.  It is up to the native side whether this action
 * is synchronous or asynchronous.  The native side can return:
 *      Synchronous: PluginResult object as a JSON string
 *      Asynchrounous: Empty string ""
 * If async, the native side will PhoneGap.callbackSuccess or PhoneGap.callbackError,
 * depending upon the result of the action.
 *
 * @param {Function} success    The success callback
 * @param {Function} fail       The fail callback
 * @param {String} service      The name of the service to use
 * @param {String} action       Action to be run in PhoneGap
 * @param {String[]} [args]     Zero or more arguments to pass to the method
 */

module.exports = function(success, fail, service, action, args) {
    try {
        var v = phonegap.PluginManager.exec(success, fail, service, action, args);

        // If status is OK, then return value back to caller
        if (v.status == PhoneGap.callbackStatus.OK) {

            // If there is a success callback, then call it now with returned value
            if (success) {
                try {
                    success(v.message);
                }
                catch (e) {
                    console.log("Error in success callback: "+callbackId+" = "+e);
                }

            }
            return v.message;
        } else if (v.status == PhoneGap.callbackStatus.NO_RESULT) {

        } else {
            // If error, then display error
            console.log("Error: Status="+v.status+" Message="+v.message);

            // If there is a fail callback, then call it now with returned value
            if (fail) {
                try {
                    fail(v.message);
                }
                catch (e) {
                    console.log("Error in error callback: "+callbackId+" = "+e);
                }
            }
            return null;
        }
    } catch (e) {
        console.log("Error: "+e);
    }
};
