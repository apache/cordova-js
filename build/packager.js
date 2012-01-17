var util = require('util'),
    debug = false,
    fs = require('fs');

function include(files, transform) {
    files = files.map ? files : [files];
    return files.map(function (file) {
        try {
            var str = fs.readFileSync(file, "utf-8") + "\n";
            str = transform ? transform(str, file) : str;
            str = debug ? "try {" + str + "} catch (e) { alert('" + file + ":' + e);}" : str;
            return str;
        } catch (e) {
            //do nothing
        }
    }).join('\n');
}
function drop(files, id) {
  return include(files, function(file, path) {
    var define_id = (typeof id != 'undefined' && id.length > 0 ? id : path.replace(/lib\//, "phonegap/").replace(/\.js$/, ''));
    return "define('" + define_id + "', function(require, exports, module) {\n" + file + "});\n";
  });
}

module.exports = {
    modules: function (platform) {
        var files = [
                "lib/utils.js",
                "lib/plugin/navigator.js",
                "lib/plugin/network.js",
                "lib/plugin/notification.js",
                "lib/plugin/accelerometer.js",
                "lib/plugin/Acceleration.js",
                "lib/plugin/CameraConstants.js",
                "lib/plugin/camera.js",
                "lib/plugin/Connection.js",
                "lib/plugin/" + platform + "/device.js",
                "lib/plugin/blackberry/manager/webworks.js",
                "lib/plugin/blackberry/manager/" + platform + ".js",
                "lib/builder.js"
            ],
            output = "";

        //include phonegap
        output += drop('lib/phonegap.js', 'phonegap');

        //include exec
        output += drop('lib/exec/' + platform + '.js', 'phonegap/exec');

        // this is really bad, im so sorry. order is important. need to figure this out better dawg
        if (platform === 'android') {
            output += drop(['lib/plugin/android/callback.js',
                            'lib/plugin/android/polling.js']);
        }

        //include common platform base
        output += drop('lib/platform/common.js', 'phonegap/common');

        //include platform
        output += drop('lib/platform/' + platform + '.js', 'phonegap/platform');

        //HACK: Get this in soon so we have access to it for the native layer
        output += "window.PhoneGap = require('phonegap');";

        //include modules
        output += drop(files);

        return output;
    },

    bundle: function (platform) {
        var output = "";

        //include LICENSE
        output += include("LICENSE", function (file) {
            return "/*\n" + file + "\n*/\n";
        });

        //include require
        output += include("thirdparty/almond.js");
        output += "define.unordered = true;";

        // include channel - this one is needed early
        output += drop('lib/channel.js');

        // include the event listener hijacks (needs to happen early)
        output += include("lib/hijacks.js");

        //include modules
        output += this.modules(platform);

        //include bootstrap
        output += include('lib/bootstrap.js');
        output += include('lib/bootstrap/' + platform + '.js');

        fs.writeFileSync(__dirname + "/../pkg/phonegap." + platform + ".js", output);
    }
};
