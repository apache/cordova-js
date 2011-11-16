var DEPLOY = __dirname + "/pkg/";

desc("runs build");
task('default', ['build'], function () {});

desc("clean");
task('clean', [], function () {
    var childProcess = require('child_process');

    var cmd = 'rm -rf ' + DEPLOY + ' && ' +
              'mkdir ' + DEPLOY;

    childProcess.exec(cmd, complete);
}, true);

desc("compiles the source files for all extensions");
task('build', ['clean'], function () {

    var util = require('util'),
        fs = require('fs'),
        files = [
            "lib/platform/blackberry.js",
            "lib/plugin/navigator.js",
            "lib/plugin/notification.js",
            "lib/Channel.js",
            "lib/builder.js",
            "lib/utils.js",
            "lib/exec/blackberry.js"
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

    //include phonegap
    output += include('lib/phonegap.js', function (file, path) {
        return "require.define('phonegap'" +
               ", function (require, module, exports) {\n" + file + "});\n";
    });

    //include bootstrap
    output += include('lib/bootstrap.js');

    fs.writeFileSync(__dirname + "/pkg/phonegap.js", output);

    util.puts(fs.readFileSync("build/dalek", "utf-8"));
});
