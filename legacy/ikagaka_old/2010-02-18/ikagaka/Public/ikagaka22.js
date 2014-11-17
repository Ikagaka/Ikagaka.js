(function(){

this.Ikagaka = function(){
	$("body").prepend("--Ikagaka phase20 test--<br />");
	$("#IkagakaBase").after(
		$("<div>")
		.attr("id","Ikagaka")
		.cleaner()
//		.css("visibility","hidden")
	);
	this.namedlist = new Array();
	this.namedlist.push("./ssp/ghost/dot_sakura_020/");
	this.nownamed = this.namedlist[0];
	this.named = new Array();
	this.named[this.nownamed] = new Named(this,0,this.nownamed);
	this.named[this.nownamed].load();
	return this;
};

//========================================================================

var Named = function(parent,id,url){
if(typeof(parent)&&typeof(url)){
	this.parent = parent;
	this.id = id;
	this.url = url;

	$("#Ikagaka").prepend(
		$("<div>")
		.addClass("named[" + this.id+"]")
		.addClass("named")
		.cleaner()
//		.css("visibility","hidden")
	);

	this.nowshell;
	this.shelllist = new Array();
	this.shell = new Array();

	this.nowscope = 0;
	this.scope = new Array();

}else $("body").prepend("warning! url or id is not found!<br />");
	return this;
};


Named.prototype.load = function(){
	var url = this.url;
if(typeof(url)){
	this.updates2Text = getStrList(url+"updates2.dau");
	var list = this.updates2Text;
if(list.length>0){
	var list2 = new Array();
	for(i=0;i<list.length;i++){
		list[i] = list[i].split("")[0];
		if(list[i].match(/^shell\/.*\//i)){
			var name = list[i].match(/^shell\/.*\//i);
			if(this.shell[name]);else{
				this.shelllist.push(name);
				this.shell[name] = new Shell(url);
			}
			this.shell[name].updates2Text.push(list[i]);
		}
	}

	this.nowshell = this.shelllist[0];
	this.shell[this.nowshell].load();

	this.nowscope = 0;
	this.scope[0] = new Scope(this,0);
	this.scope[0].nowsurface = 5000;
	this.scope[0].surfaceplayer();
	this.scope[0].nowenvelope = -1;
	this.scope[0].envelopeplayer();

	this.nowscope = 1;
	this.scope[1] = new Scope(this,1);
	this.scope[1].nowsurface = 10;
	this.scope[1].surfaceplayer();
	this.scope[1].nowenvelope = -1;
	this.scope[1].envelopeplayer();

	this.scripttid = 0;
	this.eventtid = 0;

	var _this = this;
	this.eventtid = setTimeout(function(){_this.eventplayer()},5000);

}else $("body").prepend("warning! ["+url+"] file not found<br />");
}else $("body").prepend("warning! url is not found!<br />");
	return this;
};

Named.prototype.eventplayer = function(){
	clearTimeout(this.eventtid);

	this.scope[0].text("");
	this.scope[1].text("");
	this.scope[0].envelopeplayer();
	this.scope[1].envelopeplayer();
	this.nowscript="\\0\\s[5006]Hello \\_w[250]World!\\n\\_w[1000]\\1\\s[10]ま、\\_w[500]基本やな。\\_w[500]\\0\\s[5352]だよねっ。\\_w[1000]\\1せやな。\\e";
//	this.scriptplayer();

	var _this=this;
//	this.eventtid = setTimeout(function(){_this.eventplayer()},5000);
}


Named.prototype.scriptplayer = function(){
	clearTimeout(this.scripttid);
	var wait = 50;
	if(this.nowscript.match(/^\\/)){
		var wait = 1;
		if(this.nowscript.match(/^\\0/) || this.nowscript.match(/^\\h/)){
			this.nowscope = 0;
			this.nowscript = this.nowscript.substr(2);
		}else if(this.nowscript.match(/^\\1/) || this.nowscript.match(/^\\u/)){
			this.nowscope = 1;
			this.nowscript = this.nowscript.substr(2);
		}else if(this.nowscript.match(/^\\p\[\d+\]/)){
			this.nowscope = this.nowscript.substr(3).match(/\d+/);
			if(this.scope[this.nowscope]) ; else this.scope[this.nowscope] = new scope(this,this.nowscope);
			this.nowscript = this.nowscript.replace(/^\\p\[\d+\]/,'');
		}else if(this.nowscript.match(/^\\s[0-9]/)){
			this.scope[this.nowscope].nowsurface = this.nowscript.substr(2,1);
			this.scope[this.nowscope].surfaceplayer();
			this.nowscript = this.nowscript.substr(3);
		}else if(this.nowscript.match(/^\\s\[-?\d+\]/)){
			this.scope[this.nowscope].nowsurface = this.nowscript.substr(3).match(/-?\d+/);
			this.scope[this.nowscope].surfaceplayer();
			this.nowscript = this.nowscript.replace(/^\\s\[-?\d+\]/,'');
		}else if(this.nowscript.match(/^\\i\[-?\d+\]/)){
		}else if(this.nowscript.match(/^\\b\[-?\d+\]/)){
			this.scope[this.nowscope].nowenvelope = this.nowscript.substr(3).match(/-?\d+/);
			this.scope[this.nowscope].envelopeplayer();
			this.nowscript = this.nowscript.replace(/^\\b\[-?\d+\]/,'');
		}else if(this.nowscript.match(/^\\n/)){
			this.scope[this.nowscope].addtext("<br />\n");
			this.nowscript = this.nowscript.substr(2);
		}else if(this.nowscript.match(/^\\n\[half\]/)){
		}else if(this.nowscript.match(/^\\c/)){
			this.scope[this.nowscope].text("");
			this.nowscript = this.nowscript.substr(2);
		}else if(this.nowscript.match(/^\\!\[\*\]/)){
		}else if(this.nowscript.match(/^\\w[1-9]/)){
			var wait = this.nowscript.substr(2,1)*50;
			this.nowscript = this.nowscript.substr(3);
		}else if(this.nowscript.match(/^\\_w\[\d+\]/)){
			var wait = this.nowscript.substr(4).match(/^\d+/);
			this.nowscript = this.nowscript.replace(/^\\_w\[\d+\]/,'');
		}else if(this.nowscript.match(/^\\x/)){
			this.nowscript = this.nowscript.substr(2);
		}else if(this.nowscript.match(/^\\t/)){
			this.nowscript = this.nowscript.substr(2);
		}else if(this.nowscript.match(/^\\_q/)){
			this.nowscript = this.nowscript.substr(3);
		}else if(this.nowscript.match(/^\\_s/)){
			this.nowscript = this.nowscript.substr(3);
		}else if(this.nowscript.match(/^\\q\[.*\]/)){
		}else if(this.nowscript.match(/^\\_a\[.*\]/)){
		}else if(this.nowscript.match(/^\\e/)){
			this.nowscript = "";
			this.nowscript = this.nowscript.substr(2);
		}else if(this.nowscript.match(/^\\-/)){
			this.nowscript = this.nowscript.substr(2);
		}else if(this.nowscript.match(/^\\4/)){
			this.nowscript = this.nowscript.substr(2);
		}else if(this.nowscript.match(/^\\5/)){
			this.nowscript = this.nowscript.substr(2);
		}else if(this.nowscript.match(/^\\v/)){
			this.nowscript = this.nowscript.substr(2);
		}else if(this.nowscript.match(/^\\!\[.*\]/)){
			if(this.nowscript.match(/^\\!\[change,ghost,.*\]/)){
			}else if(this.nowscript.match(/^\\!\[change,shell,.*\]/)){
			}else if(this.nowscript.match(/^\\!\[change,balloon,.*\]/)){
			}else if(this.nowscript.match(/^\\!\[call,ghost,.*\]/)){
			}else if(this.nowscript.match(/^\\!\[raise,.*\]/)){
			}
		}
	}else{
		if(this.scope[this.nowscope].nowenvelope==-1){
			this.scope[this.nowscope].nowenvelope=0;
			this.scope[this.nowscope].envelopeplayer();
		}
		this.scope[this.nowscope].addtext(this.nowscript.substr(0,1));
		this.nowscript = this.nowscript.substr(1);
	}
	var _this = this;
	if(this.nowscript.length>0) this.scripttid = setTimeout(function(){_this.scriptplayer()},wait);
};


//========================================================================

var Descript = function(list){
	var descript = new Array();
	for(var i=0;i<list.length;i++){
		if(list[i].match(/.*,.*/i)) descript[list[i].split(",")[0]] = list[i].split(",")[1];
	}
	return descript;
};

//========================================================================

var Shell = function(url){
	this.url = url;
	this.updates2Text = new Array();
	this.descriptText;
	this.descript;
	this.surfacesText = new Array();
	this.surface = new Array();
};

Shell.prototype.load = function(){
	var url = this.url;
if(typeof(url)){
	var list = this.updates2Text;
	for(var i=0;i<list.length;i++){
		if(list[i].match(/^shell\/.*\/descript\.txt$/i)){
			this.descriptText = getStrList(url+list[i]);
			this.descript = Descript(this.descriptText);
		}else if(list[i].match(/^shell\/.*\/surfaces\.txt$/i)){
			this.surfacesText = getStrList(url+list[i]);
			var list2 = this.surfacesText;
			for(var j=0;j<list2.length;j++){
				if(list2[j].match(/^surface\d+$/i)){
					if(num) this.surface[num].load();
					var num = list2[j].substr(7);
					if(this.surface[num]);else this.surface[num] = new Surface(this.url+list[i].match(/^shell\/.*\//i)[0]);
//					this.surface[num].src = url+list[i].match(/^shell\/.*\//i)[0]+list2[j]+".png";
					this.surface[num].img.src = url+list[i].match(/^shell\/.*\//i)[0]+list2[j]+".png";
				}if(num&&list2[j]) this.surface[num].surfacesText.push(list2[j]);
			}
			if(num) this.surface[num].load();
		}else if(list[i].match(/^shell\/.*\/surface\d+\.png$/i)){
			var nom = list[i].match(/surface\d+\.png$/i)[0].match(/\d+/i);
			if(this.surface[nom]);else this.surface[nom] = new Surface(this.url+list[i].match(/^shell\/.*\//i)[0]);
//			this.surface[nom].src = url+list[i];
			this.surface[nom].img.src = url+list[i];
		}
	}
}else $("body").prepend("warning! url is not found!<br />");
	return this;
};


//========================================================================

var Surface = function(url){
	this.url = url;
	this.updates2Text = new Array();
	this.src;
	this.img = new Image();
	this.surfacesText = new Array();
	this.collision = new Array();
	this.element = new Array();
	this.interval = new Array();
	this.serikolist = new Array();
};

Surface.prototype.load = function(){
	var list = this.surfacesText;
	for(var i=0;i<list.length;i++){
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
			this.element[ary[0]] = new Array();
			this.element[ary[0]].pattern = ary[1];
			this.element[ary[0]].src = this.url+ary[2];
			this.element[ary[0]].x = ary[3];
			this.element[ary[0]].y = ary[4];
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
};

//========================================================================

var Scope = function(named,id){
if(typeof(named)&&typeof(id)){
	this.parent = named;
	this.id = id;

	this.nowsurface = 0;
	this.nowenvelopepsition = "right";

	this.seriko = new Array();

	if(named.nowscope==0){
		var offsetx = 100;
	}else{
		var offsetx = 300;
	}

	$("#Ikagaka>.named["+this.parent.id+"]").prepend(
		$("<div>")
		.addClass("scope[" + this.id+"]")
		.addClass("scope")
		.cleaner()
		.css("right",offsetx+"px")
		.css("visibility","hidden")
	);
	$("#Ikagaka>.named["+this.parent.id+"]>.scope["+this.id+"]").prepend(
		$("<div>")
		.addClass("surface")
		.cleaner()
		.css("display","inline")
		.css("float","left")
	);
	$("#Ikagaka>.named["+this.parent.id+"]>.scope["+this.id+"]>.surface").prepend(
		$("<img>")
		.addClass("surfaceimg")
		.cleaner()
	);
	$("#Ikagaka>.named["+this.parent.id+"]>.scope["+this.id+"]").prepend(
		$("<div>")
		.addClass("envelope")
		.cleaner()
		.css("display","inline")
		.css("float","left")
	);
	$("#Ikagaka>.named["+this.parent.id+"]>.scope["+this.id+"]>.envelope").prepend(
		$("<div>")
		.addClass("text")
		.cleaner()
		.css("z-index","2000")
	);
}else $("body").prepend("warning! id and named is not found!<br />");
	return this;
};



Scope.prototype.surfaceplayer = function(){
	var named = this.parent;
	if(this.nowsurface==-1){
		$("#Ikagaka .named"+named.id+" .scope"+this.id+" .surface")
			.css("visibility","hidden")
	}else{
		var surface = named.shell[named.nowshell].surface[this.nowsurface];
		var img = surface.img;
//		var img = new Image();
//		img.src = surface.src;
		if(img.width>0){
			$("#Ikagaka>.named["+named.id+"]>.scope["+this.id+"]>.surface>.surfaceimg")
				.attr("src",img.src)
		}else $("body").prepend("warning! "+img.src+" is not found!<br />");
			$(".named"+this.parent.id+" .scope"+this.id+" .surface .collision").remove();
			for(var i=0;i<surface.collision.length;i++){
				$(".named"+this.parent.id+" .scope"+this.id+" .surface").prepend(
					$("<div>")
					.addClass("collision"+i)
					.addClass("collision")
					.cleaner()
					.css("left",surface.collision[i].x+"px")
					.css("top",surface.collision[i].y+"px")
					.width(surface.collision[i].X-surface.collision[i].x+"px")
					.height(surface.collision[i].Y-surface.collision[i].y+"px")
					.css("z-index","1999")
					.css("cursor","pointer")
				);
			}
/*			$(".named"+this.parent.id+" .scope"+this.id+" .surface .seriko").remove();
			for(var i=0;i<surface.serikolist.length;i++){
				$(".named"+this.parent.id+" .scope"+this.id+" .surface").prepend(
					$("<div>")
					.addClass("seriko"+surface.serikolist[i])
					.addClass("seriko")
					.cleaner()
				);
				this.seriko[i] = new Seriko(this,surface.serikolist[i],surface);
				this.seriko[i].serikoplayer();
			}
*//*			$(".named"+this.parent.id+" .scope"+this.id+" .surface .element").remove();
			for(var i=0;i<surface.element.length;i++){
				var ing = new Image();
				ing.src = surface.element[i].src;
				$(".named"+this.parent.id+" .scope"+this.id+" .surface").prepend(
					$("<div>")
					.addClass("element"+i)
					.addClass("element")
					.cleaner()
					.css("background-image","url("+ing.src+")")
					.css("filter","Chroma(color=#0000ff)")
					.css("left",surface.element[i].x+"px")
					.css("top",surface.element[i].y+"px")
					.width(ing.width+"px")
					.height(ing.height+"px")
					.css("z-index","1999")
				);
			}
*/
	}
	return this;
};

//========================================================================
var Seriko = function(scope,a,b){
	this.parent = scope;
	this.name = a;
	this.surface = b;
	this.serikotid = 0;

};

Seriko.prototype.serikoplayer = function(){
	clearTimeout(this.serikotid);
	var seriko = this.surface.interval[this.name];
	if(seriko.timing=="sometimes"){
/*		if(parseInt(Math.random()*10)>5){
		$("body").prepend(seriko.timing+"<br />");
			for(var i=0;i<seriko.pattern.length;i++){
				var anime = seriko.pattern[i];
				$("body").prepend(anime.num+"<br />");
				var surfaceEX = this.parent.parent.shell[this.parent.parent.nowshell].surface[anime.num].src;
				$("body").prepend(surfaceEX+"<br />");
				$(".named"+this.parent.id+" .scope"+this.id+" .surface .seriko"+name)
					.css("left",anime.x+"px")
					.css("top",anime.y+"px")
					.css("background-image","url("+url+hoge[anime.surface].img.src+")")
					.css()
			}
		}
		var _this = this;
		this.serikotid = setTimeout(function(){_this.serikoplayer()},1000);
*/	}else if(seriko.timing=="rarely"){
	}else if(seriko.timing.match(/random,\d+/)){
	}else if(seriko.timing=="always"){
	}else if(seriko.timing=="runonce"){
	}else if(seriko.timing=="never"){
	}else if(seriko.timing=="bind"){
	}else if(seriko.timing.match(/talk,\d+/)){
	}else if(seriko.timing=="yen-e"){
	}
};



Scope.prototype.envelopeplayer = function(){
	var named = this.parent;
	if(this.nowenvelope==-1){
		$("#Ikagaka .named"+named.id+" .scope"+this.id+" .envelope")
			.css("visibility","hidden")
	}else{
		var descript = named.shell[named.nowshell].descript;
		var surface = named.shell[named.nowshell].surface[this.nowsurface];
		var img = surface.img;
//		var img = new Image();
//		img.src = surface.src;
		if(this.id==0){
			if(img.width>0){
				var offsety = 0+Number(descript["sakura.balloon.offsety"]);
				var offsetx = img.width + Number(descript["sakura.balloon.offsetx"]);
			}else $("body").prepend("warning! "+img.src+" is not found!<br />");
			var width = 300;
			var height = 200;
		}else{
			if(img.width>0){
				var offsety = 0+Number(descript["kero.balloon.offsety"]);
				var offsetx = img.width + Number("-"+descript["kero.balloon.offsetx"]);
			}else $("body").prepend("warning! "+img.src+" is not found!<br />");
			var width = 300;
			var height = 100;
		}
		var _this = this;
		$("#Ikagaka .named"+named.id+" .scope"+this.id+" .envelope")
			.css("background-color","#998833")
			.width(width+"px")
			.height(height+"px")
			.css("top",offsety+"px")
			.css(this.nowenvelopepsition,offsetx+"px")
			.css("visibility","visible")
/*			.unbind()
			.toggle(function(){
				_this.nowenvelopepsition = "left";
				_this.envelopeplayer();
			},function(){
				_this.nowenvelopepsition = "right";
				_this.envelopeplayer();
			})
*/		$("#Ikagaka .named"+named.id+" .scope"+this.id+" .envelope .text")
			.css("background-color","#ccbb66")
			.width(width-20+"px")
			.height(height-20+"px")
			.css("top","10px")
			.css("left","10px")
	}
	return this;
};


Scope.prototype.addtext = function(_){
	var named = this.parent;
	$("#Ikagaka .named"+named.id+" .scope"+this.id+" .envelope .text")
		.append(_)
};


Scope.prototype.text = function(_){
	var named = this.parent;
	$("#Ikagaka .named"+named.id+" .scope"+this.id+" .envelope .text")
		.text(_)
};

})()