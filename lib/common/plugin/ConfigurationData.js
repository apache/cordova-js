/**
 * Encapsulates a set of parameters that the capture device supports.
 */
function ConfigurationData() {
    // The ASCII-encoded string in lower case representing the media type. 
    this.type = null; 
    // The height attribute represents height of the image or video in pixels. 
    // In the case of a sound clip this attribute has value 0. 
    this.height = 0;
    // The width attribute represents width of the image or video in pixels. 
    // In the case of a sound clip this attribute has value 0
    this.width = 0;
}

module.exports = ConfigurationData;
