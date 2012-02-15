var fs = require('fs'),
    util = require('util'),
    _path = require('path'),
    tests = [],
    packager = require('../build/packager'),
    exec = require('child_process').exec;

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

module.exports = {
    node: function () {
        var jas = require("../thirdparty/jasmine/jasmine"),
            loader = require('../lib/require'),
            TerminalReporter = require('./reporter').TerminalReporter,
            jsdom, document, window;

        try {
            jsdom = require("jsdom").jsdom;
            document = jsdom("<html>");
            window = document.createWindow();
        } catch (e) {
            //no jsDom (some people don't have compilers)
            console.log("can't run tests in node: run jake btest instead");
            return;
        }

        //Put jasmine in scope
        Object.keys(jas).forEach(function (key) {
            this[key] = window[key] = global[key] = jas[key];
        });

        //hijack require
        require = loader.require;
        define = loader.define;

        //load in our modules
        eval(packager.modules('test'));

        //load in our tests
        collect(__dirname, tests);
        for (var x in tests) {
            eval(fs.readFileSync(tests[x], "utf-8"));
        }

        var env = jasmine.getEnv();
        env.addReporter(new TerminalReporter({
            color: true,
            onComplete: process.exit
        }));

        console.log("------------");
        console.log("Unit Tests:");
        env.execute();
    },
    browser: function () {
        var connect = require('connect'),
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
                        }).join('');
                        modules = packager.modules('test'); 
                        doc = html.replace(/<!-- TESTS -->/g, specs).replace(/"##MODULES##"/g, modules);
                        res.end(doc);
                    });
                })
            );

        app.listen(3000);

        process.stdout.write("Test Server running on:\n");
        process.stdout.write("http://127.0.0.1:3000\n");

        exec('open http://127.0.0.1:3000');
    }
};
