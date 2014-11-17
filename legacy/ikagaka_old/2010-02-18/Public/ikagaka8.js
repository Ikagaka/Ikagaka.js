window.onerror = function(mes,file,num){ alert([ "file : " + file, "line : " + num, "message : " + mes ].join("\n")); return true; }
window.onload = IkagakaBootLoader;

function IkagakaBootLoader(){
////////////�@�����u�[�g���[�_�[

////////////���O��
	$("body").prepend(
		$("<div>")
		.attr("id","IkagakaLog")
		.css("background-color","transparent")
		.css("overflow","scroll")
		.css("position","absolute")
		.css("z-index","200")
		.width("400px")
		.height("200px")
		.css("top","10px")
		.css("left","10px")
	);
	$("#IkagakaLog").append("�u�@�����v�N���J�n�B<br />\n");

//////////���[�h
	SurfaceLoader();
	BalloonLoader();

//////////�ϐ��̏�����

	$("#IkagakaLog").append("�@�������J�n�B<br />\n");

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

	$("#IkagakaLog").append("�@�����B<br />\n");

//////////��b�\�z
	rickDOM();
	rickCSS();

//////////�^�X�N�N��
	SurfaceMgr();
	BalloonMgr();

	var popup = new PopupMenu();
	popup.bind(document.getElementById("IkagakaSakura"));
	popup.add('���񂢂񂷂Ɓ[��', function(){Player("\\0\\s[0]\\1����Ȃ��Ƃ�����ΊC����������邼\\w8\\0\\s[3]����Ȃ�����Ȃ��B\\e")});
	popup.addSeparator();
	popup.add('�I��', function(){Player("\\0\\s[5]������Ă��������B\\e")});

	$("#IkagakaLog").css("visibility","hidden")
	$("#IkagakaSakuraBalloon").css("visibility","hidden");
	$("#IkagakaKeroBalloon").css("visibility","hidden");
//////////���񂢁[
	SakuraScript = "\\0�e�L�X�g�{�b�N�X��SakuraScript����͂��Ď��s���Ă��������B\\w8\\e";
	$("#log").append("�N�������B<br />\n");

	Player(SakuraScript);
}
//////////////////////////////// BootLoader
//Index						<-- here!
//////////////////////////////// 
//////////////////////////////// PLAYER
//////////////////////////////// 
//
//////////////////////////////// Loader
//////////////////////////////// rick
//////////////////////////////// Mgr



//////////////////////////////// Player //////////////////////////////////
//////////////////////////////// Player //////////////////////////////////
//////////////////////////////// Player //////////////////////////////////
//////////////////////////////// Player //////////////////////////////////
function OnClose(){	//�o���[����\��
	clearTimeout(Tid);
	NowBalloonText[0] = "";
	NowBalloonText[1] = "";
	$("#IkagakaSakuraBalloon").css("visibility","hidden");
	$("#IkagakaSakuraBalloonText").val(new String());
	$("#IkagakaKeroBalloon").css("visibility","hidden");
	$("#IkagakaKeroBalloonText").val(new String());
}

function Player(_){
	clearTimeout(Tid);
	NowBalloonText[0] = "";
	NowBalloonText[1] = "";
	$("#IkagakaSakuraBalloon").css("visibility","hidden");
	$("#IkagakaSakuraBalloonText").text("");
	$("#IkagakaKeroBalloon").css("visibility","hidden");
	$("#IkagakaKeroBalloonText").text("");
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
		AddScript = "<br />";
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
	NowBalloonText[Scope] = AddScript;
		if(Scope){
			$("#IkagakaKeroBalloon").css("visibility","visible");
			$("#IkagakaKeroBalloonText").append(NowBalloonText[Scope]);
		}else{
			$("#IkagakaSakuraBalloon").css("visibility","visible");
			$("#IkagakaSakuraBalloonText").append(NowBalloonText[Scope]);
		}
	}
//����
	if(RemainScript.length>0){
		Tid = setTimeout("Analyzer(RemainScript)",50);
	}else{
		Tid = setTimeout("OnClose()",5000);
	}
}

