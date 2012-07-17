var cordova = require('cordova');


 /* definition of named properties expected by the native side,
    all arrays are stored in order of how they are received from common js code.
    When other platforms evolve to using named args this will be removed.
 */

var NamedArgs =  {
    File:{
        getFileMetadata:["fullPath"],
        getMetadata:["fullPath"],
        getParent:["fullPath"],
        readAsText:["fileName","encoding"],
        readAsDataURL:["fileName"],
        getDirectory:["fullPath","path","options"],
        remove:["fullPath"],
        removeRecursively:["fullPath"],
        getFile:["fullPath","path","options"],
        readEntries:["fullPath"],
        write:["fileName","data","position"],
        truncate:["fileName","size"],
        copyTo:["fullPath","parent", "newName"],
        moveTo:["fullPath","parent", "newName"],
        requestFileSystem:["type","size"],
        resolveLocalFileSystemURI:["uri"]
    },
    FileTransfer:{
        upload:["filePath", "server", "fileKey", "fileName", "mimeType", "params", "debug", "chunkedMode"],
        download:["url","filePath"]
    },
    Capture:{
        getFormatData:["fullPath","type"]
    }
};

/*
    Notification: {
        alert:["message","title","buttonLabel"],
        confirm:["message","title","buttonLabel"]
    },
    Camera:{
        takePicture:["quality", "destinationType", "sourceType", "targetWidth", "targetHeight", "encodingType",
                     "mediaType", "allowEdit", "correctOrientation", "saveToPhotoAlbum" ]
    },
    Contacts:{
        search:["fields","options"]
    },
    Media:{
        create:["id","src"],
        startPlayingAudio:["id","src","milliseconds"],
        stopPlayingAudio:["id"],
        seekToAudio:["id","milliseconds"],
        pausePlayingAudio:["id"],
        getCurrentPositionAudio:["id"],
        startRecordingAudio:["id","src"],
        stopRecordingAudio:["id"],
        release:["id"],
        setVolume:["id","volume"]
    },
*/

/**
 * Execute a cordova command.  It is up to the native side whether this action
 * is synchronous or asynchronous.  The native side can return:
 *      Synchronous: PluginResult object as a JSON string
 *      Asynchrounous: Empty string ""
 * If async, the native side will cordova.callbackSuccess or cordova.callbackError,
 * depending upon the result of the action.
 *
 * @param {Function} success    The success callback
 * @param {Function} fail       The fail callback
 * @param {String} service      The name of the service to use
 * @param {String} action       Action to be run in cordova
 * @param {String[]} [args]     Zero or more arguments to pass to the method

 */

module.exports = function(success, fail, service, action, args) {


    var callbackId = service + cordova.callbackId++;
    if (typeof success == "function" || typeof fail == "function")
    {
        cordova.callbacks[callbackId] = {success:success, fail:fail};
    }

    // generate a new command string, ex. DebugConsole/log/DebugConsole23/{"message":"wtf dude?"}

    if(NamedArgs[service] && NamedArgs[service][action]) {
        var argNames = NamedArgs[service][action];
        var newArgs = {};
        var len = Math.min(args.length,argNames.length);

        for(var n = 0; n < len; n++) {
            newArgs[argNames[n]] = args[n];
        }

        args = newArgs;
    }
    // else if(args && args.length && args.length == 1) {
    //     args = args[0];
    // }

    var command = service + "/" + action + "/" + callbackId + "/" + JSON.stringify(args);
    // pass it on to Notify
    try {
        if(window.external) {
            window.external.Notify(command);
        }
        else {
            console.log("window.external not available :: command=" + command);
        }
    }
    catch(e) {
        console.log("Exception calling native with command :: " + command + " :: exception=" + e);
    }
};

