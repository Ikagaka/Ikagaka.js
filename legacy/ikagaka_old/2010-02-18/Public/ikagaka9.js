window.onerror = function(mes,file,num){ alert([ "file : " + file, "line : " + num, "message : " + mes ].join("\n")); return true; }
window.onload = IkagakaLoader;
///////////// 目次 /////////////
////	←イマココ！
//////////////////////////////// IkagakaLoader
//////////////////////////////// SurfaceLoader
//////////////////////////////// BaloonLoader
//////////////////////////////// EventManager
//////////////////////////////// SurfaceManager
//////////////////////////////// BalloonManager
//////////////////////////////// ScriptPlayer
//////////////////////////////// SurfacePlayer
//////////////////////////////// BalloonPlayer

//////////////////////////////// IkagakaLoader //////////////////////////////////

function IkagakaLoader(){
////////////如何かブートローダー

////////////ログ窓
	$("body").prepend(
		$("<textarea>")
		.attr("id","IkagakaLog")
		.css("background-color","transparent")
		.css("overflow","scroll")
		.css("position","absolute")
		.css("line-height","120%")
		.css("z-index","200")
		.width("400px")
		.height("200px")
		.css("top","10px")
		.css("left","10px")
		.css("font-size","10px")
	);
	//$("#IkagakaLog").append("【如何かブートローダー】起動。<br />\n");

//////////ロード
	SurfaceLoader();
	BalloonLoader();

//////////現在状態の初期化
	//$("#IkagakaLog").append("　現在状態の初期化開始。<br />\n");

	Scope = new Number(0);
	NowSurface = new Array();
		NowSurface[0] = Surface[0];
		NowSurface[1] = Surface[10];
	NowBalloonLR = new Array();
		NowBalloonLR[0] = 0;
		NowBalloonLR[1] = 1;
	NowBalloon = new Array();
		NowBalloon[0] = Balloon[0][NowBalloonLR[0]][0];
		NowBalloon[1] = Balloon[1][NowBalloonLR[1]][0];
	NowBalloonText = new Array();
		NowBalloonText[0] = new String();
		NowBalloonText[1] = new String();
	RemainScript = new String();
	AddScript = new String();
	Wait = new Number(0);
	Tid = new Number(0);

	//$("#IkagakaLog").append("　現在状態の初期化完了。<br />\n");

//////////基礎ＤＯＭ構築
	//$("#IkagakaLog").append("　ＤＯＭ構築開始。<br />\n");

	$("#IkagakaBase").after(
		$("<div>")
		.attr("id","Ikagaka")
		.attr("class","ikagaka")
	);

	$("#Ikagaka").prepend(
		$("<div>")
		.attr("id","IkagakaSakura")
		.attr("class","ikagaka")
	);
	$("#IkagakaSakura").prepend(
		$("<div>")
		.attr("id","IkagakaSakuraSurface")
		.attr("class","ikagaka")
	);
	$("#IkagakaSakura").prepend(
		$("<div>")
		.attr("id","IkagakaSakuraBalloon")
		.attr("class","ikagaka")
	);
	$("#IkagakaSakuraBalloon").prepend(
		$("<div>")
		.attr("id","IkagakaSakuraBalloonText")
		.attr("class","ikagaka")
	);

	$("#Ikagaka").prepend(
		$("<div>")
		.attr("id","IkagakaKero")
		.attr("class","ikagaka")
	);
	$("#IkagakaKero").prepend(
		$("<div>")
		.attr("id","IkagakaKeroSurface")
		.attr("class","ikagaka")
	);
	$("#IkagakaKero").prepend(
		$("<div>")
		.attr("id","IkagakaKeroBalloon")
		.attr("class","ikagaka")
	);
	$("#IkagakaKeroBalloon").prepend(
		$("<div>")
		.attr("id","IkagakaKeroBalloonText")
		.attr("class","ikagaka")
	);

	//$("#IkagakaLog").append("　ＤＯＭ構築完了。<br />\n");

//////////基礎ＣＳＳ設定
	//$("#IkagakaLog").append("　ＣＳＳ設定開始。<br />\n");

	$(".ikagaka")
		.css("background-repeat","no-repeat")
		.css("background-color","transparent")
		.css("margin","0px")
		.css("padding","0px")
		.css("border","0px")
		.css("overflow","visible")
		.css("line-height","100%")
		.css("text-align","left")
		.css("position","absolute")
		.css("visibility","visible")
	;

	$("#Ikagaka")
		.width("100%")
		.height("100%")
		.css("left","0px")
		.css("bottom","0px")
		.css("z-index","0")
		.css("visibility","hidden")
	;
	$("#IkagakaSakura")
		.css("left","50%")
		.css("bottom","0px")
		.css("z-index","100")
	;
	$("#IkagakaKero")
		.css("left","10%")
		.css("bottom","0px")
		.css("z-index","100")
	;

	//$("#IkagakaLog").append("　ＣＳＳ設定完了。<br />\n");

//////////タスク起動
	$("#IkagakaKero").dblclick(function(){EventManager('OnMouseDoubleClick,1')});
	SurfacePlayer();
	$("#IkagakaSakuraBalloon").click(function(){BalloonManager(0)});
	$("#IkagakaKeroBalloon").click(function(){BalloonManager(1)});
	BalloonPlayer();

	$("#IkagakaSakuraBalloon").css("visibility","hidden");
	$("#IkagakaKeroBalloon").css("visibility","hidden");
	$("#IkagakaLog").css("visibility","hidden")
//	$(".ikagaka").css("border","1px solid #FF0000");

//////////えんいー
	//$("#IkagakaLog").append("【如何かブートローダー】終了。<br />\n");

	EventManager('OnBoot','','');
}
///////////// 目次 /////////////
//////////////////////////////// IkagakaLoader
////	←イマココ！
//////////////////////////////// SurfaceLoader
//////////////////////////////// BaloonLoader
//////////////////////////////// EventManager
//////////////////////////////// SurfaceManager
//////////////////////////////// BalloonManager
//////////////////////////////// ScriptPlayer
//////////////////////////////// SurfacePlayer
//////////////////////////////// BalloonPlayer

