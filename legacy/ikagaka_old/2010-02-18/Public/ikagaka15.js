//	エラーが出たときのおまじない
window.onerror = function(mes,file,num){ alert([ "file : " + file, "line : " + num, "message : " + mes ].join("\n")); return true; }

//	見ちゃらめぇぇぇぇぇ！
window.onload = IkagakaLoader;

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//　起　動

//	初期設定

function IkagakaLoader(){
	//	&Log()のＤＯＭ作成
/*
	$("body").prepend(
		$("<textarea>")
		.attr("id","IkagakaLog")
		.attr("class","ikagaka")
		.width("100%")
		.height("100%")
		.css("margin","0px")
		.css("padding","0px")
		.css("position","absolute")
		.css("left","0px")
		.css("top","0px")
		.css("border","1px solid #ff0000")
		.css("z-index","-1000")
	);
*/
	//Log("IkagakaLoader");

	//	設定ファイルＵＲＬ
	URL = new Array();
	URL.Balloon = "./balloon/ssp/";
	URL.Ghost = "./ghost/master/";
	URL.Shell = "./shell/master/";


	//	設定ファイルをここで一気に読み込む。一つでもミスったら起動しない。

	//	設定ファイルロード終了フラグ初期化
	BD = false;
	GD = false;
	SD = false;
	SS = false;

	//	surface0000...の桁数
	SurfaceRank = 0;

	//	ghostのdescript.txtを読み込む。
	GhostText = jQuery.get(
		URL.Ghost+"./descript.txt"
		,function(){
			var Text = TextLoader(GhostText.responseText)
			GhostLoader(Text);
			GD = true;
			if(BD&&GD&&SD&&SS) IkagakaBooter();
		}
	);

	//	balloonのdescript.txtを読み込む。
	BalloonText = jQuery.get(
		URL.Balloon+"./descript.txt"
		,function(){
			var Text = TextLoader(BalloonText.responseText)
			BalloonLoader(Text);
			BD = true;
			if(BD&&GD&&SD&&SS) IkagakaBooter();
		}
	);

	//	shellのdescript.txtを読み込む。
	ShellText = jQuery.get(
		URL.Shell+"./descript.txt"
		,function(){
			var Text = TextLoader(ShellText.responseText)
			ShellLoader(Text);
			SD = true;
			if(BD&&GD&&SD&&SS) IkagakaBooter();
		}
	);

	//	shellのsurface.txtを読み込む。
	SurfacesText = jQuery.get(
		URL.Shell+"./surfaces.txt"
		,function(){
			var Text = TextLoader(SurfacesText.responseText)
			SurfacesLoader(Text);
			SS = true;
			if(BD&&GD&&SD&&SS) IkagakaBooter();
		}
	);

	//Log(" file loading");
	//Log(" ");
}

//	設定ファイル読み込んだ後のブートの続き。
function IkagakaBooter(){
	//Log(" ");
	//Log("IkagakaBooter");

	//	フラグ消去。
	BD = false;
	GD = false;
	SD = false;
	SS = false;

	//Log(" setting");

	//	キャラクター数制限
	Character = 2;

	//	初期位置。
	Reason = 0;

	//	固定位置。0:自由移動、1:下端に固定
	Fixed = 0;

	//	初期スコープ
	Scope = 0;

	//	現在のサーフェス／バルーンの値の初期化
	NowSurface = new Array();
	NowBalloon = new Array();
	for(var i=0;i<Character;i++){
		NowSurface[i] = new Array();
		NowSurface[i].Number = 0;	//サーフェス番号
		NowBalloon[i] = new Array();
		NowBalloon[i].Number = 0;	//バルーン番号
		NowBalloon[i].LR = 0;	//バルーン左
	}

	//	初期サーフェス／バルーン
	NowSurface[0].Number = new Number(0);	//￥０サーフェス番号
	NowSurface[1].Number = new Number(10);	//￥１サーフェス番号
	NowBalloon[0].LR = new Number(0);	//￥０バルーン左
	NowBalloon[1].LR = new Number(1);	//￥１バルーン右

	//	実行するSakuraScript
	SakuraScript = new String();

	//	発話する一文字
	AddScript = new String();

	//	残りのSakuraScript文字列
	RemainScript = new String();

	//	一文字ウェイト初期値
	Wait = new Number(50);

	//	タイマーＩＤ
	Tid = new Number(0);


	//Log(" builting");

	//	如何か基礎
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
			.draggable({cursor:"move"})
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
			.dblclick(function(){ScriptBreaker();})
			.hide()
		);
		$("#Ikagaka"+i+"Balloon").prepend(
			$("<div>")
			.attr("id","Ikagaka"+i+"BalloonText")
			.attr("class","ikagaka")
			.css("z-index","1600")
			.css("overflow","scroll")
		);

	}


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

	//	キャラクタ初期位置
	for(var i=0;i<Character;i++){
		$("#Ikagaka"+i).css("left","0px");
//		$("#Ikagaka"+i).css("z-index","-100000000");
	}
	$("#Ikagaka0").css("left","50%");
	$("#Ikagaka1").css("left","10%");

	//	領域表示
