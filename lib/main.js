
// Priority Queue Class ###############################################################################################################
var priorityQueue = function(){
	this.Vec = [];
	this.vecSize = this.Vec.length;  
}

priorityQueue.prototype.push = function(element){

	this.Vec.push(element);
	this.vecSize = this.Vec.length;
	/*
	var index = this.vecSize - 1;

	while( index != 0){
		if( this.Vec[index] > this.Vec[ Math.floor ((index - 1) / 2 )] ){
			
			var temp = this.Vec[index];
			this.Vec[index] = this.Vec[ Math.floor( (index - 1) / 2 ) ];
			this.Vec[ Math.floor( (index - 1 )/2 )] = temp;
		}

		else{
			break;
		}

		index = Math.floor( ( index - 1 ) / 2 );
	}*/

}

priorityQueue.prototype.pop = function(){
	this.Vec[0] = this.Vec[this.vecSize -1];
	this.Vec.shift();
	this.vecSize = this.Vec.length;
	/*var i = 0;
	var flag = 1;
	
	while(flag){
		if ( 2 * i+2 <= this.vecSize - 1 || 2*i+1 <= this.vecSize - 1 ){
			if (this.Vec[i] > this.Vec[2*i+1] && this.Vec[i] > this.Vec[2*i + 2]){
				flag = 0;
			}
		}

		else{
			break;
		}

		var highChild;

		if( this.Vec[2*i+1] > this.Vec[2*i+2] ){
			highChild = 2*i + 1;
		}

		else if( this.Vec[2*i+1] < this.Vec[2*i+2]){
			highChild = 2*i+2;
		}

		var temp = this.Vec[i];
		this.Vec[i] = this.Vec[highChild];
		this.Vec[highChild] = temp;


		i = highChild;	
	}*/

}

priorityQueue.prototype.top = function(){
	if ( this.vecSize != 0){
		return this.Vec[0];
	}

	else{
		console.log("Error. Top");
	}

}


priorityQueue.prototype.display = function(){
	for ( var i = 0; i < this.vecSize; i++){
		console.log(i + " : " +this.Vec[i] );
	}
}

priorityQueue.prototype.clear = function(){
	while(this.vecSize > 0){
		this.Vec.pop();
	}
}

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
var text_entry = require("sdk/panel").Panel({
  height : 100,
  contentURL: data.url("maxTabs.html"),
  contentScriptFile: data.url("getText.js")
});

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

text_entry.on("show", function() {
  text_entry.port.emit("show");
});

text_entry.port.on("text-entered", function (text) {
  if( parseInt(text) > 0 && parseInt(text) < 11){
	Max = parseInt(text);
  }

  else{
  	Max = 5;
  }
  text_entry.hide();
});

function onOpen(tab){
	while(tabs.length > Max ){
		pQ.top().activate()
		pQ.top().close();
		pQ.pop();
				//tabs[0].activate();
				//tabs[0].close();
	}

			//else{
		
			pQ.push(tab);
				//console.log(pQ.vecSize);
			//}

			pQ.display();
}

function onActivate(tab){
	for( var i = 0; i < pQ.vecSize; i++){
		if( pQ.Vec[i] == tab){
			pQ.deprioritize(i);
		}
	}
}

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
				//tabs[0].activate();
				//tabs[0].close();
		}

		tabs.on('open', onOpen);
		tabs.on('activate', onActivate);
	
	}

	else{
		tabs.removeListener('open', onOpen);
		tabs.removeListener('activate', onActivate);
	}

}


