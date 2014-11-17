var Shell = function(){
	$("body").append("new shell<br />");

	this.url;
	this.updates2Text = new Array();

	this.descriptText = new Array();
	this.descript = new Array();

	this.surfacesText = new Array();
	this.surface = new Array();

	return this;
};

Shell.prototype.load = function(){
	$("body").append("load shell<br />");

if(
	typeof(this.url) == "string" &&
	typeof(this.updates2Text) == "object"
){
	var url = this.url;
	var list = this.updates2Text;

	for(var i=0;i<list.length;i++){
$("body").append(list[i]+"<br />");
		if(list[i].match(/^shell\/.*\/descript\.txt$/i)){
			this.descriptText = getStrList(url+list[i]);
			this.descript = Descript(this.descriptText);
		}else if(list[i].match(/^shell\/.*\/surfaces\.txt$/i)){
			this.surfacesText = getStrList(url+list[i]);
			var list2 = this.surfacesText;
			for(var j=0;j<list2.length;j++){
				if(list2[j].match(/^surface\d+$/i)){
					if(num) this.surface[num].load();
					var num = Number(list2[j].substr(7));
					if(this.surface[num]);else{
						this.surface[num] = new Surface();
						this.surface[num].url = this.url+list[i].match(/^shell\/.*\//i)[0]
					}
				}if(num&&list2[j]) this.surface[num].surfacesText.push(list2[j]);
			}
			if(num) this.surface[num].load();
		}else if(list[i].match(/^shell\/.*\/surface\d+\.png$/i)){
			var nom = Number(list[i].match(/surface\d+\.png$/i)[0].match(/\d+/i));
			if(this.surface[nom]);else{
				this.surface[nom] = new Surface();
				this.surface[nom].url = this.url+list[i].match(/^shell\/.*\//i)[0];
			}
			if(this.surface[nom].src);else this.surface[nom].src = url+list[i];
//$("body").append(nom+": "+this.surface[nom].src+"<br />");
		}
	}

}else $("body").prepend(
	"this.url: " + typeof(this.url) + "<br />" +
	"this.updates2Text: " + typeof(this.updates2Text) + "<br />"
);
	return this;
};


//========================================================================

var Surface = function(){
	this.url;
	this.updates2Text = new Array();
	this.src;
	this.surfacesText = new Array();

	this.collision = new Array();
	this.element = new Array();
	this.interval = new Array();
	this.serikolist = new Array();
};

Surface.prototype.load = function(){
if(
	typeof(this.url) == "string" &&
//	typeof(this.src) == "string" &&
	typeof(this.updates2Text) == "object" &&
	typeof(this.surfacesText) == "object"
){
	var list = this.surfacesText;
	for(var i=0;i<list.length;i++){
//$("body").prepend(list[i]+"<br />");
		if(list[i].match(/.+pattern\d+,\D/i)){
			var ary = list[i].split(",");
			var name = ary[0].match(/.+pattern/i)[0].replace(/pattern/i,"");
			var id = ary[0].match(/\d$/i)[0];
			if(this.interval[name]) ; else{
				this.interval[name] = new Array();
				this.serikolist.push(name);
				this.interval[name].pattern = new Array();
			}
			this.interval[name].pattern[id] = new Array();
			this.interval[name].pattern[id].pattern = ary[1];
			this.interval[name].pattern[id].num = ary[2];
			this.interval[name].pattern[id].wait = ary[3];
			this.interval[name].pattern[id].x = ary[4];
			this.interval[name].pattern[id].y = ary[5];
		}else if(list[i].match(/^.+interval,.+/i)){
			var ary = list[i].split(",");
			var name = ary[0].match(/.+interval/i)[0].replace(/interval/i,"");
			if(this.interval[name]) ; else{
				this.interval[name] = new Array();
				this.serikolist.push(name);
				this.interval[name].pattern = new Array();
			}
			this.interval[name].timing = ary[1];
		}else if(list[i].match(/^element\d+,.+,.+,\d+,\d+/i)){
			var ary = list[i].split(",");
			ary[0] = ary[0].substr(7);
			if(this.element[ary[0]]);else this.element[ary[0]] = new Array();
			var s = this.element[ary[0]].length;
			this.element[ary[0]][s] = new Array();
			this.element[ary[0]][s].pattern = ary[1];
			this.element[ary[0]][s].src = this.url+ary[2];
			this.element[ary[0]][s].x = ary[3];
			this.element[ary[0]][s].y = ary[4];
		}else if(list[i].match(/^collision\d+,\d+,\d+,\d+,\d+,.+/i)){
			var ary = list[i].split(",");
			ary[0] = ary[0].substr(9);
			this.collision[ary[0]] = new Array();
			this.collision[ary[0]].x = ary[1];
			this.collision[ary[0]].y = ary[2];
			this.collision[ary[0]].X = ary[3];
			this.collision[ary[0]].Y = ary[4];
			this.collision[ary[0]].name = ary[5];
		}

	}

}else $("body").prepend(
	"this.url: " + typeof(this.url) + "<br />" +
//	"this.src: " + typeof(this.src) + "<br />" +
	"this.updates2Text: " + typeof(this.updates2Text) + "<br />" +
	"this.surfacesText: " + typeof(this.surfacesText) + "<br />"
);
	return this;
};