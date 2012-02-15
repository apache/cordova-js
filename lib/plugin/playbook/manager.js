var webworks = require('cordova/plugin/webworks/manager'),
    /**
     * Private list of HTML 5 audio objects, indexed by the Cordova media object ids
     */
    audioObjects = {},
    retInvalidAction = function () { 
        return { "status" : Cordova.callbackStatus.INVALID_ACTION, "message" : "Action not found" };
    },
    retAsyncCall = function () {
        return { "status" : Cordova.callbackStatus.NO_RESULT, "message" : "WebWorks Is On It" };
    },
    cameraAPI = {
        execute: function (webWorksResult, action, args, win, fail) {
            if (action === 'takePicture') {
                blackberry.media.camera.takePicture(win, fail, fail);
                return retAsyncCall();
            }
            else {
                return retInvalidAction();
            }
        }
    },
    deviceAPI = {
        execute: function (webWorksResult, action, args, win, fail) {
            if (action === 'getDeviceInfo') {
                return {"status" : Cordova.callbackStatus.OK,
                        "message" : {
                            "version" : blackberry.system.softwareVersion,
                            "name" : blackberry.system.model,
                            "uuid" : blackberry.identity.PIN,
                            "platform" : "PlayBook",
                            "cordova" : "1.4.1"
                        }
                };
            }
            return retInvalidAction();
        }
    },
    loggerAPI = {
        execute: function (webWorksResult, action, args, win, fail) {
            if (action === 'log') {
                console.log(args);
                return {"status" : Cordova.callbackStatus.OK,
                        "message" : 'Message logged to console: ' + args};
            }
            else {
                return retInvalidAction();
            }
        }
    },
    mediaAPI = {
        execute: function (webWorksResult, action, args, win, fail) {
            if (!args.length) {
                return {"status" : 9, "message" : "Media Object id was not sent in arguments"};
            }

            var id = args[0],
                audio = audioObjects[id],
                result;

            switch (action) {
            case 'startPlayingAudio':
                if (args.length === 1) {
                    result = {"status" : 9, "message" : "Media source argument not found"};

                }

                if (audio) {
                    audio.pause();
                    audioObjects[id] = undefined;
                }

                audio = audioObjects[id] = new Audio(args[1]);
                audio.play();

                result = {"status" : 1, "message" : "Audio play started" };
                break;
            case 'stopPlayingAudio':
                if (!audio) {
                    return {"status" : 2, "message" : "Audio Object has not been initialized"};
                }

                audio.pause();
                audioObjects[id] = undefined;

                result = {"status" : 1, "message" : "Audio play stopped" };
                break;
            case 'seekToAudio':
                if (!audio) {
                    result = {"status" : 2, "message" : "Audio Object has not been initialized"};
                } else if (args.length === 1) {
                    result = {"status" : 9, "message" : "Media seek time argument not found"};
                } else {
                    try {
                        audio.currentTime = args[1];
                    } catch (e) {
                        console.log('Error seeking audio: ' + e);
                        return {"status" : 3, "message" : "Error seeking audio: " + e};
                    }

                    result = {"status" : 1, "message" : "Seek to audio succeeded" };
                }
                break;
            case 'pausePlayingAudio':
                if (!audio) {
                    return {"status" : 2, "message" : "Audio Object has not been initialized"};
                }

                audio.pause();

                result = {"status" : 1, "message" : "Audio paused" };
                break;
            case 'getCurrentPositionAudio':
                if (!audio) {
                    return {"status" : 2, "message" : "Audio Object has not been initialized"};
                }

                result = {"status" : 1, "message" : audio.currentTime };
                break;
            case 'getDuration':
                if (!audio) {
                    return {"status" : 2, "message" : "Audio Object has not been initialized"};
                }

                result = {"status" : 1, "message" : audio.duration };
                break;
            case 'startRecordingAudio':
                if (args.length <= 1) {
                    result = {"status" : 9, "message" : "Media start recording, insufficient arguments"};
                }

                blackberry.media.microphone.record(args[1], win, fail);
                result = retAsyncCall();
                break;
            case 'stopRecordingAudio':
                break;
            case 'release':
                if (audio) {
                    audioObjects[id] = undefined;
                    audio.src = undefined;
                    //delete audio;
                }

                result = {"status" : 1, "message" : "Media resources released"};
                break;
            default:
                result = retInvalidAction();
            }

            return result;
        }
    },
    mediaCaptureAPI = {
        execute: function (webWorksResult, action, args, win, fail) {
            var limit = args[0],
                pictureFiles = [],
                captureMethod;

            function captureCB(filePath) {
                var mediaFile;

                if (filePath) {
                    mediaFile = new MediaFile();
                    mediaFile.fullPath = filePath;
                    pictureFiles.push(mediaFile);
                }

                if (limit > 0) {
                    limit--;
                    blackberry.media.camera[captureMethod](win, fail, fail);
                    return;
                }

                win(pictureFiles);

                return retAsyncCall();
            }

            switch (action) {
                case 'getSupportedAudioModes':
                case 'getSupportedImageModes':
                case 'getSupportedVideoModes':
                    return {"status": Cordova.callbackStatus.OK, "message": []};
                case 'captureImage':
                    captureMethod = "takePicture";
                    captureCB();
                    break;
                case 'captureVideo':
                    captureMethod = "takeVideo";
                    captureCB();
                    break;
                case 'captureAudio':
                    return {"status": Cordova.callbackStatus.INVALID_ACTION, "message": "captureAudio is not currently supported"};
            }

            return retAsyncCall();
        }
    },
    networkAPI = {
        execute: function (webWorksResult, action, args, win, fail) {
            if (action !== 'getConnectionInfo') {
                return retInvalidAction();
            }

            var connectionType = require("cordova/plugin/Connection").NONE,
                eventType = "offline",
                callbackID,
                request;

            /**
             * For PlayBooks, we currently only have WiFi connections, so return WiFi if there is
             * any access at all.
             * TODO: update if/when PlayBook gets other connection types...
             */
            if (blackberry.system.hasDataCoverage()) {
                connectionType = require("cordova/plugin/Connection").WIFI;
                eventType = "online";
            }

            //Register an event handler for the networkChange event
            callbackID = blackberry.events.registerEventHandler("networkChange", win);

            //pass our callback id down to our network extension
            request = new blackberry.transport.RemoteFunctionCall("org/apache/cordova/getConnectionInfo");
            request.addParam("networkStatusChangedID", callbackID);
            request.makeSyncCall();

            return { "status": Cordova.callbackStatus.OK, "message": {"type": connectionType, "event": eventType } };
        }
    },
    notificationAPI = {
        execute: function (webWorksResult, action, args, win, fail) {
            if (args.length !== 3) {
              return {"status" : 9, "message" : "Notification action - " + action + " arguments not found"};

            }
            
            //Unpack and map the args
            var msg = args[0],
                title = args[1],
                btnLabel = args[2],
                btnLabels;

            switch (action) {
            case 'alert':
                blackberry.ui.dialog.customAskAsync.apply(this, [ msg, [ btnLabel ], win, { "title" : title } ]);
                return retAsyncCall();
            case 'confirm':
                btnLabels = btnLabel.split(",");
                blackberry.ui.dialog.customAskAsync.apply(this, [msg, btnLabels, win, {"title" : title} ]);
                return retAsyncCall();
            }
            return retInvalidAction();

        }
    },
    plugins = {
        'Camera' : cameraAPI,
        'Device' : deviceAPI,
        'Logger' : loggerAPI,
        'Media' : mediaAPI,
        'MediaCapture' : mediaCaptureAPI,
        'Network Status' : networkAPI,
        'Notification' : notificationAPI
    };

module.exports = {
    exec: function (win, fail, clazz, action, args) {
        var wwResult = webworks.exec(win, fail, clazz, action, args);

        //We got a sync result or a not found from WW that we can pass on to get a native mixin
        //For async calls there's nothing to do
        if ((wwResult.status === Cordova.callbackStatus.OK || 
          wwResult.status === Cordova.callbackStatus.CLASS_NOT_FOUND_EXCEPTION) &&
          plugins[clazz]) {
            return plugins[clazz].execute(wwResult.message, action, args, win, fail);
        }

        return wwResult;
    },
    resume: function () {},
    pause: function () {},
    destroy: function () {}
};
