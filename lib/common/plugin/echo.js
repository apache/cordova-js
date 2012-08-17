var exec = require('cordova/exec');

/**
 * Sends the given message through exec() to the Echo plugink, which sends it back to the successCallback.
 * @param successCallback  invoked with a FileSystem object
 * @param errorCallback  invoked if error occurs retrieving file system
 * @param message  The string to be echoed.
 * @param forceAsync  Whether to force an async return value (for testing native->js bridge).
 */
module.exports = function(successCallback, errorCallback, message, forceAsync) {
    var action = forceAsync ? 'echoAsync' : 'echo';
    exec(successCallback, errorCallback, "Echo", action, [message]);
};

