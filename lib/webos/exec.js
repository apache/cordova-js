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

var plugins = {
    "Device": require('cordova/plugin/webos/device'),
    "NetworkStatus": require('cordova/plugin/webos/network'),
    "Compass": require('cordova/plugin/webos/compass'),
    "Camera": require('cordova/plugin/webos/camera'),
    "Accelerometer" : require('cordova/plugin/webos/accelerometer'),
    "Notification" : require('cordova/plugin/webos/notification'),
    /*"File" : require('cordova/plugin/webos/filereader'),*/
    "Geolocation": require('cordova/plugin/webos/geolocation')     
};

module.exports = function(success, fail, service, action, args) {
    try {
    	console.error("exec:call plugin:"+service+":"+action);
       	plugins[service][action](success, fail, args);
    }
    catch(e) {
        console.error("missing exec: " + service + "." + action);
        console.error(args);
        console.error(e);
        console.error(e.stack);
    }
};