
module.exports = function writeModule(oFile, fileName, moduleId, debug) {
    var contents = fs.readFileSync(fileName, 'utf8')

    contents = '\n' + stripHeader(contents, fileName) + '\n'

	// Windows fix, '\' is an escape, but defining requires '/' -jm
    moduleId = path.join('cordova', moduleId).split("\\").join("/");
    
    var signature = 'function(require, exports, module)';
    
    contents = 'define("' + moduleId + '", ' + signature + ' {' + contents + '});\n'

    writeContents(oFile, fileName, contents, debug)    
}

