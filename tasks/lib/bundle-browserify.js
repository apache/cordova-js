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
var fs           = require('fs');
var path         = require('path');
var browserify   = require('browserify');
var require_tr   = require('./require-tr');
var root         = path.join(__dirname, '..', '..');
var pkgJson      = require('../../package.json');
var collectFiles = require('./collect-files');
var copyProps    = require('./copy-props');

module.exports = function bundle(platform, debug, commitId, platformVersion) {
    require_tr.platform = platform;
    // FIXME: need to find a way to void ignore missing
    var b = browserify({debug: debug});
    // XXX plugin_list is not present at this stage 
    b.ignore(path.join(root, 'src', 'common', 'plugin_list'));

    b.transform(require_tr.transform, {'platform': platform});

    var cordovajssrc = path.join(process.cwd(), 'platforms', platform, 'platform_www', 'cordova-js-src');
    //checks to see if browserify is run in a cli project and
    //if the platform has a cordova-js-src to build cordova.js with
    if(fs.existsSync(cordovajssrc)){ 
        b.add(path.join(cordovajssrc, 'exec.js'));
        b.add(path.join(cordovajssrc, 'platform.js'));
    } else {
        b.add(path.join(root, 'src', 'legacy-exec', platform, 'exec.js'));
        b.add(path.join(root, 'src', 'legacy-exec', platform, 'platform.js'));
    }

    if (platform === 'test') {
        // Add tests to bundle
        // TODO: Also need to include android/ios tests
        fs.readdirSync('test').forEach(function (item) {
            var itemPath = path.resolve('test', item);
            if (fs.statSync(itemPath).isFile()) b.add(itemPath);
        });

        // Add rest of modules from cordova-js-src/legacy-exec directory
        // TODO: this probably should be done for all platforms?
        fs.readdirSync(path.join(root, 'src', 'legacy-exec', platform, platform)).forEach(function (item) {
            var itemPath = path.resolve(root, 'src', 'legacy-exec', platform, platform, item);
            if (fs.statSync(itemPath).isFile()) b.add(itemPath);
        });

        // Ignore fake modules from tests, otherwise browserify fails to generate bundle
        ['your mom', 'dino', 'a', 'ModuleA', 'ModuleB', 'ModuleC']
        .forEach(b.ignore.bind(b));
    }

    b.add(path.join(root, 'src', 'scripts', 'bootstrap.js'));

    return b;
}
