Ajax = function(){
	this.url;
	this.callback = function(){};
	this.params = {};
	this.params[gadgets.io.RequestParameters.CONTENT_TYPE] = gadgets.io.ContentType.TEXT;
	this.get = function(url){
		if(url) this.url = url;
		var _this = this;
		gadgets.io.makeRequest(_this.url,function(obj){_this.response(obj);},_this.params);
	};
	this.response = function(obj){
		$("body").append("GET: "+this.url);
		if(obj.data){
			$("body").append("...ok<br />");
			//$("body").append(obj.text+"<br />");
			var str = obj.text;
			str = str.replace(/\r\n/g,"\n");
			str = str.replace(/\r/g,"\n");
			var list = str.split("\n");
			this.callback(list);
		}else{
			$("body").append("...fail<br />");
			this.callback(false);
		}
	};
	return this;
};

Nar = function(){
	this.homeurl;
	this.updates2 = {};
	this.updates2.path = {};
	this.updates2.md5 = {};
	this.updates2.size = {};
	this.ghost = {};
	this.shell = {};
	this.shell.key = new Array();
	this.shell.value = new Array();
	this.balloon = {};
};

Named = function(){
	this.nar = new Nar();
	this.load = function(url,fn){
		this.nar.homeurl = url;
		var _fn = fn;
		this.callback = function(){
			if(this.nar.shell.value[this.nar.shell.key[0]].surface[0].collision && this.nar.shell.value[this.nar.shell.key[0]].descript.key[0]) _fn();
		};
		var ajax = new Ajax();
		var _this = this;
		ajax.callback = function(obj){_this.load2(obj);};
		ajax.get(url+'updates2.dau');
	};
	this.load2 = function(obj,fn){
		var list = obj;
		if(list){
			for(i=0;i<list.length-1;i++){
				var ary = list[i].split("");
				this.nar.updates2.path[i] = ary[0];
				this.nar.updates2.md5[i] = ary[1];
				this.nar.updates2.size[i] = ary[2];
				//$("body").append(i+": "+ary[0]+"<br />");
				if(ary[0].match(/^shell\/[^\/]*\/[^\/]*$/i)){
					var dir = ary[0].match(/^shell\/.*\//i)[0];
					var name = dir.substr(0,dir.length-1).substr(6);
					if(this.nar.shell.value[name]);else{
						this.nar.shell.key.push(name);
						this.nar.shell.value[name] = {};
						this.nar.shell.value[name].dir = dir;
						this.nar.shell.value[name].descript = {};
						this.nar.shell.value[name].descript.key = new Array();
						this.nar.shell.value[name].descript.value = {};
						this.nar.shell.value[name].surface = new Array();
						$("body").append("shell: "+name+"...loading<br />");
					}
					if(ary[0].match(/^shell\/[^\/]*\/descript\.txt$/i)){
						var ajax = new Ajax();
						var _this = this;
						ajax.callback = function(obj){_this.loadDescript(obj,name);};
						ajax.get(this.nar.homeurl+ary[0]);
					}else if(ary[0].match(/^shell\/[^\/]*\/surfaces\.txt$/i)){
						var ajax = new Ajax();
						var _this = this;
						ajax.callback = function(obj){_this.loadSurfaces(obj,name);};
						ajax.get(this.nar.homeurl+ary[0]);
					}else if(ary[0].match(/^shell\/[^\/]*\/surface\d+\.png$/i)){
						var num = Number(ary[0].match(/surface\d+\.png$/i)[0].match(/\d+/i)[0]);
						if(this.nar.shell.value[name].surface[num]);else{
							this.nar.shell.value[name].surface[num] = {};
						}
						this.nar.shell.value[name].surface[num].src = this.nar.homeurl+ary[0];
					}
				}
			}
		}else{
			$("body").append("...fail<br />");
		}
		this.callback();
	};
	this.loadDescript = function(obj,name){
		var list = obj;
		//$("body").append(name+"<br />");
		if(list){
			for(i=0;i<list.length-1;i++){
				//$("body").append(i+": "+list[i]+"<br />");
				if(list[i].match(/.*,.*/i)){
					this.nar.shell.value[name].descript.key[i] = list[i].split(",")[0];
					this.nar.shell.value[name].descript.value[this.nar.shell.value[name].descript.key[i]] = list[i].split(",")[1];
				}
			}
		}else{
			$("body").append("...fail<br />");
		}
		this.callback();
	};
	this.loadSurfaces = function(obj,name){
		var list = obj;
		//$("body").append(name+"<br />");
		if(list){
			var num = 0;
			for(i=0;i<list.length-1;i++){
				//$("body").append(i+": "+list[i]+"<br />");
				if(list[i].match(/^surface\d+$/i)){
					num = list[i].substr(7);
					num = Number(num);
					if(this.nar.shell.value[name].surface[num]);else{
						this.nar.shell.value[name].surface[num] = {};
					}
					this.nar.shell.value[name].surface[num].collision = new Array();
					this.nar.shell.value[name].surface[num].element = new Array();
					this.nar.shell.value[name].surface[num].interval = new Array();
				}
				if(list[i].match(/\d+[^0-9]?pattern\d+,\D/i)){
					var ary = list[i].split(",");
					var id = ary[0].match(/\d+[^0-9]?pattern/i)[0].replace(/[^0-9]?pattern/i,"");
					var nm = ary[0].match(/\d+$/i)[0];
					if(this.nar.shell.value[name].surface[num].interval[id]);else{
						this.nar.shell.value[name].surface[num].interval[id] = {};
						this.nar.shell.value[name].surface[num].interval[id].pattern = new Array();
					}
					this.nar.shell.value[name].surface[num].interval[id].pattern[nm] = {};
					this.nar.shell.value[name].surface[num].interval[id].pattern[nm].pattern = ary[1];
					this.nar.shell.value[name].surface[num].interval[id].pattern[nm].num = ary[2];
					this.nar.shell.value[name].surface[num].interval[id].pattern[nm].wait = ary[3];
					this.nar.shell.value[name].surface[num].interval[id].pattern[nm].x = ary[4];
					this.nar.shell.value[name].surface[num].interval[id].pattern[nm].y = ary[5];
				}else if(list[i].match(/\d.?interval,.+/i)){
					var ary = list[i].split(",");
					var id = ary[0].match(/\d+[^0-9]?interval/i)[0].replace(/[^0-9]?interval/i,"");
					if(this.nar.shell.value[name].surface[num].interval[id]);else{
						this.nar.shell.value[name].surface[num].interval[id] = {};
						this.nar.shell.value[name].surface[num].interval[id].pattern = new Array();
					}
					this.nar.shell.value[name].surface[num].interval[id].timing = ary[1];
				}else if(list[i].match(/^element\d+,.+,.+,\d+,\d+/i)){
					var ary = list[i].split(",");
					ary[0] = ary[0].substr(7);
					this.nar.shell.value[name].surface[num].element[ary[0]] = {};
					this.nar.shell.value[name].surface[num].element[ary[0]].pattern = ary[1];
					this.nar.shell.value[name].surface[num].element[ary[0]].src = this.nar.homeurl+this.nar.shell.value[name].dir+ary[2];
					this.nar.shell.value[name].surface[num].element[ary[0]].x = ary[3];
					this.nar.shell.value[name].surface[num].element[ary[0]].y = ary[4];
				}else if(list[i].match(/^collision\d+,\d+,\d+,\d+,\d+,.+/i)){
					var ary = list[i].split(",");
					ary[0] = ary[0].substr(9);
					this.nar.shell.value[name].surface[num].collision[ary[0]] = {};
					this.nar.shell.value[name].surface[num].collision[ary[0]].x = ary[1];
					this.nar.shell.value[name].surface[num].collision[ary[0]].y = ary[2];
					this.nar.shell.value[name].surface[num].collision[ary[0]].X = ary[3];
					this.nar.shell.value[name].surface[num].collision[ary[0]].Y = ary[4];
					this.nar.shell.value[name].surface[num].collision[ary[0]].name = ary[5];
				}
			}
		}else{
			$("body").append("...fail<br />");
		}
		$("body").append("shell: "+name+"...ok<br />");
		this.callback();
	};
};