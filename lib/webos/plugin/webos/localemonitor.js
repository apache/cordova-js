//* Monitors the for locale changes and emitts a document event is occurring.

//locale monitor subscription
module.exports = {
    start: function() {
        if(!this.request) {
            this.request = service.request('palm://com.palm.systemservice', {
	        method: 'getPreferences',
	        parameters: {
	            keys: ["localeInfo"],
	        },
	        onSuccess: function (inResponse) {
	            if(navigator.localeInfo) {
		        if((navigator.localeInfo.locales.UI !== inResponse.localeInfo.locales.UI) ||
			        (navigator.localeInfo.timezone !== inResponse.localeInfo.timezone) ||
			        (navigator.localeInfo.clock !== inResponse.localeInfo.clock)) {
		            cordova.fireDocumentEvent("localechange");
		        }
	            }
	            navigator.localeInfo = inResponse.localeInfo;
	        },
	        onFailure: function(inError) {
	            console.error("Locale monitor subscribe:error");
	        },
	        subscribe: true,
	        resubscribe: true
            })
        };
    },
    stop: function() {
        if(this.request) {
	    this.request.cancel();
            this.request = undefined;
        }
    },
    init: function() {
        
    }
    
};

document.addEventListener("deviceready", function () {
    module.exports.start();
    document.addEventListener("resume", module.exports.start);
    document.addEventListener("pause", module.exports.stop);
}