var CompassHeading = function(magneticHeading, trueHeading, headingAccuracy, timestamp) {
  this.magneticHeading = magneticHeading !== undefined ? magneticHeading :  null;
  this.trueHeading = trueHeading !== undefined ? trueHeading : null;
  this.headingAccuracy = headingAccuracy !== undefined ? headingAccuracy : null;
  this.timestamp = timestamp !== undefined ? new Date(timestamp) : new Date();
};

module.exports = CompassHeading;
