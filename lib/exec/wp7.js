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
module.exports = function(success, fail, service, action, args) 
{
    var callbackId = service + PhoneGap.callbackId++;
    if (typeof success == "function" || typeof fail == "function") {
        PhoneGap.callbacks[callbackId] = {success:success, fail:fail};
    }
    // generate a new command string, ex. DebugConsole/log/DebugConsole23/{"message":"wtf dude?"}
     var command = service + "/" + action + "/" + callbackId + "/" + JSON.stringify(args);
     // pass it on to Notify
     window.external.Notify(command);
};

PhoneGapCommandResult = function(status,callbackId,args,cast)
{
	if(status === "backbutton") {

		PhoneGap.fireEvent(document,"backbutton");
		return "true";

	} else if(status === "resume") {

		PhoneGap.onResume.fire();
		return "true";

	} else if(status === "pause") {

		PhoneGap.onPause.fire();
		return "true";	
	}
	
	var safeStatus = parseInt(status);
	if(safeStatus === PhoneGap.callbackStatus.NO_RESULT ||
	   safeStatus === PhoneGap.callbackStatus.OK) {
		PhoneGap.CallbackSuccess(callbackId,args,cast);
	}
	else
	{
		PhoneGap.CallbackError(callbackId,args,cast);
	}
};