//////////////////////////////// SurfaceLoader //////////////////////////////////

function SurfaceLoader(){
///////////サーフィス読込
	//$("#IkagakaLog").append("　【サーフィスローダー】起動。<br />\n");
	//$("#IkagakaLog").append("　　surface.txt<br />\n");

	SurfaceText = new String();
	SurfaceText = $("#surface").text();
	SurfaceText = SurfaceText.replace(/\r\n/g,"\n");
	SurfaceText = SurfaceText.replace(/\r/g,"\n");
	SurfaceTextLine = new Array();
	SurfaceTextLine = SurfaceText.split("\n");

	//$("#IkagakaLog").append("　　"+SurfaceTextLine.length+"行。<br />\n");

	Surface = new Array();
	a = new Boolean();
	b = new Boolean();
	num = new Number();
	for(i=0;i<SurfaceTextLine.length;i++){
		str = SurfaceTextLine[i].match(/^surface\d+/i)
		if(str&&a!=1){
			a=1;
			num = SurfaceTextLine[i].substr(7);
			Surface[num] = new Array();
			Surface[num]["Image"] = new Image();
			Surface[num]["Image"].src = "./img/surface"+num+".png"
		//何故かここでURL読込
			//$("#IkagakaLog").append("　　surface"+num+"　読込開始。<br />\n");
			//$("#IkagakaLog").append("　　　"+Surface[num]["Image"].src+"　読込。<br />\n");
		}else if(a==1){
			if(SurfaceTextLine[i].match(/^\{/)){
				b=1;
			}else if(b==1){
				if(SurfaceTextLine[i].match(/^\}/)){
					a="";
					b="";
					//$("#IkagakaLog").append("　　surface"+num+"　読込完了。<br />\n");
				}else{
					str=SurfaceTextLine[i].match(/^collision\d+,\d+,\d+,\d+,\d+,.+/i);
					if(str){
						str2=str[0].split(",");
						Surface[num][str2[0]] = str[0];
						//$("#IkagakaLog").append("　　　"+str2[0]+"　読込。<br />\n");
					}
				}
			}
		}
	}

	//$("#IkagakaLog").append("　【サーフィスローダー】終了。<br />\n");
}
///////////// 目次 /////////////
//////////////////////////////// IkagakaLoader
//////////////////////////////// SurfaceLoader
////	←イマココ！
//////////////////////////////// BaloonLoader
//////////////////////////////// EventManager
//////////////////////////////// SurfaceManager
//////////////////////////////// BalloonManager
//////////////////////////////// ScriptPlayer
//////////////////////////////// SurfacePlayer
//////////////////////////////// BalloonPlayer

