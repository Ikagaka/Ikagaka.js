window.onerror = function(mes,file,num){ alert([ "file : " + file, "line : " + num, "message : " + mes ].join("\n")); return true; }
window.onload = IkagakaBootLoader;

function IkagakaBootLoader(){
////////////�@�����u�[�g���[�_�[
	$("#EXAM").text("");
	$("#log").text("");
	$("#log").append("�u�@�����B�v�N���J�n�B<br />\n");

//////////���[�h
	SurfaceLoader();
	BalloonLoader();

//////////�ϐ��̏�����
	$("#log").append("�@�������J�n�B<br />\n");

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

	$("#log").append("�@�����B<br />\n");

//////////��b�\�z
	rickDOM();
	rickCSS();

//////////�^�X�N�N��
	SurfaceMgr();
	BalloonMgr();

//////////�^�X�N�N��
//	EventMgr();

//	$("#Sakura").draggable({opacity:1,cursor:'move',axis:'x'});
//	$("#Kero").draggable({opacity:1,cursor:'move',axis:'x'});
	$("#SakuraCollision0").dblclick(function(){OnMouseDoubleClick("Head")});
	$("#SakuraCollision1").dblclick(function(){OnMouseDoubleClick("Face")});
	$("#SakuraCollision2").dblclick(function(){OnMouseDoubleClick("Bust")});
//	$("#SakuraSurface").dblclick(function(){OnMouseDoubleClick("Sakura")});
	$("#Kero").dblclick(function(){OnMouseDoubleClick("Kero")});

//	$("#Sakura").draggable({/*opacity:0.5,*/cursor:'move',axis:'x'});
//	$("#Kero").draggable({/*opacity:0.5,*/cursor:'move',axis:'x'});

	$("#SakuraBalloon").css("visibility","hidden");
	$("#KeroBalloon").css("visibility","hidden");

	var popup = new PopupMenu();
	popup.bind(document.getElementById("Sakura"));
	popup.add('���񂢂񂷂Ɓ[��', function(){Player("\\0\\s[0]\\1����Ȃ��Ƃ�����ΊC����������邼\\w8\\0\\s[3]����Ȃ�����Ȃ��B\\e")});
	popup.addSeparator();
	popup.add('�I��', function(){Player("\\0\\s[5]������Ă��������B\\e")});

	SakuraScript = "\\0�e�L�X�g�{�b�N�X��SakuraScript����͂��Ď��s���Ă��������B\\w8\\e";

//////////���񂢁[
	$("#log").append("�N�������B<br />\n");

	Player(SakuraScript);
}







function OnClose(){	//�o���[����\��
	clearTimeout(Tid);
	NowBalloonText[0] = "";
	NowBalloonText[1] = "";
	$("#SakuraBalloon").css("visibility","hidden");
	$("#SakuraBalloonText").val(new String());
	$("#KeroBalloon").css("visibility","hidden");
	$("#KeroBalloonText").val(new String());
}

function Player(_){
	clearTimeout(Tid);
	NowBalloonText[0] = "";
	NowBalloonText[1] = "";
	$("#SakuraBalloon").css("visibility","hidden");
	$("#SakuraBalloonText").text("");
	$("#KeroBalloon").css("visibility","hidden");
	$("#KeroBalloonText").text("");
	Analyzer(_);
}

