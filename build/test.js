module.exports = function () { 
    var connect = require('connect'),
        fs = require('fs'),
        tests = [],
        html = fs.readFileSync(__dirname + "/btest/test.html", "utf-8"),
        doc,
        modules,
        specs,
        app = connect(
            connect.static(__dirname + "/../lib/"),
            connect.static(__dirname + "/../"),
            connect.router(function (app) {
                app.get('/', function (req, res) {
                    res.writeHead(200, {
                        "Cache-Control": "no-cache",
                        "Content-Type": "text/html"
                    });
                    res.end(doc);
                });
            })
        );

    utils.collect(__dirname + "/../lib", libs);
    utils.collect(__dirname + "/../test", tests);

    modules = libs.reduce(function (str, file) {
        str += '"' + file.replace(/^.*lib\//, "").replace(/\.js$/, "") + '",\n';
        return str;
    }, "").replace(/\,\n$/g, "\n");

    specs = tests.reduce(function (str, file) {
        str += '<script src="' +
            file.replace(/^.*test/, "test") +
            '" type="text/javascript" charset="utf-8"></script>\n';
        return str;
    }, "");

    doc = html.replace(/<!-- SPECS -->/g, specs).replace(/"##FILES##"/g, modules);

    app.listen(3000);

    process.stdout.write("Test Server running on:");
    process.stdout.write("http://127.0.0.1:3000");
};
