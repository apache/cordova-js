(function (context) {
    var modules = {};

    function build(module) {
        var factory = module.factory;
        return (delete module.factory, factory(require, module.exports, module), module.exports);
    }

    function require(id) {
        if (!modules[id]) {
            throw "module " + id + " not found";
        }
        return modules[id].factory ? build(modules[id]) : modules[id].exports;
    }

    function define(id, factory) {
        if (modules[id]) {
            throw "module " + id + " already defined";
        }

        modules[id] = {
            id: id,
            factory: factory,
            exports: undefined
        };
    }

    if (!context.require) {
        context.require = require;
        context.define = define;
    }
})(window);
