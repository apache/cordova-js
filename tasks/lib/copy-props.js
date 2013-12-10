
module.exports = function copyProps(target, source) {

    for (var key in source) {
        if (!source.hasOwnProperty(key)) continue    
        target[key] = source[key]
    }
    
    return target
}
