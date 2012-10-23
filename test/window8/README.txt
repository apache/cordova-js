How to create a new win8-metro app using PhoneGap?

1.	Follow the instructions listed in README.md up to creating the pkg/ directory in incubator-cordova-js project.
2.	Create a javascript/html Windows 8 (formerly Metro Style) app or use an existing one from Visual Studio 2012.
3.  Copy the 'cordova.windows8.js' in pkg/ directory to the position you decide in your metro app created before.
4.  On each html page in the app that needs the cordova scripts, add these lines to those files:
         <script src="//Microsoft.WinJS.1.0.RC/js/base.js"></script>
    	 <script src="//Microsoft.WinJS.1.0.RC/js/ui.js"></script>

    	 <script type="text/javascript" src="../js/cordova.windows8.js"></script>

    If one or more exist, you could go ahead without adding the existing scripts again.
5.  Confirm that these links correctly reference the files. If not, update the location pointed to by source accordingly.
6.	Build and run.