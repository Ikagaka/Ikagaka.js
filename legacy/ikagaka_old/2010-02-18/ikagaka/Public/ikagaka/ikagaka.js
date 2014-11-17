var Ikagaka = function(){
	this.namedlist = new Array();
	this.nownamed = 0;
	this.named = new Array();

	return this;
};


Ikagaka.prototype.load = function(){
	$("#IkagakaBase").after(
		$("<div>")
		.attr("id","Ikagaka")
		.cleaner()
	);

	$("body").prepend("--Ikagaka phase20 test--<br />");
	this.named[this.nownamed] = new Named();
	this.named[this.nownamed].parent = this;
	this.named[this.nownamed].url = this.namedlist[this.nownamed];
	this.named[this.nownamed].id = this.nownamed;
	this.named[this.nownamed].load();

	return this;
};