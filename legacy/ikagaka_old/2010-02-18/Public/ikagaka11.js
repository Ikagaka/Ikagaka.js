window.onerror = function(mes,file,num){ alert([ "file : " + file, "line : " + num, "message : " + mes ].join("\n")); return true; }
window.onload = IkagakaLoader;
//////////////////////////////// IkagakaLogManager ////////////////////////////////
//function IkagakaLogManager(_){
//	//�@�����V�X�e�����O
//	$("#IkagakaLog").append(_+"<br />\n");
//}

//////////////////////////////// WindowManager ////////////////////////////////
//function WindowManager(){
//	//�w�E�B���h�E�V�X�e��
//}

//////////////////////////////// IkagakaLoader //////////////////////////////////
function IkagakaLoader(){
////////////���O��
/*	$("body").prepend(
		$("<textarea>")
		.attr("id","IkagakaLog")
		.attr("class","ikagaka")
		.width("300px")
		.height("400px")
		.css("position","absolute")
		.css("left","0px")
	);
*/	//IkagakaLogManager("�y�@�����u�[�g���[�_�[�z�N��");

////////////�x�[�X�E�F�A�ݒ�
//	URL = "http://www.nanican.net/dot-sakura/download/ghost/dot_sakura_000/";
	URL = "./";

	Character = 2;

////////////�I�v�V����


////////////�t�@�C�����[�h
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
			//IkagakaLogManager("BalloonDescript�擾");
			BalloonDescript = TextLoad(BalloonDescript);
			BD=true;
			BalloonLoader();
			if(BD&&GD&&SD&&SS) IkagakaBooter();
		}
	);
	ShellDescript = jQuery.get(
		URL+"./shell/master/descript.txt",
		function(){
			//IkagakaLogManager("ShellDescript�擾");
			ShellDescript = TextLoad(ShellDescript);
			SD=true;
			if(SD&&SS) ShellLoader();
			if(BD&&GD&&SD&&SS) IkagakaBooter();
		}
	);
	ShellSurfaces = jQuery.get(
		URL+"./shell/master/surfaces.txt",
		function(){
			//IkagakaLogManager("ShellSurfaces�擾");
			ShellSurfaces = TextLoad(ShellSurfaces);
			SS=true;
			if(SD&&SS) ShellLoader();
			if(BD&&GD&&SD&&SS) IkagakaBooter();
		}
	);
	GhostDescript = jQuery.get(
		URL+"./ghost/master/descript.txt",
		function(){
			//IkagakaLogManager("GhostDescript�擾");
			GhostDescript = TextLoad(GhostDescript);
			GD=true;
			GhostLoader();
			if(BD&&GD&&SD&&SS) IkagakaBooter();
		}
	);
}

//////////////////////////////// IkagakaBooter //////////////////////////////////
function IkagakaBooter(){
//////////IkagakaLoader����̑���

//////////���ݏ�Ԃ̏�����
	//IkagakaLogManager("�@���ݏ�Ԃ̏������J�n");

	BD = false;
	GD = false;
	SD = false;
	SS = false;

	Scope = new Number(0);	//�X�R�[�v

	NowSurface = new Array();
	NowSurface[0] = new Array();
	NowSurface[1] = new Array();
	NowSurface[0]["Number"] = new Number(0);	//���O�T�[�t�F�X�ԍ�
	NowSurface[1]["Number"] = new Number(10);	//���P�T�[�t�F�X�ԍ�

	NowBalloon = new Array();
	NowBalloon[0] = new Array();
	NowBalloon[1] = new Array();
	NowBalloon[0].Number = new Number(0);	//���O�o���[���ԍ�
	NowBalloon[1].Number = new Number(0);	//���P�o���[���ԍ�
	NowBalloon[0].LR = new Number(0);	//���O�o���[����
	NowBalloon[1].LR = new Number(0);	//���O�o���[����

	SakuraScript = new String();	//���s����SakuraScript
	AddScript = new String();	//���b����ꕶ��
	RemainScript = new String();	//�c���SakuraScript������
	Wait = new Number(50);		//�E�F�C�g
	Tid = new Number(0);		//�^�C�}�[�h�c
	//IkagakaLogManager("�@���ݏ�Ԃ̏���������");

//////////��b�c�n�l�\�z
	//IkagakaLogManager("�@�c�n�l�\�z�J�n");

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
	//IkagakaLogManager("�@�c�n�l�\�z����");

//////////��b�b�r�r�ݒ�
	//IkagakaLogManager("�@�b�r�r�ݒ�J�n");

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

	//IkagakaLogManager("�@�b�r�r�ݒ芮��");

//////////�^�X�N�N��
	//IkagakaLogManager("�@�^�X�N�N��");

//////////�N������
	//IkagakaLogManager("�N�������I");
	//IkagakaLogManager("");


	for(var i=0;i<Character;i++){
		BalloonPlayer(i);
	}
	EventManager('OnBoot');
}

