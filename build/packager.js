var fs    = require('fs')
var util  = require('util')
var path  = require('path')

var packager = module.exports

//------------------------------------------------------------------------------
packager.generate = function(platform, commitId) {
    var time = new Date().valueOf()
    
    var libraryRelease = packager.bundle(platform, false, commitId)
    var libraryDebug   = packager.bundle(platform, true, commitId)
    
    time = new Date().valueOf() - time
    
    var outFile
    
    outFile = path.join('pkg', 'cordova.' + platform + '.js')
    fs.writeFileSync(outFile, libraryRelease, 'utf8')
    
    outFile = path.join('pkg', 'cordova.' + platform + '-debug.js')
    fs.writeFileSync(outFile, libraryDebug, 'utf8')
    
    console.log('generated platform: ' + platform + ' in ' + time + 'ms')
}

//------------------------------------------------------------------------------
packager.bundle = function(platform, debug, commitId ) {
    var modules = collectFiles('lib/common')
    var scripts = collectFiles('lib/scripts')
    
    modules[''] = 'lib/cordova.js'
    
    if (['playbook', 'blackberry'].indexOf(platform) > -1) {
        copyProps(modules, collectFiles(path.join('lib', 'webworks')))
    }
    
    copyProps(modules, collectFiles(path.join('lib', platform)))

    var output = [];
	
    output.push("// "  + commitId + "\n");
	output.push("// File generated at :: "  + new Date() + "\n");

    // write header     
    output.push('/*\n' + getContents('LICENSE-for-js-file.txt') + '\n*/')
    output.push('\n;(function() {\n')
    
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

    output.push("\nwindow.cordova = require('cordova');\n")

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
    output.push('\n})();')

    return output.join('\n')
}

//------------------------------------------------------------------------------
var CollectedFiles = {}

function collectFiles(dir, id) {
    if (!id) id = ''
    
    if (CollectedFiles[dir]) {
        return copyProps({}, CollectedFiles[dir])
    }

    var result = {}    
    
    var entries = fs.readdirSync(dir)
    
    entries = entries.filter(function(entry) {
        if (entry.match(/\.js$/)) return true
        
        var stat = fs.statSync(path.join(dir, entry))
        if (stat.isDirectory())  return true
    })

    entries.forEach(function(entry) {
        var moduleId = path.join(id,  entry)
        var fileName = path.join(dir, entry)
        
        var stat = fs.statSync(fileName)
        if (stat.isDirectory()) {
            copyProps(result, collectFiles(fileName, moduleId))
        }
        else {
            moduleId         = getModuleId(moduleId)
            result[moduleId] = fileName
        }
    })
    
    CollectedFiles[dir] = result
    
    return copyProps({}, result)
}

//------------------------------------------------------------------------------
function writeScript(oFile, fileName, debug) {
    var contents = getContents(fileName, 'utf8')
    
    writeContents(oFile, fileName, contents, debug)    
}

//------------------------------------------------------------------------------
function writeModule(oFile, fileName, moduleId, debug) {
    var contents = '\n' + getContents(fileName, 'utf8') + '\n'

	// Windows fix, '\' is an escape, but defining requires '/' -jm
    moduleId = path.join('cordova', moduleId).split("\\").join("/");
	
	
    
    var signature = 'function(require, exports, module)';
	
	
    
    contents = 'define("' + moduleId + '", ' + signature + ' {' + contents + '});\n'

    writeContents(oFile, fileName, contents, debug)    
}

//------------------------------------------------------------------------------
var FileContents = {}

function getContents(file) {
    if (!FileContents.hasOwnProperty(file)) {
        FileContents[file] = fs.readFileSync(file, 'utf8')
    }
    
    return FileContents[file]
}

//------------------------------------------------------------------------------
function writeContents(oFile, fileName, contents, debug) {
    
    if (debug) {
        contents += '\n//@ sourceURL=' + fileName
        
        contents = 'eval(' + JSON.stringify(contents) + ')'
    }
    
    else {
        contents = '// file: ' + fileName + '\n' + contents    
    }

    oFile.push(contents)
}

//------------------------------------------------------------------------------
function getModuleId(fileName) {
    return fileName.match(/(.*)\.js$/)[1]
}

//------------------------------------------------------------------------------
function copyProps(target, source) {
    for (var key in source) {
        if (!source.hasOwnProperty(key)) continue
        
        target[key] = source[key]
    }
    
    return target
}
