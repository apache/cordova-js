
var exec = require('cordova/exec'),
    channel = require('cordova/channel');
var cordova = require("cordova");

var debugConsole = {
    log:function(msg){
        exec(null,null,"DebugConsole","log",msg);
    },
    warn:function(msg){
        exec(null,null,"DebugConsole","warn",msg);
    },
    error:function(msg){
        exec(null,null,"DebugConsole","error",msg);
    }
};

module.exports = debugConsole;