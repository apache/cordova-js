

var cordova = require('cordova');

module.exports = {
	// singular WP7 callback function attached to window, status is used to determin if it is a success or error
	CordovaCommandResult:function(status,callbackId,args,cast) {
		if(status === "backbutton") {
			cordova.fireEvent(document,"backbutton");
			return "true";
		} 
		else if(status === "resume") {
			cordova.onResume.fire();
			return "true";
		} 
		else if(status === "pause") {
		
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
	}

}