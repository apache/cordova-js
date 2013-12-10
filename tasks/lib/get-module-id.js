
module.exports = function getModuleId(fileName) {
    return fileName.match(/(.*)\.js$/)[1]
}
