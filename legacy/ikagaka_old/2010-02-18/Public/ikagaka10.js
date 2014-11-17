window.onerror = function(mes,file,num){ alert([ "file : " + file, "line : " + num, "message : " + mes ].join("\n")); return true; }
window.onload = IkagakaLoader;
///////////// 目次 /////////////
////	←イマココ！
//////////////////////////////// IkagakaLoader
//////////////////////////////// IkagakaUnloader
//////////////////////////////// IkagakaLogManager
//////////////////////////////// ShioriLogManager
//////////////////////////////// WindowManager
//////////////////////////////// GhostLoader
//////////////////////////////// EventManager
//////////////////////////////// ScriptPlayer
//////////////////////////////// ScriptBreaker
//////////////////////////////// SurfaceLoader
//////////////////////////////// SurfaceManager
//////////////////////////////// SurfacePlayer
//////////////////////////////// BaloonLoader
//////////////////////////////// BalloonManager
//////////////////////////////// BalloonPlayer

//////////////////////////////// IkagakaLoader //////////////////////////////////

function IkagakaLoader(){
////////////如何かブートローダー

////////////ログ窓
/*	$("body").prepend(
		$("<textarea>")
		.attr("id","IkagakaLog")
		.attr("class","ikagaka")
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
*/
	//IkagakaLogManager("【如何かブートローダー】起動");
//////////ロード
	ShellLoader();
	BalloonLoader();
	GhostLoader();

//////////現在状態の初期化
	//IkagakaLogManager("　現在状態の初期化開始");

	Scope = new Number(0);	//スコープ
	NowSurface = new Array();
	NowSurface[0] = new Array();
	NowSurface[1] = new Array();
	NowSurface[0]["Number"] = new Number(0);	//￥０サーフェス番号
	NowSurface[1]["Number"] = new Number(10);	//￥１サーフェス番号
	NowBalloon = new Array();
	NowBalloon[0] = new Array();
	NowBalloon[1] = new Array();
	NowBalloon[0]["Number"] = new Number(0);	//￥０バルーン番号
	NowBalloon[1]["Number"] = new Number(0);	//￥１バルーン番号
	NowBalloon[0]["LR"] = new Number(0);	//￥０バルーン左
	NowBalloon[1]["LR"] = new Number(1);	//￥０バルーン右
	NowBalloon[0]["Text"] = new String();	//￥０バルーン内容
	NowBalloon[1]["Text"] = new String();	//￥０バルーン内容

	SakuraScript = new String();	//実行するSakuraScript
	AddScript = new String();	//発話する一文字
	RemainScript = new String();	//残りのSakuraScript文字列
	Wait = new Number(50);		//ウェイト
	Tid = new Number(0);		//タイマーＩＤ
	//IkagakaLogManager("　現在状態の初期化完了");

//////////基礎ＤＯＭ構築
	//IkagakaLogManager("　ＤＯＭ構築開始");

	$("#IkagakaBase").after(
		$("<div>")
		.attr("id","Ikagaka")
		.attr("class","ikagaka")
	);
	for(var i=0;i<2;i++){
		$("#Ikagaka").prepend(
			$("<div>")
			.attr("id","Ikagaka"+i)
			.attr("class","ikagaka")
		);
		$("#Ikagaka"+i).prepend(
			$("<div>")
			.attr("id","Ikagaka"+i+"Surface")
			.attr("class","ikagaka")
		);
		$("#Ikagaka"+i).prepend(
			$("<div>")
			.attr("id","Ikagaka"+i+"Balloon")
			.attr("class","ikagaka")
		);
		$("#Ikagaka"+i+"Balloon").prepend(
			$("<div>")
			.attr("id","Ikagaka"+i+"BalloonText")
			.attr("class","ikagaka")
		);
	}
	//IkagakaLogManager("　ＤＯＭ構築完了");

//////////基礎ＣＳＳ設定
	//IkagakaLogManager("　ＣＳＳ設定開始");

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
	$("#Ikagaka0")
		.css("left","50%")
		.css("bottom","0px")
		.css("z-index","100")
	;
	$("#Ikagaka1")
		.css("left","10%")
		.css("bottom","0px")
		.css("z-index","100")
	;
	//IkagakaLogManager("　ＣＳＳ設定完了");

//////////タスク起動
	//IkagakaLogManager("　タスク起動");

	SurfacePlayer();
	$("#Ikagaka1").dblclick(function(){EventManager('OnMouseDoubleClick,1')});

	$("#Ikagaka0").draggable({/*opacity:0.5,*/cursor:'move'});
	$("#Ikagaka1").draggable({/*opacity:0.5,*/cursor:'move'});

	BalloonPlayer();
	$("#Ikagaka0Balloon").click(function(){BalloonManager(0)});
	$("#Ikagaka1Balloon").click(function(){BalloonManager(1)});

	$("#Ikagaka0Balloon").hide();
	$("#Ikagaka1Balloon").hide();
//	$("#IkagakaLog").css("visibility","hidden");

//	$(".ikagaka").css("border","1px solid #FF0000");

//////////起動完了
	//IkagakaLogManager("起動完了！");
	//IkagakaLogManager("");

	EventManager('OnBoot');
}
///////////// 目次 /////////////
//////////////////////////////// IkagakaLoader
////	←イマココ！
//////////////////////////////// IkagakaUnloader
//////////////////////////////// IkagakaLogManager
//////////////////////////////// ShioriLogManager
//////////////////////////////// WindowManager
//////////////////////////////// GhostLoader
//////////////////////////////// EventManager
//////////////////////////////// ScriptPlayer
//////////////////////////////// ScriptBreaker
//////////////////////////////// SurfaceLoader
//////////////////////////////// SurfaceManager
//////////////////////////////// SurfacePlayer
//////////////////////////////// BaloonLoader
//////////////////////////////// BalloonManager
//////////////////////////////// BalloonPlayer

