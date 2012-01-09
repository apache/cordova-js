(function (context) {
    var channel = require("phonegap/channel"),
        /**
         * PhoneGap Channels that must fire before "deviceready" is fired.
         */ 
        deviceReadyChannelsArray = [channel.onPhoneGapReady, channel.onPhoneGapInfoReady, channel.onPhoneGapConnectionReady],
        deviceReadyChannelsMap = {},
        _self = {    

            boot: function () {
                //---------------
                // Event handling
                //---------------

                /**
                 * Listen for DOMContentLoaded and notify our channel subscribers.
                 */ 
                document.addEventListener('DOMContentLoaded', function() {
                    channel.onDOMContentLoaded.fire();
                }, false);

                /**
                 * Intercept calls to document.addEventListener and handle deviceready,
                 * resume, and pause events.
                 */
                var m_document_addEventListener = document.addEventListener;

                document.addEventListener = function(evt, handler, capture) {
                    var e = evt.toLowerCase();
                    if (e == 'deviceready') {
                        channel.onDeviceReady.subscribeOnce(handler);
                    } else if (e == 'resume') {
                        channel.onResume.subscribe(handler);
                        // if subscribing listener after event has already fired, invoke the handler
                        if (onResume.fired && handler instanceof Function) {
                            handler();
                        }
                    } else if (e == 'pause') {
                        channel.onPause.subscribe(handler);
                    } else {
                        m_document_addEventListener.call(document, evt, handler, capture);
                    }
                };

                /**
                 * Create all PhoneGap objects once page has fully loaded and native side is ready.
                 */
                channel.join(function() {

                    var builder = require('phonegap/builder'),
                        platform = require('phonegap/platform');

                    // Call the platform-specific initialization
                    platform.initialize();

                    // Drop the platform-specific globals into the window object.
                    builder.build(platform.objects).into(window);

                    // Fire event to notify that all objects are created
                    channel.onPhoneGapReady.fire();

                    // Fire onDeviceReady event once all constructors have run and 
                    // PhoneGap info has been received from native side.
                    channel.join(function() {
                        channel.onDeviceReady.fire();
                        
                        // Fire the onresume event, since first one happens before JavaScript is loaded
                        channel.onResume.fire();
                    }, deviceReadyChannelsArray);
                    
                }, [ channel.onDOMContentLoaded, channel.onNativeReady ]);
            }
        };

    // _nativeReady is global variable that the native side can set
    // to signify that the native code is ready. It is a global since 
    // it may be called before any PhoneGap JS is ready.
    if (window._nativeReady) {
        channel.onNativeReady.fire(); 
        _self.boot();
    }

}(window));
