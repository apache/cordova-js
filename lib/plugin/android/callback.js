var port = null;
var token = null;

module.exports = function() {
  // Exit if shutting down app
  if (PhoneGap.shuttingDown) {
      return;
  }

  // If polling flag was changed, start using polling from now on
  if (PhoneGap.UsePolling) {
      PhoneGap.JSCallbackPolling();
      return;
  }

  var xmlhttp = new XMLHttpRequest();

  // Callback function when XMLHttpRequest is ready
  xmlhttp.onreadystatechange=function(){
      if(xmlhttp.readyState === 4){

          // Exit if shutting down app
          if (PhoneGap.shuttingDown) {
              return;
          }

          // If callback has JavaScript statement to execute
          if (xmlhttp.status === 200) {

              // Need to url decode the response
              var msg = decodeURIComponent(xmlhttp.responseText);
              setTimeout(function() {
                  try {
                      var t = eval(msg);
                  }
                  catch (e) {
                      // If we're getting an error here, seeing the message will help in debugging
                      console.log("JSCallback: Message from Server: " + msg);
                      console.log("JSCallback Error: "+e);
                  }
              }, 1);
              setTimeout(PhoneGap.JSCallback, 1);
          }

          // If callback ping (used to keep XHR request from timing out)
          else if (xmlhttp.status === 404) {
              setTimeout(PhoneGap.JSCallback, 10);
          }

          // If security error
          else if (xmlhttp.status === 403) {
              console.log("JSCallback Error: Invalid token.  Stopping callbacks.");
          }

          // If server is stopping
          else if (xmlhttp.status === 503) {
              console.log("JSCallback Server Closed: Stopping callbacks.");
          }

          // If request wasn't GET
          else if (xmlhttp.status === 400) {
              console.log("JSCallback Error: Bad request.  Stopping callbacks.");
          }

          // If error, revert to polling
          else {
              console.log("JSCallback Error: Request failed.");
              PhoneGap.UsePolling = true;
              PhoneGap.JSCallbackPolling();
          }
      }
  };

  if (port === null) {
      port = prompt("getPort", "gap_callbackServer:");
  }
  if (token === null) {
      token = prompt("getToken", "gap_callbackServer:");
  }
  xmlhttp.open("GET", "http://127.0.0.1:"+port+"/"+token , true);
  xmlhttp.send();
}
