/*
 * PhoneGap is available under *either* the terms of the modified BSD license *or* the
 * MIT License (2008). See http://opensource.org/licenses/alphabetical for full text.
 *
 * Copyright (c) 2011, Research In Motion Limited.
 */
 
var retAsyncCall = { "status" : PhoneGap.callbackStatus.NO_RESULT, "message" : "WebWorks Is On It" },
    retInvalidAction = { "status" : PhoneGap.callbackStatus.INVALID_ACTION, "message" : "Action not found" },
    // Define JavaScript plugin implementations that are common across
    // WebWorks platforms (phone/tablet).
    plugins = {};

module.exports = {
    exec: function (win, fail, clazz, action, args) {
        if (plugins[clazz]) {
            return plugins[clazz].execute(action, args, win, fail);
        }

        return {"status" : PhoneGap.callbackStatus.CLASS_NOT_FOUND_EXCEPTION, "message" : "Class " + clazz + " cannot be found"};
    }
};

//HACK: this shouldn't be done here but we need this stuff early
if (!window.phonegap) {
    window.phonegap = {};
}

phonegap.WebworksPluginManager = module.exports;
