var Position = function(coords, timestamp) {
	this.coords = coords;
	this.timestamp = (timestamp !== undefined) ? timestamp : new Date().getTime();
};

module.exports = Position;
