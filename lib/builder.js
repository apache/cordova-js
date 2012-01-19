function each(objects, func, context) {
    for (var prop in objects) {
        if (objects.hasOwnProperty(prop)) {
            func.apply(context, [objects[prop], prop]);
        }
    }
}

function include(parent, objects) {
    each(objects, function (obj, key) {
        try {
          var result = obj.path ? require(obj.path) : {};

          // Don't clobber if something already exists there
          if (typeof parent[key] == 'undefined') {
            parent[key] = result;
          } else {
            // Set result to what already exists, so we can build children into it if they exist.
            result = parent[key];
          }

          if (obj.children) {
              include(result, obj.children);
          }
        } catch(e) {
          alert('Exception building cordova JS globals: ' + e + ' for key "' + key + '"');
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
