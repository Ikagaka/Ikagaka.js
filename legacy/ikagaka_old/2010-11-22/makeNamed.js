$("head").append("<style>.named *{position:absolute;border:0px solid black;margin:0px;padding:0px;}<\/style>");//共通スタイル
var makeNamed = function(){
	var PID = Math.floor(Math.random() * new Date().getTime());
	$("body").append($("<div>").attr("id",PID).addClass("named"));//rootとなるDOMを追加
	var curShell = "master";
	var namedObj = {};
	namedObj.nar = {};
	namedObj.shiori = function(){};
	////////////////////////////////////////////////////////////////////////////////////////
	namedObj.loadSurface = function(alias,callback){//スクリプト再生前の任意サーフェスロード
		var num;
		try{//サーフェスエイリアスの決定
			num = Number(namedObj.nar.shell[curShell]["sakura.surface.alias"][alias][parseInt(Math.random() * 10,10) % namedObj.nar.shell[curShell]["sakura.surface.alias"][alias].length]);
		}catch(e){//サーフェスエイリアスが定義されていない
			num = Number(alias);
		}
		if(! isFinite(num)){//もし怪しい数
			setTimeout(callback,0);
			return undefined;
		}
		var loading = 0;
		var surface = namedObj.nar.shell[curShell].surface;
		if(typeof surface[num].src !== "undefined" || toString.call(surface[num].canvas) === "[object HTMLCanvasElement]"　|| toString.call(surface[num].canvas) === "[object HTMLImageElement]"){//もしベースサーフェスが実在したら（エレメント合成だけの非実在サーフェスというのがこの世には存在するのです） or ロード中orロード済み
			try{//ベースサーフィスロード
				surface[num].canvas = new Image();
				surface[num].canvas.src = namedObj.nar.homeurl + surface[num].src;
				surface[num].canvas.onload = (function(){
					loading += 1;
					var _surfaceN = surface[num];
					return function(){
						loading -= 1;
						var canvas = $("<canvas>").attr("width",this.width).attr("height",this.height)[0];
						canvas.getContext("2d").drawImage(this,0,0);
						_surfaceN.canvas = transCanvas(canvas);//透明化
						if(loading <= 0){
							callback();
						}
					};
				})();
			}catch(e){//ベースサーフェスのロードに失敗
				console.log("ベースサーフェスのロードに失敗。理由→" + e.toString());
			}
		}
		if(typeof surface[num].element !== "undefined"){//もしエレメントが定義されていたら
			try{//エレメント画像のロード
			}catch(e){//エレメント画像のロードに失敗
				console.log("エレメント画像のロードに失敗。理由→" + e.toString());
			}
		}
		if(typeof surface[num].animation !== "undefined"){//もしSERIKO,MAYURAが定義されていたら
			try{//SERIKO、MAYURA画像のロード
				for(var i = 0; i < surface[num].animation.length; i++){
					if(typeof surface[num].animation[i] === "undefined"){
						continue;
					}
					for(var j = 0; j < surface[num].animation[i].pattern.length; j++){
						if(surface[num].animation[i].pattern[j][0] === "alternativestart"){
							continue;
						}
						if(surface[num].animation[i].pattern[j][1] === -1){//オーバーレイ非表示は無視
							continue;
						}
						if(typeof surface[surface[num].animation[i].pattern[j][1]] === "undefined"){
							continue;
						}
						if(toString.call(surface[surface[num].animation[i].pattern[j][1]].canvas) === "[object HTMLCanvasElement]"　|| toString.call(surface[surface[num].animation[i].pattern[j][1]]) === "[object HTMLImageElement]"){//もしロード中orロード済み
							continue;
						}
						surface[surface[num].animation[i].pattern[j][1]].canvas = new Image();
						surface[surface[num].animation[i].pattern[j][1]].canvas.src = namedObj.nar.homeurl + surface[surface[num].animation[i].pattern[j][1]].src;
						surface[surface[num].animation[i].pattern[j][1]].canvas.onload = (function(){
							loading += 1;
							var _surfaceN = surface[surface[num].animation[i].pattern[j][1]];
							return function(){
								loading -= 1;
								var canvas = $("<canvas>").attr("width",this.width).attr("height",this.height)[0];
								canvas.getContext("2d").drawImage(this,0,0);
								_surfaceN.canvas = transCanvas(canvas);//透明化
								if(loading <= 0){
									callback();
								}
							};
						})();
					}
				}
			}catch(e){//SERIKO、MAYURA画像のロードに失敗
				console.log(namedObj.nar.homeurl+surface[num].src+": SERIKO、MAYURA画像のロードに失敗。理由→" + e.toString());
			}
		}
		if(loading <= 0){//もし何もロードするものがなかったら
			setTimeout(callback,0);
		}
		return num;
	};
	////////////////////////////////////////////////////////////////////////////////////////
	namedObj.playScript = (function(){
		var tidAry = [];
		var taskAry = [];
		var loading = 0;
		var talking = false;
		var timeCritical = false;
		return function(script){//サクラスクリプト解析、関数配列生成、そしてその実行トリガー
			if(typeof script !== "string" || timeCritical){
				return false;
			}
			while(tidAry.length > 0){
				clearTimeout(tidAry.shift());
			}
			taskAry = [];
			loading = 0;
			talking = true;
			timeCritical = false;
			for(var i = 0; i < scope(0).getScopeAry().length; i++){
				scope(i).blimp(-1).html("");
			}
			while(script.length > 0){
				if(script.substr(0,1) === "\\"){
					switch(script.substr(0,2)){
						case "\\0":
							taskAry.push((function(){
								return function(){
									scope(0);
									tidAry.push(setTimeout(taskAry.shift(),0));
								};
							})());
							script = script.substr(2);
							break;
						case "\\1":
							taskAry.push((function(){
								return function(){
									scope(1);
									tidAry.push(setTimeout(taskAry.shift(),0));
								};
							})());
							script = script.substr(2);
							break;
						case "\\w":
							if(isFinite(script.substr(2,1))){//もし\w0-9
								taskAry.push((function(){
									var _wait = script.substr(2,1);
									return function(){
										tidAry.push(setTimeout(taskAry.shift(),_wait * 50));
									};
								})());
								script = script.substr(3);
							}else{//無効なタグ
								script = script.substr(1);//￥削り
							}
							break;
						case "\\n":
							if(script.substr(0,8)==="\\n[half]"){
								taskAry.push((function(){
									return function(){
										scope().blimp().html(
											scope().blimp().html() + "<div style='position:relative;font-size:50%;line-hight:50%;'><br \/><\/div>"
										);
										tidAry.push(setTimeout(taskAry.shift(),0));
									};
								})());
								script = script.substr(8);
							}else{
								taskAry.push((function(){
									return function(){
										scope().blimp().html(
											scope().blimp().html() + "<br \/>"
										);
										tidAry.push(setTimeout(taskAry.shift(),0));
									};
								})());
								script = script.substr(2);
							}
							break;
						case "\\c":
							if(script.substr(0,8)==="\\c[char,"){//TODO
								script = script.substr(1);
							}else if(script.substr(0,8)==="\\c[line,"){//TODO
								script = script.substr(1);
							}else{
								taskAry.push((function(){
									return function(){
										scope().blimp().html("");
										tidAry.push(setTimeout(taskAry.shift(),0));
									};
								})());
								script = script.substr(2);
							}
							break;
						case "\\e":
							script = "";
							taskAry.push((function(){
								return function(){
									talking = false;
									timeCritical = false;
									tidAry.push(setTimeout(taskAry.shift(),0));
								};
							})());
							break;
						case "\\t":
							taskAry.push((function(){
								return function(){
									timeCritical = true;
									tidAry.push(setTimeout(taskAry.shift(),0));
								};
							})());
							script = script.substr(2);
							break;
						case "\\\\":
							taskAry.push((function(){
								return function(){
									scope().blimp().html(
										scope().blimp().html() + "\\"
									);
									tidAry.push(setTimeout(taskAry.shift(),50));
								};
							})());
							script = script.substr(2);
							break;
						default ://探索範囲を3文字に広げる
							if(script.length < 3){//もし残り3文字以下
								script = script.substr(1);//￥削り
								break;
							}
							switch(script.substr(0,3)){
								case "\\s[":
									if(script.indexOf("]") === -1){//無効なタグ（シンタックスエラー）
										script = script.substr(1);//￥削り
										break;
									}
									taskAry.push((function(){
										loading += 1;
										var _num = namedObj.loadSurface(script.slice(3,script.indexOf("]")),function(){//サーフェスプリロード
											loading -= 1;
											if(loading <= 0 && taskAry.length > 0){//スクリプト再生のトリガー。全ての画像がプリロードされた
												taskAry.shift()();
											}
										});
										return function(){
											scope().surface(_num,taskAry.shift());
										};
									})());
									script = script.substr(script.indexOf("]") + 1);
									break;
								default ://探索範囲を4文字に広げる
									switch(script.substr(0,4)){
										case "\\_w[":
											if(script.indexOf("]") === -1){//無効なタグ（シンタックスエラー）
												script = script.substr(1);//￥削り
												break;
											}
											taskAry.push((function(){
												var _wait = script.slice(4,script.indexOf("]"));
												return function(){
													tidAry.push(setTimeout(taskAry.shift(),_wait));
												};
											})());
											script = script.substr(script.indexOf("]") + 1);
											break;
										case "\\_a[":
											if(script.indexOf("]") === -1){//無効なタグ（シンタックスエラー）
												script = script.substr(1);//￥削り
												break;
											}
											taskAry.push((function(){
												var _ID = script.slice(4,script.indexOf("]"));
												script = script.substr(script.indexOf("]") + 1);
												var _str = script.slice(0,script.indexOf("\\_a"));
												return function(){
													var id = Math.floor(Math.random() * new Date().getTime());
													scope().blimp().html(
														scope().blimp().html() + "<span style='position:relative;color:blue;' class='"+id+"'>" + _str + "<\/span>"
													);
													$("."+id).css("cursor","pointer").click(function(){namedObj.playScript({"ID":"OnAnchorSelect","Reference0":_ID});});
													tidAry.push(setTimeout(taskAry.shift(),0));
												};
											})());
											script = script.substr(script.indexOf("\\_a")+3);
											break;
										default ://未知のタグ
											script = script.substr(1);//￥削り
									}
							}
					}
				}else{
					taskAry.push((function(){
						var _str = script.substr(0,1);
						return function(){
							scope().blimp().html(
								scope().blimp().html() + _str
							);
							tidAry.push(setTimeout(taskAry.shift(),50));
						};
					})());
					script = script.substr(1);
				}
			}
			taskAry.push((function(){//スクリプトブレイク
				return function(){
					talking = false;
					timeCritical = false;
					tidAry.push(setTimeout(function(){
						for(var i = 0; i < scope().getScopeAry().length; i++){
							scope(i).blimp(-1).html("");
						}
					},10000));
				};
			})());
			taskAry.push(function(){});
			if(loading <= 0 && taskAry.length > 0){//スクリプト再生のトリガー。\s[]タグなしの場合（画像プリロードなしの場合）
				taskAry.shift()();
			}
		};
	})();
	////////////////////////////////////////////////////////////////////////////////////////
	namedObj.playEvent = function(eventObj){//イベントオブジェクトを栞にリクエストし、レスポンスのサクラスクリプトをその解析器に託す。
		eventObj["Charset"]= "UTF-8";
		eventObj["Sender"]= "ikagaka";
		/*console.log("GET SHIORI/3.0");
		for(i in eventObj){
			if(eventObj.hasOwnProperty(i)){
				console.log(i + ": " + eventObj[i]);
			}
		}
		console.log("");*/
		var script = namedObj.shiori(eventObj);
		if(typeof script === "string" && script !== ""){
			/*console.log("SHIORI/3.0 200 OK");
			console.log("Value: " + script);
			console.log("");*/
			namedObj.playScript(script);
		}else{
			/*console.log("SHIORI/3.0 204 No Content");*/
		}
	};
	////////////////////////////////////////////////////////////////////////////////////////
	var scope = (function(){//スコープ状態管理オブジェクト
		var curScope = 0;//恒久的クロージャ変数なので一時的クロージャ変数の_フラグつけない
		var scopeAry = [];//これも。
		return function(num){
			if(typeof num === "undefined" || ! isFinite(Number(num))){//無効な数字は無視
				return scopeAry[curScope];
			}
			curScope = Number(num);
			if(typeof scopeAry[curScope] === "undefined"){//もし初めてのスコープ
				scopeAry[curScope] = (function(){
					$("#" + PID).prepend(//スコープDOMの新規生成
						$("<div>").addClass("scope scope" + curScope).append(
							$("<canvas>").attr("width","0").attr("height","0").css("display","block")
								.click((function(){
									var _curScope = curScope;
									return function(e){
										e.preventDefault();
										$("#" + PID).append(this.parentElement);
										$("body").append($("#" + PID)[0]);
										namedObj.playEvent({
											"ID":"OnMouseClick"
											,"Reference0":e.offsetX
											,"Reference1":e.offsetY
											,"Reference2":0
											,"Reference3":_curScope
											,"Reference4":""
										});
									};
								})())
								.dblclick((function(){
									var _curScope = curScope;
									return function(e){
										e.preventDefault();
										$("#" + PID).append(this.parentElement);
										$("body").append($("#" + PID)[0]);
										namedObj.playEvent({
											"ID":"OnMouseDoubleClick"
											,"Reference0":e.offsetX
											,"Reference1":e.offsetY
											,"Reference2":0
											,"Reference3":_curScope
											,"Reference4":""
										});
									};
								})())
								.bind("dblTap",(function(){
									var _curScope = curScope;
									return function(e){
										e.preventDefault();
										$("#" + PID).append(this.parentElement);
										$("body").append($("#" + PID)[0]);
										namedObj.playEvent({
											"ID":"OnMouseDoubleClick"
											,"Reference0":e.offsetX
											,"Reference1":e.offsetY
											,"Reference2":0
											,"Reference3":_curScope
											,"Reference4":""
										});
									};
								})())
								.mousemove((function(){
									var _curScope = curScope;
									return function(e){
										e.preventDefault();
										namedObj.playEvent({
											"ID":"OnMouseMove"
											,"Reference0":e.offsetX
											,"Reference1":e.offsetY
											,"Reference2":0
											,"Reference3":_curScope
											,"Reference4":""
										});
									};
								})())
								.bind("touchmove",(function(){
									var _curScope = curScope;
									return function(e){
										e.preventDefault();
										namedObj.playEvent({
											"ID":"OnMouseMove"
											,"Reference0":e.offsetX
											,"Reference1":e.offsetY
											,"Reference2":0
											,"Reference3":_curScope
											,"Reference4":""
										});
									};
								})())
								.bind("contextmenu",(function(){
									return function(e){
										e.preventDefault();
										$("#" + PID).append(this.parentElement);
										$("body").append($("#" + PID)[0]);
									};
								})())
							,$("<div>").addClass("collision")
							,$("<div>").addClass("blimp").append(
								$("<canvas>").attr("width","0").attr("height","0").css("display","block")
								,$("<div>").addClass("text").css("overflow-y","hidden").css("word-break","break-all")
							).css("visibility","hidden")
							.click((function(){
								return function(e){
									e.preventDefault();
									$("#" + PID).append(this.parentElement);
									$("body").append($("#" + PID)[0]);
								};
							})())
							.dblclick((function(){
								return function(e){
									e.preventDefault();
									$("#" + PID).append(this.parentElement);
									$("body").append($("#" + PID)[0]);
									namedObj.playScript("");
								};
							})())
							.bind("dblTap",(function(){
								return function(e){
									e.preventDefault();
									$("#" + PID).append(this.parentElement);
									$("body").append($("#" + PID)[0]);
									namedObj.playScript("");
								};
							})())
							.mousemove((function(){
								return function(e){
									e.preventDefault();
								};
							})())
							.bind("touchmove",(function(){
								return function(e){
									e.preventDefault();
								};
							})())
							.bind("contextmenu",(function(){
								var _curScope = curScope;
								return function(e){
									e.preventDefault();
									$("#" + PID).append(this.parentElement);
									$("body").append($("#" + PID)[0]);
									var oldScope = scope().getCurScope();
									var toggle = scope(_curScope).blimp().direction();
									if(toggle === "left"){
										scope().blimp().direction("right");
									}else if(toggle === "right"){
										scope().blimp().direction("left");
									}
									scope(oldScope);
								};
							})())
							.css("position","absolute").draggable({"cancel":"#" + PID + ">.scope" + curScope + ">.blimp>.text","start":function(){$("#" + PID).append($(this.parentElement));$("body").append($("#" + PID)[0]);}})
						).css("visibility","hidden").css("bottom","0px").css("right",250 * curScope + "px")//初期位置
						.css("position","absolute").draggable({"axis":"x","cancel":"#" + PID + ">.scope" + curScope + ">.blimp","start":function(){$("#" + PID).append($(this));$("body").append($("#" + PID)[0]);}})
					);
					return {
						////////////////////////////////////////////////////////////////////////////////////////
						"surface": (function(){
							var curSurface = -1;//恒久的クロージャ変数なので一時的クロージャ変数の_フラグつけない
							var surfaceObj = {};
							////////////////////////////////////////////////////////////////////////////////////////
							surfaceObj.playAnimation = function(num,callback){
								if(typeof num === "undefined" || ! isFinite(Number(num))){//無効な数字は無視
									setTimeout(callback,0);
									return surfaceObj;
								}
								var surface = namedObj.nar.shell[curShell].surface;
								var interval = namedObj.nar.shell[curShell].surface[curSurface].animation;
								var canvas = $("#" + PID + ">.scope" + curScope + ">canvas")[0];
								var ctx = canvas.getContext('2d');
								for(var i = 0; i < interval[num].pattern.length; i++){
									$(canvas).queue((function(){
										var _patternI = interval[num].pattern[i];
										var _surface = surface;
										return function(){
											try{//ベースを描画
												if(_patternI[1] !== -1 && _patternI[0] === "base"){
													$(canvas).attr("width",surface[_patternI[1]].canvas.width).attr("height",surface[_patternI[1]].canvas.height);
													$(canvas.parentElement).width(surface[_patternI[1]].canvas.width).height(surface[_patternI[1]].canvas.height);
													ctx.drawImage(surface[_patternI[1]].canvas,0,0);
												}else{
													$(canvas).attr("width",surface[curSurface].canvas.width).attr("height",surface[curSurface].canvas.height);
													$(canvas.parentElement).width(surface[curSurface].canvas.width).height(surface[curSurface].canvas.height);
													ctx.drawImage(surface[curSurface].canvas,0,0);
												}
											}catch(e){//ベース描画に失敗
												console.log("ベース描画に失敗。理由→" + e.toString());
											}
											try{//オーバーレイ描画
												if(_patternI[1] !== -1 && _patternI[0] === "overlay"){//オーバーレイ
													ctx.globalCompositeOperation = "source-over";
													ctx.drawImage(_surface[_patternI[1]].canvas,_patternI[3],_patternI[4]);//領域からはみ出すとINDEX_SIZE_ERROR吐くかも
												}
											}catch(e){//オーバーレイ描画に失敗
												console.log("オーバーレイ描画に失敗。理由→" + e.toString());
											}
											$(this).dequeue();
										};
									})()).delay(interval[num].pattern[i][2]);
								}
								if(typeof callback !== "undefined"){//アニメーション再生が終わったのでスクリプト再生に戻る
									$(canvas).queue((function(){
										var _callback = callback;
										return function(){
											setTimeout(_callback,0);
											$(this).dequeue();
										};
									})());
								}
							};
							////////////////////////////////////////////////////////////////////////////////////////
							return (function(){
								var tidAry = [];
								return function(num,callback){
									if(typeof num === "undefined" || ! isFinite(Number(num)) || curSurface === Number(num)){//無効な数字又は同じサーフェスは無視
										setTimeout(callback,0);
										return surfaceObj;
									}
									curSurface = Number(num);
									if(curSurface === -1){//もしサーフィス非表示
										$("#" + PID + ">.scope" + curScope).css("visibility","hidden");
										$("#" + PID + ">.scope" + curScope + ">.collision").css("display","none");
										setTimeout(callback,0);
										return surfaceObj;
									}
									$("#" + PID + ">.scope" + curScope).css("visibility","visible");
									$("#" + PID + ">.scope" + curScope + ">.collision").css("display","block");
									var surface = namedObj.nar.shell[curShell].surface;
									var canvas = $("#" + PID + ">.scope" + curScope + ">canvas")[0];
									try{//ベースサーフェスの描画
										$(canvas).attr("width",surface[curSurface].canvas.width).attr("height",surface[curSurface].canvas.height);
										$(canvas.parentElement).width(surface[curSurface].canvas.width).height(surface[curSurface].canvas.height);
										var ctx = canvas.getContext('2d');
										ctx.drawImage(surface[curSurface].canvas,0,0);
									}catch(e){//ベースサーフェスの描画に失敗
										console.log("ベースサーフェスの描画に失敗。理由→" + e.toString());
									}
									if(typeof surface[curSurface].collision !== "undefined"){//もしエレメント合成が定義されていたら
										try{//エレメント合成
										}catch(e){//エレメント合成に失敗
											console.log("エレメント合成に失敗。理由→" + e.toString());
										}
									}
									var collision = $("#" + PID + ">.scope" + curScope + ">.collision").empty();
									if(typeof surface[curSurface].collision.length !== "undefined"){//もし当たり判定が定義されていたら
										try{//当たり判定の作成
											for(var i = 0; i < surface[curSurface].collision.length; i++){
												collision.append(
													$("<div>")
														.addClass(surface[curSurface].collision[i][4] + " collision" + i)
														.css("left",surface[curSurface].collision[i][0] + "px")
														.css("top",surface[curSurface].collision[i][1] + "px")
														.css("cursor","pointer")
														.width(surface[curSurface].collision[i][2] - surface[curSurface].collision[i][0] + "px")
														.height(surface[curSurface].collision[i][3] - surface[curSurface].collision[i][1] + "px")
														.click((function(){
															var _collisionI = surface[curSurface].collision[i];
															var _curScope = curScope;
															return function(e){
																e.preventDefault();
																$("#" + PID).append(this.parentElement.parentElement);
																$("body").append($("#" + PID)[0]);
																namedObj.playEvent({
																	"ID":"OnMouseClick"
																	,"Reference0":_collisionI[0] + e.offsetX
																	,"Reference1":_collisionI[1] + e.offsetY
																	,"Reference2":0
																	,"Reference3":_curScope
																	,"Reference4":_collisionI[4]
																});
															};
														})())
														.dblclick((function(){
															var _collisionI = surface[curSurface].collision[i];
															var _curScope = curScope;
															return function(e){
																e.preventDefault();
																$("#" + PID).append(this.parentElement.parentElement);
																$("body").append($("#" + PID)[0]);
																namedObj.playEvent({
																	"ID":"OnMouseDoubleClick"
																	,"Reference0":_collisionI[0] + e.offsetX
																	,"Reference1":_collisionI[1] + e.offsetY
																	,"Reference2":0
																	,"Reference3":_curScope
																	,"Reference4":_collisionI[4]
																});
															};
														})())
														.bind("dblTap",(function(){
															var _collisionI = surface[curSurface].collision[i];
															var _curScope = curScope;
															return function(e){
																e.preventDefault();
																$("#" + PID).append(this.parentElement.parentElement);
																$("body").append($("#" + PID)[0]);
																namedObj.playEvent({
																	"ID":"OnMouseDoubleClick"
																	,"Reference0":_collisionI[0] + e.offsetX
																	,"Reference1":_collisionI[1] + e.offsetY
																	,"Reference2":0
																	,"Reference3":_curScope
																	,"Reference4":_collisionI[4]
																});
															};
														})())
														.mousemove((function(){
															var _collisionI = surface[curSurface].collision[i];
															var _curScope = curScope;
															return function(e){
																e.preventDefault();
																namedObj.playEvent({
																	"ID":"OnMouseMove"
																	,"Reference0":_collisionI[0] + e.offsetX
																	,"Reference1":_collisionI[1] + e.offsetY
																	,"Reference2":0
																	,"Reference3":_curScope
																	,"Reference4":_collisionI[4]
																});
															};
														})())
														.bind("touchmove",(function(){
															var _collisionI = surface[curSurface].collision[i];
															var _curScope = curScope;
															return function(e){
																e.preventDefault();
																namedObj.playEvent({
																	"ID":"OnMouseMove"
																	,"Reference0":_collisionI[0] + e.offsetX
																	,"Reference1":_collisionI[1] + e.offsetY
																	,"Reference2":0
																	,"Reference3":_curScope
																	,"Reference4":_collisionI[4]
																});
															};
														})())
														.bind("contextmenu",(function(){
															return function(e){
																e.preventDefault();
																$("#" + PID).append(this.parentElement.parentElement);
															};
														})())
												);
											}
										}catch(e){
										}
									}
									while(tidAry.length > 0){
										clearInterval(tidAry.shift());
									}
									if(typeof surface[num].animation !== "undefined"){//もしSERIKO,MAYURAが定義されていたら
										try{//アニメーション登録
											for(var i = 0; i < surface[curSurface].animation.length; i++){
												if(typeof surface[curSurface].animation[i] === "undefined"){
													continue;
												}
												switch(surface[curSurface].animation[i].interval){
													case "sometimes":
														tidAry.push(setInterval((function(){
															var _i = i;
															var _curScope = curScope;
															return function(){
																if(Math.random() > 0.5){//毎秒1/2の確率
																	var oldScope = scope().getCurScope();
																	scope(_curScope).surface().playAnimation(_i);
																	scope(oldScope);
																}
															};
														})(),1000));
														break;
													case "runonce":
														scope(curScope).surface().playAnimation(i,(function(){//スクリプトと同期してアニメ再生
															var _callback = callback;
															return _callback;
														})());
														callback = undefined;
														break;
													default :
														;
												}
											}										
										}catch(e){//アニメーション登録に失敗
											console.log("アニメーション登録に失敗。理由→" + e.toString());
										}
									}
									scope().blimp().direction();
									setTimeout(callback,0);
									return surfaceObj;
								};
							})();
						})()
						////////////////////////////////////////////////////////////////////////////////////////
						,"getCurScope": function(){return curScope;}
						////////////////////////////////////////////////////////////////////////////////////////
						,"getScopeAry": function(){return scopeAry;}
						////////////////////////////////////////////////////////////////////////////////////////
						,"getElement": function(){return $("#" + PID + ">.scope"+curScope)[0]}
						////////////////////////////////////////////////////////////////////////////////////////
						,"blimp": (function(){
							$("#" + PID + ">.scope>.blimp")
								.width(250+"px")
								.height(150+"px")
								.css("background-color","#DFC391")
								.css("-webkit-border-radius",20 + "px")
								.css("-moz-border-radius",20 + "px")
								.css("border-radius",20 + "px")
								.css("cursor","pointer");
							$("#" + PID + ">.scope>.blimp>.text")
								.width(250 - 30 + "px")
								.height(150 - 30 + "px")
								.css("margin",10 + "px")
								.css("padding",5 + "px")
								.css("background-color","#F4E4C3")
								.css("-webkit-border-radius",10 + "px")
								.css("-moz-border-radius",10 + "px")
								.css("border-radius",10 + "px")
								.css("cursor","auto")
								.after(
									$("<div>")
										.addClass("arrow")
										.css("position","absolute")
										.css("left","250px")
										.css("top","100px")
										.css("border-top","10px solid transparent")
										.css("border-left","20px solid #DFC391")
										.css("border-bottom","10px solid transparent")
										.after(
											$("<div>")
												.addClass("inner-arrow")
												.css("position","absolute")
												.css("left","235px")
												.css("top","100px")
												.css("border-top","10px solid transparent")
												.css("border-left","20px solid #F4E4C3")
												.css("border-bottom","10px solid transparent")
										)
								);
							var curBlimp = -1;
							var blimpObj = {};
							var direction = "left";
							blimpObj.direction = function(str){//バルーンの向き
								if(typeof str !== "undefined"){
									direction = str;
								}
								if(/*direction === "left" */curScope === 0){
									$("#" + PID + ">.scope" + curScope + ">.blimp").css("top",-100 + "px");
									$("#" + PID + ">.scope" + curScope + ">.blimp").css("left","").css("right",$("#" + PID + ">.scope" + curScope).width() - 150 + "px");
									$("#" + PID + ">.scope" + curScope + ">.blimp>.arrow").css("right","").css("border-right","").css("left","250px").css("border-left","20px solid #DFC391");
									$("#" + PID + ">.scope" + curScope + ">.blimp>.inner-arrow").css("right","").css("border-right","").css("left","235px").css("border-left","20px solid #F4E4C3");
								}else if(/*direction === "right" */curScope === 1){
									$("#" + PID + ">.scope" + curScope + ">.blimp").css("top",30 + "px");
									$("#" + PID + ">.scope" + curScope + ">.blimp").css("right","").css("left",$("#" + PID + ">.scope" + curScope).width() - 10 + "px");
									$("#" + PID + ">.scope" + curScope + ">.blimp>.arrow").css("left","").css("border-left","").css("right","250px").css("border-right","20px solid #DFC391");
									$("#" + PID + ">.scope" + curScope + ">.blimp>.inner-arrow").css("left","").css("border-left","").css("right","235px").css("border-right","20px solid #F4E4C3");
								}
								return direction;
							};
							blimpObj.html = function(str){
								if(typeof str === "undefined"){
									return $("#" + PID + ">.scope" + curScope + ">.blimp>.text").html();
								}
								$("#" + PID + ">.scope" + curScope + ">.blimp>.text").html(str).scrollTop(10000);
								if(str !== ""){
									curBlimp = 0;
									$("#" + PID + ">.scope" + curScope + ">.blimp").css("visibility","visible");
								}
								return blimpObj;
							};
							return function(num){
								if(typeof num === "undefined" || ! isFinite(Number(num)) || curBlimp === Number(num)){//無効な数字又は同じサーフェスは無視
									return blimpObj;
								}
								blimpObj.direction();
								curBlimp = Number(num);
								if(curBlimp === -1){//バルーン非表示
									 $("#" + PID + ">.scope" + curScope + ">.blimp").css("visibility","hidden");
									return blimpObj;
								}
								$("#" + PID + ">.scope" + curScope + ">.blimp").css("visibility","visible");
								//バルーンの描画
								return blimpObj;
							};
						})()
					};
				})();
			}
			$("#" + PID).append($("#" + PID + ">.scope" + curScope));//カレントスコープを前面に移動
			return scopeAry[curScope];
		};
		namedObj.scope = scope;
	})();
	////////////////////////////////////////////////////////////////////////////////////////
	var transCanvas = function(canvas){
		try{
			var ctx = canvas.getContext('2d');
			var imgdata = ctx.getImageData(0,0,canvas.width,canvas.height);
			var r = imgdata.data[0];
			var g = imgdata.data[1];
			var b = imgdata.data[2];
			for(var i = 0; i < imgdata.data.length; i++){
				if(r === imgdata.data[i] && g === imgdata.data[i+1] && b === imgdata.data[i+2]){
					imgdata.data[i+3] = 0;
				}
				i += 3;
			}
			ctx.putImageData(imgdata,0,0);
		}catch(e){
			//console.log("透明化に失敗。理由→" + e.toString());
		}
		return canvas;
	};
	////////////////////////////////////////////////////////////////////////////////////////
	return namedObj;
};