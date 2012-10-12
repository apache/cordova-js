var FileError = require('cordova/plugin/FileError'),
    ProgressEvent = require('cordova/plugin/ProgressEvent');

var FileReader = function() {
    this.fileName = "";

    this.readyState = 0; // FileReader.EMPTY

    // File data
    this.result = null;

    // Error
    this.error = null;

    // Event handlers
    this.onloadstart = null;    // When the read starts.
    this.onprogress = null;     // While reading (and decoding) file or fileBlob data, and reporting partial file data (progess.loaded/progress.total)
    this.onload = null;         // When the read has successfully completed.
    this.onerror = null;        // When the read has failed (see errors).
    this.onloadend = null;      // When the request has completed (either in success or failure).
    this.onabort = null;        // When the read has been aborted. For instance, by invoking the abort() method.
};

FileReader.prototype.readAsText=function(file, encoding) {
	console.error("webos plugin filereader readastext:"+file);
	//Mojo has no file i/o yet, so we use an xhr. very limited
	
    // Already loading something
    if (this.readyState == FileReader.LOADING) {
        throw new FileError(FileError.INVALID_STATE_ERR);
    }

    // LOADING state
    this.readyState = FileReader.LOADING;

    // If loadstart callback
    if (typeof this.onloadstart === "function") {
        this.onloadstart(new ProgressEvent("loadstart", {target:this}));
    }

    // Default encoding is UTF-8
    var enc = encoding ? encoding : "UTF-8";

    var me = this;

	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function() {
		console.error("onreadystatechange:"+xhr.readyState+" "+xhr.status);
		if (xhr.readyState == 4) {
			if (xhr.status == 200 && xhr.responseText != null) {
				console.error("file read completed");
            // Save result
            me.result = xhr.responseText;

            // If onload callback
            if (typeof me.onload === "function") {
                me.onload(new ProgressEvent("load", {target:me}));
            }

            // DONE state
            me.readyState = FileReader.DONE;

            // If onloadend callback
            if (typeof me.onloadend === "function") {
                me.onloadend(new ProgressEvent("loadend", {target:me}));
            }

			} else {

		// If DONE (cancelled), then don't do anything
        if (me.readyState === FileReader.DONE) {
            return;
        }

        // DONE state
        me.readyState = FileReader.DONE;

        me.result = null;

        // Save error
        me.error = new FileError(FileError.NOT_FOUND_ERR);

        // If onerror callback
        if (typeof me.onerror === "function") {
            me.onerror(new ProgressEvent("error", {target:me}));
        }

        // If onloadend callback
        if (typeof me.onloadend === "function") {
            me.onloadend(new ProgressEvent("loadend", {target:me}));
        }

			}
		}
	};
	xhr.open("GET", file, true);
	xhr.send();
};

module.exports = FileReader;
