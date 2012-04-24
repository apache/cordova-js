module.exports = {
      _mainCamera: null,
      _cams: [],
      getPicture: function(cameraSuccess, cameraFailure, cameraOptions) {
       // TODO
      },
      getPreview: function() {
       var self = this;
       var onCreatePreviewNodeSuccess = function(previewObject) {
           var previewDiv = document.getElementById("preview");
           previewDiv.appendChild(previewObject);
           previewObject.style.visibility = "visible";
       };
       var error = function(e) {
           alert("An error occured: " + e.message);
       };

       var success = function(cams) {
           if (cams.length > 0) {
            self._cams = cams;
               self._mainCamera = cams[0];
               self._mainCamera.createPreviewNode(onCreatePreviewNodeSuccess, error);
               return;
           }
           alert("Sorry, no cameras available.");
       };
       deviceapis.camera.getCameras(success, error);
      }
};

