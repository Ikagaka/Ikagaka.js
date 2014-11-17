function ecoco(homeurl,callback){
	var jsnNar = {
		version: 3,
		homeurl: null,
		filelist: [],
		shell: {}
	};
	if(homeurl.charAt(homeurl.length - 1) !== "/"){
		homeurl += "/";
	}
	$.ajax({
		url: homeurl + "updates2.dau",
		error: function(){
			$.ajax({
				url: homeurl + "updates.txt",
				error: function(){console.log(arguments[1]);callback(false);},
				success: function(data){
					jsnNar.filelist = $.map(data.replace("\r","\n").replace("\n\n","\n").split("\n"),function(str){
						return str.split("")[0].split(",")[1];
					});
					loadUpdates(data);
				}
			});
		},
		success: function(data){
			jsnNar.filelist = $.map(data.replace("\r","\n").replace("\n\n","\n").split("\n"),function(str){
				return str.split("")[0];
			});
			loadUpdates(data);
		}
	});
	function loadUpdates(data){
		var loading = 0, file = {};
		jsnNar.homeurl = homeurl;
		$.each(jsnNar.filelist,function(i,path){
			var dir, num;
			if(/([^\/]+)\/([^\/]+)\/([^\/]+)$/i.test(path)){
				dir = /([^\/]+)\/([^\/]+)\/([^\/]+)$/i.exec(path);
				if(/^shell$/i.test(dir[1])){
					file[dir[3]] = dir[0];
					if(typeof jsnNar.shell[dir[2]] === "undefined"){
						jsnNar.shell[dir[2]] = {
							descript: {},
							surface: []
						};
					}
					if(/^surface\d+\.png$/i.test(dir[3])){
						num = Number(/^(?:surface)(\d+)(?:\.png)$/i.exec(dir[3])[1]);
						jsnNar.shell[dir[2]].surface[num] = jsnNar.shell[dir[2]].surface[num] || {
							src: null,
							pna: null,
							collision: [],
							element: [],
							animation: []
						};
						jsnNar.shell[dir[2]].surface[num].src = path;
					}else if(/^surface\d+\.pna$/i.test(dir[3])){
						num = Number(/^(?:surface)(\d+)(?:\.pna)$/i.exec(dir[3])[1]);
						jsnNar.shell[dir[2]].surface[num] = jsnNar.shell[dir[2]].surface[num] || {
							src: null,
							pna: null,
							collision: [],
							element: [],
							animation: []
						};
						jsnNar.shell[dir[2]].surface[num].pna = path;
					}else if(/^descript\.txt$/i.test(dir[3])){
						$.ajax({
							url: homeurl + path,
							error: function(){console.log(arguments[1]);callback(false);},
							success: (function(jsnShell){
								loading += 1;
								return function(data){
									loading -= 1;
									$.each(data.replace("\r","\n").replace("\n\n","\n").split("\n"),function(i,str){
										if(str.indexOf(",") !== -1){
											jsnShell.descript[str.split(",")[0]] = str.split(",")[1].replace("\r","");
										}
									});
									if(loading === 0){
										callback(jsnNar);
									}
								};
							}(jsnNar.shell[dir[2]]))
						});
					}else if(/^surfaces\.txt$/i.test(dir[3])){
						$.ajax({
							url: homeurl + path,
							error: function(){
								console.log(arguments[1]);
								callback(false);
							},
							success: (function(jsnShell){
								loading += 1;
								return function(data){
									loading -= 1;
									$.each(data.replace("\r","\n").replace("\n\n","\n").match(/surface[^{}]+\{[^{}]+\}/gim),function(i,str){
										var ary = /surface([^{}]+)\{([^{}]+)\}/.exec(str),
											num = Number(ary[1]),
											append = false,
											a = [];
										if(isFinite(num)){
											loadSurfaces(num);
										}else if(/(.append)?([!\d\,\-]+)/.test(ary[1])){
											append = ary[1].slice(0,7) === ".append" ? true : false;
											$.each(ary[1].slice(7).split(","),function(i,str){
												var b = [];
												if(/^\d+$/.test(str)){
													a[Number(str)] = true;
												}else if(/^!\d+\D+?$/.test(str)){
													a[Number(str.slice(1))] = false;
												}else if(/^\d+-\d+$/.test(str)){
													for(b = /^(\d+)-(\d+)$/.exec(str); b[1] <= b[2]; b[1]++){
														a[Number(b[1])] = true;
													}
												}else if(/^!\d+-\d+$/.test(str)){
													for(b = /^!(\d+)-(\d+)$/.exec(str); b[1] <= b[2]; b[1]++){
														a[Number(b[1])] = false;
													}
												}
											});
											i = a.length;
											while(i--){
												if(a[i]){
													if(! append){
														jsnShell.surface[i] = null;
													}
													loadSurfaces(i);
												}
											}
										}
										function loadSurfaces(num){
											jsnShell.surface[num] = jsnShell.surface[num] || {
												src: null,
												pna: null,
												collision: [],
												element: [],
												animation: []
											};
											if(/collision\d+,\d+,\d+,\d+,\d+,\S+/gim.test(ary[2])){
												$.each(ary[2].match(/collision\d+,\d+,\d+,\d+,\d+,\S+/gim),function(i,str){
													var ary = /(?:collision)(\d+),(\d+),(\d+),(\d+),(\d+),(\S+)/gim.exec(str).slice(1),
														col = jsnShell.surface[num].collision[Number(ary[0])];
													col = ary.slice(1);
													jsnShell.surface[num].collision[Number(ary[0])] = $.map(col,function(str){
														return isFinite(Number(str)) ? Number(str) : str;
													});
												});
											}
											if(/element\d+,.+,.+,\d+,\d+/gim.test(ary[2])){
												$.each(ary[2].match(/element\d+,.+,.+,\d+,\d+/gim),function(i,str){
													var ary = /(?:element)(\d+),(.+),(.+),(\d+),(\d+)/gim.exec(str).slice(1),
														elm = jsnShell.surface[num].element[Number(ary[0])];
													elm = ary.slice(1);
													elm[1] = file[elm[1]];
													jsnShell.surface[num].element[Number(ary[0])] = $.map(elm,function(str){
														return isFinite(Number(str)) ? Number(str) : str;
													});
												});
											}
											if(/\d+interval,.+/gim.test(ary[2])){//SERIKO/1.0 interval
												$.each(ary[2].match(/\d+interval,.+/gim),function(i,str){
													var ary = /(\d+)interval,(.+)/gim.exec(str).slice(1),
														anm = jsnShell.surface[num].animation[Number(ary[0])];
													anm = anm || {
														pattern: [],
														interval: null
													};
													anm.interval = ary.slice(1)[0];
													jsnShell.surface[num].animation[Number(ary[0])] = anm;
												});
											}
											if(/\d+pattern\d+,.+/gim.test(ary[2])){//SERIKO/1.0 pattern
												$.each(ary[2].match(/\d+pattern\d+,.+/gim),function(i,str){
													var ary = /(\d+)pattern(\d+),(.+)/gim.exec(str).slice(1),
														anm = jsnShell.surface[num].animation[Number(ary[0])];
													anm = anm || {
														pattern: [],
														interval: null
													};
													anm.pattern[Number(ary[1])] = ary.slice(2)[0].split(",");
													if(! isFinite(Number(anm.pattern[Number(ary[1])][0]))){
														anm.pattern[Number(ary[1])] = [
															anm.pattern[Number(ary[1])][2]
															,anm.pattern[Number(ary[1])][0]
															,anm.pattern[Number(ary[1])][1]
															,anm.pattern[Number(ary[1])][3]
															,anm.pattern[Number(ary[1])][4]
														];
													}
													anm.pattern[Number(ary[1])] = $.map(anm.pattern[Number(ary[1])],function(str){
														return isFinite(Number(str)) ? Number(str) : str;
													});
													jsnShell.surface[num].animation[Number(ary[0])] = anm;
												});
											}
											if(/animation\d+\.interval,.+/gim.test(ary[2])){//SERIKO/2.0 interval
												$.each(ary[2].match(/animation\d+\.interval,.+/gim),function(i,str){
													var ary = /animation(\d+)\.interval,(.+)/gim.exec(str).slice(1),
														anm = jsnShell.surface[num].animation[Number(ary[0])];
													anm = anm || {
														pattern: [],
														interval: null
													};
													anm.interval =ary.slice(1)[0];
													jsnShell.surface[num].animation[Number(ary[0])] = anm;
												});
											}
											if(/animation\d+\.pattern\d+,.+/gim.test(ary[2])){//SERIKO/2.0 pattern
												$.each(ary[2].match(/animation\d+\.pattern\d+,.+/gim),function(i,str){
													var ary = /animation(\d+)\.pattern(\d+),(.+)/gim.exec(str).slice(1),
														anm = jsnShell.surface[num].animation[Number(ary[0])];
													anm = anm || {
														pattern: [],
														interval: null
													};
													anm.pattern[Number(ary[1])] = ary.slice(2)[0].split(",");
													anm.pattern[Number(ary[1])] = $.map(anm.pattern[Number(ary[1])],function(str){
														return isFinite(Number(str)) ? Number(str) : str;
													});
													jsnShell.surface[num].animation[Number(ary[0])] = anm;
												});
											}
										}
									});
									if(loading === 0){
										callback(jsnNar);
									}
								};
							}(jsnNar.shell[dir[2]]))
						});
					}
				}
			}
		});
	}
}