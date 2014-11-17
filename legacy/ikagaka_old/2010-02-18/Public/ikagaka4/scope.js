var Scope = function(){
	this.parent;
	this.id;

	this.nowsurface = 0;
	this.nowenvelope = 0;
	this.nowenvelopeposition = "right";

	this.serikolist = new Array();
	this.seriko = new Array();

	this.DOM = new Array();
};



Scope.prototype.load = function(){
if(
	typeof(this.parent) == "object" &&
	typeof(this.id) == "number"
){
	var offsetx = 50 + (Number(this.parent.nowscope) * 200);

	this.DOM["named"] = $("#Ikagaka>.named"+this.parent.id).append(
		$("<div>")
		.addClass("scope"+this.id)
		.addClass("scope")
		.cleaner()
		.css("visibility","hidden")
		.css("right",offsetx+"px")
		.css("width","800px")
		.css("height","auto")
		.css("text-align",this.nowenvelopeposition)
		.draggable({cursor:"move",zIndex:2700})
	);
	this.DOM["scope"] = $("#Ikagaka>.named"+this.parent.id+">.scope"+this.id).append(
		$("<div>")
		.addClass("surface")
		.cleaner()
		.css("position","relative")
		.css("top","0px")
		.css("left","0px")
		.css("width","auto")
		.css("height","auto")
		.css("display","inline")
		.css("float",this.nowenvelopeposition)
	);
	this.DOM["surface"] = $("#Ikagaka>.named"+this.parent.id+">.scope"+this.id+">.surface").append(
		$("<img>")
		.addClass("surfaceimg")
		.cleaner()
		.css("position","relative")
		.css("top","0px")
		.css("left","0px")
		.css("width","auto")
		.css("height","auto")
//		.attr("src",this.parent.shell[this.parent.shelllist[this.parent.nowshell]].surface[this.nowsurface].src)
		.css("visibility","inherit")
		.css("z-index","-1")

	);

	this.DOM["surfaceimg"] = $("#Ikagaka>.named"+this.parent.id+">.scope"+this.id+">.surface>.surfaceimg")

	this.DOM["scope"].append(
		$("<div>")
		.addClass("envelope")
		.cleaner()
		.css("position","relative")
		.css("top","0px")
		.css("left","0px")
		.css("width","auto")
		.css("height","auto")
		.css("display","inline")
//		.css("float","clear")
//		.css("border","1px solid #ff00ff")
	);
	this.DOM["envelope"] = $("#Ikagaka>.named"+this.parent.id+">.scope"+this.id+">.envelope").append(
		$("<img>")
		.addClass("envelopeimg")
		.cleaner()
		.css("position","relative")
		.css("top","0px")
		.css("left","0px")
		.css("width","auto")
		.css("height","auto")
		.attr("src","./../balloon/ssp/balloons0.png")
		.css("visibility","inherit")
		.css("z-index","-1")

	);
	this.DOM["envelopeimg"] = $("#Ikagaka>.named"+this.parent.id+">.scope"+this.id+">.envelope>.envelopeimg")

	this.DOM["envelope"].append(
		$("<div>")
		.addClass("text")
		.cleaner()
		.css("top","0px")
		.css("left","0px")
		.css("width","auto")
		.css("height","150px")
		.css("word-break","break-all")
		.css("overflow-y","scroll")
		.css("margin","10px")
		.css("visibility","inherit")
//		.css("border","1px solid #ff00ff")
//		.append("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")
	);

	this.DOM["text"] = $("#Ikagaka>.named"+this.parent.id+">.scope"+this.id+">.envelope>.text")

}else $("body").prepend(
	"this.parent: " + typeof(this.parent) + "<br />" +
	"this.id: " + typeof(this.id) + "<br />"
);
	return this;
};



