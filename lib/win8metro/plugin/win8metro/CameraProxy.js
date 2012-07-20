/*global Windows:true, URL:true */


var cordova = require('cordova'),
    Camera = require('cordova/plugin/CameraConstants');


module.exports = {

// args will contain :
//  ...  it is an array, so be careful
// 0 quality:50,
// 1 destinationType:Camera.DestinationType.FILE_URI,
// 2 sourceType:Camera.PictureSourceType.CAMERA,
// 3 targetWidth:-1,
// 4 targetHeight:-1,
// 5 encodingType:Camera.EncodingType.JPEG,
// 6 mediaType:Camera.MediaType.PICTURE,
// 7 allowEdit:false,
// 8 correctOrientation:false,
// 9 saveToPhotoAlbum:false,
// 10 popoverOptions:null

"takePicture":function(win,lose,args) {

    if(args[2] == Camera.PictureSourceType.CAMERA) {
        // display the camera, and capture an image
        var dialog = new Windows.Media.Capture.CameraCaptureUI();
        var allowCrop = !!args[7];
        if(!allowCrop) {
            dialog.photoSettings.allowCrop = false;
        }
        else {
            var aspectRatio = { width:args[3] > 0 ? args[3] : 1, height: args[4] > 0 ? args[4] : 1};
            dialog.photoSettings.croppedAspectRatio = aspectRatio;
        }
        if(args[5] == Camera.EncodingType.JPEG) {
            dialog.photoSettings.format = Windows.Media.Capture.CameraCaptureUIPhotoFormat.jpeg;
        }
        else if (args[5] == Camera.EncodingType.PNG) {
            dialog.photoSettings.format = Windows.Media.Capture.CameraCaptureUIPhotoFormat.png;
        }

        dialog.captureFileAsync(Windows.Media.Capture.CameraCaptureUIMode.photo).done(
            function(file){
                if(file) {
                    console.log("got a file in success handler");
                    if(args[1] == Camera.DestinationType.FILE_URI)
                    {
                        var imageBlobUrl = URL.createObjectURL(file);
                        win(imageBlobUrl);
                    }
                }
                else {
                    console.log("success handler without file ...");
                }
            },
            function(err) {
                console.log("err in camerq");
            });
    }
    else {
        // grab from the photo library
        var picker = new Windows.Storage.Pickers.FileOpenPicker();
        picker.viewMode = Windows.Storage.Pickers.PickerViewMode.thumbnail;
        picker.suggestedStartLocation = Windows.Storage.Pickers.PickerLocationId.picturesLibrary;

        picker.fileTypeFilter.replaceAll([".png", ".jpg", ".jpeg"]);

        picker.pickSingleFileAsync().then(function (file) {
            if (file) {
                console.log("got a file in success handler");
                if(args[1] == Camera.DestinationType.FILE_URI)
                {
                    var imageBlobUrl = URL.createObjectURL(file);
                    win(imageBlobUrl);
                }
            } else {
                // cancelled ??
                console.log("success handler without file ...");
            }
        });
    }

}
};