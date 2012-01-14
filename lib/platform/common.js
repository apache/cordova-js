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
        network: {
          children: {
            connection: {
              path: "phonegap/plugin/network"
            }
          }
        }
      }
    },
    Connection: {
      path: "phonegap/plugin/Connection"
    }
  }
};
