
console.log("console is being added");

var exec = require('cordova/exec'),
    channel = require('cordova/channel');
var cordova = require("cordova");


var debugConsole = 
{
	log:function(msg){
		cordova.exec(null,null,"DebugConsole","log",msg);
	},
	warn:function(msg){
		cordova.exec(null,null,"DebugConsole","warn",msg);
	},
	error:function(msg){
		cordova.exec(null,null,"DebugConsole","error",msg);
	}	
};


if(typeof window.console == "undefined")
{
	window.console = debugConsole;
}
else
{
	console.log("window.console is already defined");
}

// output any errors to console log, created above.
window.onerror=function(e)
{
	debugConsole.error(JSON.stringify(e));
};

module.exports = debugConsole;

console.log("console is added");
