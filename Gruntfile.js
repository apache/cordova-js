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

const path = require('path');
const { build, collectModules } = require('./build-tools');

module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        compile: {
            android: {},
            ios: {},
            osx: {},
            windows: { useWindowsLineEndings: true },
            browser: {},
            electron: {}
        },
        clean: ['pkg']
    });

    // custom tasks
    grunt.registerMultiTask('compile', 'Packages cordova.js', function () {
        const done = this.async();

        const platformPath = path.resolve(`../cordova-${this.target}`);
        const platformPkgPath = path.join(platformPath, 'package');
        const platformModulesPath = path.join(platformPath, 'cordova-js-src');

        build({
            platformName: this.target,
            platformVersion: grunt.option('platformVersion') ||
                             require(platformPkgPath).version,
            extraModules: collectModules(platformModulesPath)
        })
            .then(cordovaJs => {
                // if we are using windows line endings, we will also add the BOM
                if (this.data.useWindowsLineEndings) {
                    cordovaJs = '\ufeff' + cordovaJs.split(/\r?\n/).join('\r\n');
                }

                // Write out the bundle
                const baseName = `cordova.${this.target}.js`;
                const fileName = path.join('pkg', baseName);
                grunt.file.write(fileName, cordovaJs);

                console.log(`Generated ${fileName}`);
            })
            .then(done, done);
    });

    // external tasks
    grunt.loadNpmTasks('grunt-contrib-clean');

    // defaults
    grunt.registerTask('default', ['compile']);
};
