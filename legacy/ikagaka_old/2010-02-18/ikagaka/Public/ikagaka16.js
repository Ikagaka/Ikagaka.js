//	エラーが出たときのおまじない
window.onerror = function(mes,file,num){ alert([ "file : " + file, "line : " + num, "message : " + mes ].join("\n")); return true; }

//	見ちゃらめぇぇぇぇぇ！
window.onload = IkagakaLoader;

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//　起　動

//	初期設定

function IkagakaLoader(){
	//	&Log()のＤＯＭ作成

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

	Log("IkagakaLoader");

	jQuery.getJSON("./ikagaka16.json",function(_){Log("loaded");JSON = _;IkagakaBooter();});

	Log(" JSON loading");
}

//	設定ファイル読み込んだ後のブートの続き。
function IkagakaBooter(){

	Surface = JSON.Surface;
	Balloon = JSON.Balloon;
	Descript = JSON.Descript;

	Log(" ");
	Log("IkagakaBooter");

	Log(" setting");

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
		NowSurface[i].number = 0;	//サーフェス番号
		NowBalloon[i] = new Array();
		NowBalloon[i].number = 0;	//バルーン番号
		NowBalloon[i].LR = 0;	//バルーン左
	}

	//	初期サーフェス／バルーン
	NowSurface[0].number = new Number(0);	//￥０サーフェス番号
	NowSurface[1].number = new Number(10);	//￥１サーフェス番号
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


	Log(" builting");

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

	for(var i=0;i<Character;i++){
//		SurfacePlayer(i);
		BalloonPlayer(i);
//		$("#Ikagaka"+i+"Surface").hide();
//		$("#Ikagaka"+i+"Balloon").hide();
	}
	$("#Ikagaka0Surface").show();
	$("#Ikagaka1Surface").show();

	//	領域表示
//	$(".ikagaka").css("border","1px solid #FF0000");

	Log("booted");
	Log(" ");

//	Tid = window.setTimeout("EventManager('OnBoot')",1000);
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//　ス　ク　リ　プ　ト　エ　ン　ジ　ン

function EventManager(_){
	window.clearTimeout(Tid);
	for(var i=0;i<Character;i++){
		$("#Ikagaka"+i+"Balloon").hide();
		$("#Ikagaka"+i+"BalloonText").text('');
	}
	Log("【イベントマネージャー】起動");

	var a=_.split(",");
	Log("　Event: "+a[0]);
	Log("　value: "+a[1]);
	Log("　value: "+a[2]);

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
	Log("　【擬似栞】→"+SakuraScript);
	Log("【イベントマネージャー】終了");
	ScriptPlayer(SakuraScript);
}


function ScriptPlayer(_){
	Log("【スクリプトプレイヤー】起動");
	Log("　ID: "+Tid);
	Log("   "+RemainScript);
	Log("   "+AddScript);
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
				NowSurface[Scope].number = RemainScript.substr(2,1);
				RemainScript = RemainScript.substr(3);
				$("#Ikagaka"+Scope+"Surface").show();
				if(typeof(Surface[NowSurface[Scope].number])!="undefined") SurfacePlayer(Scope);	//サーフェス更新
			}
		}else if(RemainScript.match(/^\\s\[-?\d+\]/)){	//サーフェス切り替え
			if(RemainScript.substr(3).match(/-?\d+/)<0){
				$("#Ikagaka"+Scope+"Surface").hide();
			}else{
				NowSurface[Scope].number = RemainScript.substr(3).match(/-?\d+/);
				RemainScript = RemainScript.replace(/^\\s\[-?\d+\]/,'');
				$("#Ikagaka"+Scope+"Surface").show();
				if(typeof(Surface[NowSurface[Scope].number])!="undefined") SurfacePlayer(Scope);	//サーフェス更新
			}
		}else if(RemainScript.match(/^\\b\[-?\d+\]/)){	//バルーン切り替え
			NowBalloon[Scope].number = RemainScript.substr(3).match(/-?\d+/);
			RemainScript = RemainScript.replace(/^\\b\[-?\d+\]/,'');
			if(NowSurface[Scope].number<0){
				$("#Ikagaka"+Scope+"Balloon").hide();
			}else{
				$("#Ikagaka"+Scope+"Balloon").show();
				if(typeof(Balloon[NowSurface[Scope].number])!="undefined") BalloonPlayer(Scope);	//バルーン更新
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
		Log("【スクリプトプレイヤー】継続");
		Tid = window.setTimeout("ScriptPlayer(RemainScript)",Wait);
	}else{
		Log("【スクリプトプレイヤー】終了");
		Tid = window.setTimeout("ScriptBreaker()",5000);
	}
}


