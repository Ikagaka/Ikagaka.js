var Shiori = function(){
	this.url;
	this.updates2Text = new Array();

	return this;
};


Shiori.prototype.load = function(){
};

Shiori.prototype.unload = function(){
};

Shiori.prototype.request = function(_){
//$("body").prepend("sa<br />");
	var str = _;
	this.request = new Request();
	this.request.decode(str);
	this.response = new Response();
	this.response.key.push("Sender");
	this.response.value["Sender"] = "A.O.I.";
	this.response.key.push("Value");
	this.response.value["Value"] = "\\0\\s[3]Hello \\_w[250]World!\\n\\_w[1000]\\1\\s[10]ま、基本やね。\\_w[500]\\0\\s[5]だよねっ。\\e";

	return this.response.encode();

};

