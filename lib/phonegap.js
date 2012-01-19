var channel = require('phonegap/channel');
/**
 * Intercept calls to addEventListener + removeEventListener and handle deviceready,
 * resume, and pause events.
 */
var m_document_addEventListener = document.addEventListener;
var m_document_removeEventListener = document.removeEventListener;
var m_window_addEventListener = window.addEventListener;
var m_window_removeEventListener = window.removeEventListener;

/**
 * Houses custom event handlers to intercept on document + window event listeners.
 */
var documentEventHandlers = {},
    windowEventHandlers = {};

document.addEventListener = function(evt, handler, capture) {
    var e = evt.toLowerCase();
    if (e == 'deviceready') {
        channel.onDeviceReady.subscribeOnce(handler);
    } else if (e == 'resume') {
        channel.onResume.subscribe(handler);
        // if subscribing listener after event has already fired, invoke the handler
        if (channel.onResume.fired && handler instanceof Function) {
            handler();
        }
    } else if (e == 'pause') {
      channel.onPause.subscribe(handler);
    } else if (typeof documentEventHandlers[e] != 'undefined' && documentEventHandlers[e](e, handler, true)) {
      // If the event is registered as a custom one to handle, toss it over to the custom handler.
      return;
    } else {
      m_document_addEventListener.call(document, evt, handler, capture);
    }
};

window.addEventListener = function(evt, handler, capture) {
  var e = evt.toLowerCase();
  if (typeof windowEventHandlers[e] != 'undefined' && windowEventHandlers[e](e, handler, true)) {
    return;
  } else {
    m_window_addEventListener.call(window, evt, handler, capture);
  }
};

document.removeEventListener = function(evt, handler) {
  var e = evt.toLowerCase();
  // If unsubcribing from an event that is handled by a plugin
  if (typeof documentEventHandlers[e] != "undefined" && documentEventHandlers[e](e, handler, false)) {
    return;
  } else {
    m_document_removeEventListener.call(document, evt, handler, capture);
  }
};

window.removeEventListener = function(evt, handler, capture) {
  var e = evt.toLowerCase();
  // If unsubcribing from an event that is handled by a plugin
  if (typeof windowEventHandlers[e] != "undefined" && windowEventHandlers[e](e, handler, false)) {
    return;
  } else {
    m_window_removeEventListener.call(window, evt, handler, capture);
  }
};

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
     * Methods to add your own addEventListener hijacking on document + window.
     */
    addWindowEventHandler:function(event, callback) {
      windowEventHandlers[event] = callback;
    },
    addDocumentEventHandler:function(event, callback) {
      documentEventHandlers[event] = callback;
    },
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
