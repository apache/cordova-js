/**
 * this represents the mobile device, and provides properties for inspecting the model, version, UUID of the
 * phone, etc.
 * @constructor
 */
var Device = function() 
{
    this.platform = null;
    this.version  = null;
    this.name     = null;
    this.phonegap = null;
    this.uuid     = null;
    try 
	{      
		this.platform = DeviceInfo.platform;
		this.version  = DeviceInfo.version;
		this.name     = DeviceInfo.name;
		this.phonegap = DeviceInfo.gap;
		this.uuid     = DeviceInfo.uuid;

    } 
	catch(e) 
	{
        // TODO: 
    }
	this.available = PhoneGap.available = !!this.uuid;
};

module.exports = new Device();
