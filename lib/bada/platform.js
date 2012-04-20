module.exports = {
    id: "bada",
    initialize: function() {},
    objects: {
        device: {
            path: 'cordova/plugin/bada/device'
        }
    },
    merges: {
        navigator: {
            children: {
                device: {
                    path: "cordova/plugin/bada/device"
                }
            }
        }
    }
}
