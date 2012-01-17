/*
 * phonegap is available under *either* the terms of the modified BSD license *or* the
 * MIT License (2008). See http://opensource.org/licenses/alphabetical for full text.
 * 
 * Copyright (c) 2005-2010, Nitobi Software Inc.
 * Copyright (c) 2010-2011, IBM Corporation
 */

/**
 * This represents the phonegap API itself, and provides a global namespace for accessing
 * information about the state of phonegap.
 */

function createEvent(type) {
    var event = document.createEvent('Events');
    event.initEvent(type, false, false);
    return event;
}

function fireEvent(target, evt, data) {
    if (data) {
        for (var i in data) {
            if (data.hasOwnProperty(i)) {
                evt[i] = data[i];
            }
        }
    }
    target.dispatchEvent(evt);
}

var phonegap = {
    /**
     * Method to fire event from native code
     */
    fireDocumentEvent: function(type, data) {
      fireEvent(document, createEvent(type), data);
    },
    fireWindowEvent: function(type, data) {
      fireEvent(window, createEvent(type), data);
    },
    // TODO: this is Android only; think about how to do this better
    shuttingDown:false,
    UsePolling:false,
    // END TODO
    /**
     * Plugin callback mechanism.
     */
    callbackId: 0,
    callbacks:  {},
    callbackStatus: {
        NO_RESULT: 0,
        OK: 1,
        CLASS_NOT_FOUND_EXCEPTION: 2,
        ILLEGAL_ACCESS_EXCEPTION: 3,
        INSTANTIATION_EXCEPTION: 4,
        MALFORMED_URL_EXCEPTION: 5,
        IO_EXCEPTION: 6,
        INVALID_ACTION: 7,
        JSON_EXCEPTION: 8,
        ERROR: 9
    },

    /**
     * Called by native code when returning successful result from an action.
     *
     * @param callbackId
     * @param args
     */
    callbackSuccess: function(callbackId, args) {
        if (phonegap.callbacks[callbackId]) {

            // If result is to be sent to callback
            if (args.status == phonegap.callbackStatus.OK) {
                try {
                    if (phonegap.callbacks[callbackId].success) {
                        phonegap.callbacks[callbackId].success(args.message);
                    }
                }
                catch (e) {
                    console.log("Error in success callback: "+callbackId+" = "+e);
                }
            }

            // Clear callback if not expecting any more results
            if (!args.keepCallback) {
                delete phonegap.callbacks[callbackId];
            }
        }
    },

    /**
     * Called by native code when returning error result from an action.
     *
     * @param callbackId
     * @param args
     */
    callbackError: function(callbackId, args) {
        if (phonegap.callbacks[callbackId]) {
            try {
                if (phonegap.callbacks[callbackId].fail) {
                    phonegap.callbacks[callbackId].fail(args.message);
                }
            }
            catch (e) {
                console.log("Error in error callback: "+callbackId+" = "+e);
            }

            // Clear callback if not expecting any more results
            if (!args.keepCallback) {
                delete phonegap.callbacks[callbackId];
            }
        }
    }
};

module.exports = phonegap;