//	$(".ikagaka").css("border","1px solid #FF0000");

	//Log("booted");
	//Log(" ");

	Tid = window.setTimeout("sub()",3000);
}

//	付け焼刃
function sub(){
	for(var i=0;i<Character;i++){
		SurfacePlayer(i);
		BalloonPlayer(i);
		$("#Ikagaka"+i+"Surface").hide();
		$("#Ikagaka"+i+"Balloon").hide();
	}
	$("#Ikagaka0Surface").show();
	$("#Ikagaka1Surface").show();
	EventManager("OnBoot");
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//　ス　ク　リ　プ　ト　エ　ン　ジ　ン

function EventManager(_){
	window.clearTimeout(Tid);
	for(var i=0;i<Character;i++){
		$("#Ikagaka"+i+"Balloon").hide();
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
			SakuraScript = new String("\\1\\s[10]あー。\\w8\\nわいはやる気ないから、つついても無駄やで‥‥。\\e");
		}else if(a[2]){
			if(a[2].match(/Head/)){
				SakuraScript = new String("\\0\\s[1]ご主人様、お呼びですか？\\e");
			}else if(a[2].match(/Face/)){
				SakuraScript = new String("\\0\\s[3]痛いからつつかないで～。\\e");
			}else if(a[2].match(/Bust/)){
				SakuraScript = new String("\\0\\s[7]ムネを突くなっ！\\1\\s[10]落ち着けっ！\\e");
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


function ScriptPlayer(_){
	//IkagakaLogManager("【スクリプトプレイヤー】起動");
	//IkagakaLogManager("　ID: "+Tid);
	//IkagakaLogManager("   "+RemainScript);
	//IkagakaLogManager("   "+AddScript);
	window.clearTimeout(Tid);
	RemainScript = _;
	AddScript = "";

	if(RemainScript.match(/^\\/)){	//現在状態の変更
		if(RemainScript.match(/^\\0/) || RemainScript.match(/^\\h/)){	//さくら
			Scope = 0;
			RemainScript = RemainScript.substr(2);
		}else if(RemainScript.match(/^\\1/) || RemainScript.match(/^\\u/)){	//うにゅう
			Scope = 1;
			RemainScript = RemainScript.substr(2);
		}else if(RemainScript.match(/^\\p\[\d+\]/)){	//その他
			Scope = RemainScript.substr(3).match(/\d+/);
			RemainScript = RemainScript.replace(/^\\p\[\d+\]/,'');
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
		}else if(RemainScript.match(/^\\s[0-9]/)){	//サーフェス切り替え
			if(RemainScript.substr(2,1)<0){
				$("#Ikagaka"+Scope+"Surface").hide();
			}else{
				NowSurface[Scope].Number = RemainScript.substr(2,1);
				RemainScript = RemainScript.substr(3);
				$("#Ikagaka"+Scope+"Surface").show();
				if(typeof(Surface[NowSurface[Scope].Number])!="undefined") SurfacePlayer(Scope);	//サーフェス更新
			}
		}else if(RemainScript.match(/^\\s\[-?\d+\]/)){	//サーフェス切り替え
			if(RemainScript.substr(3).match(/-?\d+/)<0){
				$("#Ikagaka"+Scope+"Surface").hide();
			}else{
				NowSurface[Scope].Number = RemainScript.substr(3).match(/-?\d+/);
				RemainScript = RemainScript.replace(/^\\s\[-?\d+\]/,'');
				$("#Ikagaka"+Scope+"Surface").show();
				if(typeof(Surface[NowSurface[Scope].Number])!="undefined") SurfacePlayer(Scope);	//サーフェス更新
			}
		}else if(RemainScript.match(/^\\b\[-?\d+\]/)){	//バルーン切り替え
			NowBalloon[Scope].Number = RemainScript.substr(3).match(/-?\d+/);
			RemainScript = RemainScript.replace(/^\\b\[-?\d+\]/,'');
			if(NowSurface[Scope].Number<0){
				$("#Ikagaka"+Scope+"Balloon").hide();
			}else{
				$("#Ikagaka"+Scope+"Balloon").show();
				if(typeof(Balloon[NowSurface[Scope].Number])!="undefined") BalloonPlayer(Scope);	//バルーン更新
			}
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


function ScriptBreaker(){
	//IkagakaLogManager("【スクリプトブレイカー】"+Tid);
	window.clearTimeout(Tid);
	for(var i=0;i<Character;i++){
		$("#Ikagaka"+i+"Balloon").hide();
		NowBalloon[i].Text = "";
		$("#Ikagaka"+i+"BalloonText").text('');
	}
}




/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//　ヴィジュアル系

//////////////////////////////// SurfacePlayer ////////////////////////////////
function SurfacePlayer(_){
	//IkagakaLogManager("【サーフィスプレイヤー】起動");

	var a = new Image();
	var i = _;
	var j = new Number(0);
	var k = new Number(0);
	var ary = new Array();

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
		while(Surface[NowSurface[i].Number].collision[j]){
			ary = Surface[NowSurface[i].Number].collision[j];
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
			eval('$("#Ikagaka"+i+"Collision"+j)'+'.dblclick(function(){EventManager("OnMouseDoubleClick,'+i+','+ary.name+'")});');
			//IkagakaLogManager("　Ikagaka"+i+"Collision"+j+"　に　OnMouseDoubleClick,0,"+ary.Name+"　イベント定義");
			j++;
		}
		j=0;
		while(Surface[NowSurface[i].Number].elememt[j]){
			ary = Surface[NowSurface[i].Number].elememt[j];
			if(ary.pattern=="overlay"){
				$("#Ikagaka"+i+"Surface").prepend(
					$("<div>")
					.attr("id","Ikagaka"+i+"Element"+j)
					.attr("class","ikagaka")
					.css("left",ary.x+"px")
					.css("top",ary.y+"px")
					.width(ary.image.width+"px")
					.height(ary.image.height+"px")
					.css("background-image","url("+ary.image.src+")")
					.css("visibility","visible")
					.css("position","absolute")
					.css("z-index","1200")
				);
			}else if(ary.pattern=="base"){
				$("#Ikagaka"+i+"Surface")
					.css("background-image","url("+ary.image.src+")")
					//.css("filter","Chroma(color=#0000ff)")
					.width(ary.image.width+"px")
					.height(ary.image.height+"px")
				;
//			}else if(ary.pattern=="move"){	//	エレメント合成にこんなの要るの？
//			}else if(ary.pattern=="overlayfast"){	//こんなのムリ
			}
			j++;
		}
/*		j=0;
		k=0;
		while(Surface[NowSurface[i].Number].interval[j]){
//			Surface[NowSurface[i].Number].interval[j].pettern;	//タイミングのことかー？
			while(Surface[NowSurface[i].Number].interval[j].pattern[k]){
				ary = Surface[NowSurface[i].Number].interval[j].pattern[k];
				//IkagakaLogManager(ary);
				//IkagakaLogManager(Surface[ary.number].Image.src);
				if(ary.pattern=="overlay"){
					$("#Ikagaka"+i+"Surface").prepend(
						$("<div>")
						.attr("id","Ikagaka"+i+"Animate"+j)
						.attr("class",".ikagaka")
						.css("width",Surface[ary.number].Image.width+"px")
						.css("height",Surface[ary.number].Image.height+"px")
						.css("top",ary.y+"px")
						.css("left", ary.x+"px")
					);
					$("#Ikagaka"+i+"Animate"+j).animate(
						{},
						{
							duration: 1000,
							complete: function(){$("#Ikagaka"+i+"Animate"+j).css("background-image","url("+Surface[ary.number].Image.src+")");}
						}
					);
				}
				k++;
			}
			j++;
		}
*/
//	$(".ikagaka").css("border","1px solid #FF0000");
	//IkagakaLogManager("【サーフィスプレイヤー】終了");
}





function BalloonPlayer(_){
///////////左右反転に特化
	//IkagakaLogManager("【バルーンプレイヤー】起動");

	var a = new Image();
	var i = _;
	var num = new Number();
	if(i>0) num = 1; else num = 0;
	var ary = new Array();
	ary[0] = Descript.Shell.sakura;
	ary[1] = Descript.Shell.kero;
		a = Balloon[NowBalloon[i].Number][num][NowBalloon[i].LR];
		//IkagakaLogManager("　Balloon["+num+"]["+NowBalloon[i].Number+"]["+NowBalloon[i].LR+"]: "+a.src);

		if(NowBalloon[i].LR==1){
			//IkagakaLogManager("　バルーンを右へ");
			$("#Ikagaka"+i+"Balloon")
				.css("background-image","url("+a.src+")")
				.css("filter","Chroma(color=#dccdab)")
				.width(a.width+"px")
				.height(a.height+"px")
				.css("top",ary[num].balloon.offsety+"px")
				.css("left",eval(Surface[NowSurface[i].Number].Image.width + ary[num].balloon.offsetx)+"px")
			;
			$("#Ikagaka"+i+"BalloonText")
				.width(eval(a.width - Descript.Balloon.origin.x * 2)+"px")
				.height(eval(a.height - Descript.Balloon.origin.y * 2)+"px")
				.css("top",Descript.Balloon.origin.y+"px")
				.css("left",eval(Descript.Balloon.origin.x)+"px")
				.css("line-height","130%")
			;
		}else{
			//IkagakaLogManager("　バルーンを左へ");
			$("#Ikagaka"+i+"Balloon")
				.css("background-image","url("+a.src+")")
				.css("filter","Chroma(color=#dccdab)")
				.width(a.width+"px")
				.height(a.height+"px")
				.css("top",ary[num].balloon.offsety+"px")
				.css("left","-"+eval(a.width + ary[num].balloon.offsetx)+"px")
			;
			$("#Ikagaka"+i+"BalloonText")
				.width(eval(a.width - Descript.Balloon.origin.x * 2)+"px")
				.height(eval(a.height - Descript.Balloon.origin.y * 2)+"px")
				.css("top",Descript.Balloon.origin.y+"px")
				.css("left",Descript.Balloon.origin.x+"px")
				.css("line-height","130%")
			;
		}
	//IkagakaLogManager("【バルーンプレイヤー】終了");
}






/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//　フ　ァ　イ　ル　ロ　ー　ド

function GhostLoader(_){
	//Log("GhostLoader");
	DescriptLoader("Ghost",_);
	//Log("finished");
}

function ShellLoader(_){
	//Log("ShellLoader");
	DescriptLoader("Shell",_);
	//Log("finished");
}

function BalloonLoader(_){
	//Log("BalloonLoader");
	DescriptLoader("Balloon",_);

	//	各設定ファイル読込はいまのところ略

	//	バルーン配列。Balloon[番号][スコープ][左右]
	Balloon = new Array();
	Balloon[0] = new Array();
	Balloon[0][0] = new Array();
	Balloon[0][0][0] = new Image();
	Balloon[0][0][0].src = URL.Balloon+"./balloons0.png";
	Balloon[0][0][1] = new Image();
	Balloon[0][0][1].src = URL.Balloon+"./balloons1.png";
	Balloon[0][1] = new Array();
	Balloon[0][1][0] = new Image();
	Balloon[0][1][0].src = URL.Balloon+"./balloonk0.png";
	Balloon[0][1][1] = new Image();
	Balloon[0][1][1].src = URL.Balloon+"./balloonk1.png";
	Balloon[2] = new Array();
	Balloon[2][0] = new Array();
	Balloon[2][0][0] = new Image();
	Balloon[2][0][0].src = URL.Balloon+"./balloons2.png";
	Balloon[2][0][1] = new Image();
	Balloon[2][0][1].src = URL.Balloon+"./balloons3.png";
	Balloon[2][1] = new Array();
	Balloon[2][1][0] = new Image();
	Balloon[2][1][0].src = URL.Balloon+"./balloonk2.png";
	Balloon[2][1][1] = new Image();
	Balloon[2][1][1].src = URL.Balloon+"./balloonk3.png";

	//Log("finished");
}


function SurfacesLoader(_){
	//Log("SurfacesLoader");

	Surface = new Array();
	var i = new Number();
	var a = false;
	var b = false;
	var num = new Number();
	var ary = new Array();
	var c;
	SurfacesText=_;
	for(i=0;i<SurfacesText.length;i++){
		if(a){
			if(b){
				if(SurfacesText[i].match(/^\d+pattern\d+,\d+,\d+,.+,\d+,\d+/i)){
					ary = SurfacesText[i].split(",");
					c = ary[0].match(/^\d+/);
					ary[0] = ary[0].match(/\d+$/);
					if(typeof(Surface[num].interval[c])=="object") ; else Surface[num].interval[c] = new Array();
					if(typeof(Surface[num].interval[c].pattern)=="object") ; else Surface[num].interval[c].pattern = new Array();
					Surface[num].interval[c].pattern[ary[0]] = new Array();
					Surface[num].interval[c].pattern[ary[0]].number = ary[1];
					Surface[num].interval[c].pattern[ary[0]].wait = ary[2];
					Surface[num].interval[c].pattern[ary[0]].pattern = ary[3];
					Surface[num].interval[c].pattern[ary[0]].x = ary[4];
					Surface[num].interval[c].pattern[ary[0]].y = ary[5];
				}else if(SurfacesText[i].match(/^\d+interval,.+/i)){
					ary = SurfacesText[i].split(",");
					ary[0] = ary[0].match(/^\d+/);
					if(typeof(Surface[num].interval[ary[0]])=="object") ; else Surface[num].interval[ary[0]] = new Array();
					Surface[num].interval[ary[0]] = new Array();
					Surface[num].interval[ary[0]].timing = a[1];
				}else if(SurfacesText[i].match(/^element\d+,.+,.+,\d+,\d+/i)){
					ary = SurfacesText[i].split(",");
					ary[0] = ary[0].substr(7);
					Surface[num].elememt[ary[0]] = new Array();
					Surface[num].elememt[ary[0]].pattern = ary[1];
					Surface[num].elememt[ary[0]].image = new Image();
					Surface[num].elememt[ary[0]].image.src = URL.Shell+ary[2];
					Surface[num].elememt[ary[0]].x = ary[3];
					Surface[num].elememt[ary[0]].y = ary[4];
				}else if(SurfacesText[i].match(/^collision\d+,\d+,\d+,\d+,\d+,.+/i)){
					ary = SurfacesText[i].split(",");
					ary[0] = ary[0].substr(9);
					Surface[num].collision[ary[0]] = new Array();
					Surface[num].collision[ary[0]][1] = ary[1];
					Surface[num].collision[ary[0]][2] = ary[2];
					Surface[num].collision[ary[0]][3] = ary[3];
					Surface[num].collision[ary[0]][4] = ary[4];
					Surface[num].collision[ary[0]].name = ary[5];
				}else if(SurfacesText[i].match(/^\}/)){
					a = false;
					b = false;
					//Log(" reading surface"+num);
				}
			}else if(SurfacesText[i].match(/^\{/)){
				b = true;
			}
		}else if(SurfacesText[i].match(/^surface\d+$/i)){
			a = true;
			num = SurfacesText[i].substr(7);
			Surface[num] = new Array();
			Surface[num].collision = new Array();
			Surface[num].elememt = new Array();
			Surface[num].interval = new Array();
			Surface[num].Image = new Image();
			Surface[num].Image.src = URL.Shell+"./surface"+num+".png";	//何故かここでURL読込
			//Log(" read "+Surface[num].Image.src);
		}
	}
	//Log("finished");
}



//	descript.txt読み込み専用関数。DescriptLoader(設定ファイルの種類,内容)
function DescriptLoader(x,y){
	//Log(" DescriptLoader");
	//Log("  type: "+x);
	//	//Log("  content: "+y);
	var ary = y;
	if(typeof(Descript)=="undefined") Descript = new Array();
	Descript[x] = new Array();
	for(var i=0;i<ary.length;i++){
		if(ary[i]){
		///共通
			if(ary[i].match(/^charset,/i)){
				Descript[x].charset = ary[i].substr(8);
				//Log("  Descript.."+x+".charset: "+Descript[x].charset);
			}else if(ary[i].match(/^name,/i)){
				Descript[x].name = ary[i].substr(5);
				//Log("  Descript.."+x+".name: "+Descript[x].name);
			}else if(ary[i].match(/^type,/i)){
				Descript[x].type = ary[i].substr(5);
				//Log("  Descript.."+x+".type: "+Descript[x].type);
			}else if(ary[i].match(/^id,/i)){
				Descript[x].id = ary[i].substr(3);
				//Log("  Descript.."+x+".id: "+Descript[x].id);
			}else if(ary[i].match(/^craftman,/i)){
				Descript[x].craftman = ary[i].substr(9);
				//Log("  Descript.."+x+".craftman: "+Descript[x].craftman);
			}else if(ary[i].match(/^craftmanw,/i)){
				Descript[x].craftmanw = ary[i].substr(10);
				//Log("  Descript.."+x+".craftmanw: "+Descript[x].craftmanw);
			}else if(ary[i].match(/^craftmanurl,/i)){
				Descript[x].craftmanurl = ary[i].substr(12);
				//Log("  Descript.."+x+".craftmanurl: "+Descript[x].craftmanurl);
			}else if(ary[i].match(/^homeurl,/i)){
				Descript[x].homeurl = ary[i].substr(8);
				//Log("  Descript.."+x+".homeurl: "+Descript[x].homeurl);
		///ゴースト
			}else if(ary[i].match(/^sakura\./i)){
				if(typeof(Descript[x].sakura)=="undefined") Descript[x].sakura = new Array();
				if(ary[i].match(/^sakura\.name,/i)){
					Descript[x].sakura.name = ary[i].substr(12);
					//Log("  Descript.."+x+".sakura.name: "+Descript[x].sakura.name);
				}else if(ary[i].match(/^sakura\.name2,/i)){
					Descript[x].sakura.name2 = ary[i].substr(13);
					//Log("  Descript.."+x+".sakura.name2: "+Descript[x].sakura.name2);
				}else if(ary[i].match(/^sakura\.balloon\./i)){
					if(typeof(Descript[x].sakura.balloon)=="undefined") Descript[x].sakura.balloon = new Array();
					if(ary[i].match(/^sakura\.balloon\.offsetx,/i)){
						Descript[x].sakura.balloon.offsetx = ary[i].substr(23);
						//Log("  Descript.."+x+".sakura.balloon.offsetx: "+Descript[x].sakura.balloon.offsetx);
					}else if(ary[i].match(/^sakura\.balloon\.offsety,/i)){
						Descript[x].sakura.balloon.offsety = ary[i].substr(23);
						//Log("  Descript.."+x+".sakura.balloon.offsety: "+Descript[x].sakura.balloon.offsety);
					}
				}
			}else if(ary[i].match(/^kero\./i)){
				if(typeof(Descript[x].kero)=="undefined") Descript[x].kero = new Array();
				if(ary[i].match(/^kero\.name,/i)){
					Descript[x].kero.name = ary[i].substr(10);
					//Log("  Descript.."+x+".kero.name: "+Descript[x].kero.name);
				}else if(ary[i].match(/^kero\.balloon\./i)){
					if(typeof(Descript[x].kero.balloon)=="undefined") Descript[x].kero.balloon = new Array();
					if(ary[i].match(/^kero\.balloon\.offsetx,/i)){
						Descript[x].kero.balloon.offsetx = ary[i].substr(21);
						//Log("  Descript.."+x+".kero.balloon.offsetx: "+Descript[x].kero.balloon.offsetx);
					}else if(ary[i].match(/^kero\.balloon\.offsety,/i)){
						Descript[x].kero.balloon.offsety = ary[i].substr(21);
						//Log("  Descript.."+x+".kero.balloon.offsety: "+Descript[x].kero.balloon.offsety);
					}
				}
		///バルーン
			}else if(ary[i].match(/^origin./i)){
				if(typeof(Descript[x].origin)=="undefined") Descript[x].origin = new Array();
				if(ary[i].match(/^origin.x,/i)){
					Descript[x].origin.x = ary[i].substr(9);
					//Log("  Descript.."+x+".origin.x: "+Descript[x].origin.x);
				}else if(ary[i].match(/^origin.y,/i)){
					Descript[x].origin.y = ary[i].substr(9);
					//Log("  Descript.."+x+".origin.y: "+Descript[x].origin.y);
				}
			}else if(ary[i].match(/^validrect./i)){
				if(typeof(Descript[x].validrect)=="undefined") Descript[x].validrect = new Array();
				if(ary[i].match(/^validrect.top,/i)){
					Descript[x].validrect.top = ary[i].substr(14);
					//Log("  Descript.."+x+".validrect.top: "+Descript[x].validrect.top);
				}else if(ary[i].match(/^validrect.left,/i)){
					Descript[x].validrect.left = ary[i].substr(15);
					//Log("  Descript.."+x+".validrect.left: "+Descript[x].validrect.left);
				}else if(ary[i].match(/^validrect.right,/i)){
					Descript[x].validrect.right = ary[i].substr(16);
					//Log("  Descript.."+x+".validrect.right: "+Descript[x].validrect.right);
				}else if(ary[i].match(/^validrect.bottom,/i)){
					Descript[x].validrect.bottom = ary[i].substr(17);
					//Log("  Descript.."+x+".validrect.bottom: "+Descript[x].validrect.bottom);
				}
			}else if(ary[i].match(/^communicatebox./i)){
				if(typeof(Descript[x].communicatebox)=="undefined") Descript[x].communicatebox = new Array();
				if(ary[i].match(/^communicatebox.x,/i)){
					Descript[x].communicatebox.x = ary[i].substr(17);
					//Log("  Descript.."+x+".communicatebox.x: "+Descript[x].communicatebox.x);
				}else if(ary[i].match(/^communicatebox.y,/i)){
					Descript[x].communicatebox = new Array();
					Descript[x].communicatebox.y = ary[i].substr(17);
					//Log("  Descript.."+x+".communicatebox.y: "+Descript[x].communicatebox.y);
				}else if(ary[i].match(/^communicatebox.width,/i)){
					Descript[x].communicatebox.width = ary[i].substr(21);
					//Log("  Descript.."+x+".communicatebox.width: "+Descript[x].communicatebox.width);
				}else if(ary[i].match(/^communicatebox.height,/i)){
					Descript[x].communicatebox.height = ary[i].substr(22);
					//Log("  Descript.."+x+".communicatebox.height: "+Descript[x].communicatebox.height);
				}else if(ary[i].match(/^communicatebox.height,/i)){
					Descript[x].communicatebox.height = ary[i].substr(22);
					//Log("  Descript.."+x+".communicatebox.height: "+Descript[x].communicatebox.height);
				}
			}
		}
	}
	//Log(" finished");
}


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//　便　利　関　数

//	テキストの改行を\nに統一。
function TextLoader(_){
	var Text = _;
	Text = Text.replace(/\r\n/g,"\n");
	Text = Text.replace(/\r/g,"\n");
	var TextLine = new Array();
	TextLine = Text.split("\n");
	return TextLine;
}

//	ログ出力。&Log("出力したい１行")
function Log(_){
	$("#IkagakaLog").append(_+"<br />\n");
}