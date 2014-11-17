window.onerror = function(mes,file,num){ alert([ "file : " + file, "line : " + num, "message : " + mes ].join("\n")); return true; }
window.onload = IkagakaLoader;
//////////////////////////////// IkagakaLogManager ////////////////////////////////
//function IkagakaLogManager(_){
//	//如何かシステムログ
//	$("#IkagakaLog").append(_+"<br />\n");
//}

//////////////////////////////// WindowManager ////////////////////////////////
//function WindowManager(){
//	//Ｘウィンドウシステム
//}

//////////////////////////////// IkagakaLoader //////////////////////////////////
function IkagakaLoader(){
////////////ログ窓
/*	$("body").prepend(
		$("<textarea>")
		.attr("id","IkagakaLog")
		.attr("class","ikagaka")
		.width("300px")
		.height("400px")
		.css("position","absolute")
		.css("left","0px")
	);
*/	//IkagakaLogManager("【如何かブートローダー】起動");

////////////ベースウェア設定
//	URL = "http://www.nanican.net/dot-sakura/download/ghost/dot_sakura_000/";
	URL = "./";

	Character = 2;

////////////オプション


////////////ファイルロード
	TextLoad = function(_){
		var Text = new String();
		Text = _.responseText;
		Text = Text.replace(/\r\n/g,"\n");
		Text = Text.replace(/\r/g,"\n");
		var TextLine = new Array();
		TextLine = Text.split("\n");
		return TextLine;
	}

	BD = false;
	GD = false;
	SD = false;
	SS = false;

	BalloonDescript = jQuery.get(
		URL+"./balloon/ssp/descript.txt",
		function(){
			//IkagakaLogManager("BalloonDescript取得");
			BalloonDescript = TextLoad(BalloonDescript);
			BD=true;
			BalloonLoader();
			if(BD&&GD&&SD&&SS) IkagakaBooter();
		}
	);
	ShellDescript = jQuery.get(
		URL+"./shell/master/descript.txt",
		function(){
			//IkagakaLogManager("ShellDescript取得");
			ShellDescript = TextLoad(ShellDescript);
			SD=true;
			if(SD&&SS) ShellLoader();
			if(BD&&GD&&SD&&SS) IkagakaBooter();
		}
	);
	ShellSurfaces = jQuery.get(
		URL+"./shell/master/surfaces.txt",
		function(){
			//IkagakaLogManager("ShellSurfaces取得");
			ShellSurfaces = TextLoad(ShellSurfaces);
			SS=true;
			if(SD&&SS) ShellLoader();
			if(BD&&GD&&SD&&SS) IkagakaBooter();
		}
	);
	GhostDescript = jQuery.get(
		URL+"./ghost/master/descript.txt",
		function(){
			//IkagakaLogManager("GhostDescript取得");
			GhostDescript = TextLoad(GhostDescript);
			GD=true;
			GhostLoader();
			if(BD&&GD&&SD&&SS) IkagakaBooter();
		}
	);
}

