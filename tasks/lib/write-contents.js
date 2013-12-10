
module.exports = function writeContents(oFile, fileName, contents, debug) {
    
    if (debug) {
        contents += '\n//@ sourceURL=' + fileName
        
        contents = 'eval(' + JSON.stringify(contents) + ')'
        
        // this bit makes it easier to identify modules
        // with syntax errors in them
        var handler = 'console.log("exception: in ' + fileName + ': " + e);'
        handler += 'console.log(e.stack);'
        
        contents = 'try {' + contents + '} catch(e) {' + handler + '}'
    }
    
    else {
        contents = '// file: ' + fileName.split("\\").join("/") + '\n' + contents;
    }

    oFile.push(contents)
}
