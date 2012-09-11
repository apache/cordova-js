
var cordova = require('cordova');
var Media = require('cordova/plugin/Media');

module.exports = function(args) {
    try {

        var res = JSON.parse(args);
        if(res.msg == Media.MEDIA_ERROR) {
            res.value = {'code':res.value};
        }
        Media.onStatus(res.id, res.msg, res.value);
    }
    catch(e) {
        console.log("Error calling Media.onStatus :: " + e);
    }
};