function OnSorce(){
	$("#IkagakaLog").css('visibility','visible');
}
function OnBBS(){
	$("#msgmsg").css('visibility','visible');
}
function OnVoice(){
	$("#surface").css('visibility','visible');
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
//////////////////////////////// Loader //////////////////////////////////
//////////////////////////////// Loader //////////////////////////////////
//////////////////////////////// Loader //////////////////////////////////

function SurfaceLoader(){
///////////�T�[�t�B�X�Ǎ�
	$("#IkagakaLog").append("�@�usurface.txt�v�Ǎ��J�n�B<br />\n");

	SurfaceText = new String();
	SurfaceText = $("#surface").text();
	SurfaceText = SurfaceText.replace(/\r\n/g,"\n");
	SurfaceText = SurfaceText.replace(/\r/g,"\n");
	SurfaceTextLine = new Array();
	SurfaceTextLine = SurfaceText.split("\n");

	$("#IkagakaLog").append("�@�@"+SurfaceTextLine.length+"�s�B<br />\n");

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
			$("#IkagakaLog").append("�@�@�usurface"+num+"�v�Ǎ��J�n�B<br />\n");
			$("#IkagakaLog").append("�@�@�@�u"+Surface[num]["Image"].src+"�v�Ǎ��B<br />\n");
		}else if(a==1){
			if(SurfaceTextLine[i].match(/^\{/)){
				b=1;
			}else if(b==1){
				if(SurfaceTextLine[i].match(/^\}/)){
					a="";
					b="";
					$("#IkagakaLog").append("�@�@�����B<br />\n");
				}else{
					str=SurfaceTextLine[i].match(/^collision\d+,\d+,\d+,\d+,\d+,.+/i);
					if(str){
						str2=str[0].split(",");
						Surface[num][str2[0]] = str[0];
						$("#IkagakaLog").append("�@�@�@�u"+str2[0]+"�v�Ǎ��B<br />\n");
					}
				}
			}
		}
	}

	$("#IkagakaLog").append("�@�����B<br />\n");
}

/////////////////////////////////////////

function BalloonLoader(){
///////////�o���[���Ǎ�
	$("#IkagakaLog").append("�@�f�t�H���g�o���[���Ǎ��J�n�B<br />\n");

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

	$("#IkagakaLog").append("�@�����B<br />\n");
}

//////////////////////////////// rick //////////////////////////////////
//////////////////////////////// rick //////////////////////////////////
//////////////////////////////// rick //////////////////////////////////
//////////////////////////////// rick //////////////////////////////////

function rickDOM(){
//////////���b�N�h���B

	$("#IkagakaLog").append("�@�c�n�l�\�z�J�n�B<br />\n");

	$("#IkagakaBase").after(
		$("<div>")
		.attr("id","Ikagaka")
		.attr("class","ikagaka")
	);

	//////////

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

	//////////

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

	$("#IkagakaLog").append("�@�����B<br />\n");
}

/////////////////////////////////////////

function rickCSS(){
//////////���b�N���[���������B

	$("#IkagakaLog").append("�@�b�r�r�ݒ�J�n�B<br />\n");

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
		.css("border","0px solid #FF0000")
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


	$("#IkagakaLog").append("�@�����B<br />\n");
}

//////////////////////////////// Mgr //////////////////////////////////
//////////////////////////////// Mgr //////////////////////////////////
//////////////////////////////// Mgr //////////////////////////////////
//////////////////////////////// Mgr //////////////////////////////////

function SurfaceMgr(){
///////////�T�[�t�B�X�}�l�[�W���[
/////�T�[�t�B�X�`�F���W�Ƃ�
/////�����蔻��Ƃ��i�s�ӎ������j
/////�T�[�t�B�X�̃A�j���[�V�����Ƃ��i���\�z�i�K�j
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

	i=0;
	while(1){
		if(NowSurface[0]["collision"+i]){
			$("#IkagakaSakuraSurface").prepend(
				$("<div>").attr("id","IkagakaSakuraCollision"+i).attr("class","ikagaka")
			);
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

	i=0;
	while(1){
		if(NowSurface[1]["collision"+i]){
			$("#IkagakaKeroSurface").prepend(
				$("<div>").attr("id","KeroCollision"+i).attr("class","ikagaka")
			);
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
		}else{
			break;
		}
		i++;
	}
}

////////////////////////////////

function BalloonMgr(){
///////////�o���[���}�l�[�W���[
/////�o���[���ʒu���E�Ƃ�
/////�o���[���̎�ނƂ��Ƃ�
	$("#IkagakaSakuraBalloon")
		.css("background-image","url("+NowBalloon[0].src+")")
		.css("filter","Chroma(color=#dccdab)")
		.width(NowBalloon[0].width+"px")
		.height(NowBalloon[0].height+"px")
		.css("left","-"+NowBalloon[0].width+"px")
		.css("top","0px")
		.css("z-index","120")
	;
	$("#IkagakaSakuraBalloonText")
		.css("background-color","transparent")
		.width(eval(NowBalloon[0].width-30)+"px")
		.height(eval(NowBalloon[0].height-20)+"px")
		.css("line-height","120%")
		.css("top","10px")
		.css("left","10px")
		.css("overflow","scroll")
		.css("z-index","150")
		.css("visibility","inherit")
	;
	$("#IkagakaKeroBalloon")
		.css("background-image","url("+NowBalloon[1].src+")")
		.css("filter","Chroma(color=#dccdab)")
		.width(NowBalloon[1].width+"px")
		.height(NowBalloon[1].height+"px")
		.css("left",NowSurface[1]["Image"].width+"px")
		.css("top","0px")
		.css("z-index","120")
	;
	$("#IkagakaKeroBalloonText")
		.css("background-color","transparent")
		.width(eval(NowBalloon[1].width-30)+"px")
		.height(eval(NowBalloon[1].height-20)+"px")
		.css("line-height","120%")
		.css("top","10px")
		.css("right","10px")
		.css("overflow","scroll")
		.css("z-index","150")
		.css("visibility","inherit")
	;
}