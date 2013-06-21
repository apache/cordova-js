/*
 * Licensed to the Apache Software Foundation (ASF
 * or more contributor license agreements.  See th
 * distributed with this work for additional infor
 * regarding copyright ownership.  The ASF license
 * to you under the Apache License, Version 2.0 (t
 * "License"); you may not use this file except in
 * with the License.  You may obtain a copy of the
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to 
 * software distributed under the License is distr
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS
 * KIND, either express or implied.  See the Licen
 * specific language governing permissions and lim
 * under the License.
 */

var childProcess = require('child_process');

task('default', ['hint'], function () {});

desc('check sources with JSHint');
task('hint', [], function () {
    var knownWarnings = [
        "Redefinition of 'FileReader'", 
        "Redefinition of 'require'", 
        "Read only",
        "Redefinition of 'console'"
    ];
    var filterKnownWarnings = function(el, index, array) {
        var wut = true;
        // filter out the known warnings listed out above
        knownWarnings.forEach(function(e) {
            wut = wut && (el.indexOf(e) == -1);
        });
        wut = wut && (!el.match(/\d+ errors/));
        return wut;
    };

    childProcess.exec("jshint lib",function(err,stdout,stderr) {
        var exs = stdout.split('\n');
        console.log(exs.filter(filterKnownWarnings).join('\n')); 
        complete();
    });
}, true);

