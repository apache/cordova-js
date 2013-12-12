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

var fs       = require('fs');
var util     = require('util');
var _path    = require('path');
var exec     = require('child_process').exe;
var tests    = [];
var packager = require('./../tasks/lib/packager');
var bundle   = require('./../tasks/lib/bundle');
var collect  = require('./../tasks/lib/collect');


module.exports = {
    browser: function () {
        console.log('starting browser-based tests')
        var connect = require('connect'),
            html = fs.readFileSync(__dirname + "/suite.html", "utf-8"),
            doc,
            modules,
            specs,
            app = connect(
                connect.static(_path.join(__dirname, '..', 'tasks', 'vendor')),
                connect.static(__dirname),
                connect.router(function (app) {
                    app.get('/cordova.test.js', function (req, res) {
                        res.writeHead(200, {
                            "Cache-Control": "no-cache",
                            "Content-Type": "text/javascript"
                        });
                        res.end(bundle('test'));
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
