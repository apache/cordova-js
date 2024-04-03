#!/usr/bin/env node

/*!
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

const fs = require('node:fs');
const fsp = require('node:fs/promises');
const path = require('path');
const { build, collectModules } = require('.');

// istanbul-lib-instrument is provided by karma-coverage
const { createInstrumenter } = require('istanbul-lib-instrument');

if (require.main === module) {
    buildCordovaJsTestBundle(process.argv[2])
        .catch(err => {
            console.error(err);
            process.exitCode = 1;
        });
}

module.exports = buildCordovaJsTestBundle;

// Writes the cordova-js test build bundle to bundlePath
function buildCordovaJsTestBundle (bundlePath) {
    const instrumenter = createInstrumenter();

    return build({
        platformName: 'test',
        platformVersion: 'N/A',
        extraModules: collectTestBuildModules(),
        preprocess (f) {
            // Do not instrument our test dummies
            if (f.path.includes('/test/test-platform-modules/')) return f;

            const contents = instrumenter.instrumentSync(f.contents, f.path);
            return Object.assign({}, f, { contents });
        }
    })
        .then(testBundle => {
            const dir = path.dirname(bundlePath);

            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }

            return fsp.writeFile(bundlePath, testBundle, 'utf8');
        });
}

function collectTestBuildModules () {
    // Add platform-specific modules that have tests to the test bundle.
    const platformModules = ['android', 'ios'].map(platform => {
        const platformPath = path.dirname(require.resolve(`cordova-${platform}/package`));
        const modulePath = path.join(platformPath, 'cordova-js-src');
        const modules = collectModules(modulePath);

        // Prevent overwriting this platform's exec module with the next one
        const moduleId = path.posix.join(platform, 'exec');
        modules[moduleId] = Object.assign({}, modules.exec, { moduleId });

        return modules;
    });

    // Finally, add modules provided by test platform
    const testModulesPath = path.join(__dirname, '../test/test-platform-modules');
    return Object.assign(...platformModules, collectModules(testModulesPath));
}
