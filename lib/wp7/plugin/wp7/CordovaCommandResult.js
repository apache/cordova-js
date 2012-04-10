
var cordova = require('cordova');
var channel = require('cordova/channel');

// singular WP7 callback function attached to window, status is used to determin if it is a success or error
module.exports = function(status,callbackId,args,cast) {

	if(status === "backbutton") {
		cordova.fireDocumentEvent("backbutton");
		return "true";
	} 
	else if(status === "resume") {
		channel.onResume.fire();
		return "true";
	} 
	else if(status === "pause") {
		channel.onPause.fire();
		return "true";  
	}
	
	var parsedArgs;
	try
	{
		parsedArgs = JSON.parse(args);
		
	}
	catch(ex)
	{
		console.log("Parse error in CordovaCommandResult :: " + ex);
		return;
	}
	
	try
	{
		// For some commands, the message is a JSON encoded string
		// and other times, it is just a string, the try/catch handles the 
		// case where message was indeed, just a string.
		parsedArgs.message = JSON.parse(parsedArgs.message);
	}
	catch(ex)
	{

	}
	var safeStatus = parseInt(status, 10);
	if(safeStatus === cordova.callbackStatus.NO_RESULT ||
	   safeStatus === cordova.callbackStatus.OK) {
		cordova.callbackSuccess(callbackId,parsedArgs,cast);
	}
	else {
		cordova.callbackError(callbackId,parsedArgs,cast);
	}
};


