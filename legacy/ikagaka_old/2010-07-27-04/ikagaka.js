$(function(){
	//基本DOM生成
	
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
	//起動するゴーストを決める
	
	//ファイルロードとか
	$.get("../mobilemaster/shell/master/surfaces.txt",function(data){
		surface = loadSurfaces(data);
	});
	$.get("../mobilemaster/shell/master/descript.txt",function(data){
		descript = loadDescript(data);
	});
	
	//起動処理
	//$("body").append("Hello World!<br />");
	var canvas = $("#ikagaka>.named0>.scope0>canvas")[0];
		var ctx = canvas.getContext('2d');
		var img = new Image();
		img.src = "../mobilemaster/shell/master/surface0.png";
		img.onload=function(){
			$("#ikagaka>.named0>.scope0")
				.width(img.width)
				.height(img.height);
			$("#ikagaka>.named0>.scope0>canvas")
				.attr("width",img.width)
				.attr("height",img.height);
			ctx.drawImage(img,0,0);
			var imgdata = ctx.getImageData(0, 0, canvas.width, canvas.height);
			var tcR = imgdata.data[0];
			var tcG = imgdata.data[1];
			var tcB = imgdata.data[2];
			var tcA = imgdata.data[3];
			//	$("body").append(imgdata.data.length+"<br />");
			for(var i=0; i<=imgdata.data.length; i++){
			//for(var i=0; i<=100; i++){
				//$("body").append(i+":R:"+imgdata.data[i]+"<br />");
				var R = imgdata.data[i];
				i++;
				//$("body").append(i+":G:"+imgdata.data[i]+"<br />");
				var G = imgdata.data[i];
				i++;
				//$("body").append(i+":B:"+imgdata.data[i]+"<br />");
				var B = imgdata.data[i];
				i++;
				//$("body").append(i+":A:"+imgdata.data[i]+"<br />");
				var A = imgdata.data[i];
				if(R===tcR&&G===tcG&&B===tcB&&A===tcA){
					//$("body").append("Woo!<br />");
					imgdata.data[i]=0;
				}
			}
			ctx.putImageData(imgdata,0, 0);
		};
		$("body").append("Hello World!<br />");
		var canvas2 = $("#ikagaka>.named0>.scope0>.blimp>canvas")[0];
		var ctx2 = canvas2.getContext('2d');
		var img2 = new Image();
		img2.src = "../mobilemaster/switch_L/balloons1.png";
		img2.onload=function(){
			$("#ikagaka>.named0>.scope0>.blimp")
				.width(img2.width)
				.height(img2.height);
			$("#ikagaka>.named0>.scope0>.blimp>canvas")
				.attr("width",img2.width)
				.attr("height",img2.height);
			ctx2.drawImage(img2,0,0);
			var imgdata = ctx2.getImageData(0, 0, canvas2.width, canvas2.height);
			var tcR = imgdata.data[0];
			var tcG = imgdata.data[1];
			var tcB = imgdata.data[2];
			var tcA = imgdata.data[3];
			for(var i=0; i<=imgdata.data.length; i++){
				var R = imgdata.data[i];
				i++;
				var G = imgdata.data[i];
				i++;
				var B = imgdata.data[i];
				i++;
				var A = imgdata.data[i];
				if(R===tcR&&G===tcG&&B===tcB&&A===tcA){
					imgdata.data[i]=0;
				}
			}
			ctx2.putImageData(imgdata,0, 0);
		};
});



var Ikagaka = {
	namedList:[	//起動できるゴーストのURLリスト（登録制）
		"../mobilemaster",
		"../dot_sakura_020"
	],
	runningNamed:{},//起動しているゴーストが入る
};

//
var scopeModel = {
	id:""
	,currentSurface:"0"
	,currentBlimp:"0"
	,currentBlimpAspect:"right"
	,currentBlimpText:""
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
					for(var j=apy[i].split("-")[0];j<=apy[i].split("-")[1];j++){
						if(!keynum[j]) keynum[j] = namelist[name];
						if(minus) keynum[j] = false;
						//$("body").append(minus+"<br />");
						//$("body").append(j+"<br />");
					}
				}else if(apy[i].match(/^\d+$/)){
					if(!keynum[j]) keynum[apy[i]] = namelist[name];
					if(minus) keynum[apy[i]] = false;
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
					for(var j=apy[i].split("-")[0];j<=apy[i].split("-")[1];j++){
						if(!keynum[j]) keynum[j] = namelist[name];
						if(minus) keynum[j] = false;
					}
				}else if(apy[i].match(/^\d+$/)){
					if(!keynum[j]) keynum[apy[i]] = namelist[name];
					if(minus) keynum[apy[i]] = false;
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
			src:"",
			collision:{},
			animation:{},
			element:{},
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
		//surfaces[num] = surface;
		//$("body").append(num+"A:"+surface.collision[10]	+"<br />");
		//$("body").append(num+":"+surface.collision.length+"<br />");
		//surface="";
	}
	//$("body").append(surfaces[0].animation["animation0."]+"<br />");
	$("body").append(surfaces[10].collision[0][4]+"<br />");
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
			descript[list[i].split(",")[0]] = list[i].split(",").slice(1);
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