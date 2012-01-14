(function (context) {
    var channel = require("phonegap/channel"),
        /**
         * PhoneGap Channels that must fire before "deviceready" is fired.
         */ 
        deviceReadyChannelsArray = [channel.onPhoneGapReady, channel.onPhoneGapInfoReady, channel.onPhoneGapConnectionReady],
        deviceReadyChannelsMap = {},
        /**
         * Custom PhoneGap or plugin event handler map
         */
        documentEventHandler = {},
        windowEventHandler = {},
        addDocumentEventHandler = function(event, handler) {
          documentEventHandler[event] = handler;
        },
        addWindowEventHandler = function(event, handler) {
          windowEventHandler[event] = handler;
        },
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
                 * Intercept calls to addEventListener + removeEventListener and handle deviceready,
                 * resume, and pause events.
                 */
                var m_document_addEventListener = document.addEventListener;
                var m_document_removeEventListener = document.removeEventListener;
                var m_window_addEventListener = window.addEventListener;
                var m_window_removeEventListener = window.removeEventListener;

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
                    } else if (typeof documentEventHandler[e] !== 'undefined' && documentEventHandler[e](e, handler, true)) {
                       return;
                    } else {
                        m_document_addEventListener.call(document, evt, handler, capture);
                    }
                };

                window.addEventListener = function(evt, handler, capture) {
                  var e = evt.toLowerCase();
                  if (typeof windowEventHandler[e] !== 'undefined' && windowEventHandler[e](e, handler, true)) {
                    return;
                  } else {
                    m_window_addEventListener.call(window, evt, handler, capture);
                  }
                };

                document.removeEventListener = function(evt, handler, capture) {
                  var e = evt.toLowerCase();
                  // If unsubcribing from an event that is handled by a plugin
                  if (typeof documentEventHandler[e] !== "undefined" && documentEventHandler[e](e, handler, false)) {
                    return;
                  } else {
                    m_document_removeEventListener.call(document, evt, handler, capture);
                  }
                };

                window.removeEventListener = function(evt, handler, capture) {
                  var e = evt.toLowerCase();
                  // If unsubcribing from an event that is handled by a plugin
                  if (typeof windowEventHandler[e] !== "undefined" && windowEventHandler[e](e, handler, false)) {
                    return;
                  } else {
                    m_window_removeEventListener.call(window, evt, handler, capture);
                  }
                };

                /**
                 * Create all PhoneGap objects once page has fully loaded and native side is ready.
                 */
                channel.join(function() {


                    var builder = require('phonegap/builder'),
                        base = require('phonegap/common'),
                        platform = require('phonegap/platform');

                    // Drop the common globals into the window object.
                    builder.build(base.objects).into(window);

                    // Drop the platform-specific globals into the window object.
                    builder.build(platform.objects).into(window);

                    // Call the platform-specific initialization
                    platform.initialize();

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
