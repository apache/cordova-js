module.exports = {
    id: "wp7",
    initialize:function() {
		
		//window.Cordova = window.cordova;
			
		
	},
    objects: {
		cordova: {
			children: {
				
				CordovaCommandResult: {
					path:"cordova/plugin/wp7/CordovaCommandResult"
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


