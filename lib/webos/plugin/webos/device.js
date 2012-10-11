var service=require('cordova/plugin/webos/service')

module.exports={
  getDeviceInfo: function(success, fail, args) {
    console.log("webOS Plugin: Device - getDeviceInfo");

    this.request = service.Request('palm://com.palm.preferences/systemProperties', {
      method:"Get",
      parameters:{"key": "com.palm.properties.nduid" },
      onSuccess: postData
    }); 

    function postData(result) {

      var uuid=result["com.palm.properties.nduid"];

      var parsedData = JSON.parse(PalmSystem.deviceInfo);

      // fixed data
      var info={};
      info.cordova = "2.0.0";
      info.platform = "HP webOS";
      // variable data
      info.name = parsedData.modelName;
      info.version = parsedData.platformVersion;
      info.uuid = uuid;

      success(info);
    }

  }
};