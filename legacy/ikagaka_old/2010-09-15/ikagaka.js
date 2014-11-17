(function(){
/////////////////////////////////////////////////////////////////

//<style>を挿入する処理
$("head").append("\
<style>\
body{\
	background-color:#ff00ff;\
}\
.named *{\
	position:absolute;\
	border:1px solid black;\
	margin:0px;\
	padding:0px;\
}\
</style>\
");
window.named = function(){//クロージャを利用したコンストラクタ。
	//初期設定
	var PID = Math.floor(Math.random() * 100000000);
	var curShell = "master";

	//utility関数
	var isNumber = function(num){//真偽判定　有効な数値
		if(typeof Number(num) === "number" && isFinite(Number(num)) && ! isNaN(Number(num)) && typeof num !== "object") return true;
		return false;
	};
	var transImg = function(img){//ImageObjectを入れるとその背景色を透明化したCanvasElementを返す
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
	var overlay = function(canvas,surface,x,y){//引数０のcanvasElementに引数１のcanvasElementを指定位置に合成する
		var ctx = canvas.getContext('2d');
		ctx.globalCompositeOperation = "source-over";
		if(typeof x === "undefined" && typeof y === "undefined"){
			ctx.drawImage(surface,0,0);
		}else{
			ctx.drawImage(surface,x,y);//領域からはみ出すとINDEX_SIZE_ERROR吐くかも
		}
	};
	var delayTask = function(){//画像のプリロードに使う
		var flag = 0;
		var taskList = [];
		var taskObj = {};
		taskObj.add = function(obj){//objのメンバにtaskという名のfuncがないとエラー吐くかも
			flag += 1;
			taskList.push(obj);
		};
		taskObj.work = function(){
			flag -= 1;
			if(flag === 0){
				for(var i = 0;i < taskList.length;i += 1){
					taskList[i].task();
				}
				taskList = [];
			}
		};
		return taskObj;
	};
	var timer = function(){//アニメーションやランダムトークの発生タイミングとか
		var tid = 0;
		var work = function(){};
		var timerObj = {};
		timerObj.setSometimes = function(func){
			if(typeof func !== "undefined") work = func;
			if(Math.random() > 0.5 && typeof work === "function") work();
			tid = setTimeout(arguments.callee,1000)
		};
		timerObj.clearAll = function(){
			clearTimeout(tid);
		};
		return timerObj;
	};

	//named()のインスタンスとなるnamedObj
	var namedObj = {};
	namedObj.nar = {//ビルトインゴースト
		"homeurl":undefined
		,"shell":{
			"master":{
				"surface":[
					{"src":undefined}
				]
			}
		}
	};
	namedObj.scope = (function(){//クロージャ関数を返す無名コンストラクタ。無名コンストラクタは複数のインスタンスを使いまわずひとつだけ使うときには便利
		var curScope = 0;
		var scopeList = [];
		scope = function(){//クロージャコンストラクタ。これは使いまわす
			var scopeObj = {};
			scopeObj.surface = (function(){//無名コンストラクタ
				var curSurface = 0;
				var timing = timer();
				var surfaceObj = {};
				surfaceObj.playAnimation = function(curScope,num){//[num]interval,hoge~ のアニメーションを再生
					if(typeof num === "undefined") return surfaceObj;
					if(! isNumber(num)) return surfaceObj;
					var pattern = namedObj.nar.shell[curShell].surface[curSurface].interval[Number(num)].pattern;
					var task = delayTask();
					var img = [];//base用
					var img2 = [];//overlay用
					for(var i = 0; i < pattern.length; i += 1){
						var surface = namedObj.nar.shell[curShell].surface[curSurface];//まずbaseを描画
						img[i] = new Image();
						img[i].src = namedObj.nar.homeurl + surface.src;
						task.add({
							curScope:curScope
							,surface:surface
							,img:img[i]
							,wait:pattern[i][1]
							,aniSurfaceNum:pattern[i][0]
							,task:function(){
								var that = this;
								$("#" + PID + ">.scope" + this.curScope + ">canvas").queue(function(){
									base($(this)[0],that.img.canvas);
									$(this).dequeue();
								}).delay((function(){
									if(that.aniSurfaceNum === -1) return that.wait;
									return 1;
								})());
							}
						});
						img[i].onload = function(){
							this.canvas = transImg(this);
							task.work();
						};
						//baseをoverlayで上書き
						if(pattern[i][0] === -1) continue;
						surface = namedObj.nar.shell[curShell].surface[Number(pattern[i][0])];//pattern[i][0]の値次第でバグの原因になりうる
						img2[i] = new Image();
						img2[i].src = namedObj.nar.homeurl + surface.src;
						task.add({
							curScope:curScope
							,surface:surface
							,img:img2[i]
							,wait:pattern[i][1]
							,x:pattern[i][3]
							,y:pattern[i][4]
							,task:function(){
								var that = this;
								$("#" + PID + ">.scope" + this.curScope + ">canvas").queue(function(){
									overlay($(this)[0],that.img.canvas,that.x,that.y);//canvasからはみ出たらエラーでる
									$(this).dequeue();
								}).delay(this.wait);//SERIKOのウエイト
							}
						});
						img2[i].onload = function(){
							this.canvas = transImg(this);
							task.work();
						};
					}
				};
				return function(num){
					if(typeof num === "undefined") return surfaceObj;
					if(isNumber(num)){
						if(Number(num) === -1){
							$("#" + PID + ">.scope" + curScope).css("visibility","hidden");
							$("#" + PID + ">.scope" + curScope + ">.collision").css("display","none")
						}else{
							curSurface = Number(num);
							$("#" + PID + ">.scope" + curScope).css("visibility","visible");
							$("#" + PID + ">.scope" + curScope + ">.collision").css("display","block")
						}	
					}

					//ベースサーフェスの描画
					var surface = namedObj.nar.shell[curShell].surface[curSurface];
					var img = new Image();
					img.src = namedObj.nar.homeurl + surface.src;
					var task = delayTask();
					task.add({
						curScope:curScope
						,surface:surface
						,img:img
						,task:function(){
							base($("#" + PID + ">.scope" + this.curScope + ">canvas")[0],this.img.canvas);
							var that = this;
							if(this.curScope === 0){
								$("#" + PID + ">.scope" + that.curScope  + ">.blimp").css("right",that.img.width - 180 + "px").css("top", -130 + "px");
							}else{
								$("#" + PID + ">.scope" + that.curScope  + ">.blimp").css("left",that.img.width - 20 + "px").css("top", 80 + "px");
							}
						}
					});
					img.onload = function(){
						this.canvas = transImg(this);
						task.work();
					};
					//エレメント合成
					//当たり判定の作成
					$("#" + PID + ">.scope" + curScope + ">.collision").empty();
					if(typeof surface.collision !== "undefined"){
						var dbltouch = function(){//つつかれ関数
							//OnMouseDoubleClickを呼ぶ
							return function(){
								ghostObj.event.addKey("ID","OnMouseDoubleClick");
//								ghostObj.event.addKey("Reference3",this.data.r3);
//								ghostObj.event.addKey("Reference4",this.data.r4);
								ghostObj.event.play();
							};
						};
						var move = function(){//なでられ反応関数
							var count = 0;
							return function(){
								count += 1;
								if(count > 50){
									ghostObj.event.addKey("ID","OnMouseMove");
//									ghostObj.event.addKey("Reference3",this.data.r3)
//									ghostObj.event.addKey("Reference4",this.data.r4)
									ghostObj.event.play();
									this.count = 0;
								}
								setTimeout(function(){count = 0;},1000);
							};
						};
						for(var i = 0; i < surface.collision.length; i += 1){
							$("#" + PID + ">.scope" + curScope + ">.collision").append(
								$("<div>")
								.addClass(surface.collision[i][4] + " collision" + i)
								.css("left",surface.collision[i][0] + "px")
								.css("top",surface.collision[i][1] + "px")
								.width(surface.collision[i][2] - surface.collision[i][0] + "px")
								.height(surface.collision[i][3] - surface.collision[i][1] + "px")
								.click(function(){$("#" + PID).append($("#" + PID + ">.scope" + curScope));})//さわられ。今回は最前面移動のみ。
								.mousemove(move())//マウスなでられ
								.bind("touchmove",move())//iOSなでられ
								.bind("dblTap",dbltouch())//マウス＆タップ共通つつかれ
							);
						}
					}
					//SERIKOアニメの発動タイミングの登録
					timing.clearAll();
					if(typeof namedObj.nar.shell[curShell].surface[curSurface].interval === "undefined") return surfaceObj;
					var todo = [];
					for(var i = 0;i < namedObj.nar.shell[curShell].surface[curSurface].interval.length;i += 1){
						if(namedObj.nar.shell[curShell].surface[curSurface].interval[i].type === "sometimes"){
							todo.push({
								id:i
								,scopeObj:scopeObj
								,curScope:curScope
								,task:function(){surfaceObj.playAnimation(this.curScope,this.id);}
							});
							timing.setSometimes(function(){
								todo[0].task();
							});
						}else if(namedObj.nar.shell[curShell].surface[curSurface].interval[i].type === "runonce"){
							surfaceObj.playAnimation(curScope,i);
						}
					}
					return surfaceObj;	
				};
			})();
			scopeObj.blimp = (function(){
				var curBlimp= 0;
				var blimpObj = {};
				blimpObj.addText = function(str){
					$("#" + PID + ">.scope" + curScope + ">.blimp>.text").html(
						$("#" + PID + ">.scope" + curScope + ">.blimp>.text").html() + str
					);
					return blimpObj;
				};
				blimpObj.clearText = function(){
					$("#" + PID + ">.scope" + curScope + ">.blimp>.text").html("");
					return blimpObj;
				};
				return function(num){
					if(typeof num === "undefined") return blimpObj;
					if(isNumber(num)){
						if(Number(num) === -1){
							$("#" + PID + ">.scope" + curScope + ">.blimp").css("visibility","hidden");
						}else{
							curBlimp = Number(num);
							$("#" + PID + ">.scope" + curScope + ">.blimp").css("visibility","visible");
						}
					}else return blimpObj;
					//balloonsurfaceの再描画
					var task = delayTask();
					var img = new Image();
					var img2 = new Image();
					img.src = "../mobilemaster/switch_L/balloons0.png";
					task.add({
						curScope:curScope
						,img:img
						,task:function(){
							base($("#" + PID + ">.scope0>.blimp>canvas")[0],this.img.canvas);
							$("#" + PID + ">.scope0>.blimp>.text")
								.width(this.img.width - 30 + "px")
								.height(this.img.height - 30 + "px")
								.css("margin",15 + "px");
						}
					});
					img.onload = function(){this.canvas = transImg(this);task.work();};
					img2.src = "../mobilemaster/switch_L/balloonk1.png";
					task.add({
						curScope:1
						,img:img2
						,task:function(){
							base($("#" + PID + ">.scope" + this.curScope + ">.blimp>canvas")[0],this.img.canvas);
							$("#" + PID + ">.scope" + this.curScope + ">.blimp>.text")
								.width(this.img.width - 30 + "px")
								.height(this.img.height - 30 + "px")
								.css("margin",15 + "px");
						}
					});
					img2.onload = function(){this.canvas = transImg(this);task.work();};
					return blimpObj;//namedObj.scope().surface().playAnimation();とするため
				};
			})();
			return scopeObj;
		};
		return function(num){
			if(typeof num === "undefined") return scopeList[curScope];
			if(isNumber(num)) curScope = Number(num);
			if(typeof scopeList[curScope] === "undefined"){
				scopeList[curScope] = scope();//scopeの新規作成
				$("#" + PID).prepend(
					$("<div>").addClass("scope scope" + curScope).append(
						$("<canvas>").attr("width","0").attr("height","0")
						,$("<div>").addClass("collision")
						,$("<div>").addClass("blimp").append(
							$("<canvas>").attr("width","0").attr("height","0")
							,$("<div>").addClass("text")
						)
					)
					.css("bottom","0px")
					.css("left", 190 - 200 * curScope + "px")
				);
			}
			$("#" + PID).append($("#" + PID + ">.scope" + curScope));//カレントスコープを前面に移動
			return scopeList[curScope];

		};
	})();
	namedObj.script = (function(){
		var script;
		var tid = 0;
		var wait = 50;
		return function(str){
			if(typeof str !== "undefined") script = str;
			if(typeof script !== "string") return;
			wait = 50;
			if(script.substr(0,1) === "\\"){
				if(script.substr(0,2) === "\\0"){
					namedObj.scope(0);
					script = script.substr(2);
					wait = "";
				}else if(script.substr(0,2) === "\\1"){
					namedObj.scope(1);
					script = script.substr(2);
					wait = "";
				}else if(script.substr(0,2) === "\\n"){
					namedObj.scope().blimp().addText("<br>");
					script = script.substr(2);
					wait = "";
				}else if(script.match(/^\\s\[\d*\]/)){
					namedObj.scope().surface(2);
//					script = script.replace(/^\\s\[\d*\]/,"");
					wait = "";
				}
			}
			if(script.length !== 0){
				if(isNumber(wait)){
					//$("body").append().append("<br>");
					namedObj.scope().blimp(0).addText(script.substr(0,1));
					script = script.substr(1);
				}else{
					wait = 0;
				}
				tid = setTimeout(arguments.callee,wait);
			}else{
				tid = setTimeout(function(){
					namedObj.scope(0).blimp(-1).clearText();
					namedObj.scope(1).blimp(-1).clearText();
				},5000);
			}
			
		};
	})();
	namedObj.event = (function(){
		var eventObj = {};
		var key = {};
		eventObj.addKey = function(a,b){
			key[a] = b;
			return eventObj;
		};
		eventObj.play = function(){
			namedObj.script(shiori(key));
			key = {};
			return eventObj;
		};
		return eventObj;
	})();
	$("body").append($("<div>").attr("id",PID).addClass("named"));//namedのDOMを作る処理(PIDで指定)
	return namedObj;
};


/////////////////////////////////////////////////////////////////
})();

(function(){
window.shiori = function(key){
	if(typeof key.ID === "undefined") return "";
	var script;
	if(key.ID === "OnBoot"){
		script = "\\0\\s[43]\\w8\\w6\\w6イクサイスゼロ…\\w3\\[77]参上っ！\\w6\\1元気の良い事で。\\w8\\e";
	}else if(key.ID === "OnMouseClick"){
	}else if(key.ID === "OnMouseDoubleClick"){
		if(key.Reference3 === 0){//0つつかれ
			if(key.Reference4 === Head){//0Headつつかれ
			}else if(key.Reference4 === HeadEX){//0HeadEXつつかれ
				script = "\\0\\s[32]…\\w3！！\\w8ううぅ、\\w6\\w4なんで叩くかな…\\w3。\\w8\\w6\\e";
			}
		}
	}else if(key.ID === "OnMouseMove"){
		if(key.Reference3 === 0){//0なでられ
			if(key.Reference4 === Head){//0Headなでられ
				script = "\\0なでられてる？\\w8\\e";
				script = "\\0\\s[5]帽子が邪魔で良くわからないな…\\w3。\\w8\\e";
				script = "\\0\\s[1]…\\w3。\\w8\\e";
				script = "\\0\\s[5]そうだ、\\w6ちょっと帽子とるから…\\w3ね？\\w8\\s[30]\\e";
			}else if(key.Reference4 === HeadEX){//0HeadEXなでられ
				script = "\\0\\s[31]えへへ…\\w3。\\1こうしてるとカワイイんじゃがのぉ…\\w3。\\w8\\0…\\w3今は聞き流してあげる。\\w8\\e";
			}
		}
	}else if(key.ID === "OnRandomTalk"){
	}
	return script;
};
})();