function Analyzer(_){
	RemainScript = _;
	AddScript = "";
//��ԕύX
	if(RemainScript.match(/^\\0/) || RemainScript.match(/^\\h/)){	//������
		Scope = 0;
		RemainScript = RemainScript.substr(2);
	}else if(RemainScript.match(/^\\1/) || RemainScript.match(/^\\u/)){	//���ɂイ
		Scope = 1;
		RemainScript = RemainScript.substr(2);
	}else if(RemainScript.match(/^\\n/)){	//���s
		AddScript = "\n";
		RemainScript = RemainScript.substr(2);
	}else if(RemainScript.match(/^\\c/)){	//�o���[���N���A
		NowBalloonText[Scope] = "";
		RemainScript = RemainScript.substr(2);
	}else if(RemainScript.match(/^\\w[1-9]/)){	//�E�G�C�g
		Wait = RemainScript.substr(2,1)*50;
		RemainScript = RemainScript.substr(3);
	}else if(RemainScript.match(/^\\_w\[\d+\]/)){	//�����E�G�C�g
		Wait = RemainScript.substr(4).match(/^\d+/);
		RemainScript = RemainScript.replace(/^\\_w\[\d+\]/,'');
	}else if(RemainScript.match(/^\\s\[\d+\]/)){	//�T�[�t�F�X�؂�ւ�
		NowSurface[Scope] = Surface[RemainScript.substr(3).match(/^\d+/)];
		RemainScript = RemainScript.replace(/^\\s\[\d+\]/,'');
	}else if(RemainScript.match(/^\\e/)){	//���񂢁[
		Tid = setTimeout("OnClose()",5000);
	}else{
		AddScript = RemainScript.substr(0,1);
		RemainScript = RemainScript.substr(1);
	}
//�T�[�t�F�X
	SurfaceMgr();
//�o���[��
	if(AddScript){
	NowBalloonText[Scope] += AddScript;
		if(Scope){
			$("#KeroBalloon").css("visibility","visible");
			$("#KeroBalloonText").val(NowBalloonText[Scope]);
		}else{
			$("#SakuraBalloon").css("visibility","visible");
			$("#SakuraBalloonText").val(NowBalloonText[Scope]);
		}
	}
//����
	if(RemainScript.length>0){
		Tid = setTimeout("Analyzer(RemainScript)",50);
	}else{
		Tid = setTimeout("OnClose()",5000);
	}
}

function OnBoot(){	//�t�H�[������SakuraScuript����
	SakuraScript = new String($("#msg").val());
	Player(SakuraScript);
}

function OnMouseDoubleClick(_){	//�G�蔽��
	a = new String(_);
	if(a.match(/^Head/)){
		SakuraScript = new String("\\0\\s[1]���ŋ@�\�͕t���Ă��܂���B\\w8\\1\\s[10]���Ȋ댯�B\\e");
	}else if(a.match(/^Face/)){
		SakuraScript = new String("\\0\\s[6]�ڂɓ���܂���߂Ă��������B\\w8\\1\\s[10]�����ɂ����B\\e");
	}else if(a.match(/^Bust/)){
		SakuraScript = new String("\\0\\s[2]�����\\w8\\n\\s[1]�T�C�e�[�Ȑl�ł��B\\w8\\e");
	}else if(a.match(/^Kero/)){
		SakuraScript = new String("\\1���[\\w8\\w8\\n���C��˂����Ă����ʂ�ŁB\\w8\\w8\\0\\s[5]�o�P�l�R������ˁB\\w8\\e");
	}else{
		SakuraScript = new String("\\0\\s[6]�߂ɂ�[�Ƃ��͂���܂���B\\w8\\n\\1\\s[11]�o���[�����e�L�X�g�G���A�Ȃ̂Ń^�O�Ƃ��d���߂܂���B\\w8\\n\\0\\s[2]�X�N���[�������邾���Ȃ�f���ɂc�h�u�Ƃb�r�r��\\1\\s[10]����ȏ�͌����ȁB\\0\\s[3]�n�C�B\\e");
	}
	Player(SakuraScript);
}




















































//////////////////////////////// Loader //////////////////////////////////

