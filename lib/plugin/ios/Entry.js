module.exports = {
    toURL:function() {
        // TODO: refactor path in a cross-platform way so we can eliminate 
        // these kinds of platform-specific hacks.
        return "file://localhost" + this.fullPath;
    }
}
