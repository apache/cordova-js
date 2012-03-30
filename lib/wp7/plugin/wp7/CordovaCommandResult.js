
console.log("CordovaComandResult is being added");
var cordova = require('cordova');
var channel = require('cordova/channel');

//module.exports = {
	// singular WP7 callback function attached to window, status is used to determin if it is a success or error
var CordovaCommandResult = function(status,callbackId,args,cast) {
		if(status === "backbutton") {
			cordova.fireEvent(document,"backbutton");
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
		
		var safeStatus = parseInt(status, 10);
		if(safeStatus === cordova.callbackStatus.NO_RESULT ||
		   safeStatus === cordova.callbackStatus.OK) {
			cordova.callbackSuccess(callbackId,args,cast);
		}
		else
		{
			cordova.callbackError(callbackId,args,cast);
		}
	};

//}

module.exports = CordovaCommandResult;
console.log("CordovaComandResult is added");