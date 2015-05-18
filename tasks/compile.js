/*
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
*/
var generate = require('./lib/packager');
var fs = require('fs');
var path = require('path');

module.exports = function(grunt) {
    grunt.registerMultiTask('compile', 'Packages cordova.js', function() {
        var done = this.async();
        var platformName = this.target;
        var useWindowsLineEndings = this.data.useWindowsLineEndings;
        var platformVersion;
       
        //grabs --platformVersion flag
        var flags = grunt.option.flags();
        var platformVersion;
        flags.forEach(function(flag) {
            if (flag.indexOf('platformVersion') > -1) {
                var equalIndex = flag.indexOf('=');
                platformVersion = flag.slice(equalIndex + 1);
            }
        });
        if(!platformVersion) {
            if(fs.existsSync(path.join('node_modules','cordova-'+platformName))) {
                var platformPkgJson = require('../node_modules/cordova-'+platformName+'/package.json');
                platformVersion = platformPkgJson.version;
            } else {
                platformVersion="N/A";
            }
        }

        generate(platformName, useWindowsLineEndings, platformVersion, done);
    });
}
