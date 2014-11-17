window.onload = function(){
//	homeurl = 'http://refrain.sakura.ne.jp/kurosakura/';
//	homeurl = 'http://www.nanican.net/dot-sakura/download/ghost/dot_sakura_000/';
//	homeurl = 'http://dl.dropbox.com/u/265158/ssp/ghost/dot_sakura_020/';
//	homeurl = 'http://home.384.jp/evidence/update/bee/';
//	homeurl = 'http://ssp.shillest.net/ghost/emily4/';
//	homeurl = 'http://missii-web.hp.infoseek.co.jp/ku-/';
	homeurl = 'http://home.384.jp/evidence/update/Nikola_Tesla/';
	a = new Ikagaka();
	a.addNamed(homeurl);
	a.boot(0);
	$("body").append("Hello World!<br />");
};



(function(){
//========================================================================
// Ikagaka
//========================================================================
//====================================
// objIka = new Ikagaka();
//====================================
this.Ikagaka = function(){
	this.aryNamed = new Array();
	this.aryHomeurl = new Array();
	// aryNamed[0] is default Named.
	$("body").append("new Ikagaka<br />");
	this.addNamed('http://dl.dropbox.com/u/265158/ssp/ghost/dot_sakura_020/');
	return(this);
};
//====================================
// objIka.addNamed(_strUrl);
//====================================
this.Ikagaka.prototype.addNamed = function(_strUrl){
	var strUrl = _strUrl;
	this.aryHomeurl.push(strUrl);
	$("body").append("addNamed("+strUrl+")<br />");
	return(this);
};
//====================================
// objIka.boot(_numId);
//====================================
this.Ikagaka.prototype.boot = function(_numId){
	var numId = Number(_numId);
	if(numId);else numId = 0;
	if(typeof this.aryHomeurl[numId] == "string"){
		this.aryNamed[numId] = new this.Named();
//		this.aryNamed[numId].materialize(this.aryHomeurl[numId]);
	}
	$("body").append("boot("+numId+")<br />");
	$("body").append(" homeurl"+this.aryHomeurl[numId]+"<br />");
	return(this);
};
//========================================================================
// Named
//========================================================================
//====================================
// objNamed = new objIka.Named();
//====================================
this.Ikagaka.prototype.Named = function(){
	$("body").append("new Named<br />");
	return(this);
};
//====================================
// objNamed.materialize(_strUrl);
//====================================
this.Ikagaka.Named.prototype.materialize = function(_strUrl){
	$("body").append("Hello World!<br />");
	var strUrl = _strUrl;
	var funcCallback = function(){};
//	this.Updates2(strUrl+"updates2.dau",);
	$("body").append("Hello World!<br />");
	$("body").append("strUrl<br />");
	return(this);
};
/*
//====================================
// objNamed.Updates2(strUrl.funcCallback);
//====================================
this.Ikagaka.prototype.Updates2 = function(){
};
//====================================
// objNamed.Descript(strUrl.funcCallback);
//====================================
this.Ikagaka.prototype.Descript = function(){
};







*/








})();