//////////////////////////////// IkagakaUnloader ////////////////////////////////
function IkagakaUnLoader(){
}
///////////// 目次 /////////////
//////////////////////////////// IkagakaLoader
//////////////////////////////// IkagakaUnloader
////	←イマココ！
//////////////////////////////// IkagakaLogManager
//////////////////////////////// ShioriLogManager
//////////////////////////////// WindowManager
//////////////////////////////// GhostLoader
//////////////////////////////// EventManager
//////////////////////////////// ScriptPlayer
//////////////////////////////// ScriptBreaker
//////////////////////////////// SurfaceLoader
//////////////////////////////// SurfaceManager
//////////////////////////////// SurfacePlayer
//////////////////////////////// BaloonLoader
//////////////////////////////// BalloonManager
//////////////////////////////// BalloonPlayer

//////////////////////////////// IkagakaLogManager ////////////////////////////////
function IkagakaLogManager(_){
	$("#IkagakaLog").append(_+"<br />\n");
}
///////////// 目次 /////////////
//////////////////////////////// IkagakaLoader
//////////////////////////////// IkagakaUnloader
//////////////////////////////// IkagakaLogManager
////	←イマココ！
//////////////////////////////// ShioriLogManager
//////////////////////////////// WindowManager
//////////////////////////////// GhostLoader
//////////////////////////////// EventManager
//////////////////////////////// ScriptPlayer
//////////////////////////////// ScriptBreaker
//////////////////////////////// SurfaceLoader
//////////////////////////////// SurfaceManager
//////////////////////////////// SurfacePlayer
//////////////////////////////// BaloonLoader
//////////////////////////////// BalloonManager
//////////////////////////////// BalloonPlayer

//////////////////////////////// ShioriLogManager ////////////////////////////////
function ShioriLogManager(){
}
///////////// 目次 /////////////
//////////////////////////////// IkagakaLoader
//////////////////////////////// IkagakaUnloader
//////////////////////////////// IkagakaLogManager
//////////////////////////////// ShioriLogManager
////	←イマココ！
//////////////////////////////// WindowManager
//////////////////////////////// GhostLoader
//////////////////////////////// EventManager
//////////////////////////////// ScriptPlayer
//////////////////////////////// ScriptBreaker
//////////////////////////////// SurfaceLoader
//////////////////////////////// SurfaceManager
//////////////////////////////// SurfacePlayer
//////////////////////////////// BaloonLoader
//////////////////////////////// BalloonManager
//////////////////////////////// BalloonPlayer

