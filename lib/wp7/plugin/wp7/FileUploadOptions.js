/**
 * Options to customize the HTTP request used to upload files.
 * @constructor
 * @param fileKey {String}   Name of file request parameter.
 * @param fileName {String}  Filename to be used by the server. Defaults to image.jpg.
 * @param mimeType {String}  Mimetype of the uploaded file. Defaults to image/jpeg.
 * @param params {Object}    Object with key: value params to send to the server.
 */
var FileUploadOptions = function(fileKey, fileName, mimeType, params) {
    this.fileKey = fileKey || null;
    this.fileName = fileName || null;
    this.mimeType = mimeType || null;

    if(params && typeof params != typeof "") {
        var arrParams = [];
        for(var v in params) {
            arrParams.push(v + "=" + params[v]);
        }
        this.params = encodeURIComponent(arrParams.join("&"));
    }
    else {
        this.params = params || null;
    }
};

module.exports = FileUploadOptions;