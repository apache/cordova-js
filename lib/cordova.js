var channel = require('cordova/channel');
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
    } else if (typeof documentEventHandlers[e] != 'undefined') {
      documentEventHandlers[e].subscribe(handler);
    } else {
      m_document_addEventListener.call(document, evt, handler, capture);
    }
};

window.addEventListener = function(evt, handler, capture) {
  var e = evt.toLowerCase();
  if (typeof windowEventHandlers[e] != 'undefined') {
    windowEventHandlers[e].subscribe(handler);
  } else {
    m_window_addEventListener.call(window, evt, handler, capture);
  }
};

document.removeEventListener = function(evt, handler, capture) {
  var e = evt.toLowerCase();
  // If unsubcribing from an event that is handled by a plugin
  if (typeof documentEventHandlers[e] != "undefined") {
    documentEventHandlers[e].unsubscribe(handler);
  } else {
    m_document_removeEventListener.call(document, evt, handler, capture);
  }
};

window.removeEventListener = function(evt, handler, capture) {
  var e = evt.toLowerCase();
  // If unsubcribing from an event that is handled by a plugin
  if (typeof windowEventHandlers[e] != "undefined") {
    windowEventHandlers[e].unsubscribe(handler);
  } else {
    m_window_removeEventListener.call(window, evt, handler, capture);
  }
};

function createEvent(type, data) {
  var event = document.createEvent('Events');
  event.initEvent(type, false, false);
  if (data) {
    for (var i in data) {
      if (data.hasOwnProperty(i)) {
        event[i] = data[i];
      }
    }
  }
  return event;
}

var cordova = {
    define:define,
    require:require,
    /**
     * Methods to add/remove your own addEventListener hijacking on document + window.
     */
    addWindowEventHandler:function(event, opts) {
      return (windowEventHandlers[event] = channel.create(event, opts));
    },
    addDocumentEventHandler:function(event, opts) {
      return (documentEventHandlers[event] = channel.create(event, opts));
    },
    removeWindowEventHandler:function(event) {
      delete windowEventHandlers[event];
    },
    removeDocumentEventHandler:function(event) {
      delete documentEventHandlers[event];
    },
    /**
     * Method to fire event from native code
     */
    fireDocumentEvent: function(type, data) {
      var evt = createEvent(type, data);
      if (typeof documentEventHandlers[type] != 'undefined') {
        documentEventHandlers[type].fire(evt);
      } else {
        document.dispatchEvent(evt);
      }
    },
    fireWindowEvent: function(type, data) {
      var evt = createEvent(type,data);
      if (typeof windowEventHandlers[type] != 'undefined') {
        windowEventHandlers[type].fire(evt);
      } else {
        window.dispatchEvent(evt);
      }
    },
    // TODO: this is Android only; think about how to do this better
    shuttingDown:false,
    UsePolling:false,
    // END TODO

    // TODO: iOS only
    // This queue holds the currently executing command and all pending
    // commands executed with cordova.exec().
    commandQueue:[],
    // Indicates if we're currently in the middle of flushing the command
    // queue on the native side.
    commandQueueFlushing:false,
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
        if (cordova.callbacks[callbackId]) {

            // If result is to be sent to callback
            if (args.status == cordova.callbackStatus.OK) {
                try {
                    if (cordova.callbacks[callbackId].success) {
                        cordova.callbacks[callbackId].success(args.message);
                    }
                }
                catch (e) {
                    console.log("Error in success callback: "+callbackId+" = "+e);
                }
            }

            // Clear callback if not expecting any more results
            if (!args.keepCallback) {
                delete cordova.callbacks[callbackId];
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
        if (cordova.callbacks[callbackId]) {
            try {
                if (cordova.callbacks[callbackId].fail) {
                    cordova.callbacks[callbackId].fail(args.message);
                }
            }
            catch (e) {
                console.log("Error in error callback: "+callbackId+" = "+e);
            }

            // Clear callback if not expecting any more results
            if (!args.keepCallback) {
                delete cordova.callbacks[callbackId];
            }
        }
    },
    // TODO: remove in 2.0.
    addPlugin: function(name, obj) {
        console.log("[DEPRECATION NOTICE] window.addPlugin and window.plugins will be removed in version 2.0.");
        if (!window.plugins[name]) {
            window.plugins[name] = obj;
        }
        else {
            console.log("Error: Plugin "+name+" already exists.");
        }
    },
    
    addConstructor: function(func) {
        channel.onCordovaReady.subscribeOnce(function() {
            try {
                func();
            } catch(e) {
                console.log("Failed to run constructor: " + e);
            }
        });
    }
};

/** 
 * Legacy variable for plugin support
 * TODO: remove in 2.0.
 */
if (!window.PhoneGap) {
    window.PhoneGap = cordova;
}

/**
 * Plugins object
 * TODO: remove in 2.0.
 */
if (!window.plugins) {
    window.plugins = {};
}

module.exports = cordova;
