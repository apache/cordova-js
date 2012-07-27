/*global tizen:false */
var Connection = require('cordova/plugin/Connection');

module.exports = {
    getConnectionInfo: function (successCallback, errorCallback) {
        var cncType = Connection.NONE;
        var infoCount = 0;

        function infoCB() {
            infoCount++;
            if (infoCount > 1)
               successCallback(cncType);
        }

        function errorCB(error) {
           console.log("Error: " + error.code + "," + error.name + "," + error.message);
           infoCB();
        }

        function wifiSuccessCB(wifi) {
            if ((wifi.status === "ON")  && (wifi.ipAddress.length !== 0))
                cncType = Connection.WIFI;
            infoCB();
        }

        function cellularSuccessCB(cell) {
            if ((cncType === Connection.NONE) && (cell.status === "ON") && (cell.ipAddress.length !== 0))
                cncType = Connection.CELL_2G;
            infoCB();
        }

        if (tizen.systeminfo.isSupported('WifiNetwork')) {
            tizen.systeminfo.getPropertyValue('WifiNetwork', wifiSuccessCB, errorCB);
        }

        if (tizen.systeminfo.isSupported('CellularNetwork')) {
            tizen.systeminfo.getPropertyValue('CellularNetwork', cellularSuccessCB, errorCB);
        }
    }
};
