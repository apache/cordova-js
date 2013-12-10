
// Strips the license header. Basically only the first multi-line comment up to to the closing */
module.exports = function stripHeader(contents, fileName) {
    var ls = contents.split(/\r?\n/);
    while (ls[0]) {
        if (ls[0].match(/^\s*\/\*/) || ls[0].match(/^\s*\*/)) {
            ls.shift();
        }
        else if (ls[0].match(/^\s*\*\//)) {
            ls.shift();
            break;
        }
        else {
        	console.log("WARNING: file name " + fileName + " is missing the license header");
        	break;
    	}
    }
    return ls.join('\n');
}
