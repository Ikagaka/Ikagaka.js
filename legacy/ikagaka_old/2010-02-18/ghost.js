(function(){
	//コンストラクタ処理
	this.Named = function(){
		/////////////////////メンバ関数の定義とか

		//大きい動作
		this.chgShell = function(){};///当面はmaster固定
		this.chgBalloon = function(){};///当面は（ｒｙ

		//現在のスコープをチェンジするメソッド
		this.chgScope = function(_){
			this.curScope = _;
			//もしスコープ_のデフォルトサーフィスが存在してなかったら（≒未定義のスコープならば）スコープ_の基底DOMを生成
			if(typeof this.curSurface[this.curScope] == "undefined"){
				//デフォルトサーフィスは０
				this.curSurface[this.curScope] = 0;
				$("div#named" + this.PID).append(
					$("<div>")
					.addClass("scope" + this.curScope)
					.addClass("scope")
					.cleaner()
					.css("position","absolute")
					.css("display","inline-block")
					.css("-webkit-box-sizing","border-box")
					.css("box-sizing","border-box")
					.css("bottom","0px")
					.css("right","0px")
					.width("120%")
//					.height("auto")	
					.css("text-align","right")/////////これと
//					.css("border","1px solid #ff00ff")
//					.css("visibility","visible")
					.draggable()
					.append(
						$("<div>")
						.addClass("surface")
						.cleaner()
						.css("position","relative")
						.css("display","inline-block")
						.css("-webkit-box-sizing","border-box")
						.css("box-sizing","border-box")
//						.css("bottom","0px")
//						.css("right","0px")
						.css("float","right")////////////これ。rightでバルーンが左に。ひねくれてるね。
						.css("visibility","visible")
						.append(
							$("<img>")
							.addClass("base")
							.cleaner()
							.css("position","relative")
							.css("display","inline-block")
							.css("-webkit-box-sizing","border-box")
							.css("box-sizing","border-box")
//							.css("z-index",1)
//							.css("top","0px")
//							.css("left","0px")
						)
					)
					.append(
						$("<div>")
						.addClass("blimp")
						.cleaner()
						.css("position","relative")
						.css("display","inline-block")
						.css("-webkit-box-sizing","border-box")
						.css("box-sizing","border-box")
						.css("top",this.Nar.shell[this.curShell].descript["sakura.balloon.offsety"] + "px")
						.css("left",this.Nar.shell[this.curShell].descript["sakura.balloon.offsetx"] + "px")
						.css("clear","both")
						.css("visibility","visible")
						.append(
							$("<img>")
							.addClass("base")
							.cleaner()
							.css("position","relative")
							.css("display","inline-block")
							.css("-webkit-box-sizing","border-box")
							.css("box-sizing","border-box")
//							.css("top","0px")
//							.css("left","0px")
							.width("200px")
							.height("100px")
//							.css("z-index",5)
							.css("background-color","rgba(255,255,255,0.8)")
						)
						.append(
							$("<div>")
							.addClass("text")
							.cleaner()
							.css("position","absolute")
							.css("display","inline-block")
							.css("-webkit-box-sizing","border-box")
							.css("box-sizing","border-box")
							.css("top","0px")
							.css("left","0px")
							.width("100%")
							.height("100%")
//							.css("z-index",6)
							.css("text-align","left")
							.css("border","10px solid rgba(255,255,255,0)")
							.css("line-height","120%")
							.css("word-break","break-all")
						)
					)
				);
			}
		};
		//現在のスコープのサーフィスをチェンジするメソッド
		this.chgSurface = function(_){
			//もしサーフィス非表示命令なら
			if(_ == -1){
				$("div#named" + this.PID + ">div.scope" + this.curScope + ">div.surface").css("visibility","hidden");
				this.curBlimp[this.curScope] = _;
			//もし指定されたサーフィスが定義されていれば表示する。
			}else if(typeof this.Nar.shell[this.curShell].surface[_] == "object"){
				$("div#named" + this.PID + ">div.scope" + this.curScope + ">div.surface").css("visibility","visible");
				this.curSurface[this.curScope] = _;
				//baseサーフェスの表示
				$("div#named" + this.PID + ">div.scope" + this.curScope + ">div.surface>img.base")
				.attr("src",this.Nar.homeurl + this.Nar.shell[this.curShell].surface[this.curSurface[this.curScope]].src);
				//elementの表示
				//以前のサーフィスのエレメントを削除
				$("div#named" + this.PID + ">div.scope" + this.curScope + ">div.surface>img.element").remove();
				for(var i = 0;i < this.Nar.shell[this.curShell].surface[this.curSurface[this.curScope]].element.length;i++){
					var ary = this.Nar.shell[this.curShell].surface[this.curSurface[this.curScope]].element[i];
					if(ary[0] == "base"){
						$("div#named" + this.PID + ">div.scope" + this.curScope + ">div.surface>img.base")
						.css("left",ary[2] + "px")
						.css("top",ary[3] + "px")
						.attr("src",this.Nar.homeurl + this.Nar.shell[this.curShell].dir + ary[1])
					}else if(ary[0] == "overlay"){
						$("div#named" + this.PID + ">div.scope" + this.curScope + ">div.surface").append(
							$("<img>")
							.addClass("element" + i)
							.addClass("element")
							.cleaner()
							.css("position","absolute")
							.css("display","inline-block")
							.css("-webkit-box-sizing","border-box")
							.css("box-sizing","border-box")
//							.css("z-index",2)
							.css("left",ary[2] + "px")
							.css("top",ary[3] + "px")
							.attr("src",this.Nar.homeurl + this.Nar.shell[this.curShell].dir + ary[1])
						);
					}
				}
				//serikoの設定
				//以前のサーフィスのセリコを削除
				$("div#named" + this.PID + ">div.scope" + this.curScope + ">div.surface>img.seriko").remove();
				//collisionの設定
				//以前のサーフィスのコリジョンを削除
				$("div#named" + this.PID + ">div.scope" + this.curScope + ">div.surface>div.collision").remove();
				for(var i = 0;i < this.Nar.shell[this.curShell].surface[this.curSurface[this.curScope]].collision.length;i++){
					var ary = this.Nar.shell[this.curShell].surface[this.curSurface[this.curScope]].collision[i];
					$("div#named" + this.PID + ">div.scope" + this.curScope + ">div.surface").append(
						$("<div>")
						.addClass("collision" + i)
						.addClass("collision")
						.cleaner()
						.css("position","absolute")
						.css("display","inline-block")
						.css("-webkit-box-sizing","border-box")
						.css("box-sizing","border-box")
//						.css("border","1px solid #ff00ff")
//						.css("z-index",4)
						.css("left",ary[0] + "px")
						.css("top",ary[1] + "px")
						.width(ary[2] - ary[0] + "px")
						.height(ary[3] - ary[1] + "px")
						.css("cursor","pointer")
					);
				}
			}
		};
		//現在のスコープのバルーンチェンジするメソッド
		this.chgBlimp = function(_){
			//もしバルーン非表示命令なら
			if(_ == -1){
				$("div#named" + this.PID + ">div.scope" + this.curScope + ">div.blimp").css("visibility","hidden");
				this.curBlimp[this.curScope] = _;
			//もし指定されたバルーンが定義されていれば表示する。
			}else if(1){
				$("div#named" + this.PID + ">div.scope" + this.curScope + ">div.blimp").css("visibility","visible");
				this.curBlimp[this.curScope] = _;
			}
		};
		//現在のスコープのバルーンに文字を表示するメソッド
		this.talk = function(_){
			//もしバルーンが非表示ならば表示する
			if(this.curBlimp[this.curScope] == -1) this.chgBlimp(0);
			//発話
			$("div#named" + this.PID + ">div.scope" + this.curScope + ">div.blimp>div.text")
			.append(_)
			.scrollTop(1000);//自動スクロールのおまじない
		};
		//現在のバルーンの中身
		this.text = function(_){
			if(typeof _ == "undefined"){
				return $("div#named" + this.PID + ">div.scope" + this.curScope + ">div.blimp>div.text").html();
			}else{
				return $("div#named" + this.PID + ">div.scope" + this.curScope + ">div.blimp>div.text").html(_);
			}
		};
		//現在のスコープのサーフィスのアニメーションを再生するメソッド
		this.plySeriko = function(_){
			var i = _;
			//例外処理いれとく
			$("body").append(this.Nar.shell[this.curShell].surface[this.curSurface[this.curScope]].interval[i].timing);
			for(var j = 0; j < this.Nar.shell[this.curShell].surface[this.curSurface[this.curScope]].interval[i].pattern.length; j++){
				var ary = this.Nar.shell[this.curShell].surface[this.curSurface[this.curScope]].interval[i].pattern
				$("div#named" + this.PID + ">div.scope" + this.curScope + ">div.surface").append(
					$("<img>")
				/*		.addClass("seriko" + i)
						.addClass("seriko" + j)//ダミー
						.addClass("seriko")
						.cleaner
						.css("position","absolute")
						.css("display","inline-block")
						.css("-webkit-box-sizing","border-box")
						.css("box-sizing","border-box")
						.css("left",ary[3] + "px")
						.css("top",ary[4] + "px")
					*/	.attr("src",this.Nar.homeurl + this.Nar.shell[this.curShell].surface[ary[1]].src)
				);
			}
		};

		//サクラスクリプトを再生するメソッド
		this.plyScript = function(_){
			this.chgScope(0);
			this.text("");
			this.plyScript2(_);
		}

		this.plyScript2 = function(_){
			var script = _;
			clearTimeout(this.TID);
			//ディフォルトの一文字分のウエイト
			var wait = 50;
			//もしサクラスクリプトのタグなら
			if(script.match(/^\\/)){
				var wait = 1;
				//もしエミリィ
				if(script.match(/^\\0/) || script.match(/^\\h/)){
					this.chgScope(0);
					script = script.substr(2);
				//もしティディ
				}else if(script.match(/^\\1/) || script.match(/^\\u/)){
					this.chgScope(1);
					script = script.substr(2);
				//もしエミリオ
				}else if(script.match(/^\\p\[\d+\]/)){
					this.chgScope(script.substr(3).match(/\d+/));
					script = script.replace(/^\\p\[\d+\]/,'');
				//もし簡易サーフィスチェンジ
				}else if(script.match(/^\\s[0-9]/)){
					this.chgSurface(Number(script.substr(2,1)[0]));
					script = script.substr(3);
				//もしサーフィスチェンジ
				}else if(script.match(/^\\s\[-?\d+\]/)){//負数含む
					this.chgSurface(Number(script.substr(3).match(/-?\d+/)[0]));
					script = script.replace(/^\\s\[-?\d+\]/,'');
				//もしバルーンチェンジ
				}else if(script.match(/^\\b\[-?\d+\]/)){//負数含む
					this.chgBlimp(Number(script.substr(3).match(/-?\d+/)[0]));
					script = script.replace(/^\\b\[-?\d+\]/,'');
				//もしセリコ再生
				}else if(script.match(/^\\i\[\d+\]/)){//負数含まない
					this.plySeriko(Number(script.substr(3).match(/\d+/)[0]));
					script = script.replace(/^\\i\[\d+\]/,'');
				//もし改行
				}else if(script.match(/^\\n/)){
					this.talk('<br />');
					script = script.substr(2);
				//もしバルーン内クリア
				}else if(script.match(/^\\c/)){
					this.text("");
					script = script.substr(2);
				//もし簡易ウエイト
				}else if(script.match(/^\\w[1-9]/)){
					var wait = Number(script.substr(2,1)*50);
					script = script.substr(3);
				//もし精密ウエイト
				}else if(script.match(/^\\_w\[\d+\]/)){
					var wait = Number(script.substr(4).match(/^\d+/));
					script = script.replace(/^\\_w\[\d+\]/,'');
				//えんいー
				}else if(script.match(/^\\e/)){
					script = "";
				//もし未知のサクラスクリプト
				}else{
					this.talk(script.substr(0,1));//しゃべる
					script = script.substr(1);
				}
			//もしサクラスクリプト以外の普通の文字
			}else{
				this.talk(script.substr(0,1));//しゃべる
				script = script.substr(1);
			}
			var _this = this;
			if(script.length > 0){
				this.TID = setTimeout(function(){_this.plyScript2(script)},wait);
			}else{
				//スクリプトブレイク
			}
		};

		/////////////////////始めにやるべき事とか

		//プロセスID
		this.PID = new Date().getTime();

		//初期値
		this.Nar = {};
		this.curShell = "master";
		this.curBalloon = "master";
		this.curScope = 0;
		this.curSurface = [];
		this.curBlimp = [];
		this.TID = 0;

		//ベースDOM構築
		$("body").prepend(
			$("<div>")
			.cleaner()
			.attr("id","named" + this.PID)
			.addClass("named")
			.css("position","fixed")
			.css("-webkit-box-sizing","border-box")
			.css("box-sizing","border-box")
			.css("bottom","0px")
			.css("right","0px")
			.width("100%")
			.height("100%")
			.css("visibility","hidden")
		);
	};
})();