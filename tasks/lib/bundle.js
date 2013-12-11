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
var collectFiles = require('./collect-files');
var copyProps    = require('./copy-props');
var writeModule  = require('./write-module');
var writeScript  = require('./write-script');


module.exports = function bundle(platform, debug, commitId) {
    var modules = collectFiles('lib/common')
    var scripts = collectFiles('lib/scripts')
    
    modules[''] = 'lib/cordova.js'
    copyProps(modules, collectFiles(path.join('lib', platform)));

    if (platform === 'test') {
        // FIXME why does 'test' resolve a bunch of android stuff?! 
        var testFilesPath = path.join('lib', 'android', 'android');
        copyProps(modules, collectFiles(testFilesPath, 'android/'));
    }

    var output = [];
	
    output.push("// Platform: " + platform);
    output.push("// "  + commitId);

    // write header
    var licensePath = path.join(__dirname, 'tasks', 'lib', 'LICENSE-for-js-file.txt');
    output.push('/*', fs.readFileSync(licensePath, 'utf8'), '*/');
    output.push(';(function() {');
    output.push("var CORDOVA_JS_BUILD_LABEL = '"  + commitId + "';");

    // write initial scripts
    if (!scripts['require']) {
        throw new Error("didn't find a script for 'require'")
    }
    
    writeScript(output, scripts['require'], debug)

    // write modules
    var moduleIds = Object.keys(modules)
    moduleIds.sort()
    
    for (var i=0; i<moduleIds.length; i++) {
        var moduleId = moduleIds[i]
       
        writeModule(output, modules[moduleId], moduleId, debug)
    }

    output.push("window.cordova = require('cordova');")

    // write final scripts
    if (!scripts['bootstrap']) {
        throw new Error("didn't find a script for 'bootstrap'")
    }
    
    writeScript(output, scripts['bootstrap'], debug)
    
    var bootstrapPlatform = 'bootstrap-' + platform
    if (scripts[bootstrapPlatform]) {
        writeScript(output, scripts[bootstrapPlatform], debug)
    }

    // write trailer
    output.push('})();')

    return output.join('\n')
}
