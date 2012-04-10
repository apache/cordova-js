var cordova = require('cordova');

/**
 * Execute a cordova command.  It is up to the native side whether this action
 * is synchronous or asynchronous.  The native side can return:
 *      Synchronous: PluginResult object as a JSON string
 *      Asynchrounous: Empty string ""
 * If async, the native side will cordova.callbackSuccess or cordova.callbackError,
 * depending upon the result of the action.
 *
 * @param {Function} success    The success callback
 * @param {Function} fail       The fail callback
 * @param {String} service      The name of the service to use
 * @param {String} action       Action to be run in cordova
 * @param {String[]} [args]     Zero or more arguments to pass to the method

 */
 
 /* this will become a programmatic way to gen the named args ... TODO: -jm
var NamedArgs = 
{
	File:{
		getFileMetadata:["fullPath"],
		readAsText:["fileName","encoding"],
		readAsDataURL:["fileName"],
		getDirectory:["fullPath","path","options"],
		removeRecursively:["fullPath"],
		getFile:["fullPath","path","options"],
		readEntries:["fullPath"],
		write:["fileName","data","position"],
		truncate:["fileName","size"]
	}
}
*/
 
var MonkeyPatch = 
{
	File:
	{
		"getFileMetadata":function(arg)
		{
			return  {fullPath:arg[0]};
		},
		"readAsText":function(arg)
		{ //[this.fileName, enc]
			return {fileName:arg[0],encoding:arg[1]};
		},
		"readAsDataURL":function(arg)
		{
			return {fileName:arg[0]};
		},
		"getDirectory":function(arg)
		{
			return {fullPath:arg[0],path:arg[1],options:arg[2]};
		},
		"removeRecursively":function(arg)
		{ 
			return {fullPath:arg[0]};
		},
		"getFile":function(arg)
		{
			return {fullPath:arg[0],path:arg[1],options:arg[2]};
		},
		"readEntries":function(arg)
		{
			return {fullPath:arg[0]};
		},
		"write":function(arg)
		{
			return {fileName:arg[0],data:arg[1],position:arg[2]};
		},
		"truncate":function(arg)
		{
			return {fileName:arg[0],size:arg[1]};
		}

	},
	FileTransfer: 
	{
		// [filePath, server, fileKey, fileName, mimeType, params, debug, chunkedMode]
		"upload":function(arg)
		{
			// note, chuncked mode is not supported in WP7 currently
			return {filePath:arg[0],server:arg[1],fileKey:arg[2],fileName:arg[3],mimeType:arg[4],params:arg[5],debug:arg[6]};
		}
	},
	Contacts:
	{
		"remove":function(arg) // actually caught by our other case inside exec
		{
			return arg[0];
		},
		"save":function(arg) // actually caught by our other case inside exec
		{
			return arg[0];
		},
		"search":function(arg)
		{
			return {fields:arg[0],options:arg[1]};
		}
	},
	Capture:
	{
		captureAudio:function(arg)// actually caught by our other case inside exec
		{
			return arg[0];	
		},
		captureVideo:function(arg)// actually caught by our other case inside exec
		{
			return arg[0];	
		},
		captureImage:function(arg)// actually caught by our other case inside exec
		{
			return arg[0];	
		}
	},
	Media:
	{
		create:function(arg)
		{
			return {id:arg[0],src:arg[1]};
		},
		startPlayingAudio:function(arg)
		{
			return {id:arg[0],src:arg[1],milliseconds:arg[2]};
		},
		stopPlayingAudio:function(arg)
		{
			return {id:arg[0]};
		},
		seekToAudio:function(arg)
		{
			return {id:arg[0],milliseconds:arg[1]};
		},
		pausePlayingAudio:function(arg)
		{
			return {id:arg[0]};
		},
		getCurrentPositionAudio:function(arg)
		{
			return {id:arg[0]};
		},
		startRecordingAudio:function(arg)
		{
			return {id:arg[0],src:arg[1]};
		},
		stopRecordingAudio:function(arg)
		{
			return {id:arg[0]};
		},
		release:function(arg)
		{
			return {id:arg[0]};
		},
		setVolume:function(arg)
		{
			return {id:arg[0],volume:arg[1]};
		}
	},
	Notification:
	{
		"alert":function(arg)
		{
			return {message:arg[0],title:arg[1],buttonLabel:arg[2]};
		},
		"confirm":function(arg)
		{
			return {message:arg[0],title:arg[1],buttonLabel:arg[2]};
		}
	},
	Camera:
	{
		"takePicture":function(arg)
		{
			//"takePicture", [quality, destinationType, sourceType, targetWidth, targetHeight, encodingType]);
			return {quality:arg[0],destinationType:arg[1],sourceType:arg[2],targetWidth:arg[3],targetHeight:arg[4],encodingType:arg[5]};
		}
	}
	
};

module.exports = function(success, fail, service, action, args) 
{

    var callbackId = service + cordova.callbackId++;
    if (typeof success == "function" || typeof fail == "function") 
	{
        cordova.callbacks[callbackId] = {success:success, fail:fail};
    }
    // generate a new command string, ex. DebugConsole/log/DebugConsole23/{"message":"wtf dude?"}
	
	 if(MonkeyPatch[service] && MonkeyPatch[service][action])
	 {
		//console.log("MonkeyPatching " + service + "." + action);
		args =  MonkeyPatch[service][action](args);
	 }
	 else if(args && args.length && args.length == 1)
	 {
		 args = args[0]; 
	 }
	
     var command = service + "/" + action + "/" + callbackId + "/" + JSON.stringify(args);
     // pass it on to Notify
	 try
	 {
		 if(window.external)
		 {
			 window.external.Notify(command);
		 }
		 else
		 {
			console.log("window.external not available :: command=" + command);  
		 }
	 }
	 catch(e)
	 {
		 console.log("Exception calling native with command :: " + command + " :: exception=" + e); 
	 }
};


