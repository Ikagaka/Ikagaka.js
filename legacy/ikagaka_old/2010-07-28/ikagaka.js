$(function(){
	//基本DOM生成
	$("body").append("<div id=\"ikagaka\"></div>");
	//基本CSS設定
	$("head").append("\
		<style id=\"ikagakaCSS\">\
		#ikagaka,#ikagaka *{\
			border:0px solid black;\
			margin:0px;\
			padding:0px;\
		}\
		#ikagaka{\
			position:relative;\
			width:500px;\
			height:500px;\
			background-color:red;\
		}\
		#ikagaka>.named{\
			position:absolute;\
			width:100%;\
			height:100%;\
			background-color:green;\
		}\
		#ikagaka>.named>.scope{\
			position:absolute;\
			background-color:blue;\
		}\
		#ikagaka>.named>.scope>canvas{\
			position:absolute;\
		}\
		#ikagaka>.named>.scope>.collision{\
			position:absolute;\
			background-color:yellow;\
		}\
		#ikagaka>.named>.scope>.blimp{\
			position:absolute;\
			background-color:red;\
		}\
		#ikagaka>.named>.scope>.blimp>canvas{\
			position:absolute;\
		}\
		#ikagaka>.named>.scope>.blimp>.text{\
			position:absolute;\
			background-color:green;\
		}\
		</style>\
	");
	$("body").append("\0\s[0]Hello World!\w8\e<br />");
	Ikagaka.loadNamed(Ikagaka.namedList[2]);
	for(i in Ikagaka.runningNamed){
		//$("body").append(i+"<br />");
	}
});



