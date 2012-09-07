
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

var oldOnError = window.onerror;
window.onerror = function(msg,fileName,line) {
    oldOnError && oldOnError(msg,fileName,line);
    debugConsole.error(msg + " file:" + fileName + " Line:" + line);
};

module.exports = debugConsole;