function SurfaceLoader(){
///////////�T�[�t�B�X�Ǎ�
	$("#log").append("�@�usurface.txt�v�Ǎ��J�n�B<br />\n");

	SurfaceText = new String();
	SurfaceText = $("#surface").text();
	SurfaceText = SurfaceText.replace(/\r\n/g,"\n");
	SurfaceText = SurfaceText.replace(/\r/g,"\n");
	SurfaceTextLine = new Array();
	SurfaceTextLine = SurfaceText.split("\n");

	$("#log").append("�@�@"+SurfaceTextLine.length+"�s�B<br />\n");

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
		//���̂�������URL�Ǎ�
			$("#log").append("�@�@�usurface"+num+"�v�Ǎ��J�n�B<br />\n");
			$("#log").append("�@�@�@�u"+Surface[num]["Image"].src+"�v�Ǎ��B<br />\n");
		}else if(a==1){
			if(SurfaceTextLine[i].match(/^\{/)){
				b=1;
			}else if(b==1){
				if(SurfaceTextLine[i].match(/^\}/)){
					a="";
					b="";
					$("#log").append("�@�@�����B<br />\n");
				}else{
					str=SurfaceTextLine[i].match(/^collision\d+,\d+,\d+,\d+,\d+,.+/i);
					if(str){
						str2=str[0].split(",");
						Surface[num][str2[0]] = str[0];
						$("#log").append("�@�@�@�u"+str2[0]+"�v�Ǎ��B<br />\n");
					}
				}
			}
		}
	}

	$("#log").append("�@�����B<br />\n");
}



function BalloonLoader(){
///////////�o���[���Ǎ�
	$("#log").append("�@�f�t�H���g�o���[���Ǎ��J�n�B<br />\n");

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

	$("#log").append("�@�����B<br />\n");
}













//////////////////////////////// rick //////////////////////////////////

function rickDOM(){
//////////���b�N�h���B

	$("#log").append("�@�c�n�l�\�z�J�n�B<br />\n");

	$("body").prepend(
		$("<div>").attr("id","Ikagaka").text("Ikagaka").attr("class","ikagaka")
	);

	$("#Ikagaka").prepend(
		$("<div>").attr("id","Sakura").text("Sakura").attr("class","ikagaka")
	);
	$("#Sakura").prepend(
		$("<div>").attr("id","SakuraSurface").text("SakuraSurface").attr("class","ikagaka")
	);
	$("#Sakura").prepend(
		$("<div>").attr("id","SakuraBalloon").text("SakuraBalloon").attr("class","ikagaka")
	);
	$("#SakuraBalloon").prepend(
		$("<textarea>").attr("id","SakuraBalloonText").text("SakuraBalloonText").attr("class","ikagaka")
	);

	$("#Ikagaka").prepend(
		$("<div>").attr("id","Kero").text("Kero").attr("class","ikagaka")
	);
	$("#Kero").prepend(
		$("<div>").attr("id","KeroBalloon").text("KeroBalloon").attr("class","ikagaka")
	);
	$("#Kero").prepend(
		$("<div>").attr("id","KeroSurface").text("KeroSurface").attr("class","ikagaka")
	);
	$("#KeroBalloon").prepend(
		$("<textarea>").attr("id","KeroBalloonText").text("KeroBalloonText").attr("class","ikagaka")
	);

	$("#log").append("�@�����B<br />\n");
}




function rickCSS(){
//////////���b�N���[���������B

	$("#log").append("�@�b�r�r�ݒ�J�n�B<br />\n");

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
		.css("border","1px solid #FF0000")
	;

	$("#Ikagaka")
		.width("100%")
		.height("100%")
		.css("left","0px")
		.css("bottom","0px")
		.css("z-index","0")
		.css("border","1px solid #0000FF")
		.css("visibility","hidden")
	;
	$("#Sakura")
		.css("left","60%")
		.css("bottom","0px")
		.css("z-index","100")
	;
	$("#Kero")
		.css("left","20%")
		.css("bottom","0px")
		.css("z-index","100")
	;


	$("#log").append("�@�����B<br />\n");
}












//////////////////////////////// Mgr //////////////////////////////////

