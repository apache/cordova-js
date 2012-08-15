/*global Windows:true, URL:true */


var cordova = require('cordova'),
    Camera = require('cordova/plugin/CameraConstants');


module.exports = {

/**
 * Gets a picture from source defined by "options.sourceType", and returns the
 * image as defined by the "options.destinationType" option.

 * The defaults are sourceType=CAMERA and destinationType=DATA_URL.
 *
 * @param {Function} successCallback
 * @param {Function} errorCallback
 * @param {Object} options
 */
 
"getPicture":function(successCallback, errorCallback, options) {
    

    // successCallback required
    if (typeof successCallback !== "function") {
        console.log("Camera Error: successCallback is not a function");
        return;
    }

    // errorCallback optional
    if (errorCallback && (typeof errorCallback !== "function")) {
        console.log("Camera Error: errorCallback is not a function");
        return;
    }
    
    var quality = 50;
    if (options && typeof options.quality == "number") {
        quality = options.quality;
    } else if (options && typeof options.quality == "string") {
        var qlity = parseInt(options.quality, 10);
        if (isNaN(qlity) === false) {
            quality = qlity.valueOf();
        }
    }

    var destinationType = Camera.DestinationType.FILE_URI;
    if (typeof options.destinationType == "number") {
        destinationType = options.destinationType;
    }

    var sourceType = Camera.PictureSourceType.CAMERA;
    if (typeof options.sourceType == "number") {
        sourceType = options.sourceType;
    }

    var targetWidth = -1;
    if (typeof options.targetWidth == "number") {
        targetWidth = options.targetWidth;
    } else if (typeof options.targetWidth == "string") {
        var width = parseInt(options.targetWidth, 10);
        if (isNaN(width) === false) {
            targetWidth = width.valueOf();
        }
    }

    var targetHeight = -1;
    if (typeof options.targetHeight == "number") {
        targetHeight = options.targetHeight;
    } else if (typeof options.targetHeight == "string") {
        var height = parseInt(options.targetHeight, 10);
        if (isNaN(height) === false) {
            targetHeight = height.valueOf();
        }
    }

    if ((targetWidth > 0 && targetHeight < 0) || (targetWidth < 0 && targetHeight > 0)) {
        errorCallback("targetWidth should be used with targetHeight.");
    }

    var encodingType = Camera.EncodingType.JPEG;
    if (typeof options.encodingType == "number") {
        encodingType = options.encodingType;
    }

    var mediaType = Camera.MediaType.PICTURE;
    if (typeof options.mediaType == "number") {
        mediaType = options.mediaType;
    }
    var allowEdit = false;
    if (typeof options.allowEdit == "boolean") {
        allowEdit = options.allowEdit;
    } else if (typeof options.allowEdit == "number") {
        allowEdit = options.allowEdit <= 0 ? false : true;
    }
    var correctOrientation = false;
    if (typeof options.correctOrientation == "boolean") {
        correctOrientation = options.correctOrientation;
    } else if (typeof options.correctOrientation == "number") {
        correctOrientation = options.correctOrientation <= 0 ? false : true;
    }
    var saveToPhotoAlbum = false;
    if (typeof options.saveToPhotoAlbum == "boolean") {
        saveToPhotoAlbum = options.saveToPhotoAlbum;
    } else if (typeof options.saveToPhotoAlbum == "number") {
        saveToPhotoAlbum = options.saveToPhotoAlbum <= 0 ? false : true;
    }

    
    // get the path of photo album.
    /*var parentPath
    var username = Windows.System.UserProfile.UserInformation.getDisplayNameAsync().then(function (displayName) { 
        parentPath = "C:\\Users\\" + username + "\\Pictures";
    });*/
    var package = Windows.ApplicationModel.Package.current;
    var packageId = package.installedLocation;

    // resize method :)
    var resizeImage = function (file) {
        var tempPhotoFileName = "";
        if (encodingType == Camera.EncodingType.PNG) {
            tempPhotoFileName = "camera_cordova_temp_return.png";
        } else {
            tempPhotoFileName = "camera_cordova_temp_return.jpg";
        }
        var imgObj = new Image();
        var success = function (fileEntry) {
            var successCB = function (filePhoto) {
                var filePhoto = filePhoto,
                    fileType = file.contentType,
                    reader = new FileReader();
                reader.onloadend = function () {
                    var image = new Image();
                    image.src = reader.result;
                    image.onload = function () {
                        var imageWidth = targetWidth,
                            imageHeight = targetHeight;
                        var canvas = document.createElement('canvas');
                                            
                        canvas.width = imageWidth;
                        canvas.height = imageHeight;

                        var ctx = canvas.getContext("2d");
                        ctx.drawImage(this, 0, 0, imageWidth, imageHeight);
                                            
                        // The resized file ready for upload
                        var _blob = canvas.msToBlob();
                        var _stream = _blob.msRandomAccessStream();
                        Windows.Storage.StorageFolder.getFolderFromPathAsync(packageId.path).done(function (storageFolder) {
                            storageFolder.createFileAsync(tempPhotoFileName, Windows.Storage.CreationCollisionOption.generateUniqueName).done(function (file) {
                                file.openAsync(Windows.Storage.FileAccessMode.readWrite).done( function (fileStream) {
                                    Windows.Storage.Streams.RandomAccessStream.copyAndCloseAsync(_stream, fileStream).done(function () {
                                        successCallback(file.name);
                                    }, function () { errorCallback("Resize picture error."); })
                                }, function () { errorCallback("Resize picture error."); })
                            }, function () { errorCallback("Resize picture error."); })
                        })
                      
                    }
                }

                reader.readAsDataURL(filePhoto);

            }
            var failCB = function () {
                errorCallback("File not found.")
            }
            fileEntry.file(successCB, failCB);
        }
 
        var fail = function (fileError) {
            errorCallback("FileError, code:" + fileError.code);
        }
        Windows.Storage.StorageFolder.getFolderFromPathAsync(packageId.path).done(function (storageFolder) {
            file.copyAsync(storageFolder, file.name, Windows.Storage.NameCollisionOption.replaceExisting).then(function (storageFile) {
                success(new FileEntry(storageFile.name, storageFile.path));
            }, function () {
                fail(FileError.INVALID_MODIFICATION_ERR);
            }, function () {
                errorCallback("Folder not access.");
            });
        })
                        
    }

    // because of asynchronous method, so let the successCallback be called in it. 
    var resizeImageBase64 = function (file) {
        var imgObj = new Image();
        var success = function (fileEntry) {
            var successCB = function (filePhoto) {
                var filePhoto = filePhoto,
                    fileType = file.contentType,
                    reader = new FileReader();
                reader.onloadend = function () {
                    var image = new Image();
                    image.src = reader.result;

                    image.onload = function () {
                        var imageWidth = targetWidth,
                            imageHeight = targetHeight;
                        var canvas = document.createElement('canvas');

                        canvas.width = imageWidth;
                        canvas.height = imageHeight;

                        var ctx = canvas.getContext("2d");
                        ctx.drawImage(this, 0, 0, imageWidth, imageHeight);

                        // The resized file ready for upload
                        var finalFile = canvas.toDataURL(fileType);

                        // Remove the prefix such as "data:" + contentType + ";base64," , in order to meet the Cordova API.
                        var arr = finalFile.split(",");
                        var newStr = finalFile.substr(arr[0].length + 1);
                        successCallback(newStr);
                    }
                }

                reader.readAsDataURL(filePhoto);

            }
            var failCB = function () {
                errorCallback("File not found.")
            }
            fileEntry.file(successCB, failCB);
        }

        var fail = function (fileError) {
            errorCallback("FileError, code:" + fileError.code);
        }
        Windows.Storage.StorageFolder.getFolderFromPathAsync(packageId.path).done(function (storageFolder) {
            file.copyAsync(storageFolder, file.name, Windows.Storage.NameCollisionOption.replaceExisting).then(function (storageFile) {
                success(new FileEntry(storageFile.name, storageFile.path));
            }, function () {
                fail(FileError.INVALID_MODIFICATION_ERR);
            }, function () {
                errorCallback("Folder not access.");
            });
        })

    }

    if (sourceType != Camera.PictureSourceType.CAMERA) {
        var fileOpenPicker = new Windows.Storage.Pickers.FileOpenPicker();
        fileOpenPicker.suggestedStartLocation = Windows.Storage.Pickers.PickerLocationId.picturesLibrary;
        if (mediaType == Camera.MediaType.PICTURE) {
            fileOpenPicker.fileTypeFilter.replaceAll([".png", ".jpg", ".jpeg"]);
        } else if (mediaType == Camera.MediaType.VIDEO) {
            fileOpenPicker.fileTypeFilter.replaceAll([".avi", ".flv", ".asx", ".asf", ".mov", ".mp4", ".mpg", ".rm", ".srt", ".swf", ".wmv", ".vob"]);
        } else {
            fileOpenPicker.fileTypeFilter.replaceAll(["*"]);
        }    
        fileOpenPicker.pickSingleFileAsync().then(function (file) {
            if (file) {
                if (destinationType == Camera.DestinationType.FILE_URI) {
                    if (targetHeight > 0 && targetWidth > 0) {
                        resizeImage(file);
                    } else {
                        Windows.Storage.StorageFolder.getFolderFromPathAsync(packageId.path).done(function (storageFolder) {
                            file.copyAsync(storageFolder, file.name, Windows.Storage.NameCollisionOption.replaceExisting).then(function (storageFile) {
                                successCallback(storageFile.name);
                            }, function () {
                                fail(FileError.INVALID_MODIFICATION_ERR);
                            }, function () {
                                errorCallback("Folder not access.");
                            });
                        })
                        
                    }
                }
                else {
                    if (targetHeight > 0 && targetWidth > 0) {
                        resizeImageBase64(file);
                    } else {
                        Windows.Storage.FileIO.readBufferAsync(file).done(function (buffer) {
                            var strBase64 = Windows.Security.Cryptography.CryptographicBuffer.encodeToBase64String(buffer);
                            successCallback(strBase64);
                        })
                    }
                    
                }

            } else {
                errorCallback("User didn't choose a file.");
            }
        }, function () {
            errorCallback("User didn't choose a file.")
        })
    }
    else {
        
        var cameraCaptureUI = new Windows.Media.Capture.CameraCaptureUI();
        cameraCaptureUI.photoSettings.allowCropping = true;
        if (encodingType == Camera.EncodingType.PNG) {
            cameraCaptureUI.photoSettings.format = Windows.Media.Capture.CameraCaptureUIPhotoFormat.png;
        } else {
            cameraCaptureUI.photoSettings.format = Windows.Media.Capture.CameraCaptureUIPhotoFormat.jpeg;
        }
        // decide which max pixels should be supported by targetWidth or targetHeight.
        if (targetWidth >= 1280 || targetHeight >= 960) {
            cameraCaptureUI.photoSettings.maxResolution = Windows.Media.Capture.CameraCaptureUIMaxPhotoResolution.large3M;
        } else if (targetWidth >= 1024 || targetHeight >= 768) {
            cameraCaptureUI.photoSettings.maxResolution = Windows.Media.Capture.CameraCaptureUIMaxPhotoResolution.mediumXga;
        } else if (targetWidth >= 800 || targetHeight >= 600) {
            cameraCaptureUI.photoSettings.maxResolution = Windows.Media.Capture.CameraCaptureUIMaxPhotoResolution.mediumXga;
        } else if (targetWidth >= 640 || targetHeight >= 480) {
            cameraCaptureUI.photoSettings.maxResolution = Windows.Media.Capture.CameraCaptureUIMaxPhotoResolution.smallVga;
        } else if (targetWidth >= 320 || targetHeight >= 240) {
            cameraCaptureUI.photoSettings.maxResolution = Windows.Media.Capture.CameraCaptureUIMaxPhotoResolution.verySmallQvga;
        } else {
            cameraCaptureUI.photoSettings.maxResolution = Windows.Media.Capture.CameraCaptureUIMaxPhotoResolution.highestAvailable;
        }
        
        cameraCaptureUI.captureFileAsync(Windows.Media.Capture.CameraCaptureUIMode.photo).then(function (picture) {
            if (picture) {
                // save to photo album successCallback
                var success = function (fileEntry) {
                    if (destinationType == Camera.DestinationType.FILE_URI) {
                        if (targetHeight > 0 && targetWidth > 0) {
                            resizeImage(picture);
                        } else {
                            Windows.Storage.StorageFolder.getFolderFromPathAsync(packageId.path).done(function (storageFolder) {
                                picture.copyAsync(storageFolder, picture.name, Windows.Storage.NameCollisionOption.replaceExisting).then(function (storageFile) {
                                    successCallback(storageFile.name);
                                }, function () {
                                    fail(FileError.INVALID_MODIFICATION_ERR);
                                }, function () {
                                    errorCallback("Folder not access.");
                                });
                            })
                        }
                    } else {
                        if (targetHeight > 0 && targetWidth > 0) {
                            resizeImageBase64(picture);
                        } else {
                            Windows.Storage.FileIO.readBufferAsync(picture).done(function (buffer) {
                                var strBase64 = Windows.Security.Cryptography.CryptographicBuffer.encodeToBase64String(buffer);
                                successCallback(strBase64);
                            })
                        }
                    }
                }
                // save to photo album errorCallback
                var fail = function () {
                    //errorCallback("FileError, code:" + fileError.code);
                    errorCallback("Save fail.");
                }

                if (saveToPhotoAlbum) {
                    Windows.Storage.StorageFile.getFileFromPathAsync(picture.path).then(function (storageFile) {
                        storageFile.copyAsync(Windows.Storage.KnownFolders.picturesLibrary, picture.name, Windows.Storage.NameCollisionOption.generateUniqueName).then(function (storageFile) {
                            success(storageFile);
                        }, function () {
                            fail();
                        })
                    })
                    //var directory = new DirectoryEntry("Pictures", parentPath);
                    //new FileEntry(picture.name, picture.path).copyTo(directory, null, success, fail);
                } else {
                    if (destinationType == Camera.DestinationType.FILE_URI) {
                        if (targetHeight > 0 && targetWidth > 0) {
                            resizeImage(picture);
                        } else {
                            Windows.Storage.StorageFolder.getFolderFromPathAsync(packageId.path).done(function (storageFolder) {
                                picture.copyAsync(storageFolder, picture.name, Windows.Storage.NameCollisionOption.replaceExisting).then(function (storageFile) {
                                    successCallback(storageFile.name);
                                }, function () {
                                    fail(FileError.INVALID_MODIFICATION_ERR);
                                }, function () {
                                    errorCallback("Folder not access.");
                                });
                            })
                        }
                    } else {
                        if (targetHeight > 0 && targetWidth > 0) {
                            resizeImageBase64(picture);
                        } else {
                            Windows.Storage.FileIO.readBufferAsync(picture).done(function (buffer) {
                                var strBase64 = Windows.Security.Cryptography.CryptographicBuffer.encodeToBase64String(buffer);
                                successCallback(strBase64);
                            })
                        }
                    }
                }
            } else {
                errorCallback("User didn't capture a photo.");
            }
        }, function () {
            errorCallback("Fail to capture a photo.");
        })
    }
    
}
};