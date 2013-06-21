/*
 *
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 *
*/

var fs = require('fs'),
    util = require('util'),
    _path = require('path'),
    tests = [],
    packager = require('../build/packager'),
    exec = require('child_process').exec;

function collect(path, files, matches) {
    matches = matches || function (path) {
        return path.match(/test\.(\w|-)+\.js$/);
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
    node: function(callback) {
        console.log('starting node-based tests')
        var jas = require("../thirdparty/jasmine/jasmine"),
            TerminalReporter = require('./reporter').TerminalReporter,
            jsdom, document, window;

        try {
            jsdom = require("jsdom").jsdom;
            document = jsdom("<html><head></head></html>");
            window = document.createWindow();
        } catch (e) {
            //no jsDom (some people don't have compilers)
            throw new Error("can't run tests in node: run grunt btest instead, or install jsdom via: npm install");
        }

        //Put jasmine in scope
        Object.keys(jas).forEach(function (key) {
            this[key] = window[key] = global[key] = jas[key];
        });

        //load in our modules
        var testLibName = _path.join(__dirname, '..', 'pkg', 'cordova.test.js')
        var testLib     = fs.readFileSync(testLibName, 'utf8')
        try {
            eval(testLib);
        }
        catch (e) {
            console.log("error eval()ing " + testLibName + ": " + e)
            console.log(e.stack)
            throw e
        }

        //hijack require
        require = window.cordova.require;
        define  = window.cordova.define;

        //load in our tests
        collect(__dirname, tests);
        for (var x in tests) {
            eval(fs.readFileSync(tests[x], "utf-8"));
        }

        var env = jasmine.getEnv();
        env.addReporter(new TerminalReporter({
            color: true,
            onComplete: function() { callback(true); }
        }));

        console.log("------------");
        console.log("Unit Tests:");
        env.execute();
    },
    browser: function () {
        console.log('starting browser-based tests')
        var connect = require('connect'),
            html = fs.readFileSync(__dirname + "/suite.html", "utf-8"),
            doc,
            modules,
            specs,
            app = connect(
                connect.static(_path.join(__dirname, '..', 'thirdparty')),
                connect.static(__dirname),
                connect.router(function (app) {
                    app.get('/cordova.test.js', function (req, res) {
                        res.writeHead(200, {
                            "Cache-Control": "no-cache",
                            "Content-Type": "text/javascript"
                        });
                        res.end(packager.bundle('test'));
                    }),
                    app.get('/', function (req, res) {
                        res.writeHead(200, {
                            "Cache-Control": "no-cache",
                            "Content-Type": "text/html"
                        });

                        //create the script tags to include
                        tests = [];
                        collect(__dirname, tests);
                        specs = tests.map(function (file, path) {
                            return '<script src="' + file.replace(/^.*\/test\//, "/") +
                                '" type="text/javascript" charset="utf-8"></script>';
                        }).join('');

                        //inject in the test script includes and write the document
                        doc = html.replace(/<!-- ##TESTS## -->/g, specs);
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
