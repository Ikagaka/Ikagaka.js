function ecoco(homeurl, callback){
	var jsnNar = {
		version: 3,
		homeurl: null,
		filelist: [],
		shell: {}
	},
		file = {};
	function loadSurfaces(data, jsnShell){
		data = data.replace("\r","\n").replace("\n\n","\n")
			.replace(/\/\/[^\n]*\n/, "")
			.replace("sakura.surface.alias","char0.surface.alias")
			.replace("kero.surface.alias","char1.surface.alias");
		if(/char\d+.surface.alias[^{}]+\{[^{}]+\}/gim.test(data)){
			$.each(data.match(/char\d+.surface.alias[^{}]+\{[^{}]+\}/gim), function(i, str){
				var aryStructure = /char(\d+).surface.alias[^{}]+\{([^{}]+)\}/.exec(data);
				jsnShell.alias[Number(aryStructure[1])] = {};
				$.each(aryStructure[2].match(/\d+\,\[[\d\,]+\]/), function(i, str){
					var aryAlias = /(\d+)\,\[([\d\,]+)\]/.exec(str);
					jsnShell.alias[Number(aryStructure[1])][aryAlias[1]] = $.map(aryAlias[2].split(","), function(str){
						return Number(str);
					});
				});
			});
		}
		if(data.match(/surface[^{}]+\{[^{}]+\}/gim)){
			$.each(data.match(/surface[^{}]+\{[^{}]+\}/gim), function(i, str){
				var aryStructure = /^surface([^{}]+)\{([^{}]+)\}/.exec(str),
					num = Number(aryStructure[1]),
					blAppend = false,
					aryBool = [],
					src,
					pna;
				aryStructure[1] = aryStructure[1].replace("surface","");
				if(isFinite(num)){
					jsnShell.surface[num] = jsnShell.surface[num] || {};
					src = jsnShell.surface[num].src;
					pna = jsnShell.surface[num].pna;
					jsnShell.surface[num] = {};
					jsnShell.surface[num].src = src;
					jsnShell.surface[num].pna = pna;
					jsnShell.surface[num] = loadSurfacesStructure(jsnShell.surface[num],aryStructure[2]);
				}else if(/(.append)?([!\d\,\-]+)/.test(aryStructure[1])){
					blAppend = aryStructure[1].slice(0,7) === ".append" ? true : false;
					aryStructure[1] = blAppend ? aryStructure[1].slice(7) : aryStructure[1];
					$.each(aryStructure[1].split(","), function(i, str){
						var ary = [];
						switch(true){
						case (/^\d+$/.test(str)):
							aryBool[Number(str)] = true;
							break;
						case (/^!\d+\D+?$/.test(str)):
							aryBool[Number(str.slice(1))] = false;
							break;
						case (/^\d+-\d+$/.test(str)):
							for(ary = /^(\d+)-(\d+)$/.exec(str); ary[1] <= ary[2]; ary[1]++){
								aryBool[Number(ary[1])] = true;
							}
							break;
						case (/^!\d+-\d+$/.test(str)):
							for(ary = /^!(\d+)-(\d+)$/.exec(str); ary[1] <= ary[2]; ary[1]++){
								aryBool[Number(ary[1])] = false;
							}
							break;
						}
					});
					i = aryBool.length;
					while(i--){
						if(aryBool[i]){
							if(! blAppend){
								src = jsnShell.surface[i].src;
								pna = jsnShell.surface[i].pna;
								jsnShell.surface[i] = {};
								jsnShell.surface[i].src = src;
								jsnShell.surface[i].pna = pna;
							}
							jsnShell.surface[i] = loadSurfacesStructure(jsnShell.surface[i],aryStructure[2]);
						}
					}
				}
			});
		}
		return jsnShell;
	}
	function loadSurfacesStructure(surface, structure){
		surface = surface || {};
		if(/collision\d+,\d+,\d+,\d+,\d+,\S+/gim.test(structure)){
			surface.collision = surface.collision || [];
			$.each(structure.match(/collision\d+,\d+,\d+,\d+,\d+,\S+/gim), function(i, str){
				var ary = /(?:collision)(\d+),(\d+),(\d+),(\d+),(\d+),(\S+)/gim.exec(str).slice(1),
					col = surface.collision[Number(ary[0])];
				col = ary.slice(1);
				surface.collision[Number(ary[0])] = $.map(col,function(str){
					return isFinite(Number(str)) ? Number(str) : str;
				});
			});
		}
		if(/element\d+,.+,.+,\d+,\d+/gim.test(structure)){
			surface.element = surface.element || [];
			$.each(structure.match(/element\d+,.+,.+,\d+,\d+/gim),function(i, str){
				var ary = /(?:element)(\d+),(.+),(.+),(\d+),(\d+)/gim.exec(str).slice(1),
					elm = surface.element[Number(ary[0])];
				elm = ary.slice(1);
				elm[1] = file[elm[1]];
				surface.element[Number(ary[0])] = $.map(elm,function(str){
					return isFinite(Number(str)) ? Number(str) : str;
				});
			});
		}
		if(/\d+interval,.+/gim.test(structure)){//SERIKO/1.0 interval
			surface.animation = surface.animation || [];
			$.each(structure.match(/\d+interval,.+/gim),function(i,str){
				var ary = /(\d+)interval,(.+)/gim.exec(str).slice(1),
					anm = surface.animation[Number(ary[0])];
				anm = anm || {};
				anm.interval = ary.slice(1)[0];
				surface.animation[Number(ary[0])] = anm;
			});
		}
		if(/\d+pattern\d+,.+/gim.test(structure)){//SERIKO/1.0 pattern
			surface.animation = surface.animation || [];
			$.each(structure.match(/\d+pattern\d+,.+/gim),function(i,str){
				var ary = /(\d+)pattern(\d+),(.+)/gim.exec(str).slice(1),
					anm = surface.animation[Number(ary[0])],
					pat;
				anm = anm || {};
				anm.pattern = anm.pattern || [];
				pat = anm.pattern[Number(ary[1])];
				pat = ary.slice(2)[0].split(",");
				if(! isFinite(Number(pat[0]))){
					pat = [pat[2], pat[0], pat[1], pat[3], pat[4]];
				}
				pat = $.map(pat, function(str){
					return isFinite(Number(str)) ? Number(str) : str;
				});
				anm.pattern[Number(ary[1])] = pat;
				surface.animation[Number(ary[0])] = anm;
			});
		}
		if(/animation\d+\.interval,.+/gim.test(structure)){//SERIKO/2.0 interval
			surface.animation = surface.animation || [];
			$.each(structure.match(/animation\d+\.interval,.+/gim), function(i, str){
				var ary = /animation(\d+)\.interval,(.+)/gim.exec(str).slice(1),
					anm = surface.animation[Number(ary[0])];
				anm = anm || {};
				anm.interval =ary.slice(1)[0];
				surface.animation[Number(ary[0])] = anm;
			});
		}
		if(/animation\d+\.pattern\d+,.+/gim.test(structure)){//SERIKO/2.0 pattern
			surface.animation = surface.animation || [];
			$.each(structure.match(/animation\d+\.pattern\d+,.+/gim), function(i, str){
				var ary = /animation(\d+)\.pattern(\d+),(.+)/gim.exec(str).slice(1),
					anm = surface.animation[Number(ary[0])];
				anm = anm || {};
				anm.pattern = anm.pattern || [];
				anm.pattern[Number(ary[1])] = ary.slice(2)[0].split(",");
				anm.pattern[Number(ary[1])] = $.map(anm.pattern[Number(ary[1])],function(str){
					return isFinite(Number(str)) ? Number(str) : str;
				});
				surface.animation[Number(ary[0])] = anm;
			});
		}
		return surface;
	}
	function loadUpdates(data){
		var loading = 0;
		jsnNar.homeurl = homeurl;
		$.each(jsnNar.filelist,function(i, path){
			var dir,
				num;
			if(/([^\/]+)\/([^\/]+)\/([^\/]+)$/i.test(path)){	//[shell]/[master]/[surfaces.txt]という３階層構造しか読まない
				dir = /([^\/]+)\/([^\/]+)\/([^\/]+)$/i.exec(path);
				if(/^shell$/i.test(dir[1])){
					file[dir[3]] = dir[0];
					jsnNar.shell[dir[2]] = jsnNar.shell[dir[2]] || {
						descript: {},
						surface: [],
						alias: {}
					};
					switch(true){
					case (/^surface\d+\.png$/i.test(dir[3])):
						num = Number(/^(?:surface)(\d+)(?:\.png)$/i.exec(dir[3])[1]);
						jsnNar.shell[dir[2]].surface[num] = jsnNar.shell[dir[2]].surface[num] || {};
						jsnNar.shell[dir[2]].surface[num].src = path;
						break;
					case (/^surface\d+\.pna$/i.test(dir[3])):
						num = Number(/^(?:surface)(\d+)(?:\.pna)$/i.exec(dir[3])[1]);
						jsnNar.shell[dir[2]].surface[num] = jsnNar.shell[dir[2]].surface[num] || {};
						jsnNar.shell[dir[2]].surface[num].pna = path;
						break;
					case (/^descript\.txt$/i.test(dir[3])):
						$.ajax({
							url: homeurl + path,
							error: function(){
								callback(false);
							},
							success: (function(jsnShell){
								loading += 1;
								return function(data){
									loading -= 1;
									$.each(data.replace("\r","\n").replace("\n\n","\n").split("\n"), function(i, str){
										if(str.indexOf(",") !== -1){
											jsnShell.descript[str.split(",")[0]] = str.split(",")[1].replace("\r", "");
										}
									});
									if(loading === 0){
										callback(jsnNar);
									}
								};
							}(jsnNar.shell[dir[2]]))
						});
						break;
					case (/^surfaces\.txt$/i.test(dir[3])):
						$.ajax({
							url: homeurl + path,
							error: function(){
								callback(false);
							},
							success: (function(jsnShell){
								loading += 1;
								return function(data){
									loading -= 1;
									jsnShell = loadSurfaces(data, jsnShell);
									if(loading === 0){
										callback(jsnNar);
									}
								}
							}(jsnNar.shell[dir[2]]))
						});
						break;
					case (/^surfaces2\.txt$/i.test(dir[3])):
						$.ajax({
							url: homeurl + path,
							error: function(){
								callback(false);
							},
							success: (function(jsnShell){
								loading += 1;
								return function(data){
									loading -= 1;
									jsnShell = loadSurfaces(data, jsnShell);
									if(loading === 0){
										callback(jsnNar);
									}
								}
							}(jsnNar.shell[dir[2]]))
						});
						break;
					}
				}
			}
		});
	}
	homeurl += /\/$/.test(homeurl) ? "" : "/";
	$.ajax({
		url: homeurl + "updates2.dau",
		error: function(){
			$.ajax({
				url: homeurl + "updates.txt",
				error: function(){
					callback(false);
				},
				success: function(data){
					jsnNar.filelist = $.map(data.replace("\r", "\n").replace("\n\n", "\n").split("\n"), function(str){
						return str.split("")[0].split(",")[1];
					});
					loadUpdates(data);
				}
			});
		},
		success: function(data){
			jsnNar.filelist = $.map(data.replace("\r", "\n").replace("\n\n", "\n").split("\n"), function(str){
				return str.split("")[0];
			});
			loadUpdates(data);
		}
	});
}