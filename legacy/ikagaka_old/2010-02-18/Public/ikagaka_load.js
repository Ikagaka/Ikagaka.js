window.onload = ikgkLoad;

function ikgkLoad(){
//	rickDOM;
//	rickCSS;

//	LoadDiscript();
	LoadShell();
	LoadBalloon();
//	LoadGhost();

	Scope = new Number(0);
	NowSurface = new Array();
		NowSurface[0] = Surface[0];
		NowSurface[1] = Surface[10];
	NowBalloon = new Array();
		NowBalloon[0] = Balloon.s.L[0];
		NowBalloon[1] = Balloon.k.R[0];
	NowBalloonText = new Array();
		NowBalloonText[0] = new String();
		NowBalloonText[1] = new String();
	SakuraScript = new String();
	RemainScript = new String();
	AddScript = new String();
	Wait = new Number(0);
	Tid = new Number(0);

	$("#Sakura").draggable({opacity:1,cursor:'move',axis:'x'});
	$("#Kero").draggable({opacity:1,cursor:'move',axis:'x'});
	$("#Sakura").dblclick(function(){OnMouseDoubleClick()});
	$("#Kero").dblclick(function(){OnMouseDoubleClick("Kero")});
	$("#SakuraCollision0").dblclick(function(){OnMouseDoubleClick("Head")});
	$("#SakuraCollision1").dblclick(function(){OnMouseDoubleClick("Face")});
	$("#SakuraCollision2").dblclick(function(){OnMouseDoubleClick("Bust")});
	$("#Sakura").draggable({/*opacity:0.5,*/cursor:'move',axis:'x'});
	$("#Kero").draggable({/*opacity:0.5,*/cursor:'move',axis:'x'});
	$("#SakuraBalloon").css("visibility","hidden");
	$("#KeroBalloon").css("visibility","hidden");

/*	var popup = new PopupMenu();
	popup.bind(document.getElementById("Sakura"));
	popup.add('あんいんすとーる', function(){Player("\\0\\s[0]\\1そんなことをすれば海が汚染されるぞ\\w8\\0\\s[3]されないされない。\\e")});
	popup.addSeparator();
	popup.add('終了', function(){Player("\\0\\s[5]窓を閉じてください。\\e")});
*/
	SakuraScript = "\\0テキストボックスにSakuraScriptを入力して実行してください。\\w8\\e";
	Player(SakuraScript);
}

function LoadBalloon(){
	Balloon = new Array();
	Balloon["s"] = new Array();
	Balloon["s"]["L"] = new Array();
	Balloon["s"]["R"] = new Array();
	Balloon["s"]["L"][0] = new Image();
	Balloon["s"]["L"][0].src = "./img/balloons0.png";
	Balloon["s"]["R"][0] = new Image();
	Balloon["s"]["R"][0].src = "./img/balloons1.png";
	Balloon["s"]["L"][2] = new Image();
	Balloon["s"]["L"][2].src = "./img/balloons2.png";
	Balloon["s"]["R"][2] = new Image();
	Balloon["s"]["R"][2].src = "./img/balloons3.png";
	Balloon["k"] = new Array();
	Balloon["k"]["L"] = new Array();
	Balloon["k"]["R"] = new Array();
	Balloon["k"]["L"][0] = new Image();
	Balloon["k"]["L"][0].src = "./img/balloonk0.png";
	Balloon["k"]["R"][0] = new Image();
	Balloon["k"]["R"][0].src = "./img/balloonk1.png";
	Balloon["k"]["L"][2] = new Image();
	Balloon["k"]["L"][2].src = "./img/balloonk2.png";
	Balloon["k"]["R"][2] = new Image();
	Balloon["k"]["R"][2].src = "./img/balloonk3.png";
}

function LoadShell(){
	Surface = new Array();
	for(i=0;i<10;i++){
		Surface[i] = new Array();
		Surface[i]["Image"] = new Image();
		Surface[i]["Image"].src = "./img/surface"+i+".png"
		Surface[i]["Collision"] = new Array();
		Surface[i]["Collision"][0] = [29,7,126,71,"Head"]
		Surface[i]["Collision"][1] = [46,67,104,115,"Face"]
		Surface[i]["Collision"][2] = [52,148,80,187,"Bust"]
	}
	for(i=10;i<12;i++){
		Surface[i] = new Array();
		Surface[i]["Image"] = new Image();
		Surface[i]["Image"].src = "./img/surface"+i+".png"
	}
}
