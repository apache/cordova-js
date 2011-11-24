var util = require('util'),
    fs = require('fs');

module.exports = {
    bundle: function (platform) {
        var util = require('util'),
            fs = require('fs'),
            files = [
                "lib/plugin/navigator.js",
                "lib/plugin/notification.js",
                "lib/plugin/accelerometer.js",
                "lib/plugin/Connection.js",
                "lib/plugin/network.js",
                "lib/plugin/Camera.js",
                "lib/plugin/" + platform + "/device.js",
                "lib/Channel.js",
                "lib/builder.js",
                "lib/utils.js",
                "lib/exec/" +platform + ".js"
            ],
            include = function (files, transform) {
                files = files.map ? files : [files];
                return files.map(function (file) {
                    var str = fs.readFileSync(file, "utf-8") + "\n";
                    return transform ? transform(str, file) : str;
                }).join('\n');
            }
            output = "";

        //include LICENSE
        output += include("LICENSE", function (file) {
            return "/*\n" + file + "\n*/\n";
        });

        //include require
        output += include("thirdparty/browser-require/require.js");

        //include modules
        output += include(files, function (file, path) {
            return "require.define('" + path.replace(/lib\//, "phonegap/").replace(/\.js$/, '') +
                   "', function (require, module, exports) {\n" + file + "});\n";
        });

        //include platform
        output += include('lib/platform/' + platform + '.js', function (file, path) {
            return "require.define('phonegap/platform'" +
                   ", function (require, module, exports) {\n" + file + "});\n";
        });

        //include phonegap
        output += include('lib/phonegap.js', function (file, path) {
            return "require.define('phonegap'" +
                   ", function (require, module, exports) {\n" + file + "});\n";
        });

        //include bootstrap
        output += include('lib/bootstrap.js');

        fs.writeFileSync(__dirname + "/../pkg/phonegap." + platform + ".js", output);
    }
};