function ScriptBreaker(){
	Log("【スクリプトブレイカー】"+Tid);
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
	Log("【サーフィスプレイヤー】起動");

	var a = new Image();
	var i = _;
	var j = new Number(0);
	var k = new Number(0);
	var ary = new Array();

		a.src = Surface[NowSurface[i].number].image;
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
		Log("　"+a+"　反映");

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
		while(Surface[NowSurface[i].number].collision[j]){
			ary = Surface[NowSurface[i].number].collision[j];
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
			Log("　Ikagaka"+i+"Collision"+j+"　に　OnMouseDoubleClick,0,"+ary.Name+"　イベント定義");
			j++;
		}
		j=0;
		while(Surface[NowSurface[i].number].elememt[j]){
			ary = Surface[NowSurface[i].number].elememt[j];
			if(ary.pattern=="overlay"){
				$("#Ikagaka"+i+"Surface").prepend(
					$("<div>")
					.attr("id","Ikagaka"+i+"Element"+j)
					.attr("class","ikagaka")
					.css("left",ary.x+"px")
					.css("top",ary.y+"px")
					.width(ary.image.width+"px")
					.height(ary.image.height+"px")
					.css("background-image","url("+ary.image+")")
					.css("visibility","visible")
					.css("position","absolute")
					.css("z-index","1200")
				);
			}else if(ary.pattern=="base"){
				$("#Ikagaka"+i+"Surface")
					.css("background-image","url("+ary.image+")")
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
		while(Surface[NowSurface[i].number].interval[j]){
//			Surface[NowSurface[i].number].interval[j].pettern;	//タイミングのことかー？
			while(Surface[NowSurface[i].number].interval[j].pattern[k]){
				ary = Surface[NowSurface[i].number].interval[j].pattern[k];
				//IkagakaLogManager(ary);
				//IkagakaLogManager(Surface[ary.number].image);
				if(ary.pattern=="overlay"){
					$("#Ikagaka"+i+"Surface").prepend(
						$("<div>")
						.attr("id","Ikagaka"+i+"Animate"+j)
						.attr("class",".ikagaka")
						.css("width",Surface[ary.number].image.width+"px")
						.css("height",Surface[ary.number].image.height+"px")
						.css("top",ary.y+"px")
						.css("left", ary.x+"px")
					);
					$("#Ikagaka"+i+"Animate"+j).animate(
						{},
						{
							duration: 1000,
							complete: function(){$("#Ikagaka"+i+"Animate"+j).css("background-image","url("+Surface[ary.number].image+")");}
						}
					);
				}
				k++;
			}
			j++;
		}
*/
//	$(".ikagaka").css("border","1px solid #FF0000");
	Log("【サーフィスプレイヤー】終了");
}





function BalloonPlayer(_){
///////////左右反転に特化
	Log("【バルーンプレイヤー】起動");

	var a = new Image();
	var i = _;
	var num = new Number();
	if(i>0) num = 1; else num = 0;
	var ary = new Array();
	ary[0] = Descript.Shell.sakura;
	ary[1] = Descript.Shell.kero;
		a.src = Balloon[NowBalloon[i].number][num][NowBalloon[i].LR].image;
		Log("　Balloon["+num+"]["+NowBalloon[i].number+"]["+NowBalloon[i].LR+"]: "+a.src);

		if(NowBalloon[i].LR==1){
			Log("　バルーンを右へ");
			$("#Ikagaka"+i+"Balloon")
				.css("background-image","url("+a.src+")")
				.css("filter","Chroma(color=#dccdab)")
				.width(a.width+"px")
				.height(a.height+"px")
				.css("top",ary[num].balloon.offsety+"px")
				.css("left",eval(Surface[NowSurface[i].number].image.width + ary[num].balloon.offsetx)+"px")
			;
			$("#Ikagaka"+i+"BalloonText")
				.width(eval(a.width - Descript.Balloon.origin.x * 2)+"px")
				.height(eval(a.height - Descript.Balloon.origin.y * 2)+"px")
				.css("top",Descript.Balloon.origin.y+"px")
				.css("left",eval(Descript.Balloon.origin.x)+"px")
				.css("line-height","130%")
			;
		}else{
			Log("　バルーンを左へ");
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
	Log("【バルーンプレイヤー】終了");
}





/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//　便　利　関　数

//	ログ出力。&Log("出力したい１行")
function Log(_){
	$("#IkagakaLog").append(_+"<br />\n");
}