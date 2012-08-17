var cordova = require('cordova');


module.exports = {

        getDeviceInfo:function(win,fail,args){
            console.log("NativeProxy::getDeviceInfo");
            setTimeout(function(){
                win({platform:"windows8", version:"8", name:"TODO", uuid:"TODO", cordova:"2.0.1"});
            },0);
        }
};