//	�G���[���o���Ƃ��̂��܂��Ȃ�
window.onerror = function(mes,file,num){ alert([ "file : " + file, "line : " + num, "message : " + mes ].join("\n")); return true; }

//	�������߂����������I
window.onload = IkagakaLoader;

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//�@�N�@��

//	�����ݒ�

function IkagakaLoader(){
	//	&Log()�̂c�n�l�쐬

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

//	�ݒ�t�@�C���ǂݍ��񂾌�̃u�[�g�̑����B
function IkagakaBooter(){

	Surface = JSON.Surface;
	Balloon = JSON.Balloon;
	Descript = JSON.Descript;

	Log(" ");
	Log("IkagakaBooter");

	Log(" setting");

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
		NowSurface[i].number = 0;	//�T�[�t�F�X�ԍ�
		NowBalloon[i] = new Array();
		NowBalloon[i].number = 0;	//�o���[���ԍ�
		NowBalloon[i].LR = 0;	//�o���[����
	}

	//	�����T�[�t�F�X�^�o���[��
	NowSurface[0].number = new Number(0);	//���O�T�[�t�F�X�ԍ�
	NowSurface[1].number = new Number(10);	//���P�T�[�t�F�X�ԍ�
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


	Log(" builting");

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

	for(var i=0;i<Character;i++){
//		SurfacePlayer(i);
		BalloonPlayer(i);
//		$("#Ikagaka"+i+"Surface").hide();
//		$("#Ikagaka"+i+"Balloon").hide();
	}
	$("#Ikagaka0Surface").show();
	$("#Ikagaka1Surface").show();

	//	�̈�\��
//	$(".ikagaka").css("border","1px solid #FF0000");

	Log("booted");
	Log(" ");

//	Tid = window.setTimeout("EventManager('OnBoot')",1000);
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//�@�X�@�N�@���@�v�@�g�@�G�@���@�W�@��

function EventManager(_){
	window.clearTimeout(Tid);
	for(var i=0;i<Character;i++){
		$("#Ikagaka"+i+"Balloon").hide();
		$("#Ikagaka"+i+"BalloonText").text('');
	}
	Log("�y�C�x���g�}�l�[�W���[�z�N��");

	var a=_.split(",");
	Log("�@Event: "+a[0]);
	Log("�@value: "+a[1]);
	Log("�@value: "+a[2]);

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
	Log("�@�y�[���x�z��"+SakuraScript);
	Log("�y�C�x���g�}�l�[�W���[�z�I��");
	ScriptPlayer(SakuraScript);
}


function ScriptPlayer(_){
	Log("�y�X�N���v�g�v���C���[�z�N��");
	Log("�@ID: "+Tid);
	Log("   "+RemainScript);
	Log("   "+AddScript);
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
				NowSurface[Scope].number = RemainScript.substr(2,1);
				RemainScript = RemainScript.substr(3);
				$("#Ikagaka"+Scope+"Surface").show();
				if(typeof(Surface[NowSurface[Scope].number])!="undefined") SurfacePlayer(Scope);	//�T�[�t�F�X�X�V
			}
		}else if(RemainScript.match(/^\\s\[-?\d+\]/)){	//�T�[�t�F�X�؂�ւ�
			if(RemainScript.substr(3).match(/-?\d+/)<0){
				$("#Ikagaka"+Scope+"Surface").hide();
			}else{
				NowSurface[Scope].number = RemainScript.substr(3).match(/-?\d+/);
				RemainScript = RemainScript.replace(/^\\s\[-?\d+\]/,'');
				$("#Ikagaka"+Scope+"Surface").show();
				if(typeof(Surface[NowSurface[Scope].number])!="undefined") SurfacePlayer(Scope);	//�T�[�t�F�X�X�V
			}
		}else if(RemainScript.match(/^\\b\[-?\d+\]/)){	//�o���[���؂�ւ�
			NowBalloon[Scope].number = RemainScript.substr(3).match(/-?\d+/);
			RemainScript = RemainScript.replace(/^\\b\[-?\d+\]/,'');
			if(NowSurface[Scope].number<0){
				$("#Ikagaka"+Scope+"Balloon").hide();
			}else{
				$("#Ikagaka"+Scope+"Balloon").show();
				if(typeof(Balloon[NowSurface[Scope].number])!="undefined") BalloonPlayer(Scope);	//�o���[���X�V
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
		Log("�y�X�N���v�g�v���C���[�z�p��");
		Tid = window.setTimeout("ScriptPlayer(RemainScript)",Wait);
	}else{
		Log("�y�X�N���v�g�v���C���[�z�I��");
		Tid = window.setTimeout("ScriptBreaker()",5000);
	}
}


function ScriptBreaker(){
	Log("�y�X�N���v�g�u���C�J�[�z"+Tid);
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
	Log("�y�T�[�t�B�X�v���C���[�z�N��");

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
		Log("�@"+a+"�@���f");

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
			Log("�@Ikagaka"+i+"Collision"+j+"�@�Ɂ@OnMouseDoubleClick,0,"+ary.Name+"�@�C�x���g��`");
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
//			}else if(ary.pattern=="move"){	//	�G�������g�����ɂ���Ȃ̗v��́H
//			}else if(ary.pattern=="overlayfast"){	//����Ȃ̃���
			}
			j++;
		}
/*		j=0;
		k=0;
		while(Surface[NowSurface[i].number].interval[j]){
//			Surface[NowSurface[i].number].interval[j].pettern;	//�^�C�~���O�̂��Ƃ��[�H
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
	Log("�y�T�[�t�B�X�v���C���[�z�I��");
}





function BalloonPlayer(_){
///////////���E���]�ɓ���
	Log("�y�o���[���v���C���[�z�N��");

	var a = new Image();
	var i = _;
	var num = new Number();
	if(i>0) num = 1; else num = 0;
	var ary = new Array();
	ary[0] = Descript.Shell.sakura;
	ary[1] = Descript.Shell.kero;
		a.src = Balloon[NowBalloon[i].number][num][NowBalloon[i].LR].image;
		Log("�@Balloon["+num+"]["+NowBalloon[i].number+"]["+NowBalloon[i].LR+"]: "+a.src);

		if(NowBalloon[i].LR==1){
			Log("�@�o���[�����E��");
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
			Log("�@�o���[��������");
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
	Log("�y�o���[���v���C���[�z�I��");
}





/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//�@�ց@���@�ց@��

//	���O�o�́B&Log("�o�͂������P�s")
function Log(_){
	$("#IkagakaLog").append(_+"<br />\n");
}