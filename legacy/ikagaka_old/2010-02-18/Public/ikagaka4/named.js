var Named = function(){
	$("body").append("new named<br />");

	this.url;
	this.id;
	this.updates2Text;

	this.shell = new Array();

	this.nowscope = 0;
	this.scope = new Array();

	this.scripttid = 0;
	this.eventtid = 0;

	$("#Ikagaka").prepend(
		$("<div>")
		.addClass("named" + this.id)
		.addClass("named")
		.cleaner()
		.append("named")
		.css("border","1px solid #00ff00")
//		.css("visibility","hidden")
		.css("height","0px")
	);

	return this;
};


Named.prototype.load = function(_){
	$("body").append("load named<br />");
	this.url = _;

if(
	typeof(this.url) == "string" &&
	typeof(this.id) == "number"
){
	this.updates2Text = getStrList(this.url+"updates2.dau");

	var list = this.updates2Text;

	this.shell["master"] = new Shell();
	this.shell["master"].url = this.url;

	for(i=0;i<list.length;i++){
		list[i] = list[i].split("")[0];
//$("body").append(list[i]+"<br />");
		if(list[i].match(/^shell\/master\//i)){
			this.shell["master"].updates2Text.push(list[i]);
		}
	}

	this.shell["master"].load();

}else $("body").append(
	"this.url: " + typeof(this.url) + "<br />" +
	"this.id: " + typeof(this.id) + "<br />"
);
	return this;
};