//////////////////////////////// WindowManager ////////////////////////////////
function WindowManager(){
}
///////////// 目次 /////////////
//////////////////////////////// IkagakaLoader
//////////////////////////////// IkagakaUnloader
//////////////////////////////// IkagakaLogManager
//////////////////////////////// ShioriLogManager
//////////////////////////////// WindowManager
////	←イマココ！
//////////////////////////////// GhostLoader
//////////////////////////////// EventManager
//////////////////////////////// ScriptPlayer
//////////////////////////////// ScriptBreaker
//////////////////////////////// SurfaceLoader
//////////////////////////////// SurfaceManager
//////////////////////////////// SurfacePlayer
//////////////////////////////// BaloonLoader
//////////////////////////////// BalloonManager
//////////////////////////////// BalloonPlayer

//////////////////////////////// GhostLoader ////////////////////////////////
function GhostLoader(){
}
///////////// 目次 /////////////
//////////////////////////////// IkagakaLoader
//////////////////////////////// IkagakaUnloader
//////////////////////////////// IkagakaLogManager
//////////////////////////////// ShioriLogManager
//////////////////////////////// WindowManager
//////////////////////////////// GhostLoader
////	←イマココ！
//////////////////////////////// EventManager
//////////////////////////////// ScriptPlayer
//////////////////////////////// ScriptBreaker
//////////////////////////////// SurfaceLoader
//////////////////////////////// SurfaceManager
//////////////////////////////// SurfacePlayer
//////////////////////////////// BaloonLoader
//////////////////////////////// BalloonManager
//////////////////////////////// BalloonPlayer

//////////////////////////////// EventManager ////////////////////////////////

function EventManager(_){
	window.clearTimeout(Tid);
	for(var i=0;i<2;i++){
		$("#Ikagaka"+i+"Balloon").hide();
		NowBalloon[i].Text = "";
		$("#Ikagaka"+i+"BalloonText").text('');
	}
	//IkagakaLogManager("【イベントマネージャー】起動");

	var a=_.split(",");
	//IkagakaLogManager("　Event: "+a[0]);
	//IkagakaLogManager("　value: "+a[1]);
	//IkagakaLogManager("　value: "+a[2]);

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
	//IkagakaLogManager("　【擬似栞】→"+SakuraScript);
	//IkagakaLogManager("【イベントマネージャー】終了");
	ScriptPlayer(SakuraScript);
}
///////////// 目次 /////////////
//////////////////////////////// IkagakaLoader
//////////////////////////////// IkagakaUnloader
//////////////////////////////// IkagakaLogManager
//////////////////////////////// ShioriLogManager
//////////////////////////////// WindowManager
//////////////////////////////// GhostLoader
//////////////////////////////// EventManager
////	←イマココ！
//////////////////////////////// ScriptPlayer
//////////////////////////////// ScriptBreaker
//////////////////////////////// SurfaceLoader
//////////////////////////////// SurfaceManager
//////////////////////////////// SurfacePlayer
//////////////////////////////// BaloonLoader
//////////////////////////////// BalloonManager
//////////////////////////////// BalloonPlayer

//////////////////////////////// ScriptPlayer //////////////////////////////////
function ScriptPlayer(_){
	//IkagakaLogManager("【スクリプトプレイヤー】起動");
	//IkagakaLogManager("　ID: "+Tid);
	RemainScript = _;
	AddScript = "";
//現在状態の変更
	if(RemainScript.match(/^\\/)){
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
			$("#Ikagaka"+Scope+"BalloonText").text('');
			RemainScript = RemainScript.substr(2);
		}else if(RemainScript.match(/^\\w[1-9]/)){	//ウエイト
			Wait = RemainScript.substr(2,1)*50;
			RemainScript = RemainScript.substr(3);
		}else if(RemainScript.match(/^\\_w\[\d+\]/)){	//精密ウエイト
			Wait = RemainScript.substr(4).match(/^\d+/);
			RemainScript = RemainScript.replace(/^\\_w\[\d+\]/,'');
		}else if(RemainScript.match(/^\\s\[-?\d+\]/)){	//サーフェス切り替え
			NowSurface[Scope].Number = RemainScript.substr(3).match(/-?\d+/);
			RemainScript = RemainScript.replace(/^\\s\[-?\d+\]/,'');
			SurfacePlayer();	//サーフェス更新
		}else if(RemainScript.match(/^\\e/)){	//えんいー
			RemainScript = RemainScript.replace(/^\\e/,'');
			Tid = window.setTimeout("ScriptBreaker()",5000);
		}else{
			AddScript = RemainScript.substr(0,1);
			RemainScript = RemainScript.substr(1);
			Wait = 50;
		}
	}else{
		AddScript = RemainScript.substr(0,1);
		RemainScript = RemainScript.substr(1);
		Wait = 50;
	}
