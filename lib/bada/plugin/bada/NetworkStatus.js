var channel = require('cordova/channel'),
    Connection = require("cordova/plugin/Connection");

// We can't tell if a cell connection is 2,3 or 4G.
// We just know if it's connected and the signal strength
// if it's roaming and the network name etc..so unless wifi we default to CELL_2G
// if connected to cellular network

module.exports = {
    getConnectionInfo: function(success, fail) {
        var connectionType = Connection.NONE;
        var networkInfo = ["cellular", "wifi"]; // might be a better way to do this
        var gotConnectionInfo = function() {
            networkInfo.pop();
            if(networkInfo.length === 0) {
                channel.onCordovaConnectionReady.fire();
                success(connectionType);
            }
        };
        var error = function(e) {
            console.log("Error "+e.message);
            gotConnectionInfo();
        };
        deviceapis.devicestatus.getPropertyValue(function(value) {
            console.log("Device Cellular network status: "+value);
            if(connectionType === Connection.NONE) {
                connectionType = Connection.CELL_2G;
            }
            gotConnectionInfo();
        }, error, {aspect: "CellularNetwork", property: "signalStrength"});

        deviceapis.devicestatus.getPropertyValue(function(value) {
            console.log("Device WiFi network status: "+value);
            if(value == "connected") {
                connectionType = Connection.WIFI;
            }
            gotConnectionInfo();
        }, error, {aspect: "WiFiNetwork", property: "networkStatus"});
    }
};
