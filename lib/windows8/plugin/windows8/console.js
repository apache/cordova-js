
if(!console || !console.log)
{
    var exec = require('cordova/exec');

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
}
else if(console && console.log) {
    
  console.log("console.log exists already!");
  console.warn = console.warn || function(msg){console.log("warn:"+msg);};
  console.error = console.error || function(msg){console.log("error:"+msg);};
}