//現在状況の反映
	if(AddScript){
		$("#Ikagaka"+Scope+"Balloon").show();
		$("#Ikagaka"+Scope+"BalloonText").append(AddScript);
	}
	NowBalloon[Scope].Text = $("#Ikagaka"+Scope+"BalloonText").text();

//制御
	if(RemainScript.length>0){
		//IkagakaLogManager("【スクリプトプレイヤー】継続");
		Tid = window.setTimeout("ScriptPlayer(RemainScript)",Wait);
	}else{
		//IkagakaLogManager("【スクリプトプレイヤー】終了");
		Tid = window.setTimeout("ScriptBreaker()",5000);
	}
}
///////////// 目次 /////////////
//////////////////////////////// IkagakaLoader
//////////////////////////////// IkagakaUnloader
//////////////////////////////// IkagakaLogManager
//////////////////////////////// ShioriLogManager
//////////////////////////////// WindowManager
//////////////////////////////// GhostLoader
//////////////////////////////// EventManager
//////////////////////////////// ScriptPlayer
////	←イマココ！
//////////////////////////////// ScriptBreaker
//////////////////////////////// SurfaceLoader
//////////////////////////////// SurfaceManager
//////////////////////////////// SurfacePlayer
//////////////////////////////// BaloonLoader
//////////////////////////////// BalloonManager
//////////////////////////////// BalloonPlayer

//////////////////////////////// ScriptBreaker ////////////////////////////////
function ScriptBreaker(){
	//IkagakaLogManager("【スクリプトブレイカー】"+Tid);
	window.clearTimeout(Tid);
	for(var i=0;i<2;i++){
		$("#Ikagaka"+i+"Balloon").hide();
		NowBalloon[i].Text = "";
		$("#Ikagaka"+i+"BalloonText").text('');
	}
}
///////////// 目次 /////////////
//////////////////////////////// IkagakaLoader
//////////////////////////////// IkagakaUnloader
//////////////////////////////// IkagakaLogManager
//////////////////////////////// ShioriLogManager
//////////////////////////////// WindowManager
//////////////////////////////// GhostLoader
//////////////////////////////// EventManager
//////////////////////////////// ScriptPlayer
//////////////////////////////// ScriptBreaker
////	←イマココ！
//////////////////////////////// SurfaceLoader
//////////////////////////////// SurfaceManager
//////////////////////////////// SurfacePlayer
//////////////////////////////// BaloonLoader
//////////////////////////////// BalloonManager
//////////////////////////////// BalloonPlayer

//////////////////////////////// ShellLoader //////////////////////////////////

