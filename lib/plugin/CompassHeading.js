var CompassHeading = function() {
  this.magneticHeading = null;
  this.trueHeading = null;
  this.headingAccuracy = null;
  this.timestamp = new Date();
};

module.exports = CompassHeading;
