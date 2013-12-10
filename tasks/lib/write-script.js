var fs = require('fs');

module.exports = function writeScript(oFile, fileName, debug) {
    var contents = fs.readFileSync(fileName, 'utf8')

    contents = stripHeader(contents, fileName);
    writeContents(oFile, fileName, contents, debug);
}
