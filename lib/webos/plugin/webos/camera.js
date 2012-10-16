var service=require('cordova/plugin/webos/service');

module.exports = {

takePicture: function(successCallback, errorCallback, options) {

    var filename = "";

    if (typeof options != 'undefined' && typeof options.filename != 'undefined') {
        filename = options.filename;
    }

    this.service = service.Request('palm://com.palm.applicationManager', {
        method: 'launch',
        parameters: {
        id: 'com.palm.app.camera',
        params: {
                appId: 'com.palm.app.camera',
                name: 'capture',
                sublaunch: true,
                filename: filename
            }
        },
        onSuccess: successCallback,
        onFailure: errorCallback
    });
}

}
