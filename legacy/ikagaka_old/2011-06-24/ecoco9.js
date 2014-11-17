(function(global){
	var ecoco = {};
	ecoco.loadUpdates = function(homeurl, callback){
		var json = {
			version: 4,
			homeurl: null,
			filelist: [],
			shell: {}
		};
		json.homeurl = homeurl += /\/$/.test(homeurl) ? "" : "/";
		ecoco.ajax({
			url: homeurl + "updates2.dau",
			error: function(){
				ecoco.ajax({
					url: homeurl + "updates.txt",
					error: function(){
						callback(false);
					},
					success: function(data){
						data = data.replace("\r", "\n").replace(/^\n/gm, "").split("\n").map(function(str){
							return str.trim().split(/\cA/gm)[0].split(",")[1];
						});
						loadUpdates(data);
					}
				});
			},
			success: function(data){
				data = data.replace("\r", "\n").replace(/^\n/gm, "").split("\n").map(function(str){
					return str.trim().split(/\cA/gm)[0];
				});
				loadUpdates(data);
			}
		});
		function loadUpdates(data){
			var loading = 0;
			json.filelist = data;
			data.forEach(function(path){
				var dir, num;
				if(/([^\/]+)\/([^\/]+)\/([^\/]+)$/i.test(path)){//[shell]/[master]/[surfaces.txt]という３階層構造を読み込む
					dir = /([^\/]+)\/([^\/]+)\/([^\/]+)$/i.exec(path);
					if(/^shell$/i.test(dir[1])){
						json.shell[dir[2]] = json.shell[dir[2]] || {
							filelist: {},
							descript: {},
							surface: {alias:{}}
						};
						json.shell[dir[2]].filelist[dir[3]] = dir[0];
						if(/^(?:surface)(\d+)(?:\.png)$/i.test(dir[3])){
							num = Number(/^(?:surface)(\d+)(?:\.png)$/i.exec(dir[3])[1]);
							json.shell[dir[2]].surface[num] = json.shell[dir[2]].surface[num] || {};
							json.shell[dir[2]].surface[num].src = path;
						}else if(/^(?:surface)(\d+)(?:\.pna)$/i.test(dir[3])){
							num = Number(/^(?:surface)(\d+)(?:\.pna)$/i.exec(dir[3])[1]);
							json.shell[dir[2]].surface[num] = json.shell[dir[2]].surface[num] || {};
							json.shell[dir[2]].surface[num].pna = path;
						}else if(/^surfaces\.txt$/i.test(dir[3])){
							ecoco.ajax({
								url: homeurl + path,
								error: function(){
									callback(false);
								},
								success: (function(surface){
									loading += 1;
									return function(data){
										loading -= 1;
										surface = ecoco.loadSurfaces(data, surface);
										if(loading === 0){
											callback(json);
										}
									};
								}(json.shell[dir[2]].surface))
							});
						}else if(/^surfaces2\.txt$/i.test(dir[3])){
							ecoco.ajax({
								url: homeurl + path,
								error: function(){
									callback(false);
								},
								success: (function(surface){
									loading += 1;
									return function(data){
										loading -= 1;
										surface = ecoco.loadSurfaces(data, surface);
										if(loading === 0){
											callback(json);
										}
									};
								}(json.shell[dir[2]].surface))
							});
						}else if(/^descript\.txt$/i.test(dir[3])){
							ecoco.ajax({
								url: homeurl + path,
								error: function(){
									callback(false);
								},
								success: (function(shellObj){
									loading += 1;
									return function(data){
										loading -= 1;
										shellObj.descript = ecoco.loadDescript(data);
										if(loading === 0){
											callback(json);
										}
									};
								}(json.shell[dir[2]]))
							});
						}
					}
				}
			});
		}
		return ecoco;
	};
	ecoco.loadDescript = function(data){
		var descript = {};
		data.replace("\r", "\n").replace("\n\n", "\n")
			.replace(/^\n$/gm, "")	//空行
			.replace(/\/\/[^\n]*\n/gm, "\n")	//コメントアウト
			.split("\n")
			.map(function(str){
				return str.trim();
			}).forEach(function(str){
				if(str.indexOf(",") !== -1){
					descript[str.split(",")[0]] = str.split(",")[1].replace("\r", "");
				}
			});
		return descript;
	};
	ecoco.loadSurfaces = function(data, surface){
		surface = surface || {alias:{}};
		data = ecoco.trim(data)
			.replace("sakura.surface.alias","char0.surface.alias")
			.replace("kero.surface.alias","char1.surface.alias");
		if(/^char(\d+).surface.alias[^{}]+\{([^{}]+)\}/gm.test(data) && data.match(/^char(\d+).surface.alias[^{}]+\{([^{}]+)\}/gm).length > 0){
			data.match(/^char(\d+).surface.alias[^{}]+\{([^{}]+)\}/gm).forEach(function(str){
				var ary = /^char(\d+).surface.alias[^{}]+\{([^{}]+)\}/gm.exec(str),
					num = Number(ary[1]);
				surface.alias[num] = {};
				ary[2].match(/(\d+)\,\[([\d\,]+)\]/gm).forEach(function(str){
					var ary = /(\d+)\,\[([\d\,]+)\]/gm.exec(str.trim());
					surface.alias[num][ary[1]] = ary[2].split(",").map(function(str){
						return Number(str);
					});
				});
			});
			data = data.replace(/^char(\d+).surface.alias[^{}]+\{([^{}]+)\}/gm,"");
		}
		if(data.match(/^surface([^{}]+)\{([^{}]+)\}/gm).length > 0){
			data.match(/^surface([^{}]+)\{([^{}]+)\}/gm).forEach(function(str){
				var ary = /^surface([^{}]+)\{([^{}]+)\}/gm.exec(str),
					head = ary[1].trim().replace("surface", ""),
					body = ary[2].trim().split("\n").map(function(str){
						return str.trim();
					}).join("\n"),
					blAppend = false,
					aryBool = [],
					num, src, pna, i;
				if(isFinite(Number(head))){	//もし新たなsurface定義ならsrcとpnaのパス以外を初期化
					num = Number(head);
					surface[num] = surface[num] || {};
					src = surface[num].src;
					pna = surface[num].pna;
					surface[num] = ecoco.loadSurfacesStructure(body);
					surface[num].src = src;
					surface[num].pna = pna;
				}else if(/(.append)?([!\d\,\-]+)/.test(head)){	//もし上書き定義
					blAppend = head.slice(0,7) === ".append" ? true : false;
					head = blAppend ? head.slice(7) : head;
					head.split(",").forEach(function(str){
						var ary = [];
						if(/^\d+$/.test(str)){	//上書き対象のsurfaceの検出
							aryBool[Number(str)] = true;
						}else if(/^!\d+\D+?$/.test(str)){
							aryBool[Number(str.slice(1))] = false;
						}else if(/^\d+-\d+$/.test(str)){
							for(ary = /^(\d+)-(\d+)$/.exec(str); ary[1] <= ary[2]; ary[1]++){
								aryBool[Number(ary[1])] = true;
							}
						}else if(/^!\d+-\d+$/.test(str)){
							for(ary = /^!(\d+)-(\d+)$/.exec(str); ary[1] <= ary[2]; ary[1]++){
								aryBool[Number(ary[1])] = false;
							}
						}
					});
					i = aryBool.length;
					while(i--){	//実際に上書き
						if(aryBool[i]){
							if(! blAppend){	//もしappendではなければ完全初期化
								src = surface[i].src;
								pna = surface[i].pna;
								surface[i] = ecoco.loadSurfacesStructure(body);
								surface[i].src = src;
								surface[i].pna = pna;
							}else{	//追加書き込み
								surface[i] = ecoco.loadSurfacesStructure(body, surface[i]);
							}
						}
					}
				}
			});
			data = data.replace(/^surface([^{}]+)\{([^{}]+)\}/gm,"");
		}
		return surface;
	};
	ecoco.loadSurfacesBody = function(data, surfaceObj){
		"use strict";
		var reg;
		surfaceObj = surfaceObj || {};
		data = ecoco.trim(data);
		reg = /^(?:collision)(\d+?),(\d+?),(\d+?),(\d+?),(\d+?),(.+?)$/gm;
		if(data.match(reg)){
			surfaceObj.collision = surfaceObj.collision || {};
			data.match(reg).forEach(function(str){
				var ary = reg.exec(str).slice(1),
					num = Number(ary[0]);
				reg.test(str);	//forEach内でのreg.exec/reg.testの結果がtrue/falseの交互になる問題の回避策。バグ？
				surfaceObj.collision[num] = ary.slice(1).map(function(str){
					return isFinite(Number(str)) ? Number(str) : str;
				});
			});
		}
		
		reg = /^(?:element)(\d+?),(.+?),(.+?),(\d+?),(\d+?)$/gm;
		if(data.match(reg)){
			surfaceObj.element = surfaceObj.element || {};
			data.match(reg).forEach(function(str){
				var ary = reg.exec(str).slice(1),
					num = Number(ary[0]);
				reg.test(str);	//
				surfaceObj.element[num] = ary.slice(1).map(function(str){
					return isFinite(Number(str)) ? Number(str) : str;
				});
			});
		}
		
		//↓上から一行ずつ読み込みではなく、全体マッチングによる抽出なので記述の優先順位がおかしい。SERIKO1.0 < SERIKO2.0の順。
		reg = /^(\d+?)interval,(.+?)$/gm;	//SERIKO/1.0 interval -> SERIKO/2.0 interval
		if(data.match(reg)){
			surfaceObj.animation = surfaceObj.animation || {};
			data.match(reg).forEach(function(str){
				var ary = reg.exec(str).slice(1),
					num = Number(ary[0]);
				reg.test(str);	//
				data = data.replace(str, "animation"+num+".interval,"+ary[1]);
			});
		}
		reg = /^animation(\d+?)\.interval,(.+?)(?:,(\d+?))?$/gm;	//SERIKO/2.0 interval
		// reg = /^animation(\d+?)\.interval,(.+?)$/gm;
		if(data.match(reg)){
			surfaceObj.animation = surfaceObj.animation || {};
			data.match(reg).forEach(function(str){
				var ary = reg.exec(str).slice(1),
					num = Number(ary[0]);
				reg.test(str);	//
				surfaceObj.animation[num] = {};	// 初期化
				surfaceObj.animation[num].interval = ary.slice(1)[0];
			});
		}
		
		reg = /^(\d+?)pattern(\d+?),(-?\d+?),(\d+?),(.+?)(?:,(-?\d+?),(-?\d+?))?$/gm;	//SERIKO/1.0 pattern -> SERIKO/2.0 pattern
		if(data.match(reg)){
			surfaceObj.animation = surfaceObj.animation || {};
			data.match(reg).forEach(function(str){
				var ary = reg.exec(str).slice(1),pat,
					num = Number(ary[0]);
				reg.test(str);	//
				data = data.replace(str, "animation"+num+".pattern"+ary[1]+","+ary[4]+","+ary[2]+","+(ary[3]||0)+","+(ary[5]||0)+","+(ary[6]||0));
			});
		}
		reg = /^animation(\d+?)\.pattern(\d+?),(.+?),(?:(-?\d+?),(\d+?)(?:,(-?\d+?),(-?\d+?)))|(?:\(((?:(?:-?\d+?),?))\))$/gm;
		// reg = /^animation(\d+?)\.pattern(\d+?),(.+?),(-?\d+?)(?:,(\d+?),(-?\d+?),(-?\d+?))?$/gm;	//SERIKO/2.0 pattern
		if(data.match(reg)){
			surfaceObj.animation = surfaceObj.animation || {};
			console.log(data)
			console.log(data.match(reg))
			data.match(reg).forEach(function(str){
				var ary = reg.exec(str).slice(1),pat,
					num = Number(ary[0]);
				reg.test(str);	//
				surfaceObj.animation[num] = surfaceObj.animation[num] || {};
				surfaceObj.animation[num].pattern = surfaceObj.animation[num].pattern || {};
				surfaceObj.animation[num].pattern[Number(ary[1])] = [ary[2], ary[3], (ary[4]||0), (ary[5]||0), (ary[6]||0)].map(function(str){
					return isFinite(Number(str)) ? Number(str) : str;
				});
			});
		}
		return surfaceObj;
	};
	ecoco.trim = function(str){
		"use strict";
		str = str.replace("\r","\n")	//CR->LF
			.replace(/\/\/[^\n]*\n/gm, "\n")	//コメントアウト
			.replace(/^\n/gm, "")	//空行
			.split("\n")
			.map(function(str){
				return str.trim();
			}).join("\n").trim();
		return str;
	};
	ecoco.ajax = function(obj){
		"use strict";
		var url = obj.url || "",
			success = obj.success || function(){},
			error = obj.error || function(){},
			xhr = new XMLHttpRequest();
		xhr.open("GET",url);
		xhr.onreadystatechange = function(){
			if(xhr.readyState === 4){
				if(xhr.status === 200){
					success.call(obj,xhr.responseText,"text");
				}else{
					error.call(obj,xhr,"error","text",Error("ajax error"));
				}
			}
		};
		xhr.send();
		return xhr;
	};
	global.ecoco = ecoco;
}(this));


(function(global){
	"use strict";
	var thread = {},
		counter = 1,
		length = 0,
		functions = {},
		counters = {},
		numbers = {},
		intervalId;

	thread.setInterval = function(handler, time){
		if(typeof handler === "string"){
			handler = new Function(handler);
		}
		functions[counter] = handler;
		counters[counter] = numbers[counter] = Math.ceil(time / 10);
		if(++length && !intervalId){
			intervalId = global.setInterval(function(){
				var i;
				for(i in functions){
					if(!--counters[i]){
						functions[i]();
						counters[i] = numbers[i];
					}
				} 
			}, 10);
		}
		return counter++;
	};
	thread.clearInterval = function(id){
		if(functions[id]){
			delete functions[id];
			delete numbers[id];
			delete counters[id];
			if(!--length && intervalId){
				global.clearInterval(intervalId);
				intervalId = undefined;
			}
		}
	};
	global.thread = thread;
	return;
}(this));