//////////////////////////////// BaloonLoader ////////////////////////////////

function BalloonLoader(){
///////////バルーン読込
	//$("#IkagakaLog").append("　【バルーンローダー】起動。<br />\n");

	Balloon = new Array();
	Balloon[0] = new Array();
	Balloon[0][0] = new Array();
	Balloon[0][1] = new Array();
	Balloon[0][0][0] = new Image();
	Balloon[0][0][0].src = "./img/balloons0.png";
	Balloon[0][1][0] = new Image();
	Balloon[0][1][0].src = "./img/balloons1.png";
	Balloon[0][0][2] = new Image();
	Balloon[0][0][2].src = "./img/balloons2.png";
	Balloon[0][1][2] = new Image();
	Balloon[0][1][2].src = "./img/balloons3.png";
	Balloon[1] = new Array();
	Balloon[1][0] = new Array();
	Balloon[1][1] = new Array();
	Balloon[1][0][0] = new Image();
	Balloon[1][0][0].src = "./img/balloonk0.png";
	Balloon[1][1][0] = new Image();
	Balloon[1][1][0].src = "./img/balloonk1.png";
	Balloon[1][0][2] = new Image();
	Balloon[1][0][2].src = "./img/balloonk2.png";
	Balloon[1][1][2] = new Image();
	Balloon[1][1][2].src = "./img/balloonk3.png";

	//$("#IkagakaLog").append("　【バルーンローダー】終了。<br />\n");
}

///////////// 目次 /////////////
//////////////////////////////// IkagakaLoader
//////////////////////////////// SurfaceLoader
//////////////////////////////// BaloonLoader
////	←イマココ！
//////////////////////////////// EventManager
//////////////////////////////// SurfaceManager
//////////////////////////////// BalloonManager
//////////////////////////////// ScriptPlayer
//////////////////////////////// SurfacePlayer
//////////////////////////////// BalloonPlayer

//////////////////////////////// EventManager ////////////////////////////////

function EventManager(_){
	//$("#IkagakaLog").append("【イベントマネージャー】起動。<br />\n");
	//$("#IkagakaLog").append("　→"+_+"<br />\n");
	a=_.split(",");
	//$("#IkagakaLog").append("　→"+a[0]+"<br />\n");
	//$("#IkagakaLog").append("　→"+a[1]+"<br />\n");
	//$("#IkagakaLog").append("　→"+a[2]+"<br />\n");
	//$("#IkagakaLog").append("　　【擬似SHIORI】<br />\n");
	if(a[0]=="OnBoot"){
		SakuraScript = new String("\\0テキストボックスにSakuraScriptを入力して実行してください。\\w8\\e");
	}else if(a[0]=="OnMouseDoubleClick"){
		if(a[1]==1){
			SakuraScript = new String("\\1あー\\w8\\w8\\nワイを突っついても無駄やで。\\w8\\w8\\0\\s[5]バケネコだもんね。\\w8\\e");
		}else{
			if(a[2].match(/Head/)){
				SakuraScript = new String("\\0\\s[1]撫で機能はまだ付いていません。\\w8\\1\\s[10]つつくな危険。\\e");
			}else if(a[2].match(/Face/)){
				SakuraScript = new String("\\0\\s[6]目に入りますやめてください。\\w8\\1\\s[10]おぉ痛そう。\\e");
			}else if(a[2].match(/Bust/)){
				SakuraScript = new String("\\0\\s[2]きゃっ\\w8\\n\\s[1]サイテーな人です。\\w8\\e");
			}else{
				SakuraScript = new String("\\0\\s[6]めにゅーとかはありません。\\w8\\n\\1\\s[11]バルーンがテキストエリアなのでタグとか仕込めません。\\w8\\n\\0\\s[2]スクロールさせるだけなら素直にＤＩＶとＣＳＳを\\1\\s[10]それ以上は言うな。\\0\\s[3]ハイ。\\e");
			}
		}
	}else if(a[0]=="OnAnchorSelect"){
		SakuraScript='\\0\\s[4]リンクなんて飾りです。\\w8\\1偉い人にはそれがわからんのです。\\e';
	}else{
		SakuraScript='\\0\\s[0]\\1\\s[10]\\e';
	}
	//$("#IkagakaLog").append("　→"+SakuraScript+"<br />\n");
	//$("#IkagakaLog").append("【イベントマネージャー】終了。<br />\n");
	ScriptBreak();
	ScriptPlayer(SakuraScript);
}

