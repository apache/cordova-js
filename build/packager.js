var util = require('util'),
    fs = require('fs');

function include(files, transform) {
    files = files.map ? files : [files];
    return files.map(function (file) {
        var str = fs.readFileSync(file, "utf-8") + "\n";
        return transform ? transform(str, file) : str;
    }).join('\n');
}

module.exports = {
    modules: function (platform) {
        var files = [
                "lib/utils.js",
                "lib/plugin/navigator.js",
                "lib/plugin/notification.js",
                "lib/plugin/accelerometer.js",
                "lib/plugin/Connection.js",
                "lib/plugin/network.js",
                "lib/plugin/" + platform + "/device.js",
                "lib/channel.js",
                "lib/builder.js",
                "lib/exec/" +platform + ".js"
            ]
            output = "";

        //include modules
        output += include(files, function (file, path) {
            var id = path.replace(/lib\//, "phonegap/").replace(/\.js$/, ''); 
            return "define('" + id + "', function (require, exports, module) {\n" + file + "});\n";
        });

        //include phonegap
        output += include('lib/phonegap.js', function (file, path) {
            return "define('phonegap'" +
                   ", function (require, exports, module) {\n" + file + "});\n";
        });

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

        //include modules
        output += this.modules(platform);

        //include bootstrap
        output += include('lib/bootstrap.js');

        fs.writeFileSync(__dirname + "/../pkg/phonegap." + platform + ".js", output);
    }
};