Scope.prototype.surfaceplayer = function(){
if(
	typeof(this.parent) == "object" &&
	typeof(this.id) == "number" &&
	typeof(this.nowsurface) == "number"
){
	var named = this.parent;


	if(this.nowsurface==-1){
		this.DOM["surface"]
			.css("visibility","hidden");
	}else{
		this.DOM["surface"]
			.css("visibility","visible");

		var surface = named.shell[named.shelllist[named.nowshell]].surface[this.nowsurface];
if(typeof(surface) == "object"){
		if(typeof(surface.src) == "string"){
			this.DOM["surfaceimg"]
				.attr("src",surface.src)
		}else //$("body").prepend("warning! "+surface.src+" is not found!<br />");



		$("#Ikagaka>.named"+named.id+">.scope"+this.id+">.surface>.element").remove();
		for(var i=0;i<surface.element.length;i++){
			for(var j=0;j<surface.element[i].length;j++){
		if(typeof(surface.src) == "undefined"&&j<1&&i<1){
//$("body").prepend(i+":"+j+":"+surface.element[i][j].src+"<br />");
			this.DOM["surfaceimg"]
				.attr("src",surface.element[i][j].src)
//				.css("border","1px solid #ff00ff")
		}else{
			this.DOM["surface"].append(
				$("<img>")
//				.addClass("element"+i+":"+j)
				.addClass("element")
				.cleaner()
				.css("top",Number(surface.element[i][j].y)+"px")
				.css("left",Number(surface.element[i][j].x)+"px")
				.css("width","auto")
				.css("height","auto")
				.attr("src",surface.element[i][j].src)
				.css("z-index","10")
//				.css("border","1px solid #ff00ff")
			);
		}
			}
		}


/*		$(".named"+this.parent.id+" .scope"+this.id+" .surface .seriko").remove();
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
*/

		$("#Ikagaka>.named"+named.id+">.scope"+this.id+">.surface>.collision").remove();
		for(var i=0;i<surface.collision.length;i++){
//$("body").prepend(surface.collision[i].name+"<br />");
			this.DOM["surface"].prepend(
				$("<div>")
				.addClass("collision"+i)
				.addClass("collision")
				.cleaner()
				.css("left",surface.collision[i].x+"px")
				.css("top",surface.collision[i].y+"px")
				.width(surface.collision[i].X-surface.collision[i].x+"px")
				.height(surface.collision[i].Y-surface.collision[i].y+"px")
				.css("visibility","inherit")
				.css("border","1px solid #ff00ff")
				.css("cursor","pointer")
			);
		}

}else $("body").prepend(
	"named.nowshell: " + typeof(named.nowshell) + "<br />" +
	"named.shelllist[named.nowshell]: " + typeof(named.shelllist[named.nowshell]) + "<br />" +
	"named.shell[named.shelllist[named.nowshell]]: " + typeof(named.shell[named.shelllist[named.nowshell]]) + "<br />" +
	"named.shell[named.shelllist[named.nowshell]].surface: " + typeof(named.shell[named.shelllist[named.nowshell]].surface) + "<br />" +
	"this.nowsurface: " + typeof(this.nowsurface) + "<br />" +
	"named.shell[named.shelllist[named.nowshell]].surface[this.nowsurface]: " + typeof(named.shell[named.shelllist[named.nowshell]].surface[this.nowsurface]) + "<br />"
);


	}

}else $("body").prepend(
	"this.parent: " + typeof(this.parent) + "<br />" +
	"this.id: " + typeof(this.id) + "<br />" +
	"this.nowsurface: " + typeof(this.nowsurface) + "<br />"
);
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
if(
	typeof(this.parent) == "object" &&
	typeof(this.id) == "number" &&
	typeof(this.nowenvelope) == "number"
){

	var named = this.parent;

	if(this.nowenvelope==-1){
		$("#Ikagaka>.named"+named.id+">.scope"+this.id+">.envelope")
			.css("visibility","hidden")

	}else{
		$("#Ikagaka>.named"+named.id+">.scope"+this.id+">.envelope")
			.css("visibility","visible")

//$("body").prepend(this.parent.shell[this.parent.shelllist[this.parent.nowshell]].descript["sakura.balloon.offsety"]+"<br />");

		if(this.id==0){
			var offsety = 0+Number(this.parent.shell[this.parent.shelllist[this.parent.nowshell]].descript["sakura.balloon.offsety"]);
			var offsetx = 0+Number(this.parent.shell[this.parent.shelllist[this.parent.nowshell]].descript["sakura.balloon.offsetx"]);
		}else{
			var offsety = 0+Number(this.parent.shell[this.parent.shelllist[this.parent.nowshell]].descript["kero.balloon.offsety"]);
			var offsetx = 0+Number(this.parent.shell[this.parent.shelllist[this.parent.nowshell]].descript["kero.balloon.offsetx"]);
		}
		this.DOM["scope"]
			.css("text-align",this.nowenvelopeposition)

		this.DOM["surface"]
			.css("float",this.nowenvelopeposition)

		this.DOM["envelope"]
			.css("top",offsety+"px")
			.css("left",offsetx+"px")
	}

}else $("body").prepend(
	"this.parent: " + typeof(this.parent) + "<br />" +
	"this.id: " + typeof(this.id) + "<br />" +
	"this.nowenvelope: " + typeof(this.nowenvelope) + "<br />"
);
	return this;
};


Scope.prototype.addtext = function(_){
	var named = this.parent;

	if(this.nowenvelope==-1){
		this.nowenvelope=0;
		this.envelopeplayer();
	}

//$("body").prepend(_);
	this.DOM["text"]
		.append(_);

};


Scope.prototype.text = function(_){
	var named = this.parent;

	this.DOM["text"]
		.text(_);
};


