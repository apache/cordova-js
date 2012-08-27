/*global Windows:true */

var cordova = require('cordova');


module.exports = {

    getConnectionInfo:function(win,fail,args)
    {
        var winNetConn = Windows.Networking.Connectivity;
        var networkInfo = winNetConn.NetworkInformation;
        var networkCostInfo = winNetConn.NetworkCostType;
        var networkConnectivityInfo = winNetConn.NetworkConnectivityLevel;
        var networkAuthenticationInfo = winNetConn.NetworkAuthenticationType;
        var networkEncryptionInfo = winNetConn.NetworkEncryptionType;

        var profile = Windows.Networking.Connectivity.NetworkInformation.getInternetConnectionProfile();
        if(profile) {
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

};