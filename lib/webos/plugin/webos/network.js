var service=require('cordova/plugin/webos/service')

module.exports = {
/**
 * Get connection info
 *
 * @param {Function} successCallback The function to call when the Connection data is available
 * @param {Function} errorCallback The function to call when there is an error getting the Connection data. (OPTIONAL)
 */
	getConnectionInfo: function (successCallback, errorCallback) {
   	// Get info
    console.log("webos Plugin: NetworkStatus - getConnectionInfo");

	this.request = service.Request('palm://com.palm.connectionmanager', {
	    method: 'getstatus',
	    parameters: {},
	    onSuccess: postData, 
	    onFailure: function() {}
	});	

	function postData(result) {
		console.log("result:"+JSON.stringify(result));

		var info={};
		if (!result.isInternetConnectionAvailable) { info.type="Connection.NONE"; }
		if (result.wifi.onInternet) { info.type="Connection.WIFI"; }
		if (result.wan.state==="connected") { info.type="Connection.CELL_2G"; }

		successCallback(info.type);
	}

    }
};
