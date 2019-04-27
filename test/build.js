#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const { build, collectModules } = require('../build-tools');

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
    return build({
        platformName: 'test',
        platformVersion: 'N/A',
        extraModules: collectTestBuildModules()
    })
        .then(testBundle => fs.outputFile(bundlePath, testBundle));
}

function collectTestBuildModules () {
    const pkgRoot = path.join(__dirname, '..');

    // Add platform-specific modules that have tests to the test bundle.
    const platformModules = ['android', 'ios'].map(platform => {
        const platformPath = path.resolve(pkgRoot, `../cordova-${platform}`);
        const modulePath = path.join(platformPath, 'cordova-js-src');
        const modules = collectModules(modulePath);

        // Prevent overwriting this platform's exec module with the next one
        const moduleId = path.posix.join(platform, 'exec');
        modules[moduleId] = Object.assign({}, modules.exec, { moduleId });

        return modules;
    });

    // Finally, add modules provided by test platform
    const testModulesPath = path.join(__dirname, '../src/legacy-exec/test');
    return Object.assign(...platformModules, collectModules(testModulesPath));
}
