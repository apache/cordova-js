    /**
     * Creates a gap bridge iframe used to notify the native code about queued
     * commands.
     *
     * @private
     */
var cordova = require('cordova'),
    gapBridge,
    createGapBridge = function() {
        gapBridge = document.createElement("iframe");
        gapBridge.setAttribute("style", "display:none;");
        gapBridge.setAttribute("height","0px");
        gapBridge.setAttribute("width","0px");
        gapBridge.setAttribute("frameborder","0");
        document.documentElement.appendChild(gapBridge);
    },
    channel = require('cordova/channel');

module.exports = function() { 
    if (!channel.onCordovaInfoReady.fired) {
        alert("ERROR: Attempting to call cordova.exec()" +
              " before 'deviceready'. Ignoring.");
        return;
    }

    var successCallback, failCallback, service, action, actionArgs;
    successCallback = arguments[0];
    failCallback = arguments[1];
    service = arguments[2];
    action = arguments[3];
    actionArgs = arguments[4];

    var callbackId = service + cordova.callbackId++;

    // Since we need to maintain backwards compatibility, we have to pass
    // an invalid callbackId even if no callback was provided since plugins
    // will be expecting it. The cordova.exec() implementation allocates
    // an invalid callbackId and passes it even if no callbacks were given.
    
    // Start building the command object.
    var command = {
        className: service,
        methodName: action,
        arguments: [callbackId].concat(actionArgs)
    };

    // Register the callbacks and add the callbackId to the positional
    // arguments if given.
    if (successCallback || failCallback) {
        cordova.callbacks[callbackId] = 
            {success:successCallback, fail:failCallback};
    }

    // Stringify and queue the command. We stringify to command now to
    // effectively clone the command arguments in case they are mutated before
    // the command is executed.
    cordova.commandQueue.push(JSON.stringify(command));

    // If the queue length is 1, then that means it was empty before we queued
    // the given command, so let the native side know that we have some
    // commands to execute, unless the queue is currently being flushed, in
    // which case the command will be picked up without notification.
    if (cordova.commandQueue.length == 1 && !cordova.commandQueueFlushing) {
        if (!gapBridge) {
            createGapBridge();
        }

        gapBridge.src = "gap://ready";
    }
};
