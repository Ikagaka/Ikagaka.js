function Named(){
	this.namedId;
	this.url;
	this.filelist;
	this.timerId;
}

Named.prototype.load = function(){
	var id = this.namedId;
	var url = this.url;
	var list = new Array();
	this.filelist = new Array()
	list = GET(url + "updates2.dau");
	for(var i=0;i<list.length;i++){
		this.filelist[i] = list[i].split("");
	//	log(this.filelist[i][0]);
	}
	$("#Ikagaka").prepend(
		$("<div>")
		.attr("id","Named"+id)
		.attr("class","ikagaka")
		.css("border","1px solid #ff0000")
		.text("Named"+id)
	);
};

Named.prototype.materialize = function(){
	this.timerId = window.setTimeout("EventManager()",100);
};

Named.prototype.vanish = function(){};


function EventManager(){
	SakuraScript = "\\0�e�L�X�g�{�b�N�X��SakuraScript����͂��Ď��s���Ă��������B\\w8\\e";
	ScriptPlayer(SakuraScript);
}

function ScriptPlayer(){
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
}