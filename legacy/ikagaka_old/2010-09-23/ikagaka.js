(function(){
/////////////////////////////////////////////////////////////////
$("head").append("<style>.named *{position:absolute;border:0px solid black;margin:0px;padding:0px;}</style>");//共通スタイル
window.named = function(){//使いまわすクロージャ関数
	var isNumber = function(obj){
		return typeof obj === "number" && isFinite(obj);
	};
	var asyncOrderApply = function(){
		var flag = 0;
		var funcList = [];
		var objList = [];
		var aryList = [];
		var taskObj = {};
		taskObj.todo = function(func,obj,ary){
			if ($.isFunction(func)){
				flag += 1;
				funcList.push(func);
				objList.push(($.isPlainObject(obj)) ? obj:{});
				aryList.push(($.isArray(ary) ) ? ary:[]);
			}
		};
		taskObj.trydo = function(){
			flag -= 1;
			if (flag === 0){
				for (var i = 0; i < funcList.length; i++){
					funcList[i].apply(objList[i],aryList[i]);
				}
				funcList = objList = aryList = [];
			}
		};
		return taskObj;
	};
	var img2canvas = function(img,bool) {
		var canvas = $("<canvas></canvas>").attr("width",img.width).attr("height",img.height)[0];
		var ctx = canvas.getContext('2d');
		ctx.drawImage(img,0,0);
		var imgdata = ctx.getImageData(0,0,img.width,img.height);
		var r = imgdata.data[0];
		var g = imgdata.data[1];
		var b = imgdata.data[2];
		for(var i = 0; i < imgdata.data.length; i++){
			if(r === imgdata.data[i] && g === imgdata.data[i+1] && b === imgdata.data[i+2]) imgdata.data[i+3] = 0;
			i += 3;
		}
		ctx.putImageData(imgdata,0,0);
		return canvas;
	};
	var base = function(canvas,surface){//引数０のcanvasElementに引数１のcanvasElementを上書きする
		$(canvas).attr("width",surface.width).attr("height",surface.height);
		$(canvas.parentElement).width(surface.width).height(surface.height);
		var ctx = canvas.getContext('2d');
		ctx.drawImage(surface,0,0);
	};
	var PID = Math.floor(Math.random() * new Date().getTime());
	$("body").append($("<div>").attr("id",PID).addClass("named"));
	var curShell = "master";
	var curBalloon = "switch_L";
	var namedObj = {};

	namedObj.scope = (function(){//無名クロージャ関数
		var curScope = 0;
		var scopeList =[];
		var scope = function(){//使いまわすクロージャ関数
			$("#" + PID).prepend(
				$("<div>").addClass("scope scope" + curScope).append(
					$("<canvas>").attr("width","0").attr("height","0").css("display","block").click(function(e){//さわられ
									namedObj.event.addKey("ID","OnMouseClick");
									namedObj.event.addKey("Reference0",e.offsetX);
									namedObj.event.addKey("Reference1",e.offsetY);
									namedObj.event.addKey("Reference2",0);
									namedObj.event.addKey("Reference3",$.data(this,"reference").r3);
									namedObj.event.addKey("Reference4","");
									namedObj.event.play();
								})
								.dblclick(function(e){//つつかれ
									namedObj.event.addKey("ID","OnMouseDoubleClick");
									namedObj.event.addKey("Reference0",e.offsetX);
									namedObj.event.addKey("Reference1",e.offsetY);
									namedObj.event.addKey("Reference2",0);
									namedObj.event.addKey("Reference3",$.data(this,"reference").r3);
									namedObj.event.addKey("Reference4","");
									namedObj.event.play();
								})
								.mousemove(function(e){//なでられ
									namedObj.event.addKey("ID","OnMouseMove");
									namedObj.event.addKey("Reference0",e.offsetX);
									namedObj.event.addKey("Reference1",e.offsetY);
									namedObj.event.addKey("Reference2",0);
									namedObj.event.addKey("Reference3",$.data(this,"reference").r3);
									namedObj.event.addKey("Reference4","");
									namedObj.event.play();
								})
					,$("<div>").addClass("collision")
					,$("<div>").addClass("blimp").append(
						$("<canvas>").attr("width","0").attr("height","0").css("display","block")
						,$("<div>").addClass("text").css("overflow-y","hidden")
					)
				).css("position","absolute").css("bottom","0px").css("right",300 * curScope + 50 + "px").draggable({
					"axis":"x"
					,"start":function(){
						$("#" + PID).append($(this));
					}
				})
			);
			$.data($("#" + PID + ">.scope" + curScope + ">canvas")[0],"reference",{r3:curScope});
			var scopeObj = {};
			scopeObj.surface = (function(){//無名クロージャ関数
				var curSurface = -1;
				var surfaceObj = {};
				var surfaceJqObj = $("#" + PID + ">.scope" + curScope);
				var collisionJqObj = $("#" + PID + ">.scope" + curScope + ">.collision");
				var surfaceTimer = (function(){
					var taskList = [];
					var timerObj = {};
					timerObj.setRandom = function(num,func){
						if(! isNumber(num) || ! $.isFunction(func)) return timerObj;
						taskList.push({
							num:num
							,func:func
							,tid:setTimeout(function(){
								if(Math.random() > (1 / this.num)) this.func();
								this.tid = setTimeout(arguments.callee,1000);
							},1000)
						});
					};
					timerObj.setPeriodic = function(num,func){
						if(! isNumber(num) || ! $.isFunction(func)) return timerObj;
						taskList.push({
							num:num
							,func:func
							,tid:setTimeout(function(){
								this.func();
								this.tid = setTimeout(arguments.callee,this.num);
							},this.num)
						});
					};
					timerObj.clearAll = function(){
						for(var i = 0; i < taskList.length; i++){
							clearTimeout(taskList[i].tid);
						}
						taskList = [];
					};
					return timerObj;
				})();
				return function(num){
					if(num == null || curSurface === num) return surfaceObj;
					if(num === -1){//サーフィス非表示
						surfaceJqObj.css("visibility","hidden");
						collisionJqObj.css("display","none");
						return surfaceObj;
					}
					surfaceJqObj.css("visibility","visible");
					collisionJqObj.css("display","block");
					if(namedObj.nar.shell[curShell]["sakura.surface.alias"][num] != null){//サーフェスエイリアスの決定
						var random = Math.random();
						for(var i = 0; i < namedObj.nar.shell[curShell]["sakura.surface.alias"][num].length; i++){
							if(random < ((i + 1) / namedObj.nar.shell[curShell]["sakura.surface.alias"][num].length)){
								curSurface = namedObj.nar.shell[curShell]["sakura.surface.alias"][num][i];
								break;
							}
						}
					}else{
						curSurface = num;
					}
					var surface = namedObj.nar.shell[curShell].surface[curSurface];
					var img = new Image();//ベースサーフェスの描画
					img.src = namedObj.nar.homeurl + surface.src;
					var task = asyncOrderApply();
					task.todo(function(){
						base($("#" + PID + ">.scope" + this.curScope + ">canvas")[0],this.img.canvas);
						if(this.curScope === 0){
							$("#" + PID + ">.scope" + this.curScope  + ">.blimp")
.css("right",0+"px")
.css("top",0+"px");
//							.css("right",this.img.width - (isNumber(namedObj.nar.shell[curShell]["sakura.balloon.offsetx"])) ? namedObj.nar.shell[curShell]["sakura.balloon.offsetx"]:0 + "px")
//							.css("top", - (isNumber(namedObj.nar.shell[curShell]["sakura.balloon.offsety"]))?namedObj.nar.shell[curShell]["sakura.balloon.offsety"]:0 + "px");
						}else{
							$("#" + PID + ">.scope" + this.curScope  + ">.blimp")
.css("right",0+"px")
.css("top",0+"px");
//.css("right",this.img.width - (isNumber(namedObj.nar.shell[curShell]["kero.balloon.offsetx"])) ? namedObj.nar.shell[curShell]["kero.balloon.offsetx"]:0 + "px").css("top", - (isNumber(namedObj.nar.shell[curShell]["kero.balloon.offsety"])) ? namedObj.nar.shell[curShell]["kero.balloon.offsety"]:0 + "px");
						}
					},{
						curScope:curScope
						,img:img
					},null);
					img.onload = function(){
						this.canvas = img2canvas(this);
						task.trydo();
					};
					//エレメント合成
					if(surface.collision != null){//当たり判定
						collisionJqObj.empty();
						for(var i = 0; i < surface.collision.length; i++){
							collisionJqObj.append(
								$("<div>")
								.addClass(surface.collision[i][4] + " collision" + i)
								.css("left",surface.collision[i][0] + "px")
								.css("top",surface.collision[i][1] + "px")
								.width(surface.collision[i][2] - surface.collision[i][0] + "px")
								.height(surface.collision[i][3] - surface.collision[i][1] + "px")
								.click(function(e){//さわられ
									namedObj.event.addKey("ID","OnMouseClick");
									namedObj.event.addKey("Reference0",$.data(this,"reference").r0 + e.offsetX);
									namedObj.event.addKey("Reference1",$.data(this,"reference").r1 + e.offsetY);
									namedObj.event.addKey("Reference2",0);
									namedObj.event.addKey("Reference3",$.data(this,"reference").r3);
									namedObj.event.addKey("Reference4",$.data(this,"reference").r4);
									namedObj.event.play();
								})
								.dblclick(function(e){//つつかれ
									namedObj.event.addKey("ID","OnMouseDoubleClick");
									namedObj.event.addKey("Reference0",$.data(this,"reference").r0 + e.offsetX);
									namedObj.event.addKey("Reference1",$.data(this,"reference").r1 + e.offsetY);
									namedObj.event.addKey("Reference2",0);
									namedObj.event.addKey("Reference3",$.data(this,"reference").r3);
									namedObj.event.addKey("Reference4",$.data(this,"reference").r4);
									namedObj.event.play();
								})
								.mousemove(function(e){//なでられ
									namedObj.event.addKey("ID","OnMouseMove");
									namedObj.event.addKey("Reference0",$.data(this,"reference").r0 + e.offsetX);
									namedObj.event.addKey("Reference1",$.data(this,"reference").r1 + e.offsetY);
									namedObj.event.addKey("Reference2",0);
									namedObj.event.addKey("Reference3",$.data(this,"reference").r3);
									namedObj.event.addKey("Reference4",$.data(this,"reference").r4);
									namedObj.event.play();
								})
							);
							$.data($("#" + PID + ">.scope" + curScope + ">.collision>.collision" + i)[0],"reference",{r0:surface.collision[i][0],r1:surface.collision[i][1],r3:curScope,r4:surface.collision[i][4]});
						}
					}
					if(namedObj.nar.shell[curShell].surface[curSurface].interval != null){//アニメーション登録
						for(var i = 0; i < namedObj.nar.shell[curShell].surface[curSurface].interval.length; i++){
							switch(namedObj.nar.shell[curShell].surface[curSurface].interval[i].type){
								case "sometimes":
									break;
								case "rarely":
									break;
								case "always":
									break;
								case "runonce":
									break;
								case "never":
									break;
								case "yen-e":
									break;
								default:
									if(/^random,(\d+)$/.test(namedObj.nar.shell[curShell].surface[curSurface].interval[i].type)){
										var num = /^random,(\d+)$/.exec(namedObj.nar.shell[curShell].surface[curSurface].interval[i].type);
										surfaceTimer.setRandom(num,function(){});
									}else if(/^periodic,(\d+)$/.test(namedObj.nar.shell[curShell].surface[curSurface].interval[i].type)){
										var num = /^periodic,(\d+)$/.exec(namedObj.nar.shell[curShell].surface[curSurface].interval[i].type);
										surfaceTimer.setPeriodic(num,function(){});
									}else if(/^talk,(\d+)$/.test(namedObj.nar.shell[curShell].surface[curSurface].interval[i].type)){
										var num = /^talk,(\d+)$/.exec(namedObj.nar.shell[curShell].surface[curSurface].interval[i].type);
									}
							}
						}
					}
					return surfaceObj;
				};
			})();
			scopeObj.blimp = (function(){//無名クロージャ関数
				var curBlimp= -1;
				var blimpObj = {};
				var blimpJqObj = $("#" + PID + ">.scope" + curScope + ">.blimp");
				var textJqObj = $("#" + PID + ">.scope" + curScope + ">.blimp>.text");
				blimpObj.addText = function(str){//発話
					textJqObj.html(textJqObj.html() + str).scrollTop(10000);
					return blimpObj;
				};
				blimpObj.clearText = function(){//\c
					textJqObj.html("");
					return blimpObj;
				};
				return function(num){
					if(num == null || ! isNumber(num) || curBlimp === num) return blimpObj;
					if(num === -1){//バルーン非表示
						blimpJqObj.css("visibility","hidden");
						return blimpObj;
					}
					blimpJqObj.css("visibility","visible");
					curBlimp = num;
					var blimp = namedObj.nar.balloon[curBalloon].blimp[curBlimp];//バルーンの描画
					var img = new Image();
					//try{
						if(curScope === 0){
							img.src = namedObj.nar.homeurl + blimp.s.src;
						}else{
							img.src = namedObj.nar.homeurl + blimp.k.src;
						}
						var task = asyncOrderApply();
						task.todo(function(){
							base($("#" + PID + ">.scope" + this.curScope + ">.blimp>canvas")[0],this.img.canvas);
							$("#" + PID + ">.scope" + this.curScope + ">.blimp>.text")
								.width(this.img.width - 30 + "px")
								.height(this.img.height - 30 + "px")
								.css("margin",15 + "px");
						},{
							curScope:curScope
							,img:img
						},null);
						img.onload = function(){
							this.canvas = img2canvas(this);
							task.trydo();
						};
					//}catch(e){
					//	return blimpObj;
					//}
					return blimpObj;
				};
			})();
			return scopeObj;
		};
		scopeList[curScope] = scope();//\0は必須
		return function(num){
			if(num == null) return scopeList[curScope];
			if(num != null && isNumber(num)) curScope = num;
			if(scopeList[curScope] == null) scopeList[curScope] = scope();//スコープの新規作成
			$("#" + PID).append($("#" + PID + ">.scope" + curScope));//カレントスコープを前面に移動
			return scopeList[curScope];
		};
	})();
	namedObj.event = (function(){
		var eventObj = {};
		var shioriObj = {};
		shioriObj["Charset"] = "UTF-8";
		shioriObj["Sender"] = "ikagaka";
		eventObj.addKey = function(key,value){
			shioriObj[key] = value;
			return eventObj;
		};
		eventObj.play = function(){
			console.log("GET SHIORI/3.0");
			for(var a in shioriObj){
				console.log(a+": "+shioriObj[a]);
			}
			console.log("");
			//response = satori(shioriObj);//栞にリクエスト
			//レスポンスにスクリプトがあれば再生
			shioriObj = {};
			shioriObj["Charset"] = "UTF-8";
			shioriObj["Sender"] = "ikagaka";
		};
		return eventObj;
	})();
	return namedObj;
};


/////////////////////////////////////////////////////////////////
})();





































