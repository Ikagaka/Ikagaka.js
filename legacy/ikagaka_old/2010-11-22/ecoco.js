// ecoco.js ファイルロード
// ecoco(homeurl,function(narObj){});
var ecoco = function(homeurl,callback){
	var narObj = {};
	$.get(homeurl + "updates2.dau",function(data){
		var loading = 0;
		narObj.homeurl = homeurl;
		narObj.filelist = $.map(data.replace("\r","\n").replace("\n\n","\n").split("\n"),function(str){return str.split("")[0];});
		$.each(narObj.filelist,function(i,dir){
			if(/([^\/]+)\/([^\/]+)\/([^\/]+)$/i.test(dir)){
				var ary = /([^\/]+)\/([^\/]+)\/([^\/]+)$/i.exec(dir);
				if(/^shell$/i.test(ary[1])){
					if(typeof narObj.shell === "undefined"){
						narObj.shell = {};
					}
					if(typeof narObj.shell[ary[2]] === "undefined"){
						narObj.shell[ary[2]] = {};
						narObj.shell[ary[2]].surface = [];
					}
					if(/^surface\d+\.png$/i.test(ary[3])){
						var num = Number(/^(?:surface)(\d+)(?:\.png)$/i.exec(ary[3])[1]);
						narObj.shell[ary[2]].surface[num] = {};
						narObj.shell[ary[2]].surface[num].src = dir;
						narObj.shell[ary[2]].surface[num].collision = [];
						narObj.shell[ary[2]].surface[num].element = [];
						narObj.shell[ary[2]].surface[num].animation = [];
					}else if(/^surfaces\.txt$/i.test(ary[3])){
						$.get(homeurl + dir,(function(shellObj){
							loading += 1;
							return function(data){
								loading -= 1;
								$.each(data.replace("\r","\n").replace("\n\n","\n").match(/surface[^{}]+\{[^{}]+\}/gim),function(i,str){
									var ary = /surface([^{}]+)\{([^{}]+)\}/.exec(str);
									var num = Number(ary[1]);
									if(isFinite(num)){
										if(typeof shellObj.surface[num] === "undefined"){
											shellObj.surface[num] = {};
										}
										shellObj.surface[num].collision = [];
										if(/collision\d+,\d+,\d+,\d+,\d+,\S+/gim.test(ary[2])){
											$.each(ary[2].match(/collision\d+,\d+,\d+,\d+,\d+,\S+/gim),function(i,str){
												var ary = /(?:collision)(\d+),(\d+),(\d+),(\d+),(\d+),(\S+)/gim.exec(str).slice(1);
												shellObj.surface[num].collision[Number(ary[0])] = ary.slice(1);
												shellObj.surface[num].collision[Number(ary[0])] = $.map(shellObj.surface[num].collision[Number(ary[0])],function(str){
													if(isFinite(Number(str))){
														return Number(str);
													}
													return str;
												});
											});
										}
										shellObj.surface[num].element = [];
										if(/element\d+,.+,.+,\d+,\d+/gim.test(ary[2])){
											$.each(ary[2].match(/element\d+,.+,.+,\d+,\d+/gim),function(i,str){
												var ary = /(?:element)(\d+),(.+),(.+),(\d+),(\d+)/gim.exec(str).slice(1);
												shellObj.surface[num].element[Number(ary[0])] = ary.slice(1);
												shellObj.surface[num].element[Number(ary[0])] = $.map(shellObj.surface[num].element[Number(ary[0])],function(str){
													if(isFinite(Number(str))){
														return Number(str);
													}
													return str;
												});
											});
										}
										shellObj.surface[num].animation = [];
										if(/\d+interval,.+/gim.test(ary[2])){//SERIKO/1.0 interval
											$.each(ary[2].match(/\d+interval,.+/gim),function(i,str){
												var ary = /(\d+)interval,(.+)/gim.exec(str).slice(1);
												if(typeof shellObj.surface[num].animation[Number(ary[0])] === "undefined"){
													shellObj.surface[num].animation[Number(ary[0])] = {};
												}
												if(typeof shellObj.surface[num].animation[Number(ary[0])].pattern === "undefined"){
													shellObj.surface[num].animation[Number(ary[0])].pattern = [];
												}
												shellObj.surface[num].animation[Number(ary[0])].interval = ary.slice(1)[0];
											});
										}
										if(/\d+pattern\d+,.+/gim.test(ary[2])){//SERIKO/1.0 pattern
											$.each(ary[2].match(/\d+pattern\d+,.+/gim),function(i,str){
												var ary = /(\d+)pattern(\d+),(.+)/gim.exec(str).slice(1);
												if(typeof shellObj.surface[num].animation[Number(ary[0])] === "undefined"){
													shellObj.surface[num].animation[Number(ary[0])] = {};
												}
												if(typeof shellObj.surface[num].animation[Number(ary[0])].pattern === "undefined"){
													shellObj.surface[num].animation[Number(ary[0])].pattern = [];
												}
												shellObj.surface[num].animation[Number(ary[0])].pattern[Number(ary[1])] = ary.slice(2)[0].split(",");
												if(! isFinite(Number(shellObj.surface[num].animation[Number(ary[0])].pattern[Number(ary[1])][0]))){
													shellObj.surface[num].animation[Number(ary[0])].pattern[Number(ary[1])] = [
														shellObj.surface[num].animation[Number(ary[0])].pattern[Number(ary[1])][2]
														,shellObj.surface[num].animation[Number(ary[0])].pattern[Number(ary[1])][0]
														,shellObj.surface[num].animation[Number(ary[0])].pattern[Number(ary[1])][1]
														,shellObj.surface[num].animation[Number(ary[0])].pattern[Number(ary[1])][3]
														,shellObj.surface[num].animation[Number(ary[0])].pattern[Number(ary[1])][4]
													]
												}
												shellObj.surface[num].animation[Number(ary[0])].pattern[Number(ary[1])] = $.map(shellObj.surface[num].animation[Number(ary[0])].pattern[Number(ary[1])],function(str){
													if(isFinite(Number(str))){
														return Number(str);
													}
													return str;
												});
											});
										}
										if(/animation\d+\.interval,.+/gim.test(ary[2])){//SERIKO/2.0 interval
											$.each(ary[2].match(/animation\d+\.interval,.+/gim),function(i,str){
												var ary = /animation(\d+)\.interval,(.+)/gim.exec(str).slice(1);
												if(typeof shellObj.surface[num].animation[Number(ary[0])] === "undefined"){
													shellObj.surface[num].animation[Number(ary[0])] = {};
												}
												if(typeof shellObj.surface[num].animation[Number(ary[0])].pattern === "undefined"){
													shellObj.surface[num].animation[Number(ary[0])].pattern = [];
												}
												shellObj.surface[num].animation[Number(ary[0])].interval =ary.slice(1)[0];
											});
										}
										if(/animation\d+\.pattern\d+,.+/gim.test(ary[2])){//SERIKO/2.0 pattern
											$.each(ary[2].match(/animation\d+\.pattern\d+,.+/gim),function(i,str){
												var ary = /animation(\d+)\.pattern(\d+),(.+)/gim.exec(str).slice(1);
												if(typeof shellObj.surface[num].animation[Number(ary[0])] === "undefined"){
													shellObj.surface[num].animation[Number(ary[0])] = {};
												}
												if(typeof shellObj.surface[num].animation[Number(ary[0])].pattern === "undefined"){
													shellObj.surface[num].animation[Number(ary[0])].pattern = [];
												}
												shellObj.surface[num].animation[Number(ary[0])].pattern[Number(ary[1])] = ary.slice(2)[0].split(",");
												shellObj.surface[num].animation[Number(ary[0])].pattern[Number(ary[1])] = $.map(shellObj.surface[num].animation[Number(ary[0])].pattern[Number(ary[1])],function(str){
													if(isFinite(Number(str))){
														return Number(str);
													}
													return str;
												});
											});
										}
									}
								});
								if(loading <= 0){
									callback(narObj);
								}
							};
						}(narObj.shell[ary[2]])));
					}else if(/^descript\.txt$/i.test(ary[3])){
						$.get(homeurl + dir,(function(shellObj){
							loading += 1;
							return function(data){
								loading -= 1;
								shellObj.descript = {};
								$.each(data.replace("\r","\n").replace("\n\n","\n").split("\n"),function(i,str){
									if(str.indexOf(",") !== -1){
										shellObj.descript[str.split(",")[0]] = str.split(",")[1].replace("\r","");
									}
								});
								if(loading <= 0){
									callback(narObj);
								}
							};
						}(narObj.shell[ary[2]])));
					}
				}
			}
		});
		if(loading <= 0){
			callback(narObj);
		}
	});
};