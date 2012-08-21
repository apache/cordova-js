document.addEventListener("webworksready", function () {
    require('cordova/channel').onNativeReady.fire();
});
