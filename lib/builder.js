function each(objects, func, context) {
    for (var prop in objects) {
        if (objects.hasOwnProperty(prop)) {
            func.apply(context, [objects[prop], prop]);
        }
    }
}

function include(parent, objects) {
    each(objects, function (obj, key) {
        var result = obj.path ? require(obj.path) : obj.value;

        parent[key] = result;

        if (obj.children) {
            include(result, obj.children);
        }
    });
}

module.exports = {
    build: function (objects) {
        return {
            into: function (target) {
                include(target, objects);
            }
        };
    }
};
