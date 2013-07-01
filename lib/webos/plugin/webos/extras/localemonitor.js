//* Monitors the for locale changes and emitts a document event is occurring.

var service = require('cordova/plugin/webos/service');

//locale monitor subscription
module.exports = {
    start: function() {
        if(!this.request) {
            this.request = service.Request('palm://com.palm.systemservice', {
            method: 'getPreferences',
            parameters: {
                keys: ["localeInfo"],
            },
            onSuccess: function (inResponse) {
                if(inResponse.localeInfo) {
                    if(navigator.localeInfo) {
                        if((navigator.localeInfo.locales.UI !== inResponse.localeInfo.locales.UI) ||
                                (navigator.localeInfo.timezone !== inResponse.localeInfo.timezone) ||
                                (navigator.localeInfo.clock !== inResponse.localeInfo.clock)) {
                            cordova.fireDocumentEvent("localechange");
                        }
                    }
                    navigator.localeInfo = inResponse.localeInfo;
                }
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
    }
};

document.addEventListener("deviceready", function() {
    module.exports.start();
});