//////////////////////////////// BaloonLoader ////////////////////////////////
function BalloonLoader(){
///////////�o���[���Ǎ�
	//IkagakaLogManager("�@�y�o���[�����[�_�[�z�N��");
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

	//	�e�ݒ�t�@�C���Ǎ��͂��܂̂Ƃ��뗪
	Balloon = new Array();
	Balloon[0] = new Array();	//������
	Balloon[0][0] = new Array();	//��
	Balloon[0][2] = new Array();	//��
	Balloon[0][0][0] = new Image();	//��
	Balloon[0][0][0].src = URL+"./balloon/ssp/balloons0.png";	//���������
	Balloon[0][0][1] = new Image();	//�E
	Balloon[0][0][1].src = URL+"./balloon/ssp/balloons1.png";	//��������E
	Balloon[0][2][0] = new Image();	//��
	Balloon[0][2][0].src = URL+"./balloon/ssp/balloons2.png";	//������卶
	Balloon[0][2][1] = new Image();	//�E
	Balloon[0][2][1].src = URL+"./balloon/ssp/balloons3.png";	//�������E
	Balloon[1] = new Array();	//���ɂイ
	Balloon[1][0] = new Array();	//��
	Balloon[1][2] = new Array();	//��
	Balloon[1][0][0] = new Image();	//��
	Balloon[1][0][0].src = URL+"./balloon/ssp/balloonk0.png";	//���ɂイ����
	Balloon[1][0][1] = new Image();	//�E
	Balloon[1][0][1].src = URL+"./balloon/ssp/balloonk1.png";	//���ɂイ���E
	Balloon[1][2][0] = new Image();	//��
	Balloon[1][2][0].src = URL+"./balloon/ssp/balloonk2.png";	//���ɂイ�卶
	Balloon[1][2][1] = new Image();	//�E
	Balloon[1][2][1].src = URL+"./balloon/ssp/balloonk3.png";	//���ɂイ��E

	//IkagakaLogManager("�@�y�o���[�����[�_�[�z�I��");
}

