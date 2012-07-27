/*global tizen:false */
var Camera = require('cordova/plugin/CameraConstants');

function makeReplyCallback(successCallback, errorCallback) {
    return {
        onsuccess: function(reply) {
            if (reply.length > 0) {
                successCallback(reply[0].value);
            } else {
                errorCallback('Picture selection aborted');
            }
        },
        onfail: function() {
           console.log('The service launch failed');
        }
    };
}

module.exports = {
    takePicture: function(successCallback, errorCallback, args) {
        var destinationType = args[1],
            sourceType = args[2],
            encodingType = args[5],
            mediaType = args[6];
            // Not supported
            /*
            quality = args[0]
            targetWidth = args[3]
            targetHeight = args[4]
            allowEdit = args[7]
            correctOrientation = args[8]
            saveToPhotoAlbum = args[9]
            */

        if (destinationType !== Camera.DestinationType.FILE_URI) {
            errorCallback('DestinationType not supported');
            return;
        }
        if (mediaType !== Camera.MediaType.PICTURE) {
            errorCallback('MediaType not supported');
            return;
        }

        var mimeType;
        if (encodingType === Camera.EncodingType.JPEG) {
            mimeType = 'image/jpeg';
        } else if (encodingType === Camera.EncodingType.PNG) {
            mimeType = 'image/png';
        } else {
            mimeType = 'image/*';
        }

        var serviceId;
        if (sourceType === Camera.PictureSourceType.CAMERA) {
            serviceId = 'http://tizen.org/appsvc/operation/create_content';
        } else {
            serviceId = 'http://tizen.org/appsvc/operation/pick';
        }

        var service = new tizen.ApplicationService(serviceId, null, mimeType, null);
        tizen.application.launchService(service, null, null,
                function(error) { errorCallback(error.message); },
                makeReplyCallback(successCallback, errorCallback));
    }
};
