var Descript = function(list){
	var descript = new Array();
	for(var i=0;i<list.length;i++){
		if(list[i].match(/.*,.*/i)) descript[list[i].split(",")[0]] = list[i].split(",")[1];
	}
	return descript;
};


function getStrList(_){
//	var Text = jQuery.ajax({url: "http://legokichi.cool-biz.net/ikagaka/crossdomain.php?url="+_,async: false}).responseText;
	var Text = jQuery.ajax({url: _,async: false}).responseText;
	Text = Text.replace(/\r\n/g,"\n");
	Text = Text.replace(/\r/g,"\n");
	return Text.split("\n");
}

//========================================================================


var Request = function(){
	this.method;
	this.protocol;
	this.key = new Array();
	this.value = new Array();

	return this;
};

Request.prototype.encode = function(){

	this.request = "GET SHIORI/3.0";
	this.request += "\r\n";
	for(var i=0;i<this.key.length;i++){
		this.request += this.key[i]+": "+this.value[this.key[i]];
		this.request += "\r\n";
	}

	return this.request;

};

Request.prototype.decode = function(_){
	var Text = _;
	Text = Text.replace(/\r\n/g,"\n");
	Text = Text.replace(/\r/g,"\n");
	var list = Text.split("\n");

	this.key = new Array();
	this.value = new Array();

	for(var i=1;i<list.length;i++){
//$("body").prepend(list[i]+"<br />");
		if(list[i].match(/^.+: /i)){
			var hoge = list[i].split(": ")
			this.key.push(hoge[0])
			this.value[hoge[0]] = hoge[1];
		}
	}
	return this;
};



var Response = function(){
	this.protocol;
	this.status;
	this.key = new Array();
	this.value = new Array();

	return this;
};

Response.prototype.encode = function(){

	this.response = "SHIORI/3.0 200 OK";
	this.response += "\r\n";
	for(var i=0;i<this.key.length;i++){
		this.response += this.key[i]+": "+this.value[this.key[i]];
		this.response += "\r\n";
	}

	return this.response;
};

Response.prototype.decode = function(_){
	var Text = _;
	Text = Text.replace(/\r\n/g,"\n");
	Text = Text.replace(/\r/g,"\n");
	var list = Text.split("\n");

	this.key = new Array();
	this.value = new Array();

	for(var i=1;i<list.length;i++){
//$("body").prepend(list[i]+"<br />");
		if(list[i].match(/^.+: /i)){
			var hoge = list[i].split(": ")
			this.key.push(hoge[0])
			this.value[hoge[0]] = hoge[1];
		}
	}
	return this;
};