///////////// 目次 /////////////
//////////////////////////////// IkagakaLoader
//////////////////////////////// SurfaceLoader
//////////////////////////////// BaloonLoader
//////////////////////////////// EventManager
////	←イマココ！
//////////////////////////////// SurfaceManager
//////////////////////////////// BalloonManager
//////////////////////////////// ScriptPlayer
//////////////////////////////// SurfacePlayer
//////////////////////////////// BalloonPlayer

//////////////////////////////// SurfaceManager ////////////////////////////////

///////////サーフィスマネージャー
/////サーフィスのアニメーションとか（企画構想段階）

///////////// 目次 /////////////
//////////////////////////////// IkagakaLoader
//////////////////////////////// SurfaceLoader
//////////////////////////////// BaloonLoader
//////////////////////////////// EventManager
//////////////////////////////// SurfaceManager
////	←イマココ！
//////////////////////////////// BalloonManager
//////////////////////////////// ScriptPlayer
//////////////////////////////// SurfacePlayer
//////////////////////////////// BalloonPlayer

//////////////////////////////// BalloonManager ////////////////////////////////

///////////バルーンマネージャー
/////バルーン位置左右とか
/////バルーンの種類とかとか
function BalloonManager(_){
	//$("#IkagakaLog").append("【バルーンマネージャー】起動。<br />\n");
	//$("#IkagakaLog").append("　→"+_+"<br />\n");
	//$("#IkagakaLog").append("　→"+NowBalloonLR[_]+"<br />\n");
	//$("#IkagakaLog").append("　→"+Balloon[_][NowBalloonLR[_]][0].src+"<br />\n");
	if(NowBalloonLR[_]){
		NowBalloonLR[_] = 0;
	}else{
		NowBalloonLR[_] = 1;
	}
	NowBalloon[_] = Balloon[_][NowBalloonLR[_]][0];
	//$("#IkagakaLog").append("　→"+_+"<br />\n");
	//$("#IkagakaLog").append("　→"+NowBalloonLR[_]+"<br />\n");
	//$("#IkagakaLog").append("　→"+Balloon[_][NowBalloonLR[_]][0].src+"<br />\n");
	//$("#IkagakaLog").append("【バルーンマネージャー】終了。<br />\n");
	BalloonPlayer();
}



///////////// 目次 /////////////
//////////////////////////////// IkagakaLoader
//////////////////////////////// SurfaceLoader
//////////////////////////////// BaloonLoader
//////////////////////////////// EventManager
//////////////////////////////// SurfaceManager
//////////////////////////////// BalloonManager
////	←イマココ！
//////////////////////////////// ScriptPlayer
//////////////////////////////// SurfacePlayer
//////////////////////////////// BalloonPlayer