//////////////////////////////// BalloonPlayer //////////////////////////////////
function BalloonPlayer(_){
///////////���E���]�ɓ���
	//IkagakaLogManager("�y�o���[���v���C���[�z�N��");

	var a = new Image();
	var i = _;
	var num = new Number();

		if(i>0) num = 1; else num = 0;
		a = Balloon[num][NowBalloon[i].Number][NowBalloon[i].LR];
		//IkagakaLogManager("�@Balloon["+num+"]["+NowBalloon[i].Number+"]["+NowBalloon[i].LR+"]: "+a.src);

		if(NowBalloon[i].LR==1){
			//IkagakaLogManager("�@�o���[�����E��");
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
			//IkagakaLogManager("�@�o���[��������");
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
	//IkagakaLogManager("�y�o���[���v���C���[�z�I��");
}

//////////////////////////////// ShellLoader //////////////////////////////////
function ShellLoader(){
///////////�V�F���Ǎ�
	//IkagakaLogManager("�@�y�V�F�����[�_�[�z�N��");

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
					//IkagakaLogManager("�@�@�@Surface["+num+"]["+ary[0]+"].Name: "+Surface[num][ary[0]].Name+"�@�Ǎ�");
				}else if(ShellSurfaces[i].match(/^\}/)){
					a = false;
					b = false;
					//IkagakaLogManager("�@�@surface"+num+"�@�Ǎ�����");
				}
			}else if(ShellSurfaces[i].match(/^\{/)){
				b = true;
			}
		}else if(ShellSurfaces[i].match(/^surface\d+$/i)){
			a = true;
			num = ShellSurfaces[i].substr(7);
			Surface[num] = new Array();
			Surface[num].Image = new Image();
			Surface[num].Image.src = URL+"shell/master/surface"+num+".png";	//���̂�������URL�Ǎ�
			//IkagakaLogManager("�@�@�@"+Surface[num].Image.src+"�@�Ǎ�");
		}
	}
	//IkagakaLogManager("�@�y�V�F�����[�_�[�z�I��");
}

//////////////////////////////// SurfacePlayer ////////////////////////////////
function SurfacePlayer(){
	//IkagakaLogManager("�y�T�[�t�B�X�v���C���[�z�N��");

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
		//IkagakaLogManager("�@"+a.src+"�@���f");

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
			//IkagakaLogManager("�@Ikagaka"+i+"Collision"+j+"�@�Ɂ@OnMouseDoubleClick,0,"+ary.Name+"�@�C�x���g��`");
			j++;
		}
	}
//	$(".ikagaka").css("border","1px solid #FF0000");
	//IkagakaLogManager("�y�T�[�t�B�X�v���C���[�z�I��");
}

//////////////////////////////// GhostLoader ////////////////////////////////
function GhostLoader(){
	//�S�[�X�g�Ǎ�
	//IkagakaLogManager("�@�y�S�[�X�g���[�_�[�z�N��");
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
	//IkagakaLogManager("�@�y�S�[�X�g���[�_�[�z�I��");
}

//////////////////////////////// EventManager ////////////////////////////////
function EventManager(_){
	window.clearTimeout(Tid);
	for(var i=0;i<2;i++){
		$("#Ikagaka"+i+"Balloon").hide();
		$("#Ikagaka"+i+"BalloonText").text('');
	}
	//IkagakaLogManager("�y�C�x���g�}�l�[�W���[�z�N��");

	var a=_.split(",");
	//IkagakaLogManager("�@Event: "+a[0]);
	//IkagakaLogManager("�@value: "+a[1]);
	//IkagakaLogManager("�@value: "+a[2]);

	if(a[0]=="OnBoot"){
		SakuraScript = new String("\\0\\s[3]�݂�ȂȂ�ł���Ȏ��Ԃł��N���Ă�񂾂낤�H\\w8\\w8\\1\\s[10]���̒��m�������������Ƃ�����Łd�d\\e");
	}else if(a[0]=="OnMouseDoubleClick"){
		if(a[1]==1){
			SakuraScript = new String("\\1\\s[10]���[�B\\w8\\n�킢�͂��C�Ȃ�����A���Ă����ʂ�Łd�d�B\\e");
		}else if(a[2]){
			if(a[2].match(/Head/)){
				SakuraScript = new String("\\0\\s[1]����l�l�A���Ăтł����H\\e");
			}else if(a[2].match(/Face/)){
				SakuraScript = new String("\\0\\s[3]�ɂ�������Ȃ��Ł`�B\\e");
			}else if(a[2].match(/Bust/)){
				SakuraScript = new String("\\0\\s[7]���l��˂��Ȃ��I\\1\\s[11]�����������I\\e");
				}
		}else{
			SakuraScript = new String("\\0\\s[6]�߂ɂ�[�Ƃ��͂���܂���B\\w8\\e");
		}
	}else if(a[0]=="OnAnchorSelect"){
		SakuraScript='\\1�����N�Ȃ�ď���ł��B\\w8�̂��l�ɂ͂��ꂪ�킩���̂ł��B\\e';
	}else if(a[0]=="OnPlayScript"){
		SakuraScript=a[1];
	}else{
		SakuraScript='\\0\\s[0]\\1\\s[10]\\e';
	}
	//IkagakaLogManager("�@�y�[���x�z��"+SakuraScript);
	//IkagakaLogManager("�y�C�x���g�}�l�[�W���[�z�I��");
	ScriptPlayer(SakuraScript);
}

