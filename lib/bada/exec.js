var plugins = {
    "Device": require('cordova/plugin/bada/device'),
    "NetworkStatus": require('cordova/plugin/bada/NetworkStatus'),
//    "Accelerometer": require('cordova/plugin/bada/Accelerometer'),
    "Notification": require('cordova/plugin/bada/Notification'),
    "Compass": require('cordova/plugin/bada/Compass'),
    "Capture": require('cordova/plugin/bada/Capture'),
    "Camera": require('cordova/plugin/bada/Camera'),
    "Contacts": require('cordova/plugin/bada/Contacts')
};

module.exports = function(success, fail, service, action, args) {
    try {
        plugins[service][action](success, fail, args);
    }
    catch(e) {
        console.log("missing exec: " + service + "." + action);
        console.log(args);
        console.log(e);
        console.log(e.stack);
    }
};