//////////////////////////////// IkagakaBooter //////////////////////////////////
function IkagakaBooter(){
//////////IkagakaLoaderからの続き

//////////現在状態の初期化
	//IkagakaLogManager("　現在状態の初期化開始");

	BD = false;
	GD = false;
	SD = false;
	SS = false;

	Scope = new Number(0);	//スコープ

	NowSurface = new Array();
	NowSurface[0] = new Array();
	NowSurface[1] = new Array();
	NowSurface[0]["Number"] = new Number(0);	//￥０サーフェス番号
	NowSurface[1]["Number"] = new Number(10);	//￥１サーフェス番号

	NowBalloon = new Array();
	NowBalloon[0] = new Array();
	NowBalloon[1] = new Array();
	NowBalloon[0].Number = new Number(0);	//￥０バルーン番号
	NowBalloon[1].Number = new Number(0);	//￥１バルーン番号
	NowBalloon[0].LR = new Number(0);	//￥０バルーン左
	NowBalloon[1].LR = new Number(0);	//￥０バルーン左

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
			.width("100%")
			.height("100%")
			.css("left","0px")
			.css("bottom","0px")
			.css("visibility","hidden")
			.css("z-index","1000")
	);
	for(var i=0;i<Character;i++){
		$("#Ikagaka").prepend(
			$("<div>")
			.attr("id","Ikagaka"+i)
			.attr("class","ikagaka")
			.css("bottom","0px")
			.css("left","0px")
			.css("z-index","1100")
			.css("visibility","visible")
			.draggable({cursor:'move'})
		);
		$("#Ikagaka"+i).prepend(
			$("<div>")
			.attr("id","Ikagaka"+i+"Surface")
			.attr("class","ikagaka")
			.css("z-index","1200")
			.css("visibility","visible")
		);
		$("#Ikagaka"+i).prepend(
			$("<div>")
			.attr("id","Ikagaka"+i+"Balloon")
			.attr("class","ikagaka")
			.css("z-index","1500")
			.css("visibility","visible")
			.hide()
		);
		eval('$("#Ikagaka"+i+"Balloon").click(function(){if(NowBalloon['+i+'].LR==1){NowBalloon['+i+'].LR = 0;}else{NowBalloon['+i+'].LR = 1;}BalloonPlayer('+i+')})');
		$("#Ikagaka"+i+"Balloon").prepend(
			$("<div>")
			.attr("id","Ikagaka"+i+"BalloonText")
			.attr("class","ikagaka")
			.css("z-index","1600")
			.css("overflow","scroll")
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
	;

	$("#Ikagaka0").css("left","50%");
	$("#Ikagaka1").css("left","10%");

	//IkagakaLogManager("　ＣＳＳ設定完了");

//////////タスク起動
	//IkagakaLogManager("　タスク起動");

//////////起動完了
	//IkagakaLogManager("起動完了！");
	//IkagakaLogManager("");


	for(var i=0;i<Character;i++){
		BalloonPlayer(i);
	}
	EventManager('OnBoot');
}

//////////////////////////////// BaloonLoader ////////////////////////////////
function BalloonLoader(){
///////////バルーン読込
	//IkagakaLogManager("　【バルーンローダー】起動");
	var a = BalloonDescript;
	for(var i=0;i<a.length;i++){
		if(a[i].match(/^charset,/i)){
			BalloonDescript.charset = a[i].substr(8);
		}else if(a[i].match(/^name,/i)){
			BalloonDescript.name = a[i].substr(5);
		}else if(a[i].match(/^id,/i)){
			BalloonDescript.id = a[i].substr(3);
		}else if(a[i].match(/^craftman,/i)){
			BalloonDescript.craftman = a[i].substr(9);
		}else if(a[i].match(/^craftmanurl,/i)){
			BalloonDescript.craftmanurl = a[i].substr(12);
//		}else if(a[i].match(/^sakura.name,/i)){
//		}else if(a[i].match(/^kero.name,/i)){
		}
	}

	//	各設定ファイル読込はいまのところ略
	Balloon = new Array();
	Balloon[0] = new Array();	//さくら
	Balloon[0][0] = new Array();	//並
	Balloon[0][2] = new Array();	//大
	Balloon[0][0][0] = new Image();	//左
	Balloon[0][0][0].src = URL+"./balloon/ssp/balloons0.png";	//さくら並左
	Balloon[0][0][1] = new Image();	//右
	Balloon[0][0][1].src = URL+"./balloon/ssp/balloons1.png";	//さくら並右
	Balloon[0][2][0] = new Image();	//左
	Balloon[0][2][0].src = URL+"./balloon/ssp/balloons2.png";	//さくら大左
	Balloon[0][2][1] = new Image();	//右
	Balloon[0][2][1].src = URL+"./balloon/ssp/balloons3.png";	//さくら大右
	Balloon[1] = new Array();	//うにゅう
	Balloon[1][0] = new Array();	//並
	Balloon[1][2] = new Array();	//大
	Balloon[1][0][0] = new Image();	//左
	Balloon[1][0][0].src = URL+"./balloon/ssp/balloonk0.png";	//うにゅう並左
	Balloon[1][0][1] = new Image();	//右
	Balloon[1][0][1].src = URL+"./balloon/ssp/balloonk1.png";	//うにゅう並右
	Balloon[1][2][0] = new Image();	//左
	Balloon[1][2][0].src = URL+"./balloon/ssp/balloonk2.png";	//うにゅう大左
	Balloon[1][2][1] = new Image();	//右
	Balloon[1][2][1].src = URL+"./balloon/ssp/balloonk3.png";	//うにゅう大右

	//IkagakaLogManager("　【バルーンローダー】終了");
}

//////////////////////////////// BalloonPlayer //////////////////////////////////
function BalloonPlayer(_){
///////////左右反転に特化
	//IkagakaLogManager("【バルーンプレイヤー】起動");

	var a = new Image();
	var i = _;
	var num = new Number();

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
				.css("top","0px")
				.css("left",Surface[NowSurface[i].Number].Image.width+"px")
			;
			$("#Ikagaka"+i+"BalloonText")
				.width(eval(a.width-30)+"px")
				.height(eval(a.height-20)+"px")
				.css("top","10px")
				.css("left","14px")
				.css("line-height","130%")
			;
		}else{
			//IkagakaLogManager("　バルーンを左へ");
			$("#Ikagaka"+i+"Balloon")
				.css("background-image","url("+a.src+")")
				.css("filter","Chroma(color=#dccdab)")
				.width(a.width+"px")
				.height(a.height+"px")
				.css("top","0px")
				.css("left","-"+a.width+"px")
			;
			$("#Ikagaka"+i+"BalloonText")
				.width(eval(a.width-30)+"px")
				.height(eval(a.height-20)+"px")
				.css("top","10px")
				.css("right","14px")
				.css("line-height","130%")
			;
		}
	//IkagakaLogManager("【バルーンプレイヤー】終了");
}