//////////////////////////////// ScriptPlayer //////////////////////////////////
function ScriptPlayer(_){
	//$("#IkagakaLog").append("【スクリプトプレイヤー】起動。<br />\n");
	//$("#IkagakaLog").append("　ID: "+Tid+"<br />\n");
	//$("#IkagakaLog").append("　→"+_+"<br />\n");
	clearTimeout(Tid);
	RemainScript = _;
	AddScript = "";
//現在状態の変更
	if(RemainScript.match(/^\\0/) || RemainScript.match(/^\\h/)){	//さくら
		Scope = 0;
		RemainScript = RemainScript.substr(2);
	}else if(RemainScript.match(/^\\1/) || RemainScript.match(/^\\u/)){	//うにゅう
		Scope = 1;
		RemainScript = RemainScript.substr(2);
	}else if(RemainScript.match(/^\\n/)){	//改行
		AddScript = "<br />\n";
		RemainScript = RemainScript.substr(2);
	}else if(RemainScript.match(/^\\c/)){	//バルーンクリア
		NowBalloonText[Scope] = "";
		RemainScript = RemainScript.substr(2);
	}else if(RemainScript.match(/^\\w[1-9]/)){	//ウエイト
		Wait = RemainScript.substr(2,1)*50;
		RemainScript = RemainScript.substr(3);
	}else if(RemainScript.match(/^\\_w\[\d+\]/)){	//精密ウエイト
		Wait = RemainScript.substr(4).match(/^\d+/);
		RemainScript = RemainScript.replace(/^\\_w\[\d+\]/,'');
	}else if(RemainScript.match(/^\\s\[-?\d+\]/)){	//サーフェス切り替え
		NowSurface[Scope] = Surface[RemainScript.substr(3).match(/-?\d+/)];
		RemainScript = RemainScript.replace(/^\\s\[-?\d+\]/,'');
		SurfacePlayer();			//←ここに来た
	}else if(RemainScript.match(/^\\e/)){	//えんいー
		clearTimeout(Tid);
		Tid = setTimeout("ScriptPlayer(RemainScript)",5000);
		RemainScript = RemainScript.replace(/^\\e/,'');
	}else{
		AddScript = RemainScript.substr(0,1);
		RemainScript = RemainScript.substr(1);
		Wait = 50;
	}
//現在状況の反映
//	SurfacePlayer();	//サーフェス更新かなりエグそうこんなところで毎回呼ぶなマジで。↑元の鞘に収まる

	if(AddScript){	//バルーン
	NowBalloonText[Scope] = AddScript;
		if(Scope){
			$("#IkagakaKeroBalloon").css("visibility","visible");
			$("#IkagakaKeroBalloonText").append(NowBalloonText[Scope]);
		}else{
			$("#IkagakaSakuraBalloon").css("visibility","visible");
			$("#IkagakaSakuraBalloonText").append(NowBalloonText[Scope]);
		}
	}
//制御
	if(RemainScript.length>0){
		//$("#IkagakaLog").append("【スクリプトプレイヤー】継続。<br />\n");
		Tid = setTimeout("ScriptPlayer(RemainScript)",Wait);
	}else{
		//$("#IkagakaLog").append("【スクリプトプレイヤー】終了。<br />\n");
		Tid = setTimeout("ScriptPlayer(RemainScript)",5000);
	}
}

function ScriptBreak(){
	clearTimeout(Tid);
	//$("#IkagakaLog").append("【スクリプトブレイク】<br />\n");
	$("#IkagakaSakuraBalloon").css("visibility","hidden");
	$("#IkagakaKeroBalloon").css("visibility","hidden");
	NowBalloonText[0] = "";
	NowBalloonText[1] = "";
	$("#IkagakaSakuraBalloonText").text('');
	$("#IkagakaKeroBalloonText").text('');
}

///////////// 目次 /////////////
//////////////////////////////// IkagakaLoader
//////////////////////////////// SurfaceLoader
//////////////////////////////// BaloonLoader
//////////////////////////////// EventManager
//////////////////////////////// SurfaceManager
//////////////////////////////// BalloonManager
//////////////////////////////// ScriptPlayer
////	←イマココ！
//////////////////////////////// SurfacePlayer
//////////////////////////////// BalloonPlayer

