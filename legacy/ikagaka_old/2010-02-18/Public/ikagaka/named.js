var Named = function(){
	this.parent;
	this.url;
	this.id;

	this.updates2Text = new Array();

	this.shelllist = new Array();
	this.nowshell = 0;
	this.shell = new Array();

	this.nowscope = 0;
	this.scope = new Array();

	this.shiori = new Shiori();

	this.scripttid = 0;
	this.eventtid = 0;

	return this;
};


Named.prototype.load = function(){
	$("#Ikagaka").prepend(
		$("<div>")
		.addClass("named" + this.id)
		.addClass("named")
		.cleaner()
		.css("visibility","hidden")
		.css("height","0px")
	);
if(
	typeof(this.parent) == "object" &&
	typeof(this.url) == "string" &&
	typeof(this.id) == "number"
){
	var url = this.url;
	this.updates2Text = getStrList(url+"updates2.dau");
	var list = this.updates2Text;
	var list2 = new Array();
	var j = 0;

	for(i=0;i<list.length;i++){
//$("body").prepend(list[i]+"<br />");
		list[i] = list[i].split("")[0];
		if(list[i].match(/^shell\/.*\//i)){
			var name = list[i].match(/^shell\/.*\//i);
			if(this.shell[name]);else{
				this.shelllist.push(name);
				this.shell[name] = new Shell();
				this.shell[name].url = url;
			}
			this.shell[name].updates2Text.push(list[i]);
		}
	}
	this.shell[this.shelllist[this.nowshell]].load();

	this.nowscope = 0;
	this.scope[this.nowscope] = new Scope();
	this.scope[this.nowscope].parent = this;
	this.scope[this.nowscope].id = this.nowscope;
	this.scope[this.nowscope].nowsurface = 0;
	this.scope[this.nowscope].nowenvelopeposition = "right";
	this.scope[this.nowscope].load();
	this.scope[this.nowscope].surfaceplayer();
	this.scope[this.nowscope].nowenvelope = -1;
	this.scope[this.nowscope].envelopeplayer();

	this.nowscope = 1;
	this.scope[this.nowscope] = new Scope();
	this.scope[this.nowscope].parent = this;
	this.scope[this.nowscope].id = this.nowscope;
	this.scope[this.nowscope].nowsurface = 10;
	this.scope[this.nowscope].nowenvelopeposition = "right";
	this.scope[this.nowscope].load();
	this.scope[this.nowscope].surfaceplayer();
	this.scope[this.nowscope].nowenvelope = -1;
	this.scope[this.nowscope].envelopeplayer();

	this.shiori.load();

	var _this=this;
	this.eventtid = setTimeout(function(){_this.eventplayer()},1000);

}else $("body").prepend(
	"this.parent: " + typeof(this.parent) + "<br />" +
	"this.url: " + typeof(this.url) + "<br />" +
	"this.id: " + typeof(this.id) + "<br />"
);
	return this;
};


Named.prototype.eventplayer = function(){
	clearTimeout(this.eventtid);

	this.scope[0].text("");
	this.scope[1].text("");

//	this.request = new Request();
//	this.request.key.push("ID");
//	this.request.value["ID"] = "OnBoot";
//	this.request.key.push("Sender");
//	this.request.value["Sender"] = "Ikagaka";

//	this.response = new Response();

this.shiori = new Shiori();
//	this.response.decode(this.shiori.request(this.request.encode()));

//	this.nowscript = this.response.value["Value"];

//$("body").prepend("script: "+this.nowscript+"<br />");
this.nowscript=$('#msg').val()
	this.scriptplayer();

	var _this=this;
	this.eventtid = setTimeout(function(){_this.eventplayer()},10000);
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
			this.scope[this.nowscope].nowsurface = Number(this.nowscript.substr(2,1)[0]);
			this.scope[this.nowscope].surfaceplayer();
			this.nowscript = this.nowscript.substr(3);
		}else if(this.nowscript.match(/^\\s\[-?\d+\]/)){
			this.scope[this.nowscope].nowsurface = Number(this.nowscript.substr(3).match(/-?\d+/)[0]);
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
		this.scope[this.nowscope].addtext(this.nowscript.substr(0,1));
		this.nowscript = this.nowscript.substr(1);
	}
	var _this = this;
	if(this.nowscript.length>0) this.scripttid = setTimeout(function(){_this.scriptplayer()},wait);
	else this.scripttid = setTimeout(function(){_this.scriptbreaker()},5000);
};


Named.prototype.scriptbreaker = function(){
	clearTimeout(this.scripttid);
	this.nowscope = 0;
	this.scope[this.nowscope].text("");
	this.scope[this.nowscope].nowenvelope = -1;
	this.scope[this.nowscope].envelopeplayer();
	this.nowscope = 1;
	this.scope[this.nowscope].text("");
	this.scope[this.nowscope].nowenvelope = -1;
	this.scope[this.nowscope].envelopeplayer();
};
