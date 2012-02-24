module.exports = {
    id: "wp7",
    initialize:function() {},
    objects: {
		cordova: {
			children: {
				CordovaCommandResult: {
					path:"cordova/plugin/wp7/cordovaCommandResult"
				}
			}
		},
        navigator: {
            children: {
                device: {
                    path: "cordova/plugin/wp7/device"
                }
            }
        },
        device: {
            path: 'cordova/plugin/wp7/device'
        }
    }
};


