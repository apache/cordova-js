module.exports={

setOrientation: function(orientation) {
    PalmSystem.setWindowOrientation(orientation);
},

/*
 * Returns the current window orientation
 * orientation is one of 'up', 'down', 'left', 'right', or 'free'
 */
getCurrentOrientation: function() {
      return PalmSystem.windowOrientation;
}

}
