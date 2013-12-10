
module.exports = function bundle(platform, debug, commitId) {
    var modules = collectFiles('lib/common')
    var scripts = collectFiles('lib/scripts')
    
    modules[''] = 'lib/cordova.js'
    copyProps(modules, collectFiles(path.join('lib', platform)));

    if (platform === 'test') {
        copyProps(modules, collectFiles(path.join('lib', 'android', 'android'), 'android/'));
    }

    var output = [];
	
    output.push("// Platform: " + platform);
    output.push("// "  + commitId);

    // write header
    output.push('/*', fs.readFileSync('LICENSE-for-js-file.txt', 'utf8'), '*/')
    output.push(';(function() {')
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
