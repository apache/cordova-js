module.exports={

types: {
	text: 0,
	password: 1,
	search: 2,
	range: 3,
	email: 4,
	number: 5,
	phone: 6,
	url: 7,
	color: 8
},
_isShowing:null,
_manual:null,
isManualMode:null,
isShowing: function() {
	return _isShowing || false;
},
show: function(type){
	if(isManualMode()) {
		PalmSystem.keyboardShow(type || 0);
	}
},
hide: function(){
	if(isManualMode()) {
		PalmSystem.keyboardHide();
	}
},
setManualMode: function(mode){
	_manual = mode;
	PalmSystem.setManualKeyboardEnabled(mode);
},
isManualMode: function(){
	return _manual || false;
},
forceShow: function(inType){
	this.setManualMode(true);
	PalmSystem.keyboardShow(inType || 0);
},
forceHide: function(){
	this.setManualMode(true);
	PalmSystem.keyboardHide();
}

}