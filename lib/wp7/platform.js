module.exports = {
    id: "wp7",
    initialize:function() {
		
		console.log("wp7 initialize");
		console.log("window.CordovaCommandResult = " + window.CordovaCommandResult);
		//cordova.require("cordova/channel").onNativeReady.fire();
	},
    objects: {
		CordovaCommandResult: {
			path:"cordova/plugin/wp7/CordovaCommandResult"
		},
        navigator: {
            children: {
                device: {
                    path: "cordova/plugin/wp7/device"
                }
            }
        }
    }
};


