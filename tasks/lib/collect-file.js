// FIXME I think this is unused
// smh
module.exports = function collectFile(dir, id, entry) {
    if (!id) id = ''
    var moduleId = path.join(id,  entry)
    var fileName = path.join(dir, entry)
    
    var stat = fs.statSync(fileName)

    var result = {};

    moduleId         = getModuleId(moduleId)
    result[moduleId] = fileName

    return copyProps({}, result)
}
