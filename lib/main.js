// Yucheng Lin
// Tab-Limit

// Priority Queue Class ###############################################################################################################
var priorityQueue = function(){
	this.Vec = [];
	this.vecSize = this.Vec.length;  
}

// Push Function
priorityQueue.prototype.push = function(element){

	this.Vec.push(element);
	this.vecSize = this.Vec.length;

}

// Pop Function
priorityQueue.prototype.pop = function(){
	this.Vec[0] = this.Vec[this.vecSize -1];
	this.Vec.shift();
	this.vecSize = this.Vec.length;

}

// Top Function, Returns value at Vec[0]
priorityQueue.prototype.top = function(){
	if ( this.vecSize != 0){
		return this.Vec[0];
	}

	else{
		console.log("Error. Top");
	}

}

// Display whats inside the priority queue
priorityQueue.prototype.display = function(){
	for ( var i = 0; i < this.vecSize; i++){
		console.log(i + " : " +this.Vec[i] );
	}
}

// Sets the priority queue to empty
priorityQueue.prototype.clear = function(){
	while(this.vecSize > 0){
		this.Vec.pop();
	}
}

// Change the priority of recently used tabs by shifting all the value down and adding it to the beginning of the queue again
priorityQueue.prototype.deprioritize = function(i){
	var temp = this.Vec[i];
	for ( var j = i; j < this.vecSize - 1; j++){
		this.Vec[j] = this.Vec[j+1];
	}
	this.Vec[this.vecSize - 1] = temp;

} 
 //###################################################################################################################################

var { ToggleButton } = require('sdk/ui/button/toggle');
var tabs = require("sdk/tabs");
var pQ = new priorityQueue();
var Max;
var data = require("sdk/self").data;

// UI panel
var text_entry = require("sdk/panel").Panel({
  height : 100,
  contentURL: data.url("maxTabs.html"),
  contentScriptFile: data.url("getText.js")
});

// Toggel Button
var button = ToggleButton({
  id: "TabManager",
  label: "Tab Limit",
  icon: {
    "16": "./icon2-16.png",
    "32": "./icon2-32.png",
    "64": "./icon2-64.png"
  },
  onChange: fillQueue,

});

// Show panel function
text_entry.on("show", function() {
  text_entry.port.emit("show");
});

// Get Value function
text_entry.port.on("text-entered", function (text) {
  if( parseInt(text) > 0 && parseInt(text) < 11){
	Max = parseInt(text);
  }

  else{
  	Max = 5;
  }
  text_entry.hide();
});

// Listens for openTabs and closes old ones
function onOpen(tab){
	while(tabs.length > Max ){
		pQ.top().activate()
		pQ.top().close();
		pQ.pop();
			
	}
			pQ.push(tab);
}

// Deprioritize tabs that are being activated
function onActivate(tab){
	for( var i = 0; i < pQ.vecSize; i++){
		if( pQ.Vec[i] == tab){
			pQ.deprioritize(i);
		}
	}
}

// Main Tab limit function
function fillQueue() {
	this.state('window', null);
	this.checked = !this.checked;

    if (this.checked){
    	text_entry.show({position:button});
		for ( let tab of tabs){
			pQ.push(tab);
		}

		while(tabs.length > Max){
				pQ.top().activate()
				pQ.top().close();
				pQ.pop();
		}

		tabs.on('open', onOpen);
		tabs.on('activate', onActivate);
	}

	else{
		tabs.removeListener('open', onOpen);
		tabs.removeListener('activate', onActivate);
	}

}


