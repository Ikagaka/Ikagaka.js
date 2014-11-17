(function(){
// 如何かver0.6
// ゴーストオブジェクトの定義

//コンストラクタ
this.Named = function(){

		//メンバ変数の初期値
		this.PID = new Date().getTime();//プロセスIDもといスレッドID
		this.Nar = {};//narオブジェクト
		this.curShell = "master";//カレントシェル
		this.curBalloon = "master";//カレントバルーン
		this.curScope = 0;//カレントスコープ
		this.curSurface = [];//カレントスコープのカレントサーフェス
		this.curBlimp = [];//カレントスコープのカレントブリンプ
		//↓serikoTID[スコープ][アニメーションID] = [tid];
		this.serikoTID = [];//カレントスコープのカレントサーフェスのn番目のアニメーションのsetIntervalのtimerID
		this.curZindex = 0;//カレントスコープのz-indexの値（最前線のz-indexの値とも言う
		this.TID = 0;//plyScript2のsetTimeoutのtimerID

		//初期スタイル
		$("head").append(//head要素の末尾にstyle要素追加
			$("<style>")
			.attr("type" , "text/css")
			.attr("id" , "style" + this.PID)
			.html(
				"div#named" + this.PID + "," +//基礎要素と
				"div#named" + this.PID + " *" +//その子孫要素に適用
				"{" +
					"margin : 0px;" +
					"border : 1px solid #ffff00;" +
					"padding : 0px;" +
					"background-color : transparent;" +
					"overflow : visible;" +
					"visibility : inherit;" +
				"}"
			)
		);

		//基礎要素構築
		$("body").prepend(
			$("<div>")
			.attr("id","named" + this.PID)
			.addClass("named")
			.css("position","fixed")
			.css("bottom","0px")
			.css("right","0px")
			.width("100%")
			.height("100%")
			.css("visibility","hidden")
		);
}



//SakuraScriptを再生する準備をするGhostオブジェクトのメンバ関数
//ghostObj.plyScript([生SakuraScript])
//複数起動時に備えてプロトタイプ
this.Named.prototype.plyScript = function(){
	this.chgScope(0);//カレントスコープを\0に戻す
	//すべてのスコープのバルーン内クリア
	this.allClearText();
	//みたいな。スイーツ（笑）
	this.plyScript2(arguments[0]);
}

//SakuraScriptを実際に再生するGhostオブジェクトのメンバ関数
//ghostObj.plyScript2([生SakuraScript])
//やっぱりプロトタイプ
this.Named.prototype.plyScript2 = function(){
	var script = arguments[0];
	//スクリプトブレイク
	clearTimeout(this.TID);
	//ディフォルトの一文字分のウエイト
	var wait = 50;//この50ミリ病は定数にして設定できるようにすべき
	//もしSakuraScriptのタグなら（このifが処理軽減になるかも
	//さらに言うとelse ifの順番をタグの統計的登場頻度毎に最適化するともっと速くなる（今はやってないけど！
	if(script.match(/^\\/)){
		//ウエイトを　ほ　ぼ　無しにする付け焼刃
		wait = 1;
		//もしエミリ
		if(script.match(/^\\0/) || script.match(/^\\h/)){
			this.chgScope(0);
			script = script.substr(2);
		//もしテディ
		}else if(script.match(/^\\1/) || script.match(/^\\u/)){
			this.chgScope(1);
			script = script.substr(2);
		//もしエミリオその他
		}else if(script.match(/^\\p\[.*?\]/)){//\p[文字]が来ても大丈夫・・・？
			this.chgScope(script.substr(3).match(/^.*?]/)[0].substr(-1));//最短マッチできるかいな
			script = script.replace(/^\\p\[.*?\]/,'');
		//もし簡易サーフィスチェンジ
		}else if(script.match(/^\\s[0-9]/)){
			this.chgSurface(Number(script.substr(2,1)[0]));
			script = script.substr(3);
		//もしサーフィスチェンジ
		}else if(script.match(/^\\s\[.*?\]/)){//\s[文字]が来ても大丈夫・・・？
			this.chgSurface(script.substr(3).match(/^.*?]/)[0].substr(-1));//最短マッチできるかいな
			script = script.replace(/^\\s\[.*?\]/,'');
		//もしバルーンチェンジ
		}else if(script.match(/^\\b\[.*?\]/)){//\b[文字]が来ても大丈夫・・・？
			this.chgBlimp(script.substr(3).match(/^.*?]/)[0].substr(-1));//最短マッチできるかいな
			script = script.replace(/^\\b\[.*?\]/,'');
		//もしセリコ再生
		}else if(script.match(/^\\i\[.*?\]/)){//\i[文字]が来ても大丈夫・・・？
			this.plySeriko(script.substr(3).match(/^.*?]/)[0].substr(-1));//最短マッチできるかいな
			script = script.replace(/^\\i\[.*?\]/,'');
		//もし精密ウエイト
		}else if(script.match(/^\\_w\[.*?\]/)){//\_w[文字]が来ても大丈夫・・・？
			wait = Number(script.substr(3).match(/^.*?]/)[0].substr(-1));//最短マッチできるかいな
			if (wait == "NaN") wait = 1;//もし文字だったときのエスケープ処理。美しくない付け焼刃
			script = script.replace(/^\\_w\[.*?\]/,'');
		//もし簡易ウエイト
		}else if(script.match(/^\\w[1-9]/)){
			wait = Number(script.substr(2,1)*50);//この50ミリ病は定数にして設定できるようにすべき
			script = script.substr(3);
		//もし改行
		}else if(script.match(/^\\n/)){
			this.addText('<br />');//WRYYYYYYYYYYYYYYYYYYYYYYYYYYYYY
			script = script.substr(2);
		//もしバルーン内クリア
		}else if(script.match(/^\\c/)){
			this.clearText("");//WRYYYYYYYYYYYYYYYYYYYYYYYYYYYYY
			script = script.substr(2);
		//えんいー
		}else if(script.match(/^\\e/)){
			script = "";
		//もし未知のサクラスクリプト
		//デバッグのためにもそのまましゃべっちまえ！（SSPだと\e扱い？
		}else{
			//処理が普通の発話と重複していてアルゴリズムが美しくない
			this.addText(script.substr(0,1));//一文字しゃべる
			script = script.substr(1);
		}
	//もしサクラスクリプト以外の普通の文字
	}else{
		this.addText(script.substr(0,1));//一文字しゃべる
		script = script.substr(1);
	}
	var _this = this;
	//まだ文字が残っていれば
	if(script.length > 0){
		//次の処理待ち
		this.TID = setTimeout(function(){_this.plyScript2(script)},wait);
	}else{
		//スクリプトブレイク。5秒だけ待ってやる！
		this.TID = setTimeout(function(){
			//すべてのスコープのバルーン内クリア
			this.allClearText();
			//みたいな。スイーツ（笑）
		},5000);
	}
};

