module.exports = {
    id: "wp7",
    initialize:function() {},
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
        },
        device:{
          path:"cordova/plugin/wp7/device"
        },
        console:{
          path: "cordova/plugin/wp7/console"
        }
    }
};