//////////////////////////////// ShellLoader //////////////////////////////////
function ShellLoader(){
///////////シェル読込
	//IkagakaLogManager("　【シェルローダー】起動");

	var a = ShellDescript;
	for(i=0;i<a.length;i++){
		if(a[i].match(/^charset,/i)){
			ShellDescript.charset = a[i].substr(8);
		}else if(a[i].match(/^name,/i)){
			ShellDescript.name = a[i].substr(5);
		}else if(a[i].match(/^id,/i)){
			ShellDescript.id = a[i].substr(3);
		}else if(a[i].match(/^craftman,/i)){
			ShellDescript.craftman = a[i].substr(9);
		}else if(a[i].match(/^craftmanurl,/i)){
			ShellDescript.craftmanurl = a[i].substr(12);
//		}else if(a[i].match(/^element\d+,.+,.+,\d+,\d+/i)){
//			var ary = a[i].split(/^element\d+,.+,.+,\d+,\d+/i)
//			Surface[i].element.pattern = ary[1];
//			Surface[i].element.image = ary[2];
//			Surface[i].element[ary[0]][] = ary[3];
//			Surface[i].element[ary[0]][] = ary[4];
//			
//		}else if(a[i].match(/^kero.name,/i)){
		}
	}

	Surface = new Array();
	var i = new Number();
	var a = false;
	var b = false;
	var num = new Number();
	var ary = new Array();

	for(i=0;i<ShellSurfaces.length;i++){
		if(a){
			if(b){
				if(ShellSurfaces[i].match(/^collision\d+,\d+,\d+,\d+,\d+,.+/i)){
					ary = ShellSurfaces[i].split(",");
					ary[0] = ary[0].substr(9);
					Surface[num][ary[0]] = new Array();
					Surface[num][ary[0]][1] = ary[1];
					Surface[num][ary[0]][2] = ary[2];
					Surface[num][ary[0]][3] = ary[3];
					Surface[num][ary[0]][4] = ary[4];
					Surface[num][ary[0]].Name = ary[5];
					//IkagakaLogManager("　　　Surface["+num+"]["+ary[0]+"].Name: "+Surface[num][ary[0]].Name+"　読込");
				}else if(ShellSurfaces[i].match(/^\}/)){
					a = false;
					b = false;
					//IkagakaLogManager("　　surface"+num+"　読込完了");
				}
			}else if(ShellSurfaces[i].match(/^\{/)){
				b = true;
			}
		}else if(ShellSurfaces[i].match(/^surface\d+$/i)){
			a = true;
			num = ShellSurfaces[i].substr(7);
			Surface[num] = new Array();
			Surface[num].Image = new Image();
			Surface[num].Image.src = URL+"shell/master/surface"+num+".png";	//何故かここでURL読込
			//IkagakaLogManager("　　　"+Surface[num].Image.src+"　読込");
		}
	}
	//IkagakaLogManager("　【シェルローダー】終了");
}

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
		;
		//IkagakaLogManager("　"+a.src+"　反映");

		$("#Ikagaka"+i+"Surface").empty();

		$("#Ikagaka"+i+"Surface").prepend(
			$("<div>")
				.attr("id","Ikagaka"+i+"Collision")
				.attr("class","ikagaka")
				.width(a.width+"px")
				.height(a.height+"px")
				.css("visibility","inherit")
				.css("position","absolute")
				.css("z-index","1300")
		);
		eval('$("#Ikagaka"+i+"Collision")'+'.dblclick(function(){EventManager("OnMouseDoubleClick,'+i+'")});');
		while(Surface[i][j]){
			ary = Surface[NowSurface[i].Number][j];
			$("#Ikagaka"+i+"Surface").prepend(
				$("<div>")
				.attr("id","Ikagaka"+i+"Collision"+j)
				.attr("class","ikagaka")
				.css("left",ary[1]+"px")
				.css("top",ary[2]+"px")
				.width(eval(ary[3]-ary[1])+"px")
				.height(eval(ary[4]-ary[2])+"px")
				.css("background-color","transparent")
				.css("visibility","visible")
				.css("cursor","pointer")
				.css("position","absolute")
				.css("z-index","1400")
			);
			eval('$("#Ikagaka"+i+"Collision"+j)'+'.dblclick(function(){EventManager("OnMouseDoubleClick,'+i+','+ary.Name+'")});');
			//IkagakaLogManager("　Ikagaka"+i+"Collision"+j+"　に　OnMouseDoubleClick,0,"+ary.Name+"　イベント定義");
			j++;
		}
	}
