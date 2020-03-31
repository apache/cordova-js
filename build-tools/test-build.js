#!/usr/bin/env node

const fs = require('fs-extra');
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
        .then(testBundle => fs.outputFile(bundlePath, testBundle));
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
