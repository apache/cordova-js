var cordova = require('cordova');


module.exports = {

        getDeviceInfo:function(win,fail,args){
            console.log("NativeProxy::getDeviceInfo");
            setTimeout(function(){
                win({platform:"win8metro", version:"8", name:"metrova", uuid:"42", cordova:"2.0.1"});
            },0);
        }
};