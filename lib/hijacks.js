(function() {
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
   * Custom PhoneGap or plugin event handler map
   */
  var documentEventHandler = {},
      windowEventHandler = {};

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
      } else if (typeof documentEventHandler[e] !== 'undefined' && documentEventHandler[e](e, handler, true)) {
         return;
      } else {
          m_document_addEventListener.call(document, evt, handler, capture);
      }
  };

  window.addEventListener = function(evt, handler, capture) {
    var e = evt.toLowerCase();
    if (typeof windowEventHandler[e] !== 'undefined' && windowEventHandler[e](e, handler, true)) {
      return;
    } else {
      m_window_addEventListener.call(window, evt, handler, capture);
    }
  };

  document.removeEventListener = function(evt, handler, capture) {
    var e = evt.toLowerCase();
    // If unsubcribing from an event that is handled by a plugin
    if (typeof documentEventHandler[e] !== "undefined" && documentEventHandler[e](e, handler, false)) {
      return;
    } else {
      m_document_removeEventListener.call(document, evt, handler, capture);
    }
  };

  window.removeEventListener = function(evt, handler, capture) {
    var e = evt.toLowerCase();
    // If unsubcribing from an event that is handled by a plugin
    if (typeof windowEventHandler[e] !== "undefined" && windowEventHandler[e](e, handler, false)) {
      return;
    } else {
      m_window_removeEventListener.call(window, evt, handler, capture);
    }
  };
})();
