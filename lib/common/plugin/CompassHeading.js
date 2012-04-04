var CompassHeading = function(magneticHeading, trueHeading, headingAccuracy, timestamp) {
  this.magneticHeading = (magneticHeading !== undefined ? magneticHeading : null);
  this.trueHeading = (trueHeading !== undefined ? trueHeading : null);
  this.headingAccuracy = (headingAccuracy !== undefined ? headingAccuracy : null);
  this.timestamp = (timestamp !== undefined ? timestamp : new Date().getTime());
};

module.exports = CompassHeading;
