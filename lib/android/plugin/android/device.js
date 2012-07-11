var channel = require('cordova/channel'),
    utils = require('cordova/utils'),
    exec = require('cordova/exec'),
    app = require('cordova/plugin/android/app');

module.exports = {
    /*
     * DEPRECATED
     * This is only for Android.
     *
     * You must explicitly override the back button.
     */
    overrideBackButton:function() {
        console.log("Device.overrideBackButton() is deprecated.  Use App.overrideBackbutton(true).");
        app.overrideBackbutton(true);
    },

    /*
     * DEPRECATED
     * This is only for Android.
     *
     * This resets the back button to the default behaviour
     */
    resetBackButton:function() {
        console.log("Device.resetBackButton() is deprecated.  Use App.overrideBackbutton(false).");
        app.overrideBackbutton(false);
    },

    /*
     * DEPRECATED
     * This is only for Android.
     *
     * This terminates the activity!
     */
    exitApp:function() {
        console.log("Device.exitApp() is deprecated.  Use App.exitApp().");
        app.exitApp();
    }
};