var Ikagaka = {
	namedList:[	//起動できるゴーストのURLリスト（登録制）
		"../mobilemaster/",
		"../dot_sakura_020/",
		"../emily4/",
		"../exice_z/"
	],
	runningNamed:{},//起動しているゴーストが入る
	loadNamed:function(url){
		this.runningNamed[url] = {
			homeurl:url,
			updates2:{},
			install:{},
			ghost:{},
			shell:{},
			balloon:{},
			PID:0,
			scriptTID:0,
			eventTID:0,
			currentShell:null,
			currentScope:null
		};
		//ファイルロードとか
		var that = this;
		var status = 0;
		status++;
		$.get(url+"updates2.dau",function(data){
			status--;
			that.runningNamed[url].updates2 = loadUpdates2(data);
			var list = that.runningNamed[url].updates2;
			for(var i=0;i<list.length;i++){
				if(list[i].match(/install\.txt$/i)){
					status++;
					$.get(url+"install.txt",function(data){
						status--;
						that.runningNamed[url].install = loadDescript(data);
						if(status===0) that.materializeNamed(that.runningNamed[url]);
					});
				}else if(list[i].match(/^shell\/.*\//i)){
					var dirname = list[i].match(/^shell\/.*\//i)[0];
					var name = dirname.substr(6).replace("/","");
					if(typeof that.runningNamed[url].shell[name] === "undefined"){
						//$("body").append(name+":"+typeof that.runningNamed[url].shell[name]+"<br />");
						that.runningNamed[url].shell[name] = {
							descript:{},
							dir:dirname,
							surface:{}
						};
					}
					if(list[i].match(/^shell\/.*\/descript\.txt$/i)){
						status++;
						//$("body").append(url+list[i]+"<br />");
						$.get(url+list[i],function(data){
							status--;
							that.runningNamed[url].shell[name].descript = loadDescript(data);
							if(status===0) that.materializeNamed(that.runningNamed[url]);
						});
					}else if(list[i].match(/^shell\/.*\/surfaces\.txt$/i)){
						status++;
						//$("body").append(url+list[i]+"<br />");
						$.get(url+list[i],function(data){
							status--;
							var ary = loadSurfaces(data);
							for(var j in ary){
								if(typeof that.runningNamed[url].shell[name].surface[j]==="undefined"){
									that.runningNamed[url].shell[name].surface[j] = ary[j];
								}else{
									for(var k in ary[j]){
										that.runningNamed[url].shell[name].surface[j][k] = ary[j][k];
									}
								}
							}
							if(status===0) that.materializeNamed(that.runningNamed[url]);
						});
					}else if(list[i].match(/^shell\/.*\/surface\d+\.png$/i)){
						var nom = Number(list[i].match(/surface\d+\.png$/i)[0].match(/\d+/i));
						that.runningNamed[url].shell[name].surface[nom] = {};
						that.runningNamed[url].shell[name].surface[nom].src = url+list[i];
					}
				}
			}
			if(status===0) that.materializeNamed(that.runningNamed[url]);
		});
	},
	materializeNamed:function(_that){
		var that = _that;
		that.eventPlayer = function(_that){
				var that = _that;
				that.script = "\\0\\s[0]Hello World!\\w8\\e";
				that.scriptPlayer(_that);
		};
		that.scriptPlayer = function(_that){
				var that = _that;
				var script = that.script;
				var wait = 50;
//////////////////////////////////////////////////////////////////////////////////////////////////
				if(script.match(/^\\/)){
					wait = 1;
					if(script.match(/^\\0/) || script.match(/^\\h/)){
						this.chgScope(0);
						script = script.substr(2);
					}else if(script.match(/^\\1/) || script.match(/^\\u/)){
						this.chgScope(1);
						script = script.substr(2);
					}else if(script.match(/^\\p\[.*?\]/)){//\p[文字]が来ても大丈夫・・・？
						this.chgScope(script.substr(3).match(/^.*?]/)[0].substr(-1));//最短マッチできるかいな
						script = script.replace(/^\\p\[.*?\]/,'');
					/*}else if(script.match(/^\\s[0-9]/)){
						this.chgSurface(Number(script.substr(2,1)[0]));
						script = script.substr(3);
					}else if(script.match(/^\\s\[.*?\]/)){//\s[文字]が来ても大丈夫・・・？
						this.chgSurface(script.substr(3).match(/^.*?]/)[0].substr(-1));//最短マッチできるかいな
						script = script.replace(/^\\s\[.*?\]/,'');
					}else if(script.match(/^\\b\[.*?\]/)){//\b[文字]が来ても大丈夫・・・？
						this.chgBlimp(script.substr(3).match(/^.*?]/)[0].substr(-1));//最短マッチできるかいな
						script = script.replace(/^\\b\[.*?\]/,'');
					}else if(script.match(/^\\i\[.*?\]/)){//\i[文字]が来ても大丈夫・・・？
						this.plySeriko(script.substr(3).match(/^.*?]/)[0].substr(-1));//最短マッチできるかいな
						script = script.replace(/^\\i\[.*?\]/,'');
					}else if(script.match(/^\\_w\[.*?\]/)){//\_w[文字]が来ても大丈夫・・・？
						wait = Number(script.substr(3).match(/^.*?]/)[0].substr(-1));//最短マッチできるかいな
						if (wait == "NaN") wait = 1;//もし文字だったときのエスケープ処理。美しくない付け焼刃
						script = script.replace(/^\\_w\[.*?\]/,'');
					}else if(script.match(/^\\w[1-9]/)){
						wait = Number(script.substr(2,1)*50);//この50ミリ病は定数にして設定できるようにすべき
						script = script.substr(3);
					}else if(script.match(/^\\n/)){
						this.addText('<br />');//WRYYYYYYYYYYYYYYYYYYYYYYYYYYYYY
						script = script.substr(2);
					}else if(script.match(/^\\c/)){
						this.clearText("");//WRYYYYYYYYYYYYYYYYYYYYYYYYYYYYY
						script = script.substr(2);
					}else if(script.match(/^\\e/)){
						script = "";
						//もし未知のサクラスクリプト
						//デバッグのためにもそのまましゃべっちまえ！（SSPだと\e扱い？
					
					*/}else{
						//処理が普通の発話と重複していてアルゴリズムが美しくない
					
						//this.addText(script.substr(0,1));//一文字しゃべる
				$("#ikagaka>.named"+that.PID).append(script+"<br>");
						script = script.substr(1);
					}
				}else{
				$("#ikagaka>.named"+that.PID).append(script+"<br>");
					//this.addText(script.substr(0,1));//一文字しゃべる
					script = script.substr(1);
				}
//////////////////////////////////////////////////////////////////////////////////////////////////
				that.script = script;
				if(that.script.length > 0){
					that.scriptTID = setTimeout(function(){that.scriptPlayer(that)},wait);
				}else{
					that.scriptTID = setTimeout(function(that){},5000);
				}
		};
that.chgScope = function(){
	that.currentScope = Number(arguments[0]);
	if(that.currentScope === NaN) this.currentScope = 0;
	//もしスコープarguments[0]の基底要素が存在していなかったら既定要素を構築
	if($("#ikagaka>.named" + that.PID + ">.scope").hasClass(".scope" + that.currentScope) === false){
		//デフォルトでカレントサーフィスは0
		that.currentSurface[that.currentScope] = 0;
		$("#ikagaka>.named" + that.PID).append(
			$("<div>")
			.addClass("scope" + that.currentScope)
			.addClass("scope")
			.append(
				$("<canvas>")
			)
			.append(
				$("<div>")
				.addClass("blimp")
			)
		);
	}
};
that.chgSurface = function(){
	that.currentSurface[that.currentScope] = Number(arguments[0]);
	//もし非数
	if(that.currentSurface[that.currentScope] === NaN) that.currentSurface[that.currentScope] = 0;
	//もしサーフィス非表示命令なら
	if(that.currentSurface[that.currentScope] == -1){
		$("#ikagaka>.named" + that.PID + ">.scope" + that.currentScope).css("visibility","hidden");//もちっとクールに消えてくれよ
	//もしサーフィスが定義されていれば
	}else if(that.currentShell.surface[that.currentSurface[that.currentScope]] instanceof object){
		$("#ikagaka>.named" + that.PID + ">.scope" + that.currentScope).css("visibility","visible");//もちっとクールに現れてくれよ
		//baseサーフェスの表示
		//elementの設定
		//serikoの設定
		//collisionの設定
	}
};
		that.PID = new Date().getTime();
		$("#ikagaka").append("<div class=\"named named"+that.PID+"\"></div>");
		//$("body").append("<pre>"+JSON.stringify(this)+"</pre>");
		that.currentShell = that.shell["master"];
		that.currentScope = 0;
		that.scope=[];
		that.scope[0] = {
			currentSurface:"0"
			,currentBlimp:"0"
			,currentBlimpAspect:"right"
			,currentBlimpText:""
		};	
		that.scope[1] = {
			currentSurface:"10"
			,currentBlimp:"0"
			,currentBlimpAspect:"right"
			,currentBlimpText:""
		};		
		that.scriptTID = 0;
		that.eventTID = setTimeout(function(){that.eventPlayer(that)},5000);
	}
};


var loadSurfaces = function(str){
	var surface = {};
	var list = str.replace(/\r\n/g,"\n").replace(/\r/g,"\n").replace(/\n\n/g,"\n").replace(/\/\/.*\n/g,"").split("\n");
	var name = "";
	var namelist = {};
	var kakkono_soto = true;
	for(var i=0; i<list.length;i++){
		if(kakkono_soto){
			if(list[i].match(/^charset/i)){
				namelist[list[i].split(",")[0]] = list[i].split(",").slice(1);
			}else if(list[i].match(/.?\{/i)){
				name+=list[i].split("{")[0];
				kakkono_soto = false;
				namelist[name] = "";
			}else{
				name+=list[i];
			}
		}else{
			if(list[i].match(/\}/i)){
				//$("body").append(name+":"+namelist[name]+"<br />");
				kakkono_soto = true;
				name = "";
			}else{
				namelist[name]+=list[i]+"\n";
			}
		}
		//$("body").append(i+":"+list[i]+"<br />");
	}
	var minus = false;
	var keynum = {};
	var apy;
	for(name in namelist){
		if(name.match(/surface\d+/i)){
			apy = name.replace(/surface/,"").split(",");
			for(var i=0;i<apy.length;i++){
				minus = false;
				if(apy[i].match(/^\!/)){
					apy[i] = apy[i].replace(/^\!/,"");
					minus = true;
				}
				apy[i] = apy[i].replace(/surface/g,"");
				if(apy[i].match(/^\d+-\d+$/)){
					for(var j = Number(apy[i].split("-")[0]); j <= Number(apy[i].split("-")[1]);j++){
						if(!keynum[j]) keynum[j] = namelist[name];
						if(minus) keynum[j] = false;
						//$("body").append(minus+"<br />");
						//$("body").append(j+"<br />");
					}
				}else if(apy[i].match(/^\d+$/)){
					if(!keynum[Number(apy[i])]) keynum[Number(apy[i])] = namelist[name];
					if(minus) keynum[Number(apy[i])] = false;
				}
			}
			var num;
			for(num in keynum){
				if(typeof surface[num]==="undefined") surface[num] = "";
				surface[num] = keynum[num];
				//$("body").append(num+":"+keynum[num]+"<br />");
			}
			keynum = {};
			apy = "";
		}
	}
	for(name in namelist){
		if(name.match(/surface\.append/i)){
			apy = name.replace(/surface\.append/,"").split(",");
			for(var i=0;i<apy.length;i++){
				minus = false;
				if(apy[i].match(/^\!/)){
					apy[i] = apy[i].replace(/^\!/,"");
					minus = true;
				}
				if(apy[i].match(/^\d+-\d+$/)){
					for(var j = Number(apy[i].split("-")[0]); j <= Number(apy[i].split("-")[1]);j++){
						if(!keynum[j]) keynum[j] = namelist[name];
						if(minus) keynum[j] = false;
					}
				}else if(apy[i].match(/^\d+$/)){
					if(!keynum[Number(apy[i])]) keynum[Number(apy[i])] = namelist[name];
					if(minus) keynum[Number(apy[i])] = false;
				}
				//$("body").append(minus+"<br />");
				//$("body").append(apy[i]+"<br />");
			}
			var num;
			for(num in keynum){
				if(typeof surface[num]==="undefined") surface[num] = "";
				if(keynum[num]) surface[num] += keynum[num];
				//$("body").append(num+":"+typeof keynum[num]+"<br />");
			}
		}
	}
	var surfaces = {};
	for(num in surface){
		//$("body").append(num+":"+typeof surface[num]+"<br />");
		surfaces[num] = {
			collision:{},
			animation:{},
			element:{}
		};
		list = surface[num].split("\n");
		for(var i=0;i<list.length;i++){
			//$("body").append(num+"::"+list[i]+"<br />");
			if(list[i].match(/.+pattern\d+,\D/i)){
				var ary = list[i].split(",");
				var name = ary[0].match(/.+pattern/i)[0].replace(/pattern/i,"");
				var id = ary[0].match(/\d$/i)[0];
				if(typeof surfaces[num].animation[name]==="undefined"){
					surfaces[num].animation[name] = {
						interval:"",
						pattern:[]
					};
				}
				surfaces[num].animation[name].pattern[id] = ary.slice(1);
			}else if(list[i].match(/^.+interval,.+/i)){
				var ary = list[i].split(",");
				var name = ary[0].match(/.+interval/i)[0].replace(/interval/i,"");
				if(typeof surfaces[num].animation[name]==="undefined"){
					surfaces[num].animation[name] = {
						interval:"",
						pattern:[]
					};
				}
				surfaces[num].animation[name].interval = ary.slice(1);
				//$("body").append(num+":"+name+"<br />");
			}else if(list[i].match(/^element\d+,.+,.+,\d+,\d+/i)){
				var ary = list[i].split(",");
				ary[0] = ary[0].substr(7);
				surfaces[num].element[ary[0]] = {};
				surfaces[num].element[ary[0]].pattern = ary[1];
				surfaces[num].element[ary[0]].src = ary[2];
				surfaces[num].element[ary[0]].x = ary[3];
				surfaces[num].element[ary[0]].y = ary[4];
			}else if(list[i].match(/^collision\d+,\d+,\d+,\d+,\d+,.+/i)){
				var ary = list[i].split(",");
				ary[0] = ary[0].substr(9);
				surfaces[num].collision[ary[0]] = [];
				surfaces[num].collision[ary[0]] = ary.slice(1);
			}
		}
	}
	return surfaces;
};

var loadDescript = function(str){
	var descript = {
		"charset":"",
		"type":"",
		"name":"",
		"name.allowoverride":"",
		"title":"",
		"id":"",
		"homeurl":"",
		"craftman":"",
		"craftmanw":"",
		"craftmanurl":"",
		"readme":"",
		"seriko.alignmenttodesktop":"",
		"seriko.paint_transparent_region_black":"",
		"seriko.use_self_alpha":"",
		"sakura.name":"",
		"sakura.name2":"",
		"sakura.seriko.defaultsurface":"",
		"sakura.seriko.alignmenttodesktop":"",
		"sakura.defaultx":"",
		"sakura.defaulty":"",
		"sakura.defaulttop":"",
		"sakura.balloon.offsetx":"",
		"sakura.balloon.offsety":"",
		"sakura.balloon.alignment":"",
		"sakura.bindgroup0.default":"",
		"sakura.bindgroup0.addid":"",
		"sakura.bindgroup0.group":"",
		"sakura.menuitem0":"",
		"sakura.menu,auto":"",
		"kero.name":"",
		"kero.seriko":"",
		"kero.seriko.defaultsurface":"",
		"kero.seriko.alignmenttodesktop":"",
		"kero.defaultx":"",
		"kero.defaulty":"",
		"kero.defaulttop":"",
		"kero.balloon.offsetx":"",
		"kero.balloon.offsety":"",
		"kero.balloon.alignment":"",
		"kero.bindgroup0.default":"",
		"kero.bindgroup0.addid":"",
		"kero.bindgroup0.group":"",
		"kero.menuitem0":"",
		"kero.menu,auto":"",
		"char0.name":"",
		"char0.seriko":"",
		"char0.seriko.defaultsurface":"",
		"char0.seriko.alignmenttodesktop":"",
		"char0.defaultx":"",
		"char0.defaulty":"",
		"char0.defaulttop":"",
		"char0.bindgroup0.default":"",
		"char0.bindgroup0.addid":"",
		"char0.bindgroup0.group":"",
		"char0.menuitem0":"",
		"char0.menu,auto":"",
		"cursor":"",
		"shiori":"",
		"shiori.cache":"",
		"shiori.encoding":"",
		"makoto":"",
		"balloon":"",
		"balloon.dontmove":"",
		"balloon.defaultsurface":"",
		"default.balloon.path":"",
		"origin.x":"",
		"origin.y":"",
		"validrect.left":"",
		"validrect.top":"",
		"validrect.right":"",
		"validrect.bottom":"",
		"wordwrappoint.x":"",
		"wordwrappoint.y":"",
		"font.name":"",
		"font.color.r":"",
		"font.color.g":"",
		"font.color.b":"",
		"font.shadowcolor.r":"",
		"font.shadowcolor.g":"",
		"font.shadowcolor.b":"",
		"anchor.font.color.r":"",
		"anchor.font.color.g":"",
		"anchor.font.color.b":"",
		"cursor.style":"",
		"cursor.blendmethod":"",
		"cursor.font.color.r":"",
		"cursor.font.color.g":"",
		"cursor.font.color.b":"",
		"cursor.pen.color.r":"",
		"cursor.pen.color.g":"",
		"cursor.pen.color.b":"",
		"cursor.brush.color.r":"",
		"cursor.brush.color.g":"",
		"cursor.brush.color.b":"",
		"anchor.style":"",
		"anchor.blendmethod":"",
		"anchor.pen.color.r":"",
		"anchor.pen.color.g":"",
		"anchor.pen.color.b":"",
		"anchor.brush.color.r":"",
		"anchor.brush.color.g":"",
		"anchor.brush.color.b":"",
		"anchor.notselect.style":"",
		"anchor.notselect.blendmethod":"",
		"anchor.notselect.font.color.r":"",
		"anchor.notselect.font.color.g":"",
		"anchor.notselect.font.color.b":"",
		"anchor.notselect.pen.color.r":"",
		"anchor.notselect.pen.color.g":"",
		"anchor.notselect.pen.color.b":"",
		"anchor.notselect.brush.color.r":"",
		"anchor.notselect.brush.color.g":"",
		"anchor.notselect.brush.color.b":"",
		"anchor.visited.style":"",
		"anchor.visited.blendmethod":"",
		"anchor.visited.font.color.r":"",
		"anchor.visited.font.color.g":"",
		"anchor.visited.font.color.b":"",
		"anchor.visited.pen.color.r":"",
		"anchor.visited.pen.color.g":"",
		"anchor.visited.pen.color.b":"",
		"anchor.visited.brush.color.r":"",
		"anchor.visited.brush.color.g":"",
		"anchor.visited.brush.color.b":"",
		"sstpmarker.x":"",
		"sstpmarker.y":"",
		"sstpmessage.x":"",
		"sstpmessage.y":"",
		"sstpmessage.xr":"",
		"sstpmessage.font.name":"",
		"sstpmessage.font.height":"",
		"sstpmessage.font.color.r":"",
		"sstpmessage.font.color.g":"",
		"sstpmessage.font.color.b":"",
		"number.font.name":"",
		"number.font.height":"",
		"number.font.color.r":"",
		"number.font.color.g":"",
		"number.font.color.b":"",
		"number.xr":"",
		"number.y":"",
		"arrow0.x":"",
		"arrow0.y":"",
		"arrow1.x":"",
		"arrow1.y":"",
		"communicatebox.font.name":"",
		"communicatebox.x":"",
		"communicatebox.y":"",
		"communicatebox.width":"",
		"communicatebox.height":"",
		"paint_transparent_region_black":"",
		"use_self_alpha":"",
		"windowposition.x":"",
		"windowposition.y":"",
		"refresh":"",
		"refreshundeletemask":"",
		"directory":"",
		"balloon.directory":"",
		"accept":"",
		"icon":"",
		"icon.minimize":"",
		"menu.font.name":"",
		"menu.font.height":"",
		"menu.background.bitmap.filename":"",
		"menu.foreground.bitmap.filename":"",
		"menu.sidebar.bitmap.filename":"",
		"menu.background.font.color.r":"",
		"menu.background.font.color.g":"",
		"menu.background.font.color.b":"",
		"menu.foreground.font.color.r":"",
		"menu.foreground.font.color.g":"",
		"menu.foreground.font.color.b":"",
		"menu.separator.color.r":"",
		"menu.separator.color.g":"",
		"menu.separator.color.b":"",
		"menu.background.alignment":"",
		"menu.foreground.alignment":"",
		"menu.sidebar.alignment":"",
		"install.accept":"",
		"sstp.allowunspecifiedsend":"",
		"sstp.allowcommunicate":"",
		"sstp.alwaystranslate":"",
		"don't need onmousemove":"",
		"don't_need_bind":"",
		"don't need seriko talk":""
	};
	var list = str.replace(/\r\n/g,"\n").replace(/\r/g,"\n").replace(/\n\n/g,"\n").replace(/\/\/.*\n/g,"").split("\n");
	for(var i=0; i<list.length;i++){
		if(list[i].match(/^.*,.*/i)){
			descript[list[i].split(",")[0]] = list[i].split(",").slice(1).join();
			//$("body").append(i+":"+list[i]+"<br />");
		}
	}
	//$("body").append(descript["name"]+"<br />");
	return descript;
};

var loadUpdates2 = function(str){
	var list = str.replace(/\r\n/g,"\n").replace(/\r/g,"\n").replace(/\n\n/g,"\n").replace(/\/\/.*\n/g,"").split("\n");
	for(var i=0;i<list.length;i++){
		list[i] = list[i].split("")[0];
	}
	return list;
};