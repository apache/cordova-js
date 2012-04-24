module.exports = {
    captureAudio: function() {
      console.log("navigator.capture.captureAudio unsupported!");
    },
    captureVideo: function(success, fail, options) {
          var camera = navigator.camera._mainCamera;
      camera.startVideoCapture(success, fail, options);
          if(options.duration) {
            Osp.Core.Function.delay(camera.stopVideoCapture, options.duration, camera);
          }
    },
    stopVideoCapture: function() {
      navigator.camera._mainCamera.stopVideoCapture();
    },
    captureImage: function(success, fail, options) {
      try {
        navigator.camera._mainCamera.captureImage(success, fail, options);
      } catch(exp) {
        alert("Exception :[" + exp.code + "] " + exp.message);
      }
    }
}