//カレントスコープを変更するGhostオブジェクトのメンバ関数
//ghostObj.chgScope([なんか])
//複数起動時に備えてプロトタイプ
this.Named.prototype.chgScope = function(){
	this.curScope = Number(arguments[0]);
	//もし非数
	if(this.curScope == NaN) this.curScope = 0;
	
	//もしスコープarguments[0]の基底要素が存在していなかったら既定要素を構築
	if($("div#named" + this.PID + ">div.scope").hasClass("div.scope" + this.curScope) == false){
		//デフォルトでカレントサーフィスは0
		this.curSurface[this.curScope] = 0;
		$("div#named" + this.PID).append(
			$("<div>")
			.addClass("scope" + this.curScope)
			.addClass("scope")
			.draggable()
			.append(
				$("<canvas>")
				.addClass("surface")
			)
			.append(
				$("<div>")
				.addClass("blimp")
			)
		);
	}
};

//カレントスコープのカレントサーフィスを変更するGhostオブジェクトのメンバ関数
//ghostObj.chgSurface([なんか])
//複数起動時に備えてプロトタイプ
this.Named.prototype.chgSurface = function(){
	this.curSurface[this.curScope] = Number(arguments[0]);
	//もし非数
	if(this.curSurface[this.curScope] == NaN) this.curSurface[this.curScope] = 0;
	
	//もしサーフィス非表示命令なら
	if(this.curSurface[this.curScope] == -1){
		$("div#named" + this.PID + ">div.scope" + this.curScope).css("visibility","hidden");//もちっとクールに消えてくれよ
	//もしサーフィスが定義されていれば
	}else if(this.Nar.shell[this.curShell].surface[this.curSurface[this.curScope]] instanceof object){
		$("div#named" + this.PID + ">div.scope" + this.curScope).css("visibility","visible");//もちっとクールに現れてくれよ
		//baseサーフェスの表示
		//elementの設定
		//serikoの設定
		//collisionの設定
	}
};

//カレントスコープのカレントブリンプを変更するGhostオブジェクトのメンバ関数
//ghostObj.chgBlimp([なんか])
//複数起動時に備えてプロトタイプ
this.Named.prototype.chgBlimp = function(){
	this.curBlimp[this.curScope] = Number(arguments[0]);
	//もし非数
	if(this.curBlimp[this.curScope] == NaN) this.curBlimp[this.curScope] = 0;
	
	//もしブリンプ非表示命令なら
	if(this.curBlimp[this.curScope] == -1){
		$("div#named" + this.PID + ">div.scope" + this.curScope + ">div.blimp").css("visibility","hidden");//もちっとクールに消えてくれよ
	//もしサーフィスが定義されていれば
	}else if(this.curBlimp[this.curScope] == 0){//手抜きにも程がある
		$("div#named" + this.PID + ">div.scope" + this.curScope + ">div.blimp").css("visibility","visible");//もちっとクールに現れてくれよ
	}
};

//カレントスコープのカレントサーフェスのアニメーションを再生するGhostオブジェクトのメンバ関数
//ghostObj.plySeriko([なんか])
//複数起動時に備えてプロトタイプ
this.Named.prototype.plySeriko = function(){};

//カレントスコープのカレントブリンプに文字を追加表示するGhostオブジェクトのメンバ関数
//ghostObj.addText([なんか])
//複数起動時に備えてプロトタイプ
this.Named.prototype.addText = function(){
	//もしバルーンが非表示ならば表示する
	if(this.curBlimp[this.curScope] == -1) this.chgBlimp(0);
	//発話
	$("div#named" + this.PID + ">div.scope" + this.curScope + ">div.blimp")
	.append(arguments[0])
	.scrollTop(1000);//自動スクロールのおまじない
};

this.Named.prototype.clearText = function(){
	$("div#named" + this.PID + ">div.scope" + this.curScope + ">div.blimp").html("");
};
this.Named.prototype.allClearText = function(){
	$("div#named" + this.PID + ">div.scope>div.blimp").html("");
};












})();