function ShellLoader(){
///////////シェル読込
	//IkagakaLogManager("　【シェルローダー】起動");
	//IkagakaLogManager("　　surface.txt");

	SurfaceText = new String();
	SurfaceText = $("#surface").text();
	SurfaceText = SurfaceText.replace(/\r\n/g,"\n");
	SurfaceText = SurfaceText.replace(/\r/g,"\n");

/*	$("body").prepend(
		$("<textarea>")
		.attr("id","SurfaceDotText")
		.attr("class","ikagaka")
		.append(SurfaceText)
	);
*/
	var SurfaceTextLine = new Array();
	SurfaceTextLine = SurfaceText.split("\n");

	//IkagakaLogManager("　　"+SurfaceTextLine.length+"行");

	Surface = new Array();
	var i = new Number();
	var a = false;
	var b = false;
	var num = new Number();
	var ary = new Array();

	for(i=0;i<SurfaceTextLine.length;i++){
		if(a){
			if(b){
				if(SurfaceTextLine[i].match(/^collision\d+,\d+,\d+,\d+,\d+,.+/i)){
					ary = SurfaceTextLine[i].split(",");
					ary[0] = ary[0].substr(9);
					Surface[num][ary[0]] = new Array();
					Surface[num][ary[0]][1] = ary[1];
					Surface[num][ary[0]][2] = ary[2];
					Surface[num][ary[0]][3] = ary[3];
					Surface[num][ary[0]][4] = ary[4];
					Surface[num][ary[0]].Name = ary[5];
					//IkagakaLogManager("　　　Surface["+num+"]["+ary[0]+"].Name: "+Surface[num][ary[0]].Name+"　読込");
				}else if(SurfaceTextLine[i].match(/^\}/)){
					a = false;
					b = false;
					//IkagakaLogManager("　　surface"+num+"　読込完了");
				}
			}else if(SurfaceTextLine[i].match(/^\{/)){
				b = true;
			}
		}else if(SurfaceTextLine[i].match(/^surface\d+$/i)){
			a = true;
			num = SurfaceTextLine[i].substr(7);
			Surface[num] = new Array();
			Surface[num].Image = new Image();
			Surface[num].Image.src = "./img/surface"+num+".png";	//何故かここでURL読込
			//IkagakaLogManager("　　　"+Surface[num].Image.src+"　読込");
		}
	}
	//IkagakaLogManager("　【シェルローダー】終了");
}
///////////// 目次 /////////////
//////////////////////////////// IkagakaLoader
//////////////////////////////// IkagakaUnloader
//////////////////////////////// IkagakaLogManager
//////////////////////////////// ShioriLogManager
//////////////////////////////// WindowManager
//////////////////////////////// GhostLoader
//////////////////////////////// EventManager
//////////////////////////////// ScriptPlayer
//////////////////////////////// ScriptBreaker
//////////////////////////////// SurfaceLoader
////	←イマココ！
//////////////////////////////// SurfaceManager
//////////////////////////////// SurfacePlayer
//////////////////////////////// BaloonLoader
//////////////////////////////// BalloonManager
//////////////////////////////// BalloonPlayer

//////////////////////////////// SurfaceManager ////////////////////////////////
function SurfaceManager(){
	//IkagakaLogManager("　【サーフィスマネージャー】起動");
	//IkagakaLogManager("　【サーフィスマネージャー】終了");
}
///////////// 目次 /////////////
//////////////////////////////// IkagakaLoader
//////////////////////////////// IkagakaUnloader
//////////////////////////////// IkagakaLogManager
//////////////////////////////// ShioriLogManager
//////////////////////////////// WindowManager
//////////////////////////////// GhostLoader
//////////////////////////////// EventManager
//////////////////////////////// ScriptPlayer
//////////////////////////////// ScriptBreaker
//////////////////////////////// SurfaceLoader
//////////////////////////////// SurfaceManager
////	←イマココ！
//////////////////////////////// SurfacePlayer
//////////////////////////////// BaloonLoader
//////////////////////////////// BalloonManager
//////////////////////////////// BalloonPlayer

