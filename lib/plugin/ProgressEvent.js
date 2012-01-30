function ProgressEvent(type, dict) {
    this.type = type;
    this.bubbles = false;
    this.cancelBubble = false;
    this.cancelable = false;
    this.lengthComputable = false;
    this.loaded = dict && dict.loaded ? dict.loaded : 0;
    this.total = dict && dict.total ? dict.total : 0;
    this.target = dict && dict.target ? dict.target : null;
}

module.exports = ProgressEvent;
