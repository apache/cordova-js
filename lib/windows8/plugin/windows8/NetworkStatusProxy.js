/*
 *
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 *
*/

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