function SurfaceMgr(){
///////////�T�[�t�B�X�}�l�[�W���[
/////�T�[�t�B�X�`�F���W�Ƃ�
/////�����蔻��Ƃ��i�s�ӎ������j
/////�T�[�t�B�X�̃A�j���[�V�����Ƃ��i���\�z�i�K�j
	$("#Sakura")
		.width(NowSurface[0]["Image"].width+"px")
		.height(NowSurface[0]["Image"].height+"px")
	;
	$("#SakuraSurface")
		.css("background-image","url("+NowSurface[0]["Image"].src+")")
		.css("filter","Chroma(color=#0000ff)")
		.width(NowSurface[0]["Image"].width+"px")
		.height(NowSurface[0]["Image"].height+"px")
		.css("z-index","120")
	;

	i=0;
	while(1){
		if(NowSurface[0]["collision"+i]){
			$("#SakuraSurface").prepend(
				$("<div>").attr("id","SakuraCollision"+i).attr("class","ikagaka")
			);
			a=NowSurface[0]["collision"+i].split(",");
			$("#SakuraCollision"+i)
				.css("left",a[1]+"px")
				.css("top",a[2]+"px")
				.width(eval(a[3]-a[1])+"px")
				.height(eval(a[4]-a[2])+"px")
				.css("z-index","150")
				.css("visibility","inherit")
				.css("cursor","pointer")
				.css("position","absolute")
			;
		}else{
			break;
		}
		i++;
	}


	$("#Kero")
		.width(NowSurface[1]["Image"].width+"px")
		.height(NowSurface[1]["Image"].height+"px")
	;
	$("#KeroSurface")
		.css("background-image","url("+NowSurface[1]["Image"].src+")")
		.css("filter","Chroma(color=#0000ff)")
		.width(NowSurface[1]["Image"].width+"px")
		.height(NowSurface[1]["Image"].height+"px")
		.css("z-index","120")
	;

	i=0;
	while(1){
		if(NowSurface[1]["collision"+i]){
			$("#KeroSurface").prepend(
				$("<div>").attr("id","KeroCollision"+i).attr("class","ikagaka")
			);
			a=NowSurface[1]["collision"+i].split(",");
			$("#KeroCollision"+i)
				.css("left",a[1]+"px")
				.css("top",a[2]+"px")
				.width(eval(a[3]-a[1])+"px")
				.height(eval(a[4]-a[2])+"px")
				.css("z-index","150")
				.css("visibility","inherit")
				.css("cursor","pointer")
				.css("position","absolute")
			;
		}else{
			break;
		}
		i++;
	}
}





function BalloonMgr(){
///////////�o���[���}�l�[�W���[
/////�o���[���ʒu���E�Ƃ�
/////�o���[���̎�ނƂ��Ƃ�
	$("#SakuraBalloon")
		.css("background-image","url("+NowBalloon[0].src+")")
		.css("filter","Chroma(color=#dccdab)")
		.width(NowBalloon[0].width+"px")
		.height(NowBalloon[0].height+"px")
		.css("left","-"+NowBalloon[0].width+"px")
		.css("top","0px")
		.css("z-index","120")
	;
	$("#SakuraBalloonText")
		.css("background-color","transparent")
		.width(eval(NowBalloon[0].width-30)+"px")
		.height(eval(NowBalloon[0].height-20)+"px")
		.css("top","10px")
		.css("left","10px")
		.css("overflow","scroll")
		.css("z-index","150")
		.css("visibility","inherit")
	;
	$("#KeroBalloon")
		.css("background-image","url("+NowBalloon[1].src+")")
		.css("filter","Chroma(color=#dccdab)")
		.width(NowBalloon[1].width+"px")
		.height(NowBalloon[1].height+"px")
		.css("left",NowSurface[1]["Image"].width+"px")
		.css("top","0px")
		.css("z-index","120")
	;
	$("#KeroBalloonText")
		.css("background-color","transparent")
		.width(eval(NowBalloon[1].width-30)+"px")
		.height(eval(NowBalloon[1].height-20)+"px")
		.css("top","10px")
		.css("right","10px")
		.css("overflow","scroll")
		.css("z-index","150")
		.css("visibility","inherit")
	;
}




