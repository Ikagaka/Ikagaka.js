//	�G���[���o���Ƃ��̂��܂��Ȃ�
window.onerror = function(mes,file,num){ alert([ "file : " + file, "line : " + num, "message : " + mes ].join("\n")); return true; }

//	�������߂����������I
window.onload = IkagakaLoader;

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//�@�N�@��

//	�����ݒ�

function IkagakaLoader(){
	//	&Log()�̂c�n�l�쐬
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

	//	�ݒ�t�@�C���t�q�k
	URL = new Array();
	URL.Balloon = "./balloon/ssp/";
	URL.Ghost = "./ghost/master/";
	URL.Shell = "./shell/master/";


	//	�ݒ�t�@�C���������ň�C�ɓǂݍ��ށB��ł��~�X������N�����Ȃ��B

	//	�ݒ�t�@�C�����[�h�I���t���O������
	BD = false;
	GD = false;
	SD = false;
	SS = false;

	//	surface0000...�̌���
	SurfaceRank = 0;

	//	ghost��descript.txt��ǂݍ��ށB
	GhostText = jQuery.get(
		URL.Ghost+"./descript.txt"
		,function(){
			var Text = TextLoader(GhostText.responseText)
			GhostLoader(Text);
			GD = true;
			if(BD&&GD&&SD&&SS) IkagakaBooter();
		}
	);

	//	balloon��descript.txt��ǂݍ��ށB
	BalloonText = jQuery.get(
		URL.Balloon+"./descript.txt"
		,function(){
			var Text = TextLoader(BalloonText.responseText)
			BalloonLoader(Text);
			BD = true;
			if(BD&&GD&&SD&&SS) IkagakaBooter();
		}
	);

	//	shell��descript.txt��ǂݍ��ށB
	ShellText = jQuery.get(
		URL.Shell+"./descript.txt"
		,function(){
			var Text = TextLoader(ShellText.responseText)
			ShellLoader(Text);
			SD = true;
			if(BD&&GD&&SD&&SS) IkagakaBooter();
		}
	);

	//	shell��surface.txt��ǂݍ��ށB
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

//	�ݒ�t�@�C���ǂݍ��񂾌�̃u�[�g�̑����B
function IkagakaBooter(){
	//Log(" ");
	//Log("IkagakaBooter");

	//	�t���O�����B
	BD = false;
	GD = false;
	SD = false;
	SS = false;

	//Log(" setting");

	//	�L�����N�^�[������
	Character = 2;

	//	�����ʒu�B
	Reason = 0;

	//	�Œ�ʒu�B0:���R�ړ��A1:���[�ɌŒ�
	Fixed = 0;

	//	�����X�R�[�v
	Scope = 0;

	//	���݂̃T�[�t�F�X�^�o���[���̒l�̏�����
	NowSurface = new Array();
	NowBalloon = new Array();
	for(var i=0;i<Character;i++){
		NowSurface[i] = new Array();
		NowSurface[i].Number = 0;	//�T�[�t�F�X�ԍ�
		NowBalloon[i] = new Array();
		NowBalloon[i].Number = 0;	//�o���[���ԍ�
		NowBalloon[i].LR = 0;	//�o���[����
	}

	//	�����T�[�t�F�X�^�o���[��
	NowSurface[0].Number = new Number(0);	//���O�T�[�t�F�X�ԍ�
	NowSurface[1].Number = new Number(10);	//���P�T�[�t�F�X�ԍ�
	NowBalloon[0].LR = new Number(0);	//���O�o���[����
	NowBalloon[1].LR = new Number(1);	//���P�o���[���E

	//	���s����SakuraScript
	SakuraScript = new String();

	//	���b����ꕶ��
	AddScript = new String();

	//	�c���SakuraScript������
	RemainScript = new String();

	//	�ꕶ���E�F�C�g�����l
	Wait = new Number(50);

	//	�^�C�}�[�h�c
	Tid = new Number(0);


	//Log(" builting");

	//	�@������b
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

	//	�L�����N�^�����ʒu
	for(var i=0;i<Character;i++){
		$("#Ikagaka"+i).css("left","0px");
//		$("#Ikagaka"+i).css("z-index","-100000000");
	}
	$("#Ikagaka0").css("left","50%");
	$("#Ikagaka1").css("left","10%");

	//	�̈�\��
//	$(".ikagaka").css("border","1px solid #FF0000");

	//Log("booted");
	//Log(" ");

	Tid = window.setTimeout("sub()",3000);
}

//	�t���Đn
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
//�@�X�@�N�@���@�v�@�g�@�G�@���@�W�@��

function EventManager(_){
	window.clearTimeout(Tid);
	for(var i=0;i<Character;i++){
		$("#Ikagaka"+i+"Balloon").hide();
		$("#Ikagaka"+i+"BalloonText").text('');
	}
	//IkagakaLogManager("�y�C�x���g�}�l�[�W���[�z�N��");

	var a=_.split(",");
	//IkagakaLogManager("�@Event: "+a[0]);
	//IkagakaLogManager("�@value: "+a[1]);
	//IkagakaLogManager("�@value: "+a[2]);

	if(a[0]=="OnBoot"){
		SakuraScript = new String("\\0�e�L�X�g�{�b�N�X��SakuraScript����͂��Ď��s���Ă��������B\\w8\\e");
	}else if(a[0]=="OnMouseDoubleClick"){
		if(a[1]==1){
			SakuraScript = new String("\\1\\s[10]���[�B\\w8\\n�킢�͂��C�Ȃ�����A���Ă����ʂ�Łd�d�B\\e");
		}else if(a[2]){
			if(a[2].match(/Head/)){
				SakuraScript = new String("\\0\\s[1]����l�l�A���Ăтł����H\\e");
			}else if(a[2].match(/Face/)){
				SakuraScript = new String("\\0\\s[3]�ɂ�������Ȃ��Ł`�B\\e");
			}else if(a[2].match(/Bust/)){
				SakuraScript = new String("\\0\\s[7]���l��˂��Ȃ��I\\1\\s[10]�����������I\\e");
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


function ScriptPlayer(_){
	//IkagakaLogManager("�y�X�N���v�g�v���C���[�z�N��");
	//IkagakaLogManager("�@ID: "+Tid);
	//IkagakaLogManager("   "+RemainScript);
	//IkagakaLogManager("   "+AddScript);
	window.clearTimeout(Tid);
	RemainScript = _;
	AddScript = "";

	if(RemainScript.match(/^\\/)){	//���ݏ�Ԃ̕ύX
		if(RemainScript.match(/^\\0/) || RemainScript.match(/^\\h/)){	//������
			Scope = 0;
			RemainScript = RemainScript.substr(2);
		}else if(RemainScript.match(/^\\1/) || RemainScript.match(/^\\u/)){	//���ɂイ
			Scope = 1;
			RemainScript = RemainScript.substr(2);
		}else if(RemainScript.match(/^\\p\[\d+\]/)){	//���̑�
			Scope = RemainScript.substr(3).match(/\d+/);
			RemainScript = RemainScript.replace(/^\\p\[\d+\]/,'');
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
		}else if(RemainScript.match(/^\\s[0-9]/)){	//�T�[�t�F�X�؂�ւ�
			if(RemainScript.substr(2,1)<0){
				$("#Ikagaka"+Scope+"Surface").hide();
			}else{
				NowSurface[Scope].Number = RemainScript.substr(2,1);
				RemainScript = RemainScript.substr(3);
				$("#Ikagaka"+Scope+"Surface").show();
				if(typeof(Surface[NowSurface[Scope].Number])!="undefined") SurfacePlayer(Scope);	//�T�[�t�F�X�X�V
			}
		}else if(RemainScript.match(/^\\s\[-?\d+\]/)){	//�T�[�t�F�X�؂�ւ�
			if(RemainScript.substr(3).match(/-?\d+/)<0){
				$("#Ikagaka"+Scope+"Surface").hide();
			}else{
				NowSurface[Scope].Number = RemainScript.substr(3).match(/-?\d+/);
				RemainScript = RemainScript.replace(/^\\s\[-?\d+\]/,'');
				$("#Ikagaka"+Scope+"Surface").show();
				if(typeof(Surface[NowSurface[Scope].Number])!="undefined") SurfacePlayer(Scope);	//�T�[�t�F�X�X�V
			}
		}else if(RemainScript.match(/^\\b\[-?\d+\]/)){	//�o���[���؂�ւ�
			NowBalloon[Scope].Number = RemainScript.substr(3).match(/-?\d+/);
			RemainScript = RemainScript.replace(/^\\b\[-?\d+\]/,'');
			if(NowSurface[Scope].Number<0){
				$("#Ikagaka"+Scope+"Balloon").hide();
			}else{
				$("#Ikagaka"+Scope+"Balloon").show();
				if(typeof(Balloon[NowSurface[Scope].Number])!="undefined") BalloonPlayer(Scope);	//�o���[���X�V
			}
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


function ScriptBreaker(){
	//IkagakaLogManager("�y�X�N���v�g�u���C�J�[�z"+Tid);
	window.clearTimeout(Tid);
	for(var i=0;i<Character;i++){
		$("#Ikagaka"+i+"Balloon").hide();
		NowBalloon[i].Text = "";
		$("#Ikagaka"+i+"BalloonText").text('');
	}
}




/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//�@���B�W���A���n

//////////////////////////////// SurfacePlayer ////////////////////////////////
function SurfacePlayer(_){
	//IkagakaLogManager("�y�T�[�t�B�X�v���C���[�z�N��");

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
			//IkagakaLogManager("�@Ikagaka"+i+"Collision"+j+"�@�Ɂ@OnMouseDoubleClick,0,"+ary.Name+"�@�C�x���g��`");
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
//			}else if(ary.pattern=="move"){	//	�G�������g�����ɂ���Ȃ̗v��́H
//			}else if(ary.pattern=="overlayfast"){	//����Ȃ̃���
			}
			j++;
		}
/*		j=0;
		k=0;
		while(Surface[NowSurface[i].Number].interval[j]){
//			Surface[NowSurface[i].Number].interval[j].pettern;	//�^�C�~���O�̂��Ƃ��[�H
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
	//IkagakaLogManager("�y�T�[�t�B�X�v���C���[�z�I��");
}





function BalloonPlayer(_){
///////////���E���]�ɓ���
	//IkagakaLogManager("�y�o���[���v���C���[�z�N��");

	var a = new Image();
	var i = _;
	var num = new Number();
	if(i>0) num = 1; else num = 0;
	var ary = new Array();
	ary[0] = Descript.Shell.sakura;
	ary[1] = Descript.Shell.kero;
		a = Balloon[NowBalloon[i].Number][num][NowBalloon[i].LR];
		//IkagakaLogManager("�@Balloon["+num+"]["+NowBalloon[i].Number+"]["+NowBalloon[i].LR+"]: "+a.src);

		if(NowBalloon[i].LR==1){
			//IkagakaLogManager("�@�o���[�����E��");
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
			//IkagakaLogManager("�@�o���[��������");
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
	//IkagakaLogManager("�y�o���[���v���C���[�z�I��");
}






/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//�@�t�@�@�@�C�@���@���@�[�@�h

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

	//	�e�ݒ�t�@�C���Ǎ��͂��܂̂Ƃ��뗪

	//	�o���[���z��BBalloon[�ԍ�][�X�R�[�v][���E]
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
			Surface[num].Image.src = URL.Shell+"./surface"+num+".png";	//���̂�������URL�Ǎ�
			//Log(" read "+Surface[num].Image.src);
		}
	}
	//Log("finished");
}



//	descript.txt�ǂݍ��ݐ�p�֐��BDescriptLoader(�ݒ�t�@�C���̎��,���e)
function DescriptLoader(x,y){
	//Log(" DescriptLoader");
	//Log("  type: "+x);
	//	//Log("  content: "+y);
	var ary = y;
	if(typeof(Descript)=="undefined") Descript = new Array();
	Descript[x] = new Array();
	for(var i=0;i<ary.length;i++){
		if(ary[i]){
		///����
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
		///�S�[�X�g
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
		///�o���[��
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
//�@�ց@���@�ց@��

//	�e�L�X�g�̉��s��\n�ɓ���B
function TextLoader(_){
	var Text = _;
	Text = Text.replace(/\r\n/g,"\n");
	Text = Text.replace(/\r/g,"\n");
	var TextLine = new Array();
	TextLine = Text.split("\n");
	return TextLine;
}

//	���O�o�́B&Log("�o�͂������P�s")
function Log(_){
	$("#IkagakaLog").append(_+"<br />\n");
}