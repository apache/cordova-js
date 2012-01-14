/**
 * Custom pub-sub channel that can have functions subscribed to it
 */
var Channel = function(type) {
        this.type = type;
        this.handlers = [];
        this.guid = 0;
        this.fired = false;
        this.enabled = true;
    },
    channel = {
        /**
         * Calls the provided function only after all of the channels specified
         * have been fired.
         */
        join: function (h, c) {
            var i = c.length;
            var len = i;
            var f = function() {
                if (!(--i)) h();
            };
            for (var j=0; j<len; j++) {
                (!c[j].fired?c[j].subscribeOnce(f):i--);
            }
            if (!i) h();
        },
        create: function (type) {
            channel[type] = new Channel(type);
            return channel[type];
        }
    },
    utils = require('phonegap/utils');

/**
 * Subscribes the given function to the channel. Any time that 
 * Channel.fire is called so too will the function.
 * Optionally specify an execution context for the function
 * and a guid that can be used to stop subscribing to the channel.
 * Returns the guid.
 */
Channel.prototype.subscribe = function(f, c, g) {
    // need a function to call
    if (f === null) { return; }

    var func = f;
    if (typeof c == "object" && f instanceof Function) { func = utils.close(c, f); }

    g = g || func.observer_guid || f.observer_guid || this.guid++;
    func.observer_guid = g;
    f.observer_guid = g;
    this.handlers[g] = func;
    return g;
};

/**
 * Like subscribe but the function is only called once and then it
 * auto-unsubscribes itself.
 */
Channel.prototype.subscribeOnce = function(f, c) {
    var g = null;
    var _this = this;
    var m = function() {
        f.apply(c || null, arguments);
        _this.unsubscribe(g);
    };
    if (this.fired) {
        if (typeof c == "object" && f instanceof Function) { f = utils.close(c, f); }
        f.apply(this, this.fireArgs);
    } else {
        g = this.subscribe(m);
    }
    return g;
};

/** 
 * Unsubscribes the function with the given guid from the channel.
 */
Channel.prototype.unsubscribe = function(g) {
    if (g instanceof Function) { g = g.observer_guid; }
    this.handlers[g] = null;
    delete this.handlers[g];
};

/** 
 * Calls all functions subscribed to this channel.
 */
Channel.prototype.fire = function(e) {
    if (this.enabled) {
        var fail = false;
        this.fired = true;
        for (var item in this.handlers) {
            var handler = this.handlers[item];
            if (handler instanceof Function) {
                var rv = (handler.apply(this, arguments)===false);
                fail = fail || rv;
            }
        }
        this.fireArgs = arguments;
        return !fail;
    }
    return true;
};

//HACK: defining them here so they are ready super fast!
channel.create('onDOMContentLoaded');
channel.create('onNativeReady');
channel.create('onPhoneGapReady');
channel.create('onPhoneGapInfoReady');
channel.create('onPhoneGapConnectionReady');
channel.create('onResume');
channel.create('onPause');
channel.create('onDeviceReady');
channel.create('onDestroy');

module.exports = channel;
