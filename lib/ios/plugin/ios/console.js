var exec = require('cordova/exec');

/**
 * This class provides access to the debugging console.
 * @constructor
 */
var DebugConsole = function() {
    this.winConsole = window.console;
    this.logLevel = DebugConsole.INFO_LEVEL;
};

// from most verbose, to least verbose
DebugConsole.ALL_LEVEL    = 1; // same as first level
DebugConsole.INFO_LEVEL   = 1;
DebugConsole.WARN_LEVEL   = 2;
DebugConsole.ERROR_LEVEL  = 4;
DebugConsole.NONE_LEVEL   = 8;
                                                    
DebugConsole.prototype.setLevel = function(level) {
    this.logLevel = level;
};

var stringify = function(message) {
    try {
        if (typeof message === "object" && JSON && JSON.stringify) {
            return JSON.stringify(message);
        } else {
            return message.toString();
        } 
    } catch (e) {
        return e.toString();
    }
};

/**
 * Print a normal log message to the console
 * @param {Object|String} message Message or object to print to the console
 */
DebugConsole.prototype.log = function(message) {
    if (this.logLevel <= DebugConsole.INFO_LEVEL) {
        exec(null, null, 'Debug Console', 'log', [ stringify(message), { logLevel: 'INFO' } ]);
    }
    else if (this.winConsole && this.winConsole.log) {
        this.winConsole.log(message);
    }
};

/**
 * Print a warning message to the console
 * @param {Object|String} message Message or object to print to the console
 */
DebugConsole.prototype.warn = function(message) {
    if (this.logLevel <= DebugConsole.WARN_LEVEL) {
        exec(null, null, 'Debug Console', 'log', [ stringify(message), { logLevel: 'WARN' } ]);
    }
    else if (this.winConsole && this.winConsole.warn) {
        this.winConsole.warn(message);
    }
};

/**
 * Print an error message to the console
 * @param {Object|String} message Message or object to print to the console
 */
DebugConsole.prototype.error = function(message) {
    if (this.logLevel <= DebugConsole.ERROR_LEVEL) {
        exec(null, null, 'Debug Console', 'log', [ stringify(message), { logLevel: 'ERROR' } ]);
    }
    else if (this.winConsole && this.winConsole.error){
        this.winConsole.error(message);
    }
};

module.exports = new DebugConsole();
