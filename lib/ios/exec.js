    /**
     * Creates a gap bridge iframe used to notify the native code about queued
     * commands.
     *
     * @private
     */
var cordova = require('cordova'),
    channel = require('cordova/channel'),
    nativecomm = require('cordova/plugin/ios/nativecomm'),
    utils = require('cordova/utils'),
    jsToNativeModes = {
        IFRAME_NAV: 0,
        XHR_NO_PAYLOAD: 1,
        XHR_WITH_PAYLOAD: 2,
        XHR_OPTIONAL_PAYLOAD: 3
    },
    bridgeMode = jsToNativeModes.IFRAME_NAV,
    execIframe,
    execXhr;

function createExecIframe() {
    var iframe = document.createElement("iframe");
    iframe.style.display = 'none';
    document.body.appendChild(iframe);
    return iframe;
}

function shouldBundleCommandJson() {
    if (bridgeMode == 2) {
        return true;
    }
    if (bridgeMode == 3) {
        var payloadLength = 0;
        for (var i = 0; i < cordova.commandQueue.length; ++i) {
            payloadLength += cordova.commandQueue[i].length;
        }
        // The value here was determined using the benchmark within CordovaLibApp on an iPad 3.
        return payloadLength < 4500;
    }
    return false;
}

function iOSExec() {
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

    // Register the callbacks and add the callbackId to the positional
    // arguments if given.
    if (successCallback || failCallback) {
        callbackId = service + cordova.callbackId++;
        cordova.callbacks[callbackId] =
            {success:successCallback, fail:failCallback};
    }

    var command = [callbackId, service, action, actionArgs];

    // Stringify and queue the command. We stringify to command now to
    // effectively clone the command arguments in case they are mutated before
    // the command is executed.
    cordova.commandQueue.push(JSON.stringify(command));

    // If the queue length is 1, then that means it was empty before we queued
    // the given command, so let the native side know that we have some
    // commands to execute, unless the queue is currently being flushed, in
    // which case the command will be picked up without notification.
    if (cordova.commandQueue.length == 1 && !cordova.commandQueueFlushing) {
        if (bridgeMode) {
            execXhr = execXhr || new XMLHttpRequest();
            execXhr.open('HEAD', "file:///!gap_exec", true);
            execXhr.setRequestHeader('vc', cordova.iOSVCAddr);
            if (shouldBundleCommandJson()) {
                execXhr.setRequestHeader('cmds', nativecomm());
            }
            execXhr.send(null);
        } else {
            execIframe = execIframe || createExecIframe();
            execIframe.src = "gap://ready";
        }
    }
}

iOSExec.jsToNativeModes = jsToNativeModes;

iOSExec.setJsToNativeBridgeMode = function(mode) {
    // Remove the iFrame since it may be no longer required, and its existence
    // can trigger browser bugs.
    // https://issues.apache.org/jira/browse/CB-593
    if (execIframe) {
        execIframe.parentNode.removeChild(execIframe);
        execIframe = null;
    }
    if (mode && !cordova.iOSVCAddr) {
        alert('ViewController not correctly initialized for XHR mode.');
        mode = 0;
    }
    bridgeMode = mode;
};

module.exports = iOSExec;
