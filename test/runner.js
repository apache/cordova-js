var fs = require('fs'),
    _path = require('path');

function collect(path, files, matches) {
    matches = matches || function (path) {
        return path.match(/test\.\w+\.js$/);
    };

    if (fs.statSync(path).isDirectory()) {
        fs.readdirSync(path).forEach(function (item) {
            collect(_path.join(path, item), files, matches);
        });
    } else if (matches(path)) {
        files.push(path);
    }
}

module.exports = function () { 
    var connect = require('connect'),
        packager = require('../build/packager'),
        tests = [],
        html = fs.readFileSync(__dirname + "/suite.html", "utf-8"),
        doc,
        modules,
        specs,
        app = connect(
            connect.static(__dirname + "/../lib/"),
            connect.static(__dirname + "/../"),
            connect.static(__dirname),
            connect.router(function (app) {
                app.get('/', function (req, res) {
                    res.writeHead(200, {
                        "Cache-Control": "no-cache",
                        "Content-Type": "text/html"
                    });
                    tests = [];
                    collect(__dirname, tests);

                    specs = tests.map(function (file, path) {
                        return '<script src="' + file.replace(/^.*test/, "test") +
                            '" type="text/javascript" charset="utf-8"></script>';
                    }).join();
                    modules = packager.modules('test'); 
                    doc = html.replace(/<!-- TESTS -->/g, specs).replace(/"##MODULES##"/g, modules);
                    res.end(doc);
                });
            })
        );

    app.listen(3000);

    process.stdout.write("Test Server running on:\n");
    process.stdout.write("http://127.0.0.1:3000\n");
};
