var cordova = require('cordova'),
    MediaFile = require('cordova/plugin/MediaFile'),
    /**
     * Private list of HTML 5 audio objects, indexed by the Cordova media object ids
     */
    audioObjects = {},
    retInvalidAction = function () {
        return { "status" : cordova.callbackStatus.INVALID_ACTION, "message" : "Action not found" };
    },
    retAsyncCall = function () {
        return { "status" : cordova.callbackStatus.NO_RESULT, "message" : "WebWorks Is On It" };
    },
    batteryAPI = {
        start: function (args, win, fail) {
            // Register one listener to each of level and state change
            // events using WebWorks API.
            blackberry.system.event.deviceBatteryStateChange(function(state) {
                var me = navigator.battery;
                // state is either CHARGING or UNPLUGGED
                if (state === 2 || state === 3) {
                    var info = {
                        "level" : me._level,
                        "isPlugged" : state === 2
                    };

                    if (me._isPlugged !== info.isPlugged && typeof win === 'function') {
                        win(info);
                    }
                }
            });
            blackberry.system.event.deviceBatteryLevelChange(function(level) {
                var me = navigator.battery;
                if (level != me._level && typeof win === 'function') {
                    win({'level' : level, 'isPlugged' : me._isPlugged});
                }
            });

            return retAsyncCall();
        },
        stop: function (args, win, fail) {
            // Unregister battery listeners.
            blackberry.system.event.deviceBatteryStateChange(null);
            blackberry.system.event.deviceBatteryLevelChange(null);
            return retAsyncCall();
        }
    },
    cameraAPI = {
        takePicture: function (args, win, fail) {
            blackberry.media.camera.takePicture(win, fail, fail);
            return retAsyncCall();
        }
    },
    deviceAPI = {
        getDeviceInfo: function (args, win, fail) {
            return {"status" : cordova.callbackStatus.OK,
                    "message" : {
                        "version" : blackberry.system.softwareVersion,
                        "name" : blackberry.system.model,
                        "uuid" : blackberry.identity.PIN,
                        "platform" : "PlayBook",
                        "cordova" : "1.7.0rc1"
                    }
            };
        }
    },
    loggerAPI = {
        log: function (args, win, fail) {
            console.log(args);
            return {"status" : cordova.callbackStatus.OK,
                    "message" : 'Message logged to console: ' + args};
        }
    },
    mediaAPI = {
        startPlayingAudio: function (args, win, fail) {
            if (!args.length) {
                return {"status" : 9, "message" : "Media Object id was not sent in arguments"};
            }

            var id = args[0],
                audio = audioObjects[id],
                result;

            if (args.length === 1) {
                return {"status" : 9, "message" : "Media source argument not found"};
            }

            if (audio) {
                audio.pause();
                audioObjects[id] = undefined;
            }

            audio = audioObjects[id] = new Audio(args[1]);
            audio.play();

            return {"status" : 1, "message" : "Audio play started" };
        },
        stopPlayingAudio: function (args, win, fail) {
            if (!args.length) {
                return {"status" : 9, "message" : "Media Object id was not sent in arguments"};
            }

            var id = args[0],
                audio = audioObjects[id],
                result;

            if (!audio) {
                return {"status" : 2, "message" : "Audio Object has not been initialized"};
            }

            audio.pause();
            audioObjects[id] = undefined;

            return {"status" : 1, "message" : "Audio play stopped" };
        },
        seekToAudio: function (args, win, fail) {
            if (!args.length) {
                return {"status" : 9, "message" : "Media Object id was not sent in arguments"};
            }

            var id = args[0],
                audio = audioObjects[id],
                result;

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

            return result;
        },
        pausePlayingAudio: function (args, win, fail) {
            if (!args.length) {
                return {"status" : 9, "message" : "Media Object id was not sent in arguments"};
            }

            var id = args[0],
                audio = audioObjects[id],
                result;

            if (!audio) {
                return {"status" : 2, "message" : "Audio Object has not been initialized"};
            }

            audio.pause();

            return {"status" : 1, "message" : "Audio paused" };
        },
        getCurrentPositionAudio: function (args, win, fail) {
            if (!args.length) {
                return {"status" : 9, "message" : "Media Object id was not sent in arguments"};
            }

            var id = args[0],
                audio = audioObjects[id],
                result;

            if (!audio) {
                return {"status" : 2, "message" : "Audio Object has not been initialized"};
            }

            return {"status" : 1, "message" : audio.currentTime };
        },
        getDuration: function (args, win, fail) {
            if (!args.length) {
                return {"status" : 9, "message" : "Media Object id was not sent in arguments"};
            }

            var id = args[0],
                audio = audioObjects[id],
                result;

            if (!audio) {
                return {"status" : 2, "message" : "Audio Object has not been initialized"};
            }

            return {"status" : 1, "message" : audio.duration };
        },
        startRecordingAudio: function (args, win, fail) {
            if (!args.length) {
                return {"status" : 9, "message" : "Media Object id was not sent in arguments"};
            }

            var id = args[0],
                audio = audioObjects[id],
                result;

            if (args.length <= 1) {
                result = {"status" : 9, "message" : "Media start recording, insufficient arguments"};
            }

            blackberry.media.microphone.record(args[1], win, fail);
            return retAsyncCall();
        },
        stopRecordingAudio: function (args, win, fail) {
        },
        release: function (args, win, fail) {
            if (!args.length) {
                return {"status" : 9, "message" : "Media Object id was not sent in arguments"};
            }

            var id = args[0],
                audio = audioObjects[id],
                result;

            if (audio) {
                audioObjects[id] = undefined;
                audio.src = undefined;
                //delete audio;
            }

            result = {"status" : 1, "message" : "Media resources released"};

            return result;
        }
    },
    mediaCaptureAPI = {
        getSupportedAudioModes: function (args, win, fail) {
            return {"status": cordova.callbackStatus.OK, "message": []};
        },
        getSupportedImageModes: function (args, win, fail) {
            return {"status": cordova.callbackStatus.OK, "message": []};
        },
        getSupportedVideoModes: function (args, win, fail) {
            return {"status": cordova.callbackStatus.OK, "message": []};
        },
        captureImage: function (args, win, fail) {
            var limit = args[0];

            if (limit > 0) {
                blackberry.media.camera.takePicture(win, fail, fail);
            }
            else {
                win([]);
            }

            return retAsyncCall();
        },
        captureVideo: function (args, win, fail) {
            var limit = args[0];

            if (limit > 0) {
                blackberry.media.camera.takeVideo(win, fail, fail);
            }
            else {
                win([]);
            }
            
            return retAsyncCall();
        },
        captureAudio: function (args, win, fail) {
            return {"status": cordova.callbackStatus.INVALID_ACTION, "message": "captureAudio is not currently supported"};
        }
    },
    networkAPI = {
        getConnectionInfo: function (args, win, fail) {
            var connectionType = require("cordova/plugin/Connection").NONE,
                eventType = "offline",
                callbackID,
                request;

            /**
             * For PlayBooks, we currently only have WiFi connections, so
             * return WiFi if there is any access at all.
             * TODO: update if/when PlayBook gets other connection types...
             */
            if (blackberry.system.hasDataCoverage()) {
                connectionType = require("cordova/plugin/Connection").WIFI;
                eventType = "online";
            }

            //Register an event handler for the networkChange event
            callbackID = blackberry.events.registerEventHandler("networkChange", function (status) {
                win(status.type);
            });

            //pass our callback id down to our network extension
            request = new blackberry.transport.RemoteFunctionCall("org/apache/cordova/getConnectionInfo");
            request.addParam("networkStatusChangedID", callbackID);
            request.makeSyncCall();

            return { "status": cordova.callbackStatus.OK, "message": connectionType};
        }
    },
    notificationAPI = {
        alert: function (args, win, fail) {
            if (args.length !== 3) {
                return {"status" : 9, "message" : "Notification action - alert arguments not found"};
            }

            //Unpack and map the args
            var msg = args[0],
                title = args[1],
                btnLabel = args[2];

            blackberry.ui.dialog.customAskAsync.apply(this, [ msg, [ btnLabel ], win, { "title" : title } ]);
            return retAsyncCall();
        },
        confirm: function (args, win, fail) {
            if (args.length !== 3) {
                return {"status" : 9, "message" : "Notification action - confirm arguments not found"};
            }

            //Unpack and map the args
            var msg = args[0],
                title = args[1],
                btnLabel = args[2],
                btnLabels = btnLabel.split(",");

            blackberry.ui.dialog.customAskAsync.apply(this, [msg, btnLabels, win, {"title" : title} ]);
            return retAsyncCall();
        }
    },
    plugins = {
        'Battery' : batteryAPI,
        'Camera' : cameraAPI,
        'Device' : deviceAPI,
        'Logger' : loggerAPI,
        'Media' : mediaAPI,
        'Capture' : mediaCaptureAPI,
        'NetworkStatus' : networkAPI,
        'Notification' : notificationAPI
    };

module.exports = {
    exec: function (win, fail, clazz, action, args) {
        var result = {"status" : cordova.callbackStatus.CLASS_NOT_FOUND_EXCEPTION, "message" : "Class " + clazz + " cannot be found"};

        if (plugins[clazz]) {
            if (plugins[clazz][action]) {
                result = plugins[clazz][action](args, win, fail);
            }
            else {
                result = retInvalidAction();
            }
        }

        return result;
    },
    resume: function () {},
    pause: function () {},
    destroy: function () {}
};