//////////////////////////////// SurfacePlayer //////////////////////////////////
function SurfacePlayer(){
///////////サーフィスプレイヤー
/////サーフィスチェンジとか
/////当たり判定とか（鋭意実装中）
	//$("#IkagakaLog").append("【サーフィスプレイヤー】起動。<br />\n");
	$("#IkagakaSakura")
		.width(NowSurface[0]["Image"].width+"px")
		.height(NowSurface[0]["Image"].height+"px")
	;
	$("#IkagakaSakuraSurface")
		.css("background-image","url("+NowSurface[0]["Image"].src+")")
		.css("filter","Chroma(color=#0000ff)")
		.width(NowSurface[0]["Image"].width+"px")
		.height(NowSurface[0]["Image"].height+"px")
		.css("z-index","120")
	;
	//$("#IkagakaLog").append("　"+NowSurface[0]["Image"].src+"　反映。<br />\n");
	i=0;
	while(1){
		if(NowSurface[0]["collision"+i]){
			//$("#IkagakaLog").append("　"+$("#IkagakaSakuraCollision"+i).attr("class")+"<br />\n");
			if(typeof $("IkagakaSakuraCollision"+i).attr("class") == "undefined"){
				//$("#IkagakaLog").append("　IkagakaSakuraCollision"+i+"　未確認。<br />\n");
				$("#IkagakaSakuraSurface").prepend(
					$("<div>").attr("id","IkagakaSakuraCollision"+i).attr("class","ikagaka")
				);
				//$("#IkagakaLog").append("　IkagakaSakuraCollision"+i+"　作成。<br />\n");
			}else{
				;
				//$("#IkagakaLog").append("　IkagakaSakuraCollision"+i+"　発見。<br />\n");
			}
			a=NowSurface[0]["collision"+i].split(",");
			$("#IkagakaSakuraCollision"+i)
				.css("left",a[1]+"px")
				.css("top",a[2]+"px")
				.width(eval(a[3]-a[1])+"px")
				.height(eval(a[4]-a[2])+"px")
				.css("z-index","150")
				.css("visibility","inherit")
				.css("cursor","pointer")
				.css("position","absolute")
			;
			$("#IkagakaSakuraCollision"+i).dblclick("EventManager(OnMouseDoubleClick,1,a[5])");
			//$("#IkagakaLog").append("　"+a[1]+","+a[2]+","+eval(a[3]-a[1])+","+eval(a[4]-a[2])+"<br />\n");
			//$("#IkagakaLog").append("　IkagakaSakuraCollision"+i+"　に　OnMouseDoubleClick,0,"+a[5]+"　イベント定義。<br />\n");
		}else{
			break;
		}
		i++;
	}

	$("#IkagakaKero")
		.width(NowSurface[1]["Image"].width+"px")
		.height(NowSurface[1]["Image"].height+"px")
	;
	$("#IkagakaKeroSurface")
		.css("background-image","url("+NowSurface[1]["Image"].src+")")
		.css("filter","Chroma(color=#0000ff)")
		.width(NowSurface[1]["Image"].width+"px")
		.height(NowSurface[1]["Image"].height+"px")
		.css("z-index","120")
	;
	//$("#IkagakaLog").append("　"+NowSurface[1]["Image"].src+"　反映。<br />\n");
	i=0;
	while(1){
		if(NowSurface[1]["collision"+i]){
			//$("#IkagakaLog").append("　"+$("#IkagakaKeroCollision"+i).attr("class")+"<br />\n");
			if(typeof $("IkagakaKeroCollision"+i).attr("class") == "undefined"){
				//$("#IkagakaLog").append("　IkagakaKeroCollision"+i+"　未確認。<br />\n");
				$("#IkagakaSakuraSurface").prepend(
					$("<div>").attr("id","IkagakaKeroCollision"+i).attr("class","ikagaka")
				);
				//$("#IkagakaLog").append("　IkagakaKeroCollision"+i+"　作成。<br />\n");
			}else{
				;
				//$("#IkagakaLog").append("　IkagakaKeroCollision"+i+"　発見。<br />\n");
			}
			a=NowSurface[1]["collision"+i].split(",");
			$("#IkagakaKeroCollision"+i)
				.css("left",a[1]+"px")
				.css("top",a[2]+"px")
				.width(eval(a[3]-a[1])+"px")
				.height(eval(a[4]-a[2])+"px")
				.css("z-index","150")
				.css("visibility","inherit")
				.css("cursor","pointer")
				.css("position","absolute")
			;
			$("#IkagakaKeroCollision"+i).dblclick("EventManager('OnMouseDoubleClick,1,'"+a[5]+")");
			//$("#IkagakaLog").append("　IkagakaKeroCollision"+i+"　に　OnMouseDoubleClick,1,"+a[5]+"　イベント定義。<br />\n");
		}else{
			break;
		}
		i++;
	}
	//$("#IkagakaLog").append("【サーフィスプレイヤー】終了。<br />\n");
}
///////////// 目次 /////////////
//////////////////////////////// IkagakaLoader
//////////////////////////////// SurfaceLoader
//////////////////////////////// BaloonLoader
//////////////////////////////// EventManager
//////////////////////////////// SurfaceManager
//////////////////////////////// BalloonManager
//////////////////////////////// ScriptPlayer
//////////////////////////////// SurfacePlayer
////	←イマココ！
//////////////////////////////// BalloonPlayer

