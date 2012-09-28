/*global Windows:true */

var cordova = require('cordova');

module.exports = {
    alert:function(win, loseX, args) {
        var message = args[0];
        var _title = args[1];
        var _buttonLabel = args[2];

        var md = new Windows.UI.Popups.MessageDialog(message, _title);
        md.commands.append(new Windows.UI.Popups.UICommand(_buttonLabel));
        md.showAsync().then(win);
    },

    confirm:function(win, loseX, args) {
        var message = args[0];
        var _title = args[1];
        var _buttonLabels = args[2];

        var btnList = [];
        function commandHandler (command) {
            win(btnList[command.label]);
        }

        var md = new Windows.UI.Popups.MessageDialog(message, _title);
        var button = _buttonLabels.split(',');

        for (var i = 0; i<button.length; i++) {
            btnList[button[i]] = i+1;
            md.commands.append(new Windows.UI.Popups.UICommand(button[i],commandHandler));
        }
        md.showAsync();
    },

    vibrate:function(winX, loseX, args) {
        var mills = args[0];

        //...
    },

    beep:function(winX, loseX, args) {
        var count = args[0];
        /*
        var src = //filepath//
        var playTime = 500; // ms
        var quietTime = 1000; // ms
        var media = new Media(src, function(){});
        var hit = 1;
        var intervalId = window.setInterval( function () {
            media.play();
            sleep(playTime);
            media.stop();
            media.seekTo(0);
            if (hit < count) {
                hit++;
            } else {
                window.clearInterval(intervalId);
            }
        }, playTime + quietTime); */
    }
};