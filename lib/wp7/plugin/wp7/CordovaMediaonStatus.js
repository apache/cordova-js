
var cordova = require('cordova');


module.exports = function(args) {
    try {
        var res = JSON.parse(args);
        // NOTE: had issues with require here. -jm
        // technically this should be var _media = require('Media'); /// me thinks
        Media.onStatus(res.id, res.msg, res.value);
    }
    catch(e) {
        console.log("Error calling media.onStatus :: " + e);
    }

};