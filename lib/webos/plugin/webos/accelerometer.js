var callback;
module.exports={

/*
 * Tells WebOS to put higher priority on accelerometer resolution. Also relaxes the internal garbage collection events.
 * @param {Boolean} state
 * Dependencies: Mojo.windowProperties
 * Example:
 *         navigator.accelerometer.setFastAccelerometer(true)
 */
setFastAccelerometer: function(state) {
    navigator.windowProperties.fastAccelerometer = state;
    navigator.window.setWindowProperties();
},

/*
 * Starts the native acceleration listener.
 */
start: function(win,fail,args) {
    console.error("webos plugin accelerometer start");
    window.removeEventListener("acceleration", callback);
    callback=function(event) {
        var accel = new Acceleration(event.accelX*-9.81, event.accelY*-9.81, event.accelZ*-9.81);
        win(accel);
    }
    document.addEventListener("acceleration", callback);
},
stop: function (win,fail,args) {
    console.error("webos plugin accelerometer stop");
    window.removeEventListener("acceleration", callback);
}

}
