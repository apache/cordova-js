var CompassHeading = function(magneticHeading, trueHeading, headingAccuracy, timestamp) {
  this.magneticHeading = magneticHeading || null;
  this.trueHeading = trueHeading || null;
  this.headingAccuracy = headingAccuracy || null;
  this.timestamp = (timestamp ? new Date(timestamp) : new Date());
};

module.exports = CompassHeading;
