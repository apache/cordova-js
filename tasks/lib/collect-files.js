module.exports = function collectFiles(dir, id) {
    if (!id) id = ''

    var result = {}    
    var entries = fs.readdirSync(dir)

    entries = entries.filter(function(entry) {
        if (entry.match(/\.js$/)) return true
        
        var stat = fs.statSync(path.join(dir, entry))
        if (stat.isDirectory())  return true
    })

    entries.forEach(function(entry) {
        var moduleId = path.join(id, entry)
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
    return copyProps({}, result)
}
