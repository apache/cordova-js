/*global Windows:true */

var cordova = require('cordova');
var Connection = require('cordova/plugin/Connection');

module.exports = {

    getConnectionInfo:function(win,fail,args)
    {
        var winNetConn = Windows.Networking.Connectivity;
        var networkInfo = winNetConn.NetworkInformation;
        var networkCostInfo = winNetConn.NetworkCostType;
        var networkConnectivityInfo = winNetConn.NetworkConnectivityLevel;
        var networkAuthenticationInfo = winNetConn.NetworkAuthenticationType;
        var networkEncryptionInfo = winNetConn.NetworkEncryptionType;

        var connectionType;

        var profile = Windows.Networking.Connectivity.NetworkInformation.getInternetConnectionProfile();
        if(profile) {
            var conLevel = profile.getNetworkConnectivityLevel();
            var interfaceType = profile.networkAdapter.ianaInterfaceType;

            if (conLevel == Windows.Networking.Connectivity.NetworkConnectivityLevel.none) {
                connectionType = Connection.NONE;
            }
            else {
                switch (interfaceType) {
                    case 71:
                        connectionType = Connection.WIFI;
                        break;
                    case 6:
                        connectionType = Connection.ETHERNET;
                        break;
                    default:
                        connectionType = Connection.UNKNOWN;
                        break;
                }
            }
        }
        // FYI
        //Connection.UNKNOWN  'Unknown connection';
        //Connection.ETHERNET 'Ethernet connection';
        //Connection.WIFI     'WiFi connection';
        //Connection.CELL_2G  'Cell 2G connection';
        //Connection.CELL_3G  'Cell 3G connection';
        //Connection.CELL_4G  'Cell 4G connection';
        //Connection.NONE     'No network connection';

        setTimeout(function () {
            if (connectionType) {
                win(connectionType);
            } else {
                win(Connection.NONE);
            }
        },0);
    }

};