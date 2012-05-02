function UUIDcreatePart(length) {
    var uuidpart = "";
    for (var i=0; i<length; i++) {
        var uuidchar = parseInt((Math.random() * 256), 10).toString(16);
        if (uuidchar.length == 1) {
            uuidchar = "0" + uuidchar;
        }
        uuidpart += uuidchar;
    }
    return uuidpart;
}

var _self = {
    isArray:function(a) {
        return Object.prototype.toString.call(a) == '[object Array]';
    },
    isDate:function(d) {
        return Object.prototype.toString.call(d) == '[object Date]';
    },
    /**
     * Does a deep clone of the object.
     */
    clone: function(obj) {
        if(!obj || typeof obj == 'function' || _self.isDate(obj) || typeof obj != 'object') {
            return obj;
        }

        var retVal, i;

        if(_self.isArray(obj)){
            retVal = [];
            for(i = 0; i < obj.length; ++i){
                retVal.push(_self.clone(obj[i]));
            }
            return retVal;
        }

        retVal = {};
        for(i in obj){
            if(!(i in retVal) || retVal[i] != obj[i]) {
                retVal[i] = _self.clone(obj[i]);
            }
        }
        return retVal;
    },

    close: function(context, func, params) {
        if (typeof params == 'undefined') {
            return function() {
                return func.apply(context, arguments);
            };
        } else {
            return function() {
                return func.apply(context, params);
            };
        }
    },

    /**
     * Create a UUID
     */
    createUUID: function() {
        return UUIDcreatePart(4) + '-' +
            UUIDcreatePart(2) + '-' +
            UUIDcreatePart(2) + '-' +
            UUIDcreatePart(2) + '-' +
            UUIDcreatePart(6);
    },

    /**
     * Extends a child object from a parent object using classical inheritance
     * pattern.
     */
    extend: (function() {
        // proxy used to establish prototype chain
        var F = function() {};
        // extend Child from Parent
        return function(Child, Parent) {
            F.prototype = Parent.prototype;
            Child.prototype = new F();
            Child.__super__ = Parent.prototype;
            Child.prototype.constructor = Child;
        };
    }()),

    /**
     * Alerts a message in any available way: alert or console.log.
     */
    alert:function(msg) {
        if (alert) {
            alert(msg);
        } else if (console && console.log) {
            console.log(msg);
        }
    }
};

module.exports = _self;
