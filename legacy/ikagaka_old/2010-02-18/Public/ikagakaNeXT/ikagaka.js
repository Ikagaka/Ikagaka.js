(function(){
var ikagaka = {};
ikagaka.version = "0.6.0";
ikagaka.named = [];


ikagaka.setNamed = function(homeurl,callback){
	this.named[homeurl] = {};
	this.named[homeurl].homeurl = homeurl;
	$("body").append(homeurl);
	$.get("./sample.txt",function(text){
		$("body").append(text);
	});
};

window.ikagaka = ikagaka;
})();

$(function(){ikagaka.setNamed("./sample.txt");});