//////////////////////////////// SurfacePlayer ////////////////////////////////
function SurfacePlayer(){
	//IkagakaLogManager("【サーフィスプレイヤー】起動");

	var a = new Image();
	var i = new Number();
	var j = new Number(0);
	var ary = new Array();

	for(i=0;i<2;i++){
		a = Surface[NowSurface[i].Number].Image;
		$("#Ikagaka"+i)
			.width(a.width+"px")
			.height(a.height+"px")
		;
		$("#Ikagaka"+i+"Surface")
			.css("background-image","url("+a.src+")")
			.css("filter","Chroma(color=#0000ff)")
			.width(a.width+"px")
			.height(a.height+"px")
			.css("z-index","120")
		;
		//IkagakaLogManager("　"+a.src+"　反映");

		$("#Ikagaka"+i+"Surface").empty();

		while(Surface[i][j]){
			$("#Ikagaka"+i+"Surface").prepend(
				$("<div>").attr("id","Ikagaka"+i+"Collision"+j).attr("class","ikagaka")
			);

			ary = Surface[NowSurface[i].Number][j];
			$("#Ikagaka"+i+"Collision"+j)
				.css("left",ary[1]+"px")
				.css("top",ary[2]+"px")
				.width(eval(ary[3]-ary[1])+"px")
				.height(eval(ary[4]-ary[2])+"px")
				.css("z-index","150")
				.css("visibility","inherit")
				.css("cursor","pointer")
				.css("position","absolute")
			;
			eval('$("#Ikagaka"+i+"Collision"+j)'+'.dblclick(function(){EventManager("OnMouseDoubleClick,'+i+','+ary.Name+'")});');
			//IkagakaLogManager("　Ikagaka"+i+"Collision"+j+"　に　OnMouseDoubleClick,0,"+ary.Name+"　イベント定義");
			j++;
		}
	}
	//IkagakaLogManager("【サーフィスプレイヤー】終了");
}
///////////// 目次 /////////////
//////////////////////////////// IkagakaLoader
//////////////////////////////// IkagakaUnloader
//////////////////////////////// IkagakaLogManager
//////////////////////////////// ShioriLogManager
//////////////////////////////// WindowManager
//////////////////////////////// GhostLoader
//////////////////////////////// EventManager
//////////////////////////////// ScriptPlayer
//////////////////////////////// ScriptBreaker
//////////////////////////////// SurfaceLoader
//////////////////////////////// SurfaceManager
//////////////////////////////// SurfacePlayer
////	←イマココ！
//////////////////////////////// BaloonLoader
//////////////////////////////// BalloonManager
//////////////////////////////// BalloonPlayer

//////////////////////////////// BaloonLoader ////////////////////////////////
function BalloonLoader(){
///////////バルーン読込
	//IkagakaLogManager("　【バルーンローダー】起動");

	Balloon = new Array();
	Balloon[0] = new Array();	//さくら
	Balloon[0][0] = new Array();	//並
	Balloon[0][2] = new Array();	//大
	Balloon[0][0][0] = new Image();	//左
	Balloon[0][0][0].src = "./img/balloons0.png";	//さくら並左
	Balloon[0][0][1] = new Image();	//右
	Balloon[0][0][1].src = "./img/balloons1.png";	//さくら並右
	Balloon[0][2][0] = new Image();	//左
	Balloon[0][2][0].src = "./img/balloons2.png";	//さくら大左
	Balloon[0][2][1] = new Image();	//右
	Balloon[0][2][1].src = "./img/balloons3.png";	//さくら大右
	Balloon[1] = new Array();	//うにゅう
	Balloon[1][0] = new Array();	//並
	Balloon[1][2] = new Array();	//大
	Balloon[1][0][0] = new Image();	//左
	Balloon[1][0][0].src = "./img/balloonk0.png";	//うにゅう並左
	Balloon[1][0][1] = new Image();	//右
	Balloon[1][0][1].src = "./img/balloonk1.png";	//うにゅう並右
	Balloon[1][2][0] = new Image();	//左
	Balloon[1][2][0].src = "./img/balloonk2.png";	//うにゅう大左
	Balloon[1][2][1] = new Image();	//右
	Balloon[1][2][1].src = "./img/balloonk3.png";	//うにゅう大右

	//IkagakaLogManager("　【バルーンローダー】終了");
}
///////////// 目次 /////////////
//////////////////////////////// IkagakaLoader
//////////////////////////////// IkagakaUnloader
//////////////////////////////// IkagakaLogManager
//////////////////////////////// ShioriLogManager
//////////////////////////////// WindowManager
//////////////////////////////// GhostLoader
//////////////////////////////// EventManager
//////////////////////////////// ScriptPlayer
//////////////////////////////// ScriptBreaker
//////////////////////////////// SurfaceLoader
//////////////////////////////// SurfaceManager
//////////////////////////////// SurfacePlayer
//////////////////////////////// BaloonLoader
////	←イマココ！
//////////////////////////////// BalloonManager
//////////////////////////////// BalloonPlayer

