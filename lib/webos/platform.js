module.exports = {
    id: "webos",
    initialize: function() {
        if (window.PalmSystem) {
            window.PalmSystem.stageReady();
        }
        Mojo = window.Mojo || {};
        Mojo.stageActivated = function() {
			console.error("stageActivated");
		}
    },
    objects: {
        requestFileSystem:{
            path: 'cordova/plugin/webos/requestfilesystem'
        },
        FileReader: {
            path: "cordova/plugin/webos/filereader"
        }
    },
    merges: {
        navigator: {
            children: {
            	service: {
					path: "cordova/plugin/webos/service"
            	},
                application: {
                    path: "cordova/plugin/webos/application"
                },
                window: {
                    path: "cordova/plugin/webos/window"	
                },
                notification: {
                	path: "cordova/plugin/webos/notification"	
                },
                orientation: {
                	path: "cordova/plugin/webos/orientation"
                },
                keyboard: {
                	path: "cordova/plugin/webos/keyboard"
                }
            }
        }
    }
};
