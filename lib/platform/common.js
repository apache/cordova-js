module.exports = {
  objects: {
    Acceleration: {
      path: "phonegap/plugin/Acceleration"
    },
    navigator: {
      path: "phonegap/plugin/navigator",
      children: {
        notification: {
          path: "phonegap/plugin/notification"
        },
        accelerometer: {
          path: "phonegap/plugin/accelerometer"
        },
        battery: {
          path: "phonegap/plugin/battery"
        },
        camera:{
          path: "phonegap/plugin/camera"
        },
        compass:{
          path: "phonegap/plugin/compass"
        },
        device:{
          children:{
            capture: {
              path: "phonegap/plugin/capture"
            }
          }
        },
        network: {
          children: {
            connection: {
              path: "phonegap/plugin/network"
            }
          }
        }
      }
    },
    Camera:{
      path: "phonegap/plugin/CameraConstants"
    },
    CaptureError: {
      path: "phonegap/plugin/CaptureError"
    },
    CaptureAudioOptions:{
      path: "phonegap/plugin/CaptureAudioOptions"
    },
    CaptureImageOptions: {
      path: "phonegap/plugin/CaptureImageOptions"
    },
    CaptureVideoOptions: {
      path: "phonegap/plugin/CaptureVideoOptions"
    },
    CompassHeading:{
      path: "phonegap/plugin/CompassHeading"
    },
    CompassError:{
      path: "phonegap/plugin/CompassConstants"
    },
    ConfigurationData: {
      path: "phonegap/plugin/ConfigurationData"
    },
    Connection: {
      path: "phonegap/plugin/Connection"
    },
    File: {
      path: "phonegap/plugin/File"
    },
    FileError: {
      path: "phonegap/plugin/FileError"
    },
    MediaFile: {
      path: "phonegap/plugin/MediaFile"
    },
    MediaFileData:{
      path: "phonegap/plugin/MediaFileData"
    }
  }
};