//	$(".ikagaka").css("border","1px solid #FF0000");
	//IkagakaLogManager("【サーフィスプレイヤー】終了");
}

//////////////////////////////// GhostLoader ////////////////////////////////
function GhostLoader(){
	//ゴースト読込
	//IkagakaLogManager("　【ゴーストローダー】起動");
	var a = GhostDescript;
	for(i=0;i<a.length;i++){
		if(a[i].match(/^charset,/i)){
			GhostDescript.charset = a[i].substr(8);
		}else if(a[i].match(/^name,/i)){
			GhostDescript.name = a[i].substr(5);
		}else if(a[i].match(/^id,/i)){
			GhostDescript.id = a[i].substr(3);
		}else if(a[i].match(/^craftman,/i)){
			GhostDescript.craftman = a[i].substr(9);
		}else if(a[i].match(/^craftmanurl,/i)){
			GhostDescript.craftmanurl = a[i].substr(12);
//		}else if(a[i].match(/^sakura.name,/i)){
//		}else if(a[i].match(/^kero.name,/i)){
		}
	}
	//IkagakaLogManager("　【ゴーストローダー】終了");
}

//////////////////////////////// EventManager ////////////////////////////////
function EventManager(_){
	window.clearTimeout(Tid);
	for(var i=0;i<2;i++){
		$("#Ikagaka"+i+"Balloon").hide();
		$("#Ikagaka"+i+"BalloonText").text('');
	}
	//IkagakaLogManager("【イベントマネージャー】起動");

	var a=_.split(",");
	//IkagakaLogManager("　Event: "+a[0]);
	//IkagakaLogManager("　value: "+a[1]);
	//IkagakaLogManager("　value: "+a[2]);

	if(a[0]=="OnBoot"){
		SakuraScript = new String("\\0\\s[3]みんななんでこんな時間でも起きてるんだろう？\\w8\\w8\\1\\s[10]世の中知らん方がええこともあるで‥‥\\e");
	}else if(a[0]=="OnMouseDoubleClick"){
		if(a[1]==1){
			SakuraScript = new String("\\1\\s[10]あー。\\w8\\nわいはやる気ないから、つついても無駄やで‥‥。\\e");
		}else if(a[2]){
			if(a[2].match(/Head/)){
				SakuraScript = new String("\\0\\s[1]ご主人様、お呼びですか？\\e");
			}else if(a[2].match(/Face/)){
				SakuraScript = new String("\\0\\s[3]痛いからつつかないで～。\\e");
			}else if(a[2].match(/Bust/)){
				SakuraScript = new String("\\0\\s[7]ムネを突くなっ！\\1\\s[11]落ち着けっ！\\e");
				}
		}else{
			SakuraScript = new String("\\0\\s[6]めにゅーとかはありません。\\w8\\e");
		}
	}else if(a[0]=="OnAnchorSelect"){
		SakuraScript='\\1リンクなんて飾りです。\\w8偉い人にはそれがわからんのです。\\e';
	}else if(a[0]=="OnPlayScript"){
		SakuraScript=a[1];
	}else{
		SakuraScript='\\0\\s[0]\\1\\s[10]\\e';
	}
	//IkagakaLogManager("　【擬似栞】→"+SakuraScript);
	//IkagakaLogManager("【イベントマネージャー】終了");
	ScriptPlayer(SakuraScript);
}

