(function(){
/////////////////////////////////////////////////////////////////

//<style>を挿入する処理
$("head").append("\
<style>\
body{\
	background-color:#0088ff;\
}\
.named *{\
	position:absolute;\
	border:0px solid black;\
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
			tid = 0;
			work = function(){};
			timerObj = {};
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
					if(typeof num === curSurface ) return surfaceObj;
					if(isNumber(num)){
						if(Number(num) === -1){
							$("#" + PID + ">.scope" + curScope).css("visibility","hidden");
							$("#" + PID + ">.scope" + curScope + ">.collision").css("display","none")
						}else{
							curSurface = Number(num);
							if(curSurface === 0){
								var a = Math.random();
								switch(true){
									case a > 0.6 : curSurface = 23; break;
									case a > 0.3 : curSurface = 22; break;
									default : curSurface = 0;
								}
							}
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
								namedObj.event.addKey("ID","OnMouseDoubleClick");
								namedObj.event.addKey("Reference3",$.data(this,"reference").r3)
								namedObj.event.addKey("Reference4",$.data(this,"reference").r4)
								namedObj.event.play();
							};
						};
						var move = function(){//なでられ反応関数
							var count = 0;
							return function(){
								count += 1;
								if(count > 50){
									namedObj.event.addKey("ID","OnMouseMove");
									namedObj.event.addKey("Reference3",$.data(this,"reference").r3)
									namedObj.event.addKey("Reference4",$.data(this,"reference").r4)
									namedObj.event.play();
									count = 0;
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
								.dblclick(dbltouch())
								.bind("dblTap",dbltouch())//マウス＆タップ共通つつかれ
							);
							$.data($("#" + PID + ">.scope" + curScope + ">.collision>.collision" + i)[0],"reference",{r3: Number(curScope),r4: surface.collision[i][4]});
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
					).scrollTop(10000);
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
							,$("<div>").addClass("text").css("overflow-y","hidden")
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
		var script = "";
		var tid = 0;
		var wait = 50;
		var talking = false;
		return function(str){
			clearTimeout(tid);
			tid = 0;
			if(typeof str !== "undefined" && ! talking){
				namedObj.scope(1).blimp(-1).clearText();
				namedObj.scope(0).blimp(-1).clearText();
				script = str;
				talking = true;
			}
			if(typeof script !== "string" ) return;
			wait = 50;
			if(script.substr(0,1) === "\\"){
//				$("body").append(script).append("<br>");
				wait = 1;
				if(script.match(/^\\w[1-9]/)){
					wait = script.substr(2,1)*50;
					script = script.substr(3);
				}else if(script.match(/^\\s\[-?\d+\]/)){
					wait = 1000;
					namedObj.scope().surface(script.substr(3).match(/-?\d+/)[0]);
					script = script.replace(/^\\s\[-?\d+\]/,"");
				}else if(script.substr(0,2) === "\\0"){
					namedObj.scope(0);
					script = script.substr(2);
				}else if(script.substr(0,2) === "\\1"){
					namedObj.scope(1);
					script = script.substr(2);
				}else if(script.match(/^\\n\[half\]/)){
					namedObj.scope().blimp().addText("<br>");
					script = script.replace(/^\\n\[half\]/,'');
				}else if(script.substr(0,2) === "\\n"){
					namedObj.scope().blimp().addText("<br>");
					script = script.substr(2);
				}else if(script.match(/^\\_w\[\d+\]/)){
					wait = script.substr(4).match(/^\d+/)[0];
					script = script.replace(/^\\_w\[\d+\]/,'');
				}else if(script.match(/^\\_a\[.+\].+\\_a/)){
					namedObj.scope().blimp(0).addText("<mark style='color:blue;'>"+script.substr(4).match(/^.+?\]/)[0].replace(/]/,"")+"</mark>");
					script = script.replace(/^\\_a\[.+\].+\\_a/,'');
				}else if(script.substr(0,2) === "\\c"){
					namedObj.scope().blimp().clearText();
					script = script.substr(2);
				}else if(script.match(/^\\e/)){
					script = "";
				}else{
					namedObj.scope().blimp(0).addText(script.substr(0,1));
					script = script.substr(1);
				}
			}else{
				namedObj.scope().blimp(0).addText(script.substr(0,1));
				script = script.substr(1);
			}
			if(script.length > 0){
				tid = setTimeout(arguments.callee,Number(wait));
			}else{
				talking = false;
				tid = setTimeout(function(){
					clearTimeout(tid);
					tid = 0;
					namedObj.scope(0).blimp(-1).clearText();
					namedObj.scope(1).blimp(-1).clearText();
				},10000);
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
			var script = shiori(key);
			if(typeof script === "string")namedObj.script(script);
			key = {};
			eventObj = {};
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
		script = "\\1\\s[10]\\0\\s[43]\\w8\\w6\\w6イクサイスゼロ…\\w3\\s[77]\\_w[100]参上っ！\\w6\\_w[72]\\n\\n[half]\\_w[6]\\1元気の良い事で。\\_w[48]\\e";
	}else if(key.ID === "OnMouseDoubleClick"){
		if(key.Reference3 === 0){//0つつかれ
			if(key.Reference4 === "Head"){//0Headつつかれ
			}else if(key.Reference4 === "HeadEX"){//0HeadEXつつかれ
				script = "\\0\\s[0]\\0\\s[32]…\\w3！！\\w8\\_w[18]\\nううぅ、\\_w[24]\\w4なんで叩くかな…\\w3。\\_w[54]\\w6\\n\\s[3]\\e"
			}else if(key.Reference4 === "Bust"){
				if(typeof countCB === "undefined") countCB = 0 ;//ごめんなさい今度からはチャンとクロージャで実装しますorz
				countCB += 1;
				if(countCB === 1){
					script = "\\0\\s[0]\\1\\s[10]\\1\\n[half]\\_w[6]\\0つついた…\\w3？\\_w[36]\\e";
				}else if(countCB === 2){
					script = "\\0\\s[4]…\\w3つついたね？\\w8\\_w[42]\\n…\\w3二回もつついたね？\\w8\\_w[60]\\n\\s[7]主任にもつつかれたこと無いのにっ！\\w8\\_w[102]\\n\\n[half]\\_w[6]\\1\\s[12]そんな叔父、\\_w[36]問題です！\\_w[30]\\e";
				}else if(countCB === 3){
					script = "\\1\\s[10]\\0\\s[7]～～～～～…\\w3！\\w6\\_w[42]\\n\\n[half]\\_w[6]\\1その服…\\w3\\w4衝撃には強いんじゃが。\\_w[90]\\w4\\n触られるだけなら感触はそのまま伝わるらしいぞ。\\_w[138]\\w8\\n\\n[half]\\_w[6]\\0余計な事言わないの！\\_w[60]\\e";
				}else if(countCB === 4){
					script = "\\1\\s[10]\\0\\s[4]そろそろ身の危険を感じて良いですか。\\_w[108]\\e";
				}else if(countCB === 5){
					script = "\\0\\s[73]ユーザーさん、\\_w[18]成敗ッ！\\w6\\_w[24]\\n\\n[half]\\_w[6]\\1\\s[17]巻き込まれ！\\_w[36]\\e";
					countCB = 0;
				}
//				setTimeout(function(){countCB = 0;},30000);
			}else if(key.Reference4 === "Face"){
				if(typeof countCF === "undefined") countCF = 0 ;//ごめんなさい今度からはチャンとクロージャで実装しますorz
				countCF += 1;
				if(countCF === 4){
					script = "\\1\\s[10]\\0\\s[4]うぅー。\\_w[24]家電虐待だー。\\_w[42]\\w6\\n\\n[half]\\_w[6]\\1しれっと人権放棄するようなこと言わない。\\_w[120]\\w6\\n\\n[half]\\_w[6]\\0じゃ、\\_w[18]幼女虐待だー。\\_w[42]\\w6\\n\\n[half]\\_w[6]\\1「聞こえ」は恐ろしく悪くなったな…\\w3。\\_w[108]\\e";
					countCF = 0;
				}else if(countCF === 3){
					script = "\\1\\s[10]\\0\\s[3]肌を触られるの弱いんだよー。\\_w[84]\\e";
				}else if(countCF === 2){
					script = "\\1\\s[10]\\0\\s[2]痛いってー。\\_w[36]\\e";
				}else if(countCF === 1){
					script = "\\1\\s[10]\\1\\n[half]\\_w[6]\\0\\s[1]ぅ。\\_w[12]\\e";
				}
//				setTimeout(function(){countCF = 0;},30000);
			}else if(key.Reference4 === "LeftST"){
				script = "\\0\\s[0]\\1\\s[10]\\0更新履歴だよ。\\_w[42]\\n\\n2005/12/27   報告を受けた誤記誤字脱字等を修正。\\_w[141]\\n　　　　　　 サイト移転につきＵＲＬの変更も。\\_w[135]\\n　　　　　　 ネットワーク更新をひとまず解除。\\_w[135]\\n2003/6/23　　バグを少し修正。\\_w[87]\\n2003/6/22　　ゴースト「イクサイス・\\w3ゼロ・\\w3」\\_w[129]\\n　　　　　　 正式版リリース。\\_w[87]\\e";
			}
		}
	}else if(key.ID === "OnMouseMove"){
		if(key.Reference3 === 0){//0なでられ
			if(key.Reference4 === "Head"){//0Headなでられ
				if(typeof countHOGE === "undefined") countHOGE = 0 ;//ごめんなさい今度からはチャンとクロージャで実装しますorz
				countHOGE += 1;
				if(countHOGE === 1){
					script = "\\0\\s[0]\\1\\s[10]\\0なでられてる？\\_w[42]\\e";
				}else if(countHOGE === 2){
					script = "\\0\\s[5]帽子が邪魔で良くわからないな…\\w3。\\_w[96]\\e";
				}else if(countHOGE === 3){
					script = "\\0\\s[1]…\\w3。\\_w[12]\\e";
				}else if(countHOGE === 4){
					script = "\\0\\s[5]そうだ、\\_w[24]ちょっと帽子とるから…\\w3ね？\\s[30]\\_w[78]\\e";
					countHOGE = 0;
				}
//				setTimeout(function(){countHOGE = 0;},30000);
			}else if(key.Reference4 === "HeadEX"){//0HeadEXなでられ
				if(Math.random() > 0.5){
					script = "\\0\\s[31]えへへ…\\w3。\\_w[30]\\n\\n[half]\\_w[6]\\1こうしてるとカワイイんじゃがのぉ…\\w3。\\_w[108]\\n\\n[half]\\_w[6]\\0…\\w3今は聞き流してあげる。\\_w[72]\\e";
				}else{
					script = "\\0\\s[31]えへへっ。\\_w[30]\\n\\n[half]\\_w[6]\\1猫みたいなヤツじゃなー。\\_w[72]\\e";
				}
			}else if(key.Reference4 === "Face"){
				script = "\\0\\s[0]\\0\\s[3]うう、\\_w[18]顔筋なぞらないでよー。\\_w[66]\\e"
			}else if(key.Reference4 === "Bust"){
				if(typeof countBust === "undefined") countBust = 0 ;//ごめんなさい今度からはチャンとクロージャで実装しますorz
				countBust += 1;
				if(countBust === 1){
					script = "\\1\\s[10]\\0\\s[0]…\\w3…\\w3。\\_w[18]\\e";
				}else if(countBust === 2){
					script = "\\1\\s[10]\\0も\\_w[6]\\n\\n[half]\\_w[6]\\1揉むほど無いですぞ。\\_w[60]\\n\\n[half]\\_w[6]\\0\\s[4]先に言わないでー。\\_w[54]\\e";
				}else if(countBust === 3){
					script = "\\0\\s[4]それでも揉むんだね…\\w3。\\_w[66]\\e";
				}else if(countBust === 4){
					script = "\\0\\s[4]\\n\\1少しは何か感じるか？\\_w[60]\\n\\n[half]\\_w[6]\\0黙れー。\\_w[24]\\n\\n[half]\\_w[6]\\1\\s[17]び！\\_w[12]\\e";
				}else if(countBust === 5){
					script = "\\0\s[0]身にかかる火の粉は…\\w3、\\_w[66]\\n\\s[70]振り払わなければなりますまい！\\_w[90]\\n\\n[half]\\_w[6]\\1\\s[14]ノエル！\\_w[24]\\e";
					countBust = 0;
				}
//				setTimeout(function(){countBust = 0;},30000);
			}
		}
	}else if(key.ID === "OnSecondChange"){
		if(typeof countS === "undefined") countS = 0;
		countS += 1;
		if(countS > 30){
			countS = 0;
			if(typeof countM === "undefined") countM = 0;
			script = [
"\\0\\s[0]\\1\\s[10]\\1\\n[half]\\_w[6]\\0\\_a[【イクサイスユニット】]【イクサイスユニット】\\_aはいわば着るエアコン。\\_w[132]\\w6\\nとある家電メーカーの目玉商品だよ。\\_w[102]\\w6\\n私の叔父さんが所長をやってる、\\_w[90]企画開発部別室で製作されたんだ。\\_w[96]\\w8\\n\\n[half]\\_w[6]\\1別室というか、\\_w[42]変わり者を集めた離れというか。\\_w[90]\\w6\\n\\n[half]\\_w[6]\\0\\s[9]否定はしないけどね。\\_w[60]\\w6\\n\\n[half]\\_w[6]\\1お前さんも含\\_w[36]\\n\\n[half]\\_w[6]\\0\\s[74]ツバメ返し！\\1\\s[15]ちにゃ！\\_w[114]\\n\\_w[774]\\e"
,"\\0\\s[0]\\1\\s[10]\\1\\n[half]\\_w[6]\\0\\_a[【イクサイス】]【イクサイス】\\_aの持つ基本的な能力は、\\_w[108]「空調機能」と「身体強化」だよ。\\_w[96]\\w6\\n\\n「空調機能」は文字通りエアコンとしての機能で、\\_w[138]着用者およびその周りの人に快適な空間をもたらす事が可能になるよ。\\_w[192]\\w8\\n\\n「身体強化」は、\\_w[48]外界の危険から着用者の安全を守るためのもので、\\_w[138]着用者の運動神経や防御力を着ている間ずっと向上させ続けるよ。\\_w[180]\\w8\\n\\n[half]\\_w[6]\\1どのくらい強くなるんじゃったかな？\\w6\\_w[102]\\n\\n[half]\\_w[6]\\0運動神経は、\\_w[36]通常時１００の力を出せる人が１２０の力を出せるようになるくらい。\\_w[192]\\w8\\n防御力は、\\_w[30]車にはねられても一応死なないくらいかな。\\_w[120]\\w6\\n\\n[half]\\_w[6]\\1凄い事は凄いが…\\w3微妙なラインじゃな。\\_w[108]\\n\\_w[1551]\\e"
,"\\0\\s[0]\\1\\s[10]\\0ただ、\\_w[18]私の着ているユニットは、\\_w[72]\\_a[【Ｚ式】]【Ｚ式】\\_aっていうプロトタイプなんだ。\\_w[108]\\w8\\n一般に出回ってる量産型とは若干性能が違うよ。\\_w[132]\\w8\\n\\n[half]\\_w[6]\\1アレで若干と仰りマスカ。\\_w[72]\\w6\\n\\n[half]\\_w[6]\\0\\s[9]…\\w3露骨に戦闘能力あるもんね。\\_w[84]\\w6\\n\\n[half]\\_w[6]\\1どちらかというと戦闘能力の方がメインで、\\_w[120]エアコンはオマケに見えるんじゃが…\\w3。\\_w[108]\\e"
,"\\0\\s[0]\\1\\s[10]\\1買い物した後にお釣りを貰う際、\\_w[90]タイミングがずれて早く手を出してしまうと、\\_w[126]気まずい気分にならないかの？\\w8\\_w[84]\\n\\n[half]\\_w[6]\\0それはあるかもね。\\_w[54]\\w6\\n\\n[half]\\_w[6]\\1催促しているように取られるかも知れんからの。\\_w[132]\\w8\\n\\n[half]\\_w[6]\\0…\\w3…\\w3。\\_w[18]\\w8\\n\\n[half]\\_w[6]\\1どうしたんじゃ。\\_w[48]\\w6\\n\\n[half]\\_w[6]\\0\\s[3]…\\w3その格好で買い物？\\w8\\_w[60]\\n\\n[half]\\_w[6]\\1何か変なことでもあるのか？\\_w[78]\\e"
,"\\1\\s[10]\\1\\n[half]\\_w[6]\\0\\s[5]良いこと教えてあげるよ。\\_w[72]\\w6\\n\\n[half]\\_w[6]\\1何じゃ？\\w6\\_w[24]\\n\\n[half]\\_w[6]\\0\\s[0]主任の部屋の、\\_w[42]色の薄い方のタンスの裏にはヘソクリが隠してあるんだよ。\\_w[162]\\w6\\n\\n[half]\\_w[6]\\1お前ね。\\_w[24]\\w6\\nで、\\_w[12]いくらほどあったんじゃ？\\w6\\_w[72]\\n\\n[half]\\_w[6]\\0\\s[3]見たことも無いようなお金だった…\\w3。\\_w[102]\\w6\\n\\s[4]額面も読めなかった…\\w3。\\_w[66]\\w6\\n\\n[half]\\_w[6]\\1それ、\\_w[18]本当にお金？\\_w[36]\\n\\_w[711]\\e"
,"\\1\\s[10]\\1\\n[half]\\_w[6]\\0\\s[4]あ～…\\w3。\\_w[24]\\w6\\n\\n[half]\\_w[6]\\1どうかしたかの？\\w6\\_w[48]\\n\\n[half]\\_w[6]\\0全身筋肉痛…\\w3。\\_w[42]\\w6\\n\\n[half]\\_w[6]\\1お前さん、\\_w[30]運動神経 だけ\\w4 は良いはずじゃったが。\\_w[108]\\w6\\n何か激しい運動でも？\\w6\\_w[60]\\n\\n[half]\\_w[6]\\0\\s[7]何か引っかかるね…\\w3。\\_w[60]\\w6\\nまあいいよ。\\_w[36]\\w6\\n\\s[0]昨日、\\_w[18]ヒルデさんと射撃訓練をやったのですよ。\\_w[114]\\w6\\n\\n[half]\\_w[6]\\1ほうほう。\\_w[30]\\w4\\n\\n[half]\\_w[6]\\0エキサイトしていくうちに、\\_w[78]射撃回避訓練になったのですよ。\\_w[90]\\w6\\n\\n[half]\\_w[6]\\1ほうほう。\\_w[30]\\w4\\n\\n[half]\\_w[6]\\0\\s[5]さらにエキサイトして、\\_w[66]どれだけ華麗にかわすかを競い始めたのですよ。\\_w[132]\\w6\\n\\n[half]\\_w[6]\\1ふむ…\\w3。\\_w[24]\\w4\\n\\n[half]\\_w[6]\\0\\s[3]マトリックスごっこ。\\_w[60]\\w6\\n…\\w3軽く半日ぐらい。\\_w[54]\\w4\\n\\n[half]\\_w[6]\\1そりゃ、\\_w[24]疲れますがな。\\_w[42]\\w4\\nタイガーバームでも塗っときなされ。\\_w[102]\\w4\\n\\n[half]\\_w[6]\\0タイガーバーム…\\w3？\\_w[54]\\e"
,"\\0\\s[0]\\1\\s[10]\\1\\n[half]\\_w[6]\\0実は料理とか鉱石精製とか趣味だよ。\\_w[102]\\w6\\n\\n[half]\\_w[6]\\1壊滅的にヘタクソじゃが。\\_w[72]\\w6\\n\\n[half]\\_w[6]\\0\\s[7]うるさいなー。\\_w[42]\\n\\_w[246]\\e"
,"\\0\\s[0]\\1\\s[10]\\1\\n[half]\\_w[6]\\0荻月ってさ。\\_w[36]\\w4\\n\\n[half]\\_w[6]\\1ム？\\_w[12]\\n\\n[half]\\_w[6]\\0何処か行ってみたいところってある？\\w6\\_w[102]\\n\\n[half]\\_w[6]\\1ん～…\\w3。\\_w[24]\\w8\\nぶらり信州一人旅。\\_w[54]\\w6\\nちなみに「ぶらり」と「一人」ははずせんのぅー。\\_w[138]\\w4\\n\\n[half]\\_w[6]\\0\\s[7]私と一緒じゃイヤってこと？\\w4\\_w[78]\\n\\n[half]\\_w[6]\\1風情が無くなりそうじゃからな。\\_w[90]\\n\\n[half]\\_w[6]\\0むー。\\_w[18]\\e"
,"\\0\\s[0]\\1\\s[10]\\1\\n[half]\\_w[6]\\0おや…\\w3。\\_w[24]\\w6\\n\\s[5]…\\w3見て見て！　\\w6\\_w[42]\\n黒曜石の剣が落ちてるよ！\\w4ゲットゲット！　\\w6\\_w[120]\\n\\n[half]\\_w[6]\\1そのまえに、\\_w[36]持ち主がいないかどうか、\\_w[72]ちゃんと\\_a[【スキャニング】]【スキャニング】\\_aで調べておくんじゃぞ？\\w6\\_w[138]\\n\\n[half]\\_w[6]\\0\\s[5]了解、\\_w[18]了解～♪\\s[36]\\_w[24]\\e"
,"\\0\\s[0]\\1\\s[10]\\1\\n[half]\\_w[6]\\0田植えをしながら歓迎します！　\\w6\\_w[90]\\n\\s[5]ようこそ！　\\w6\\_w[36]\\n\\n[half]\\_w[6]\\1Welcomeじゃな？　\\w6\\_w[51]\\n６点。\\_w[18]　\\_w[6]\\n\\n[half]\\_w[6]\\0\\s[4]結構自身あったんだけどなぁー。\\_w[90]\\e"
,"\\0\\s[0]\\1\\s[10]\\1\\n[half]\\_w[6]\\0陶芸にいそしむ荻月。\\_w[60]\\w4\\n\\n[half]\\_w[6]\\1いそしみません。\\_w[48]\\e"
,"\\0\\s[0]\\1\\s[10]\\1\\n[half]\\_w[6]\\0病院の空気がたまらなく好き。\\_w[84]消毒用アルコールの匂いも好き。\\_w[90]\\w6\\n\\n[half]\\_w[6]\\1微妙に危なっかしい趣味ですな。\\_w[90]\\w8\\n\\n[half]\\_w[6]\\0ほら、\\_w[18]私\\_a[【アルビノ】]【アルビノ】\\_aだし、\\_w[60]イクサイスになる前は外出できない体だったでしょ？\\w8\\_w[144]\\n検査を受けに病院に行くのは、\\_w[84]唯一昼間に外出する機会だったから特別な印象があるんだ。\\_w[162]\\w6\\n\\n[half]\\_w[6]\\1ふむ…\\w3。\\_w[24]\\w6\\n\\n[half]\\_w[6]\\0\\xちなみに。\\_w[30]\\w6\\n病院に行く際に、\\_w[48]後部座席に光が入らないようにした車に乗ってたんだけど…\\w3。\\_w[168]\\w8\\nこれも変な気分がするから好きだったよ。\\_w[114]\\w6\\n\\n[half]\\_w[6]\\1それは変な子でしたね。\\_w[66]\\w6\\n今でも変な子ですが。\\_w[60]\\w6\\n\\n[half]\\_w[6]\\0\\s[70]アークインパルスッ！\\1\\s[14]あろぱるぱ…\\w3！\\_w[192]\\e"
,"\\0\\s[0]\\1\\s[10]\\1\\n[half]\\_w[6]\\0静けさや　岩にヒビ入る　蝉の声\\w6\\_w[90]\\n\\n[half]\\_w[6]\\1それは断じて静かではないと思うぞ。\\_w[102]\\w6\\n\\n[half]\\_w[6]\\0ものすごく五月蝿い時って、\\_w[78]なんか音が聞こえないような錯覚することあるじゃない。\\_w[156]\\w6\\nあれだよ～。\\_w[36]\\n\\n[half]\\_w[6]\\1む。\\_w[12]なるほど。\\_w[30]\\e"
,"\\0\\s[0]\\1\\s[10]\\1\\n[half]\\_w[6]\\0ほにゅう\\w6\\_w[24]\\n\\n[half]\\_w[6]\\1哺乳？\\w4\\_w[18]\\n\\n[half]\\_w[6]\\0しりゅう\\w6\\_w[24]\\n\\n[half]\\_w[6]\\1支流？\\w4\\_w[18]\\n\\n[half]\\_w[6]\\0ありゅう先生\\w6\\_w[36]\\n\\n[half]\\_w[6]\\1亜流先生？\\w4\\_w[30]\\n\\n[half]\\_w[6]\\0\\n\\s[4]…\\w3ダメだ！何度言っても発音できないよ！\\w8\\_w[114]\\n\\n[half]\\_w[6]\\1あ、\\_w[12]ほねゅう・\\w3汁ゅう・\\w3あるゅう先生の事か。\\_w[114]\\w8\\n\\n[half]\\_w[6]\\0\\s[7]くっ…\\w3これ見よがしに発音して…\\w3。\\_w[96]\\e"
,"\\0\\s[0]\\1\\s[10]\\1\\n[half]\\_w[6]\\0私の着てる\\_a[【Ｚ式】]【Ｚ式】\\_aイクサイスユニットには便利な機能が付いてるんだ。\\_w[198]\\w6\\n\\n[half]\\_w[6]\\1む？\\w6\\_w[12]\\n\\n[half]\\_w[6]\\0ＵＶカット。\\_w[36]\\w6\\n\\n[half]\\_w[6]\\1…\\w3。\\_w[12]\\w6\\n\\n[half]\\_w[6]\\0バカにしちゃダメだよ。\\_w[66]\\_a[【アルビノ】]【アルビノ】\\_aの人でも昼間に外出が可能になるくらい強力なんだから。\\_w[192]\\n\\_w[564]\\e"
,"\\0\\s[0]\\1\\s[10]\\1\\n[half]\\_w[6]\\0そういえば、\\_w[36]荻月ってどうして年寄り言葉で話すの？\\w6\\_w[108]\\n\\n[half]\\_w[6]\\1魂がジジイじゃからな。\\_w[66]\\w6\\n\\n[half]\\_w[6]\\0\\_a[【ジジイの魂】]【ジジイの魂】\\_a？\\_w[48]\\n\\_w[288]\\e"
,"\\0\\s[0]\\1\\s[10]\\1\\n[half]\\_w[6]\\0頑張って火に油を注ぐよ！\\w6\\_w[72]\\n\\n[half]\\_w[6]\\1加油かの。\\_w[30]\\w８点。\\_w[18]\\e"
,"\\1\\s[10]\\1\\n[half]\\_w[6]\\0\\s[25]岩は\\w8　もう\\w8　砕けない\\w8　お爺さんの\\w4拳～♪\\w6\\_w[114]\\n\\n[half]\\_w[6]\\1微妙に物騒じゃが…\\w3それはそれで切ないものがあるのぉ…\\w3。\\_w[162]\\n\\_w[297]\\e"
,"\\1\\s[10]\\1\\n[half]\\_w[6]\\0\\s[3]荻月…\\w3どうしよう～…\\w3。\\_w[66]\\w6\\n\\n[half]\\_w[6]\\1どうしたんじゃ？\\w6\\_w[48]\\n\\n[half]\\_w[6]\\0今料理してたときに、\\_w[60]キャッツアイ混ぜてみたら…\\w3\\w6その…\\w3\\w6\\s[9]困ったものが出来た…\\w3。\\_w[234]\\w8\\n\\n[half]\\_w[6]\\1\\s[11]だらずがっ！\\w6\\_w[36]\\n信じられんことしよるわー！！\\w6\\_w[84]\\n\\n[half]\\_w[6]\\0\\s[3]そんなに怒らないでよ～。\\_w[72]\\w6\\n\\n[half]\\_w[6]\\1\\s[10]捨てるわけにもいかん物が出来てたら、\\_w[108]処分するのはワシの仕事じゃぞ。\\_w[90]\\w8\\n\\n[half]\\_w[6]\\0\\s[4]う。\\_w[12]ゴメン…\\w3。\\_w[30]\\w6\\n\\_w[861]\\e"
,"\\0\\s[0]\\1\\s[10]\\0…\\w3ところで、\\_w[36]「だらず」って何…\\w3？\\w6\\_w[60]\\n\\n[half]\\_w[6]\\1鳥取の方言では有名なものじゃと思うがの。\\_w[120]\\w6\\n「たわけ」くらいの意味かのぉ。\\_w[90]\\e"
,"\\0\\s[0]\\1\\s[10]\\1\\n[half]\\_w[6]\\0次は何処に行こうかな。\\_w[66]\\w6\\n空中庭園とかいいかなぁ…\\w3。\\_w[78]\\w6\\n\\n[half]\\_w[6]\\1おまえさん、\\_w[36]そんな頻繁に世界中をどうやってまわっとるのじゃ？\\w6\\_w[144]\\n\\n[half]\\_w[6]\\0あれ？話してなかったっけ？\\w6\\_w[78]\\n殆ど\\_a[【テレポート】]【テレポート】\\_aだけど。\\_w[78]\\w6\\n\\n[half]\\_w[6]\\1ネットダイブとかは利用しないのかの？\\w6\\_w[108]\\n\\n[half]\\_w[6]\\0行ける所を増やしたいときには使うかな。\\_w[114]\\w6\\n\\_w[756]\\e"
,"\\1\\s[10]\\1\\n[half]\\_w[6]\\0\\s[5]この前メタルたわしってモンスターに遭ったよ。\\_w[132]\\w6\\n\\n[half]\\_w[6]\\1ほほう、\\_w[24]どうじゃった？\\w6\\_w[42]\\n\\n[half]\\_w[6]\\0\\s[4]逃げられた…\\w3。\\_w[42]\\w6\\n\\n[half]\\_w[6]\\1やっぱり逃げるんか…\\w3。\\_w[66]\\n\\_w[351]\\e"
,"\\0\\s[0]\\1\\s[10]\\1最近は、\\_w[24]ユーザーによるカスタマイズが進み、\\_w[102]本来の任務に付いてない\\_a[【サポートユニット】]【サポートユニット】\\_aも増えたのぉ。\\_w[168]\\w6\\n\\n[half]\\_w[6]\\0\\_a[【量産型イクサイス】]【量産型イクサイス】\\_aのサポートユニット、\\_w[120]\\_a[【千台】]【千台】\\_aのこと？\\w6\\_w[48]\\n\\n[half]\\_w[6]\\1そうそう。\\_w[30]\\w6\\n武器になったりするらしいんじゃ。\\_w[96]\\w6\\n\\n[half]\\_w[6]\\0\\s[9]…\\w3それはまた、\\_w[42]随分と豪快なカスタマイズだね。\\_w[90]\\w6\\nでも一応「イクサイスの補助」にはなるのかな？\\w6\\_w[132]\\n\\n[half]\\_w[6]\\1じゃな。\\_w[24]\\w6\\n\\n[half]\\_w[6]\\0とすると監視任務のほうか。\\_w[78]\\w6\\n\\n[half]\\_w[6]\\1ああ。\\_w[18]\\w6\\nまぁ量産型は、\\_w[42]お前達試験体と違ってはるかに安定していて安全じゃ。\\_w[150]\\w6\\nサポートユニットがいなくても大した問題はないんじゃがな。\\_w[168]\\n\\_w[1419]\\e"
,"\\1\\s[10]\\1\\n[half]\\_w[6]\\0\\s[0]さて問題です。\\_w[42]\\w6\\n神が生み出してしまった最悪の兵器とは何でしょう？\\w6\\_w[144]\\n\\n[half]\\_w[6]\\1…\\w3唐突じゃな。\\_w[42]\\w4核兵器あたりかの？\\w6\\_w[54]\\n\\n[half]\\_w[6]\\0\\s[5]はずれ！\\w6\\_w[24]\\n正解はチェーンソーでしたー。\\_w[84]\\w6\\n\\n[half]\\_w[6]\\1何故に。\\_w[24]\\w6\\n\\n[half]\\_w[6]\\0「かみはバラバラになった」\\w6\\_w[78]\\n\\n[half]\\_w[6]\\1ああ、\\_w[18]確かにあのゲームでは核より強いのォ。\\_w[108]\\n\\_w[690]\\e"
,"\\1\\s[10]\\0\\s[0]…\\w3私は人間の事じゃないかと思ってるんだけどね。\\_w[138]\\w8\\n\\n[half]\\_w[6]\\1何の話じゃ？\\w6\\_w[36]\\n\\n[half]\\_w[6]\\0さっきの。\\_w[30]最強の兵器の話。\\_w[48]\\w6\\n\\n[half]\\_w[6]\\1フム…\\w3。\\_w[24]\\w6\\n\\n[half]\\_w[6]\\0核だってチェーンソーだって、\\_w[84]どっちも人が作った物だよ。\\_w[78]\\w6\\n「新たな兵器を創出する兵器」って見方をすれば、\\_w[138]最強かなって。\\_w[42]\\w6\\n\\n[half]\\_w[6]\\1「最強」よりは、\\_w[48]「最凶」のほうがしっくりきやしませんか。\\_w[120]\\w6\\n\\n[half]\\_w[6]\\0そうかも。\\_w[30]\\w6\\n\\n[half]\\_w[6]\\1まぁ、\\_w[18]何事も人間次第。\\_w[48]\\w6\\n\\n[half]\\_w[6]\\0だね。\\_w[18]\\w6\\n…\\w3で、\\_w[18]その最凶の人間が創出した兵器を纏った人間だから、\\_w[144]\\s[5]私が最強という事でひとつ。\\_w[78]\\w8\\n\\n[half]\\_w[6]\\1蛙が。\\_w[18]大海を知れ。\\_w[36]\\w6\\n\\n[half]\\_w[6]\\0\\s[7]むー。\\_w[18]ヒドイなー。\\_w[36]\\e"
,"\\0\\s[0]\\1\\s[10]\\1\\n[half]\\_w[6]\\0私は、\\_w[18]イクサイスの能力のほかにも、\\_w[84]二つの得意技を持っているんだ。\\_w[90]\\w6\\n一つは\\_a[【スキャニング】]【スキャニング】\\_a、\\_w[72]\\w4もう一つは\\_a[【テレポート】]【テレポート】\\_a。\\_w[78]\\w6\\n前者は、\\_w[24]触れたものの来歴を読み取り、\\_w[84]そして記憶する力。\\_w[54]\\w6\\n一般的にサイコメトリーと呼ばれている超能力に似てるかな。\\_w[168]\\w6\\n拾ったものの鑑定なんかに良く使ってる。\\_w[114]\\w6\\n後者はそのまま。\\_w[48]空間を飛び越える力だね。\\_w[72]\\w6\\n\\n[half]\\_w[6]\\1すぐにあちこち遊びに行く癖があるんで、\\_w[114]目付け役としては苦労が絶えませんな。\\_w[108]\\w6\\n\\n[half]\\_w[6]\\0\\s[7]持てる力を有効に利用してるだけだよー。\\_w[114]\\n\\_w[1308]\\e"
,"\\0\\s[0]\\1\\s[10]\\1\\n[half]\\_w[6]\\0不定形生物って打撃に強い印象があるけど、\\_w[120]荻月はどう？\\w6\\_w[36]\\n\\n[half]\\_w[6]\\1ワシも打撃には強いぞぃ。\\_w[72]\\w6\\nメイスぐらいへのカッパじゃからの。\\_w[102]\\w6\\n\\n[half]\\_w[6]\\0いまいち良く良くわからないね…\\w3。\\_w[96]\\w6\\n\\n試してみよう。\\_w[42]\\w8\\n…\\w3\\s[73]ハンマーフォール！\\w6\\_w[60]\\n\\n[half]\\_w[6]\\1\\s[17]あろぱるぱ…\\w3！\\w6\\_w[42]\\n\\_w[624]\\e"
,"\\0\\s[0]\\1\\s[10]\\1味もみてみよう。\\_w[48]\\w6\\n\\n[half]\\_w[6]\\0みないよ。\\_w[30]\\e"
,"\\0\\s[0]\\1\\s[10]\\1\\n[half]\\_w[6]\\0たまに雪だるまに埋まってみたくならない？\\w6\\_w[120]\\n\\n[half]\\_w[6]\\1なりません。\\_w[36]\\w6\\n\\n[half]\\_w[6]\\0\\s[28]私はなるけどなぁ…\\w3。\\_w[60]\\w6\\n\\s[0]埋まりたくなったら何時でも言ってね。\\_w[108]\\w6\\n\\n[half]\\_w[6]\\1だからならんって。\\_w[54]\\e"
,"\\0\\s[0]\\1\\s[10]\\1\\n[half]\\_w[6]\\0ペラペ～ラ！\\w6\\_w[36]\\n\\s[5]だったのデ～ス！\\w6\\_w[48]\\n\\s[0]わかったアルか？\\w6\\_w[48]\\n\\n[half]\\_w[6]\\1…\\w3？\\w6\\_w[12]\\n\\n[half]\\_w[6]\\0\\s[5]さて、\\_w[18]それぞれ何処の国の人のものまねだったでしょう？\\w6\\_w[138]\\n\\n[half]\\_w[6]\\1\\s[11]全部日本人じゃろうが！\\w6\\_w[66]\\n\\n[half]\\_w[6]\\0\\s[2]うっ、\\_w[18]正解だよ…\\w3。\\_w[36]\\e"
,"\\0\\s[0]\\1\\s[10]\\1\\n[half]\\_w[6]\\0マジックカットを見てると…\\w3\\w6\\_w[78]\\nさくさく細かく切りたくならないかな？\\w8\\_w[108]\\n\\n[half]\\_w[6]\\1プチプチも潰したくなる人かの？\\w6\\_w[90]\\n\\n[half]\\_w[6]\\0うん。\\_w[18]\\w6\\n\\n[half]\\_w[6]\\1\\s[18]\\n\\cそれは貴方の持つ破壊衝動がそうさせるのですよ。\\_w[138]\\w6\\nその衝動を満足させるべく、\\_w[78]私の教えた攻撃魔法をもっとガンガン使いましょう。\\_w[144]\\w8\\n\\n[half]\\_w[6]\\0\\s[7]イ ヤ で す よ　ー だ ！\\w6\\_w[72]\\n\\n[half]\\_w[6]\\1ケチですね。\\_w[36]\\w6\\n\\n[half]\\_w[6]\\0だったらもっと汎用性の高い魔法作ってよね…\\w3。\\_w[132]\\e"
,"\\0\\s[0]\\1\\s[10]\\1\\n[half]\\_w[6]\\0荻月って、\\_w[30]学術っぽく言うとどんな分類になるの？\\w6\\_w[108]\\n\\n[half]\\_w[6]\\1有機微小精密機械集合式霊子付与擬似生命体…\\w3ってところかのぉ。\\_w[180]\\w8\\n適当じゃが。\\_w[36]\\w6\\n\\n[half]\\_w[6]\\0\\s[4]意味不明デス。\\_w[42]\\w6\\n\\n[half]\\_w[6]\\1有機ナノマシン集合体に、\\_w[72]魂をくっつけた生物です、\\_w[72]って感じじゃな。\\_w[48]\\w8\\n魂付与は錬金術的なものに頼ってるらしいから、\\_w[132]かなり正体不明じゃと思うがな。\\_w[90]\\w8\\n\\n[half]\\_w[6]\\0\\s[0]ＡＩじゃなかったんだ？\\w6\\_w[66]\\n\\n[half]\\_w[6]\\1ああ。\\_w[18]他の\\_a[【サポートユニット】]【サポートユニット】\\_aの連中は皆ＡＩじゃがな。\\_w[144]\\w6\\nお前さんの珍妙な能力に付き合うのはＡＩじゃ大変らしいゾ。\\_w[168]\\w6\\n\\n[half]\\_w[6]\\0\\s[7]誰が珍妙だってー？\\w6\\_w[54]\\n\\_w[1356]\\e"
,"\\0\\s[0]\\1\\s[10]\\1\\n[half]\\_w[6]\\0おや、\\_w[18]こんなところにクリスタルの欠片が。\\_w[102]\\w8\\n\\n[half]\\_w[6]\\1ふむ。\\_w[18]\\w8\\n\\n[half]\\_w[6]\\0\\s[6]欠片に宿る勇者の心…\\w3\\w6\\_w[60]\\n…\\w3\\s[22]『スーパー弁護士』。\\_w[66]\\w8\\n\\n[half]\\_w[6]\\1…\\w3そんな方法でなれるものなのか…\\w3？\\_w[102]\\e"
,"\\0\\s[0]\\1\\s[10]\\1\\n[half]\\_w[6]\\0荻月って、\\_w[30]学術っぽく言うとどんな分類になるの？\\w6\\_w[108]\\n\\n[half]\\_w[6]\\1有機微小精密機械集合式霊子付与擬似生命体…\\w3ってところかのぉ。\\_w[180]\\w8\\n適当じゃが。\\_w[36]\\w6\\n\\n[half]\\_w[6]\\0\\s[4]意味不明デス。\\_w[42]\\w6\\n\\n[half]\\_w[6]\\1有機ナノマシン集合体に、\\_w[72]魂をくっつけた生物です、\\_w[72]って感じじゃな。\\_w[48]\\w8\\n魂付与は錬金術的なものに頼ってるらしいから、\\_w[132]かなり正体不明じゃと思うがな。\\_w[90]\\w8\\n\\n[half]\\_w[6]\\0\\s[0]ＡＩじゃなかったんだ？\\w6\\_w[66]\\n\\n[half]\\_w[6]\\1ああ。\\_w[18]他の\\_a[【サポートユニット】]【サポートユニット】\\_aの連中は皆ＡＩじゃがな。\\_w[144]\\w6\\nお前さんの珍妙な能力に付き合うのはＡＩじゃ大変らしいゾ。\\_w[168]\\w6\\n\\n[half]\\_w[6]\\0\\s[7]誰が珍妙だってー？\\w6\\_w[54]\\n\\_w[1356]\\e"
,"\\0\\s[0]\\1\\s[10]\\1\\n[half]\\_w[6]\\0静けさや　岩にヒビ入る　蝉の声\\w6\\_w[90]\\n\\n[half]\\_w[6]\\1それは断じて静かではないと思うぞ。\\_w[102]\\w6\\n\\n[half]\\_w[6]\\0ものすごく五月蝿い時って、\\_w[78]なんか音が聞こえないような錯覚することあるじゃない。\\_w[156]\\w6\\nあれだよ～。\\_w[36]\\n\\n[half]\\_w[6]\\1む。\\_w[12]なるほど。\\_w[30]\\e"
,"\\0\\s[0]\\1\\s[10]\\1\\n[half]\\_w[6]\\0私の着てる\\_a[【Ｚ式】]【Ｚ式】\\_aイクサイスユニットには便利な機能が付いてるんだ。\\_w[198]\\w6\\n\\n[half]\\_w[6]\\1む？\\w6\\_w[12]\\n\\n[half]\\_w[6]\\0ＵＶカット。\\_w[36]\\w6\\n\\n[half]\\_w[6]\\1…\\w3。\\_w[12]\\w6\\n\\n[half]\\_w[6]\\0バカにしちゃダメだよ。\\_w[66]\\_a[【アルビノ】]【アルビノ】\\_aの人でも昼間に外出が可能になるくらい強力なんだから。\\_w[192]\\n\\_w[564]\\e"
,"\\0\\s[0]\\1\\s[10]\\1\\n[half]\\_w[6]\\0ほにゅう\\w6\\_w[24]\\n\\n[half]\\_w[6]\\1哺乳？\\w4\\_w[18]\\n\\n[half]\\_w[6]\\0しりゅう\\w6\\_w[24]\\n\\n[half]\\_w[6]\\1支流？\\w4\\_w[18]\\n\\n[half]\\_w[6]\\0ありゅう先生\\w6\\_w[36]\\n\\n[half]\\_w[6]\\1亜流先生？\\w4\\_w[30]\\n\\n[half]\\_w[6]\\0\\n\\s[4]…\\w3ダメだ！何度言っても発音できないよ！\\w8\\_w[114]\\n\\n[half]\\_w[6]\\1あ、\\_w[12]ほねゅう・\\w3汁ゅう・\\w3あるゅう先生の事か。\\_w[114]\\w8\\n\\n[half]\\_w[6]\\0\\s[7]くっ…\\w3これ見よがしに発音して…\\w3。\\_w[96]\\e"
,"\\0\\s[0]\\1\\s[10]\\1\\n[half]\\_w[6]\\0そういえば、\\_w[36]荻月ってどうして年寄り言葉で話すの？\\w6\\_w[108]\\n\\n[half]\\_w[6]\\1魂がジジイじゃからな。\\_w[66]\\w6\\n\\n[half]\\_w[6]\\0\\_a[【ジジイの魂】]【ジジイの魂】\\_a？\\_w[48]\\n\\_w[288]\\e"
,"\\0\\s[0]\\1\\s[10]\\1\\n[half]\\_w[6]\\0頑張って火に油を注ぐよ！\\w6\\_w[72]\\n\\n[half]\\_w[6]\\1加油かの。\\_w[30]\\w８点。\\_w[18]\\e"
,"\\0\\s[0]\\1\\n[half]\\_w[6]\\0\\s[25]岩は\\w8　もう\\w8　砕けない\\w8　お爺さんの\\w4拳～♪\\w6\\_w[114]\\n\\n[half]\\_w[6]\\1微妙に物騒じゃが…\\w3それはそれで切ないものがあるのぉ…\\w3。\\_w[162]\\n\\_w[297]\\e"
,"\\0\\s[0]\\1\\n[half]\\_w[6]\\0\\s[3]荻月…\\w3どうしよう～…\\w3。\\_w[66]\\w6\\n\\n[half]\\_w[6]\\1どうしたんじゃ？\\w6\\_w[48]\\n\\n[half]\\_w[6]\\0今料理してたときに、\\_w[60]キャッツアイ混ぜてみたら…\\w3\\w6その…\\w3\\w6\\s[9]困ったものが出来た…\\w3。\\_w[234]\\w8\\n\\n[half]\\_w[6]\\1\\s[11]だらずがっ！\\w6\\_w[36]\\n信じられんことしよるわー！！\\w6\\_w[84]\\n\\n[half]\\_w[6]\\0\\s[3]そんなに怒らないでよ～。\\_w[72]\\w6\\n\\n[half]\\_w[6]\\1\\s[10]捨てるわけにもいかん物が出来てたら、\\_w[108]処分するのはワシの仕事じゃぞ。\\_w[90]\\w8\\n\\n[half]\\_w[6]\\0\\s[4]う。\\_w[12]ゴメン…\\w3。\\_w[30]\\w6\\n\\_w[861]\\e"
,"\\0\\s[0]\\1\\s[10]\\0…\\w3ところで、\\_w[36]「だらず」って何…\\w3？\\w6\\_w[60]\\n\\n[half]\\_w[6]\\1鳥取の方言では有名なものじゃと思うがの。\\_w[120]\\w6\\n「たわけ」くらいの意味かのぉ。\\_w[90]\\e"
,"\\0\\s[0]\\1\\s[10]\\1\\n[half]\\_w[6]\\0次は何処に行こうかな。\\_w[66]\\w6\\n空中庭園とかいいかなぁ…\\w3。\\_w[78]\\w6\\n\\n[half]\\_w[6]\\1おまえさん、\\_w[36]そんな頻繁に世界中をどうやってまわっとるのじゃ？\\w6\\_w[144]\\n\\n[half]\\_w[6]\\0あれ？話してなかったっけ？\\w6\\_w[78]\\n殆ど\\_a[【テレポート】]【テレポート】\\_aだけど。\\_w[78]\\w6\\n\\n[half]\\_w[6]\\1ネットダイブとかは利用しないのかの？\\w6\\_w[108]\\n\\n[half]\\_w[6]\\0行ける所を増やしたいときには使うかな。\\_w[114]\\w6\\n\\_w[756]\\e"
,"\\0\\s[0]\\1\\n[half]\\_w[6]\\0\\s[5]この前メタルたわしってモンスターに遭ったよ。\\_w[132]\\w6\\n\\n[half]\\_w[6]\\1ほほう、\\_w[24]どうじゃった？\\w6\\_w[42]\\n\\n[half]\\_w[6]\\0\\s[4]逃げられた…\\w3。\\_w[42]\\w6\\n\\n[half]\\_w[6]\\1やっぱり逃げるんか…\\w3。\\_w[66]\\n\\_w[351]\\e"
,"\\0\\s[0]\\1\\s[10]\\1最近は、\\_w[24]ユーザーによるカスタマイズが進み、\\_w[102]本来の任務に付いてない\\_a[【サポートユニット】]【サポートユニット】\\_aも増えたのぉ。\\_w[168]\\w6\\n\\n[half]\\_w[6]\\0\\_a[【量産型イクサイス】]【量産型イクサイス】\\_aのサポートユニット、\\_w[120]\\_a[【千台】]【千台】\\_aのこと？\\w6\\_w[48]\\n\\n[half]\\_w[6]\\1そうそう。\\_w[30]\\w6\\n武器になったりするらしいんじゃ。\\_w[96]\\w6\\n\\n[half]\\_w[6]\\0\\s[9]…\\w3それはまた、\\_w[42]随分と豪快なカスタマイズだね。\\_w[90]\\w6\\nでも一応「イクサイスの補助」にはなるのかな？\\w6\\_w[132]\\n\\n[half]\\_w[6]\\1じゃな。\\_w[24]\\w6\\n\\n[half]\\_w[6]\\0とすると監視任務のほうか。\\_w[78]\\w6\\n\\n[half]\\_w[6]\\1ああ。\\_w[18]\\w6\\nまぁ量産型は、\\_w[42]お前達試験体と違ってはるかに安定していて安全じゃ。\\_w[150]\\w6\\nサポートユニットがいなくても大した問題はないんじゃがな。\\_w[168]\\n\\_w[1419]\\e"
,"\\0\\s[0]\\1\\n[half]\\_w[6]\\0\\s[0]さて問題です。\\_w[42]\\w6\\n神が生み出してしまった最悪の兵器とは何でしょう？\\w6\\_w[144]\\n\\n[half]\\_w[6]\\1…\\w3唐突じゃな。\\_w[42]\\w4核兵器あたりかの？\\w6\\_w[54]\\n\\n[half]\\_w[6]\\0\\s[5]はずれ！\\w6\\_w[24]\\n正解はチェーンソーでしたー。\\_w[84]\\w6\\n\\n[half]\\_w[6]\\1何故に。\\_w[24]\\w6\\n\\n[half]\\_w[6]\\0「かみはバラバラになった」\\w6\\_w[78]\\n\\n[half]\\_w[6]\\1ああ、\\_w[18]確かにあのゲームでは核より強いのォ。\\_w[108]\\n\\_w[690]\\e"
,"\\0\\s[0]\\0\\s[0]…\\w3私は人間の事じゃないかと思ってるんだけどね。\\_w[138]\\w8\\n\\n[half]\\_w[6]\\1何の話じゃ？\\w6\\_w[36]\\n\\n[half]\\_w[6]\\0さっきの。\\_w[30]最強の兵器の話。\\_w[48]\\w6\\n\\n[half]\\_w[6]\\1フム…\\w3。\\_w[24]\\w6\\n\\n[half]\\_w[6]\\0核だってチェーンソーだって、\\_w[84]どっちも人が作った物だよ。\\_w[78]\\w6\\n「新たな兵器を創出する兵器」って見方をすれば、\\_w[138]最強かなって。\\_w[42]\\w6\\n\\n[half]\\_w[6]\\1「最強」よりは、\\_w[48]「最凶」のほうがしっくりきやしませんか。\\_w[120]\\w6\\n\\n[half]\\_w[6]\\0そうかも。\\_w[30]\\w6\\n\\n[half]\\_w[6]\\1まぁ、\\_w[18]何事も人間次第。\\_w[48]\\w6\\n\\n[half]\\_w[6]\\0だね。\\_w[18]\\w6\\n…\\w3で、\\_w[18]その最凶の人間が創出した兵器を纏った人間だから、\\_w[144]\\s[5]私が最強という事でひとつ。\\_w[78]\\w8\\n\\n[half]\\_w[6]\\1蛙が。\\_w[18]大海を知れ。\\_w[36]\\w6\\n\\n[half]\\_w[6]\\0\\s[7]むー。\\_w[18]ヒドイなー。\\_w[36]\\e"
,"\\0\\s[0]\\1\\s[10]\\1\\n[half]\\_w[6]\\0私は、\\_w[18]イクサイスの能力のほかにも、\\_w[84]二つの得意技を持っているんだ。\\_w[90]\\w6\\n一つは\\_a[【スキャニング】]【スキャニング】\\_a、\\_w[72]\\w4もう一つは\\_a[【テレポート】]【テレポート】\\_a。\\_w[78]\\w6\\n前者は、\\_w[24]触れたものの来歴を読み取り、\\_w[84]そして記憶する力。\\_w[54]\\w6\\n一般的にサイコメトリーと呼ばれている超能力に似てるかな。\\_w[168]\\w6\\n拾ったものの鑑定なんかに良く使ってる。\\_w[114]\\w6\\n後者はそのまま。\\_w[48]空間を飛び越える力だね。\\_w[72]\\w6\\n\\n[half]\\_w[6]\\1すぐにあちこち遊びに行く癖があるんで、\\_w[114]目付け役としては苦労が絶えませんな。\\_w[108]\\w6\\n\\n[half]\\_w[6]\\0\\s[7]持てる力を有効に利用してるだけだよー。\\_w[114]\\n\\_w[1308]\\e"
,"\\0\\s[0]\\1\\s[10]\\1\\n[half]\\_w[6]\\0不定形生物って打撃に強い印象があるけど、\\_w[120]荻月はどう？\\w6\\_w[36]\\n\\n[half]\\_w[6]\\1ワシも打撃には強いぞぃ。\\_w[72]\\w6\\nメイスぐらいへのカッパじゃからの。\\_w[102]\\w6\\n\\n[half]\\_w[6]\\0いまいち良く良くわからないね…\\w3。\\_w[96]\\w6\\n\\n試してみよう。\\_w[42]\\w8\\n…\\w3\\s[73]ハンマーフォール！\\w6\\_w[60]\\n\\n[half]\\_w[6]\\1\\s[17]あろぱるぱ…\\w3！\\w6\\_w[42]\\n\\_w[624]\\e"
,"\\0\\s[0]\\1\\s[10]\\1味もみてみよう。\\_w[48]\\w6\\n\\n[half]\\_w[6]\\0みないよ。\\_w[30]\\e"
,"\\0\\s[0]\\1\\s[10]\\1\\n[half]\\_w[6]\\0広島県は…\\w3宮島、\\_w[48]厳島神社の地下に神代の遺跡が残ってるって。\\_w[126]\\w6\\n\\n[half]\\_w[6]\\1また\\_a[【水希】]【水希】\\_aの奴か？\\w6\\_w[60]\\n\\n[half]\\_w[6]\\0うん。\\_w[18]\\w6\\n\\n[half]\\_w[6]\\1嘘じゃよ。\\_w[30]\\w6\\n\\n[half]\\_w[6]\\0そんなことだと思ったよ。\\_w[72]\\w6\\n調べても何処にも無かったから。\\_w[90]\\w6\\n\\n[half]\\_w[6]\\1調べたんか…\\w3。\\_w[42]\\n\\_w[546]\\e"
,"\\0\\s[0]\\1\\s[10]\\1\\n[half]\\_w[6]\\0実は料理とか鉱石精製とか趣味だよ。\\_w[102]\\w6\\n\\n[half]\\_w[6]\\1壊滅的にヘタクソじゃが。\\_w[72]\\w6\\n\\n[half]\\_w[6]\\0\\s[7]うるさいなー。\\_w[42]\\n\\_w[246]\\e"
,"\\0\\s[0]\\1\\s[10]\\1\\n[half]\\_w[6]\\0山口県には秋吉台って所があるんだよね？\\w6\\_w[114]\\n\\n[half]\\_w[6]\\1そうじゃな。\\_w[36]\\w6\\n\\n[half]\\_w[6]\\0その地下には秋芳洞ダンジョンが広がってるって本当？\\w6\\_w[150]\\n\\n[half]\\_w[6]\\1ダンジョン、\\_w[36]は余計じゃがな…\\w3。\\_w[54]\\n\\_w[429]\\e"
,"\\0\\s[0]\\1\\s[10]\\1\\n[half]\\_w[6]\\0燃料が増える…\\w3？　\\_w[54]\\e"
,"\\0\\s[0]\\1\\s[10]\\0\\s[0]\\1\\s[10]\\e"
][countM];
			countM += 1;
			if(typeof script ==="undefined") countM = 0;
		}
	}
	return script;
};
})();