//////////////////////////////// BalloonPlayer //////////////////////////////////
function BalloonPlayer(){
///////////バルーンプレイヤー（何それ
	//$("#IkagakaLog").append("【バルーンプレイヤー】起動。<br />\n");
	if(NowBalloonLR[0]==1){	//バルーンを右へ
		//$("#IkagakaLog").append("　\\0バルーンを右へ。<br />\n");
		$("#IkagakaSakuraBalloon")
			.css("background-image","url("+NowBalloon[0].src+")")
			.css("filter","Chroma(color=#dccdab)")
			.width(NowBalloon[0].width+"px")
			.height(NowBalloon[0].height+"px")
			.css("left",NowSurface[0].Image.width+"px")
			.css("top","0px")
			.css("z-index","200")
		;
		$("#IkagakaSakuraBalloonText")
			.css("background-color","transparent")
			.width(eval(NowBalloon[0].width-30)+"px")
			.height(eval(NowBalloon[0].height-20)+"px")
			.css("line-height","120%")
			.css("top","10px")
			.css("left","20px")
			.css("overflow","scroll")
			.css("z-index","210")
			.css("visibility","inherit")
		;
	}else{	//バルーンを左へ
		//$("#IkagakaLog").append("　\\0バルーンを左へ。<br />\n");
		$("#IkagakaSakuraBalloon")
			.css("background-image","url("+NowBalloon[0].src+")")
			.css("filter","Chroma(color=#dccdab)")
			.width(NowBalloon[0].width+"px")
			.height(NowBalloon[0].height+"px")
			.css("left","-"+NowBalloon[0].width+"px")
			.css("top","0px")
			.css("z-index","200")
		;
		$("#IkagakaSakuraBalloonText")
			.css("background-color","transparent")
			.width(eval(NowBalloon[0].width-30)+"px")
			.height(eval(NowBalloon[0].height-20)+"px")
			.css("line-height","120%")
			.css("top","10px")
			.css("left","10px")
			.css("overflow","scroll")
			.css("z-index","210")
			.css("visibility","inherit")
		;
	}
	if(NowBalloonLR[1]==1){	//バルーンを右へ
		//$("#IkagakaLog").append("　\\1バルーンを右へ。<br />\n");
		$("#IkagakaKeroBalloon")
			.css("background-image","url("+NowBalloon[1].src+")")
			.css("filter","Chroma(color=#dccdab)")
			.width(NowBalloon[1].width+"px")
			.height(NowBalloon[1].height+"px")
			.css("left",NowSurface[1].Image.width+"px")
			.css("top","0px")
			.css("z-index","200")
		;
		$("#IkagakaKeroBalloonText")
			.css("background-color","transparent")
			.width(eval(NowBalloon[1].width-30)+"px")
			.height(eval(NowBalloon[1].height-20)+"px")
			.css("line-height","120%")
			.css("top","10px")
			.css("left","20px")
			.css("overflow","scroll")
			.css("z-index","210")
			.css("visibility","inherit")
		;
	}else{	//バルーンを左へ
		//$("#IkagakaLog").append("　\\1バルーンを左へ。<br />\n");
		$("#IkagakaKeroBalloon")
			.css("background-image","url("+NowBalloon[1].src+")")
			.css("filter","Chroma(color=#dccdab)")
			.width(NowBalloon[1].width+"px")
			.height(NowBalloon[1].height+"px")
			.css("left","-"+NowBalloon[1].width+"px")
			.css("top","0px")
			.css("z-index","200")
		;
		$("#IkagakaKeroBalloonText")
			.css("background-color","transparent")
			.width(eval(NowBalloon[1].width-30)+"px")
			.height(eval(NowBalloon[1].height-20)+"px")
			.css("line-height","120%")
			.css("top","10px")
			.css("left","10px")
			.css("overflow","scroll")
			.css("z-index","210")
			.css("visibility","inherit")
		;
	}

	//$("#IkagakaLog").append("【バルーンプレイヤー】終了。<br />\n");
}
///////////// 目次 /////////////
//////////////////////////////// IkagakaLoader
//////////////////////////////// SurfaceLoader
//////////////////////////////// BaloonLoader
//////////////////////////////// EventManager
//////////////////////////////// SurfaceManager
//////////////////////////////// BalloonManager
//////////////////////////////// ScriptPlayer
//////////////////////////////// SurfacePlayer
//////////////////////////////// BalloonPlayer
////	←イマココ！