//////////////////////////////// ScriptPlayer //////////////////////////////////
function ScriptPlayer(_){
	//IkagakaLogManager("【スクリプトプレイヤー】起動");
	//IkagakaLogManager("　ID: "+Tid);
	RemainScript = _;
	AddScript = "";

	if(RemainScript.match(/^\\/)){	//現在状態の変更
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
		}else if(RemainScript.match(/^\\b\[-?\d+\]/)){	//バルーン切り替え
			NowBalloon[Scope].Number = RemainScript.substr(3).match(/-?\d+/);
			RemainScript = RemainScript.replace(/^\\b\[-?\d+\]/,'');
			BalloonPlayer(Scope);	//バルーン更新
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

	if(AddScript){	//現在状況の反映
		$("#Ikagaka"+Scope+"Balloon").show();
		$("#Ikagaka"+Scope+"BalloonText").append(AddScript);
	}

	if(RemainScript.length>0){	//制御
		//IkagakaLogManager("【スクリプトプレイヤー】継続");
		Tid = window.setTimeout("ScriptPlayer(RemainScript)",Wait);
	}else{
		//IkagakaLogManager("【スクリプトプレイヤー】終了");
		Tid = window.setTimeout("ScriptBreaker()",5000);
	}
}

//////////////////////////////// ScriptBreaker ////////////////////////////////
function ScriptBreaker(){
	//IkagakaLogManager("【スクリプトブレイカー】"+Tid);
	for(var i=0;i<2;i++){
		$("#Ikagaka"+i+"Balloon").hide();
		NowBalloon[i].Text = "";
		$("#Ikagaka"+i+"BalloonText").text('');
	}
}