//////////////////////////////// ScriptPlayer //////////////////////////////////
function ScriptPlayer(_){
	//IkagakaLogManager("�y�X�N���v�g�v���C���[�z�N��");
	//IkagakaLogManager("�@ID: "+Tid);
	RemainScript = _;
	AddScript = "";

	if(RemainScript.match(/^\\/)){	//���ݏ�Ԃ̕ύX
		if(RemainScript.match(/^\\0/) || RemainScript.match(/^\\h/)){	//������
			Scope = 0;
			RemainScript = RemainScript.substr(2);
		}else if(RemainScript.match(/^\\1/) || RemainScript.match(/^\\u/)){	//���ɂイ
			Scope = 1;
			RemainScript = RemainScript.substr(2);
		}else if(RemainScript.match(/^\\n/)){	//���s
			AddScript = "<br />\n";
			RemainScript = RemainScript.substr(2);
		}else if(RemainScript.match(/^\\c/)){	//�o���[���N���A
			$("#Ikagaka"+Scope+"BalloonText").text('');
			RemainScript = RemainScript.substr(2);
		}else if(RemainScript.match(/^\\w[1-9]/)){	//�E�G�C�g
			Wait = RemainScript.substr(2,1)*50;
			RemainScript = RemainScript.substr(3);
		}else if(RemainScript.match(/^\\_w\[\d+\]/)){	//�����E�G�C�g
			Wait = RemainScript.substr(4).match(/^\d+/);
			RemainScript = RemainScript.replace(/^\\_w\[\d+\]/,'');
		}else if(RemainScript.match(/^\\s\[-?\d+\]/)){	//�T�[�t�F�X�؂�ւ�
			NowSurface[Scope].Number = RemainScript.substr(3).match(/-?\d+/);
			RemainScript = RemainScript.replace(/^\\s\[-?\d+\]/,'');
			SurfacePlayer();	//�T�[�t�F�X�X�V
		}else if(RemainScript.match(/^\\b\[-?\d+\]/)){	//�o���[���؂�ւ�
			NowBalloon[Scope].Number = RemainScript.substr(3).match(/-?\d+/);
			RemainScript = RemainScript.replace(/^\\b\[-?\d+\]/,'');
			BalloonPlayer(Scope);	//�o���[���X�V
		}else if(RemainScript.match(/^\\e/)){	//���񂢁[
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

	if(AddScript){	//���ݏ󋵂̔��f
		$("#Ikagaka"+Scope+"Balloon").show();
		$("#Ikagaka"+Scope+"BalloonText").append(AddScript);
	}

	if(RemainScript.length>0){	//����
		//IkagakaLogManager("�y�X�N���v�g�v���C���[�z�p��");
		Tid = window.setTimeout("ScriptPlayer(RemainScript)",Wait);
	}else{
		//IkagakaLogManager("�y�X�N���v�g�v���C���[�z�I��");
		Tid = window.setTimeout("ScriptBreaker()",5000);
	}
}

//////////////////////////////// ScriptBreaker ////////////////////////////////
function ScriptBreaker(){
	//IkagakaLogManager("�y�X�N���v�g�u���C�J�[�z"+Tid);
	for(var i=0;i<2;i++){
		$("#Ikagaka"+i+"Balloon").hide();
		NowBalloon[i].Text = "";
		$("#Ikagaka"+i+"BalloonText").text('');
	}
}
