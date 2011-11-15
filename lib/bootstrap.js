var Channel = require("./Channel"),
    /**
     * onDOMContentLoaded channel is fired when the DOM content 
     * of the page has been parsed.
     */
    onDOMContentLoaded = new Channel('onDOMContentLoaded'),
    /**
     * onNativeReady channel is fired when the PhoneGap native code
     * has been initialized.
     */
    onNativeReady = new Channel('onNativeReady'),
    /**
     * onPhoneGapInit channel is fired when the web page is fully loaded and
     * PhoneGap native code has been initialized.
     */
    onPhoneGapInit = new Channel('onPhoneGapInit'),
    /**
     * onPhoneGapReady channel is fired when the JS PhoneGap objects have been created.
     */
    onPhoneGapReady = new Channel('onPhoneGapReady'),
    /**
     * onPhoneGapInfoReady channel is fired when the PhoneGap device properties
     * has been set.
     */
    onPhoneGapInfoReady = new Channel('onPhoneGapInfoReady'),
    /**
     * onPhoneGapConnectionReady channel is fired when the PhoneGap connection properties
     * has been set.
     */
    onPhoneGapConnectionReady = new Channel('onPhoneGapConnectionReady'),
    /**
     * onResume channel is fired when the PhoneGap native code
     * resumes.
     */
    onResume = new Channel('onResume'),
    /**
     * onPause channel is fired when the PhoneGap native code
     * pauses.
     */
    onPause = new Channel('onPause'),
    /**
     * onDeviceReady is fired only after all PhoneGap objects are created and
     * the device properties are set.
     */
    onDeviceReady = new Channel('onDeviceReady'),
    /**
     * PhoneGap Channels that must fire before "deviceready" is fired.
     */ 
    deviceReadyChannelsArray = [onPhoneGapReady, onPhoneGapInfoReady, onPhoneGapConnectionReady],
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
                PhoneGap.onDOMContentLoaded.fire();
            }, false);

            /**
             * Intercept calls to document.addEventListener and handle deviceready,
             * resume, and pause events.
             */
            PhoneGap.m_document_addEventListener = document.addEventListener;

            document.addEventListener = function(evt, handler, capture) {
                var e = evt.toLowerCase();
                if (e == 'deviceready') {
                    PhoneGap.onDeviceReady.subscribeOnce(handler);
                } else if (e == 'resume') {
                    PhoneGap.onResume.subscribe(handler);
                    // if subscribing listener after event has already fired, invoke the handler
                    if (PhoneGap.onResume.fired && handler instanceof Function) {
                        handler();
                    }
                } else if (e == 'pause') {
                    PhoneGap.onPause.subscribe(handler);
                } else {
                    PhoneGap.m_document_addEventListener.call(document, evt, handler, capture);
                }
            };

            /**
             * Create all PhoneGap objects once page has fully loaded and native side is ready.
             */
            Channel.join(function() {

                // Run PhoneGap constructors
                onPhoneGapInit.fire();

                // Fire event to notify that all objects are created
                onPhoneGapReady.fire();

                // Fire onDeviceReady event once all constructors have run and 
                // PhoneGap info has been received from native side.
                Channel.join(function() {
                    onDeviceReady.fire();
                    
                    // Fire the onresume event, since first one happens before JavaScript is loaded
                    onResume.fire();
                }, deviceReadyChannelsArray);    
                
            }, [ onDOMContentLoaded, onNativeReady ]);
        },

        /**
         * User-defined channels that must also fire before "deviceready" is fired.
         */
        waitForInitialization: function(feature) {
            var channel;
            if (feature) {
                channel = new Channel(feature);
                deviceReadyChannelsMap[feature] = channel;
                deviceReadyChannelsArray.push(channel);
            }
        },
        /**
         * Indicate that initialization code has completed and the feature is ready to
         * be used.
         * 
         * @param feature {String} The unique feature name
         */
        initializationComplete: function(feature) {
            var channel = deviceReadyChannelsMap[feature];
            if (channel) {
                channel.fire();
            }
        };
    };

module.exports = _self;

// _nativeReady is global variable that the native side can set
// to signify that the native code is ready. It is a global since 
// it may be called before any PhoneGap JS is ready.
if (typeof _nativeReady !== 'undefined') { PhoneGap.onNativeReady.fire(); }