//////////////////////////////// BalloonManager ////////////////////////////////
function BalloonManager(_){
	//IkagakaLogManager("【バルーンマネージャー】起動");
	//IkagakaLogManager("　_: "+_);
	//IkagakaLogManager("　NowBalloon["+_+"].Number: "+NowBalloon[_].Number);
	//IkagakaLogManager("　NowBalloon["+_+"].LR: "+NowBalloon[_].LR);
	if(NowBalloon[_].LR==1){	//左右反転
		NowBalloon[_].LR = 0;
	}else{
		NowBalloon[_].LR = 1;
	}
	//IkagakaLogManager("　→NowBalloon["+_+"].LR: "+NowBalloon[_].LR);
	//IkagakaLogManager("　NowBalloon["+_+"].Text: "+NowBalloon[_].Text);
	//IkagakaLogManager("【バルーンマネージャー】終了");
	BalloonPlayer();
}
///////////// 目次 /////////////
//////////////////////////////// IkagakaLoader
//////////////////////////////// IkagakaUnloader
//////////////////////////////// IkagakaLogManager
//////////////////////////////// ShioriLogManager
//////////////////////////////// WindowManager
//////////////////////////////// GhostLoader
//////////////////////////////// EventManager
//////////////////////////////// ScriptPlayer
//////////////////////////////// ScriptBreaker
//////////////////////////////// SurfaceLoader
//////////////////////////////// SurfaceManager
//////////////////////////////// SurfacePlayer
//////////////////////////////// BaloonLoader
//////////////////////////////// BalloonManager
////	←イマココ！
//////////////////////////////// BalloonPlayer

//////////////////////////////// BalloonPlayer //////////////////////////////////
function BalloonPlayer(){
	//IkagakaLogManager("【バルーンプレイヤー】起動");

	var a = new Image();
	var i = new Number();
	var num = new Number();

	for(i=0;i<2;i++){
		if(i>0) num = 1; else num = 0;
		a = Balloon[num][NowBalloon[i].Number][NowBalloon[i].LR];
		//IkagakaLogManager("　Balloon["+num+"]["+NowBalloon[i].Number+"]["+NowBalloon[i].LR+"]: "+a.src);
		if(NowBalloon[i].LR==1){
			//IkagakaLogManager("　バルーンを右へ");
			$("#Ikagaka"+i+"Balloon")
				.css("background-image","url("+a.src+")")
				.css("filter","Chroma(color=#dccdab)")
				.width(a.width+"px")
				.height(a.height+"px")
				.css("left",Surface[NowSurface[i].Number].Image.width+"px")
				.css("top","0px")
				.css("z-index","200")
			;
			$("#Ikagaka"+i+"BalloonText")
				.css("background-color","transparent")
				.width(eval(a.width-30)+"px")
				.height(eval(a.height-20)+"px")
				.css("line-height","120%")
				.css("top","10px")
				.css("left","20px")
				.css("overflow","scroll")
				.css("z-index","210")
				.css("visibility","inherit")
			;
		}else{
			//IkagakaLogManager("　バルーンを左へ");
			$("#Ikagaka"+i+"Balloon")
				.css("background-image","url("+a.src+")")
				.css("filter","Chroma(color=#dccdab)")
				.width(a.width+"px")
				.height(a.height+"px")
				.css("left","-"+a.width+"px")
				.css("top","0px")
				.css("z-index","200")
			;
			$("#Ikagaka"+i+"BalloonText")
				.css("background-color","transparent")
				.width(eval(a.width-30)+"px")
				.height(eval(a.height-20)+"px")
				.css("line-height","120%")
				.css("top","10px")
				.css("left","10px")
				.css("overflow","scroll")
				.css("z-index","410")
				.css("visibility","inherit")
			;
		}
	}
	//IkagakaLogManager("【バルーンプレイヤー】終了");
}
///////////// 目次 /////////////
//////////////////////////////// IkagakaLoader
//////////////////////////////// IkagakaUnloader
//////////////////////////////// IkagakaLogManager
//////////////////////////////// ShioriLogManager
//////////////////////////////// WindowManager
//////////////////////////////// GhostLoader
//////////////////////////////// EventManager
//////////////////////////////// ScriptPlayer
//////////////////////////////// ScriptBreaker
//////////////////////////////// SurfaceLoader
//////////////////////////////// SurfaceManager
//////////////////////////////// SurfacePlayer
//////////////////////////////// BaloonLoader
//////////////////////////////// BalloonManager
//////////////////////////////// BalloonPlayer
////	←イマココ！