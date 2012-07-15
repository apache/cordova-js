var cordova = require('cordova');


 /* definition of named properties expected by the native side,
    all arrays are stored in order of how they are received from common js code.
    When other platforms evolve to using named args this will be removed.
 */


/**
 * Execute a cordova command.  It is up to the native side whether this action
 * is synchronous or asynchronous.  The native side can return:
 *      Synchronous: PluginResult object as a JSON string
 *      Asynchrounous: Empty string ""
 * If async, the native side will cordova.callbackSuccess or cordova.callbackError,
 * depending upon the result of the action.
 *
 * @param {Function} success    The success callback
 * @param {Function} fail       The fail callback
 * @param {String} service      The name of the service to use
 * @param {String} action       Action to be run in cordova
 * @param {String[]} [args]     Zero or more arguments to pass to the method

 */



var NativeProxy = {
    "Accelerometer": { 
        onDataChanged:function(e){
            var reading = e.reading;
            // reading.accelerationX.toFixed(2);
            // reading.accelerationY.toFixed(2);
            // reading.accelerationZ.toFixed(2);
        },       
        start:function(win,lose){
            console.log("Accelerometer.start");
            var accel = Windows.Devices.Sensors.Accelerometer.getDefault();
            if(!accel) {
                lose("No accelerometer found");
            }
            else {
                var self = this;
                // store our bound function
                this.onDataChanged.bound = function(e) {
                    self.onDataChanged(e);
                }
                accel.addEventListener("readingchanged",this.onDataChanged.bound);
            }
        },
        stop:function(win,lose){
            console.log("Accelerometer.stop");
            var accel = Windows.Devices.Sensors.Accelerometer.getDefault();
            if(!accel) {
                lose("No accelerometer found");
            }
            else {
                if(this.onDataChanged.bound) {
                    accel.removeEventListener("readingchanged",this.onDataChanged.bound);
                }
                this.onDataChanged.bound = null;
            }
        }
    },
    "Device": {
        getDeviceInfo:function(win,fail,args){
            console.log("NativeProxy::getDeviceInfo");
            setTimeout(function(){
                win({platform:"win8metro", version:"0.1", name:"hmm", uuid:"42", cordova:"12"});
            },0);
        }
    },
    "NetworkStatus": { 
        getConnectionInfo:function(win,fail,args)
        {
            console.log("getConnectionInfo");
            

            var winNetConn = Windows.Networking.Connectivity;
            var networkInfo = winNetConn.NetworkInformation;
            var networkCostInfo = winNetConn.NetworkCostType;
            var networkConnectivityInfo = winNetConn.NetworkConnectivityLevel;
            var networkAuthenticationInfo = winNetConn.NetworkAuthenticationType;
            var networkEncryptionInfo = winNetConn.NetworkEncryptionType;

            var profile = Windows.Networking.Connectivity.NetworkInformation.getInternetConnectionProfile();
            var conLevel = profile.getNetworkConnectivityLevel();

            switch (conLevel) {
                case Windows.Networking.Connectivity.NetworkConnectivityLevel.none:
                    break;
                case Windows.Networking.Connectivity.NetworkConnectivityLevel.localAccess:
                    break;
                case Windows.Networking.Connectivity.NetworkConnectivityLevel.internetAccess:
                    break;
                case Windows.Networking.Connectivity.NetworkConnectivityLevel.constrainedInternetAccess:
                    break;
            }


            // FYI
            //Connection.UNKNOWN  'Unknown connection';
            //Connection.ETHERNET 'Ethernet connection';
            //Connection.WIFI     'WiFi connection';
            //Connection.CELL_2G  'Cell 2G connection';
            //Connection.CELL_3G  'Cell 3G connection';
            //Connection.CELL_4G  'Cell 4G connection';
            //Connection.NONE     'No network connection';

            setTimeout(function(){
                win("wifi");
            },0);
        }

    } 
};
    // ,
    // "Accelerometer": require('cordova/plugin/bada/Accelerometer'),
    // "Notification": require('cordova/plugin/bada/Notification'),
    // "Compass": require('cordova/plugin/bada/Compass'),
    // "Capture": require('cordova/plugin/bada/Capture'),
    // "Camera": require('cordova/plugin/bada/Camera'),
    // "Contacts": require('cordova/plugin/bada/Contacts')


module.exports = function(success, fail, service, action, args) {

    var callbackId = service + cordova.callbackId++;
    console.log("EXEC:" + service + " : " + action);

    if (typeof success == "function" || typeof fail == "function")
    {
        cordova.callbacks[callbackId] = {success:success, fail:fail};
    }

    if(NativeProxy[service] && NativeProxy[service][action]) {

        // pass it on to Notify
        try {
            NativeProxy[service][action](success, fail, args);
        }
        catch(e) {
            console.log("Exception calling native with command :: " + service + " :: " + action  + " ::exception=" + e);
        }
    }

};

