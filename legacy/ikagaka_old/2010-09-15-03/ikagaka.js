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
		if(typeof Number(num) === "number" && isFinite(Number(num))) return true;
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
			if(Math.random() > 0.5) work();
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
									base($(this)[0],transImg(that.img));
									$(this).dequeue();
								}).delay((function(){
									if(that.aniSurfaceNum === -1) return that.wait;
									return 1;
								})());
							}
						});
						img[i].onload = function(){task.work();};
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
									overlay($(this)[0],transImg(that.img),that.x,that.y);//canvasからはみ出たらエラーでる
									$(this).dequeue();
								}).delay(this.wait);//SERIKOのウエイト
							}
						});
						img2[i].onload = function(){task.work();};
					}
				};
				return function(num){
					if(typeof num === "undefined") return surfaceObj;
					if(isNumber(num)) curSurface = Number(num);
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
							base($("#" + PID + ">.scope" + this.curScope + ">canvas")[0],transImg(this.img));
						}
					});
					img.onload = function(){task.work();};
					//エレメント合成
					//当たり判定の作成
					$("#" + PID + ">.scope" + curScope + ">.collision").empty();
					if(typeof surface.collision !== "undefined"){
						for(var i = 0; i < surface.collision.length; i += 1){
							$("#" + PID + ">.scope" + curScope + ">.collision").append(
								$("<div>")
								.addClass(surface.collision[i][4] + " collision" + i)
								.css("left",surface.collision[i][0] + "px")
								.css("top",surface.collision[i][1] + "px")
								.width(surface.collision[i][2] - surface.collision[i][0] + "px")
								.height(surface.collision[i][3] - surface.collision[i][1] + "px")
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
				var curBlimp = 0;
				var blimpObj = {};
				blimpObj.text = function(str){
					if(typeof num === "undefined") return blimpObj;
					if(isNumber(num)) curBlimp = Number(num);
				};
				return function(num){
					return blimpObj;
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
					.css("right",250 * curScope + "px")
				);
			}
			$("#" + PID).append($("#" + PID + ">.scope" + curScope));//カレントスコープを前面に移動
			return scopeList[curScope];

		};
	})();
	$("body").append($("<div>").attr("id",PID).addClass("named"));//namedのDOMを作る処理(PIDで指定)
	return namedObj;
};


/////////////////////////////////////////////////////////////////
})();