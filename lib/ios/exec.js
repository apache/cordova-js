    /**
     * Creates a gap bridge iframe used to notify the native code about queued
     * commands.
     *
     * @private
     */
var cordova = require('cordova'),
    utils = require('cordova/utils'),
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
    if (!channel.onCordovaReady.fired) {
        utils.alert("ERROR: Attempting to call cordova.exec()" +
              " before 'deviceready'. Ignoring.");
        return;
    }

    var successCallback, failCallback, service, action, actionArgs, splitCommand;
    var callbackId = null;
    if (typeof arguments[0] !== "string") {
        // FORMAT ONE
        successCallback = arguments[0];
        failCallback = arguments[1];
        service = arguments[2];
        action = arguments[3];
        actionArgs = arguments[4];

        // Since we need to maintain backwards compatibility, we have to pass
        // an invalid callbackId even if no callback was provided since plugins
        // will be expecting it. The Cordova.exec() implementation allocates
        // an invalid callbackId and passes it even if no callbacks were given.
        callbackId = 'INVALID';
    } else {
        // FORMAT TWO
        splitCommand = arguments[0].split(".");
        action = splitCommand.pop();
        service = splitCommand.join(".");
        actionArgs = Array.prototype.splice.call(arguments, 1);
    }

    // Start building the command object.
    var command = {
        className: service,
        methodName: action,
        "arguments": []
    };

    // Register the callbacks and add the callbackId to the positional
    // arguments if given.
    if (successCallback || failCallback) {
        callbackId = service + cordova.callbackId++;
        cordova.callbacks[callbackId] =
            {success:successCallback, fail:failCallback};
    }
    if (callbackId !== null) {
        command["arguments"].push(callbackId);
    }

    for (var i = 0; i < actionArgs.length; ++i) {
        var arg = actionArgs[i];
        if (arg === undefined || arg === null) { // nulls are pushed to the args now (becomes NSNull)
            command["arguments"].push(arg);
        } else if (typeof(arg) == 'object' && !(utils.isArray(arg))) {
            command.options = arg;
        } else {
            command["arguments"].push(arg);
        }
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
