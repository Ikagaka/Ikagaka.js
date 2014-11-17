//	猫姫ライブラリ Ver.0.91
//	(C)猫姫 http://www.nekohime.org
//	このファイルの無断使用・無断転載を禁じます。

//サブキャラクタークラスここから
function SubCharacter(x, y, hontai, refVar) {

	this.zIndex = 1000;
	this.ref_hontai = hontai;

	this.fukidasi = document.createElement('DIV');
	this.fukidasi.style.position = 'absolute';
	this.fukidasi.style.zIndex = this.zIndex;
	var inner = '<TABLE border=\'0\' cellspacing=\'0\' cellpadding=\'0\'>';
	inner += '<TR><TD colspan=\'2\' align=\'right\' height=\'15\'>';
	inner += '</TD></TR><TR><TD valign=\'top\'></TD><TD valign=\'top\'>';
	inner += '<div style=\'overflow:auto;width:100%;font-size:11px;word-break:break-all;font-family:\"ＭＳ ゴシック\";\' align=\'left\'></div>';
	inner += '</TD><TD></TD></TR><TR><TD colspan=\'2\' height=\'10\'></TD></TR></TABLE>';
	this.fukidasi.innerHTML = inner;
	this.fukidasi.onclick = new Function(refVar+'.balloonClick();');

	this.chara = document.createElement('DIV');
	this.chara.style.position = 'absolute';
	this.chara.style.zIndex = this.zIndex;
	this.chara.style.cursor = 'move';
	this.chara.innerHTML = '&nbsp;';
	this.chara.onmousedown = new Function('e', refVar+'.unyuu.drag(e, true);return false;');
	this.chara.onmouseup = new Function('e', refVar+'.unyuu.drag(e, false);return false;');
	this.isIE = navigator.appName.match(/Microsoft Internet Explorer/);
	this.msgDiv = this.fukidasi.getElementsByTagName("DIV").item(0);
	this.balImg = null;
	this.isDragging = false;

	//常に画面左上が原点
	this.setLocation = function(x, y) {

		this.chara.style.left = x + 'px';
		this.chara.style.top = y + 'px';
		if(this.fukidasi.width!=null) this.fukidasi.style.left = (x - this.fukidasi.width) + 'px';
		this.fukidasi.style.top = y + 'px';
	};

	this.setLocation(x, y);

	document.body.appendChild(this.fukidasi);
	document.body.appendChild(this.chara);


	this.balloon = function(bid) {

		if(bid == '-1') {

			this.fukidasi.style.visibility = 'hidden';
			this.msgDiv.innerHTML = '';

		}else {

			this.fukidasi.style.visibility = 'visible';
			var bid_int = parseInt(bid);

			var bTab = this.fukidasi.getElementsByTagName("TABLE").item(0);
			if(bid_int%2 == 0) {

				bTab.rows[1].cells[0].width = 10;
				bTab.rows[1].cells[2].width = 20;

			}else {

				bTab.rows[1].cells[0].width = 20;
				bTab.rows[1].cells[2].width = 10;
			}

			this.balImg = new Image();
			this.balImg.onload = new Function(this.ref_hontai.refVarName+'.unyuu.balloonOnLoad();');
			this.balImg.src = this.ref_hontai.initParam.balURL + bid_int +'.gif?' + this.ref_hontai.initParam.balLastmod;

		}
	};

	this.balloonOnLoad = function() {

		var bTab = this.fukidasi.getElementsByTagName("TABLE").item(0);
		bTab.width = this.balImg.width;
		bTab.height = this.balImg.height;
		this.fukidasi.width = this.balImg.width;
		this.fukidasi.height = this.balImg.height;
		this.fukidasi.style.left = (parseInt(this.chara.style.left.substring(0, this.chara.style.left.length-2)) - this.balImg.width) + 'px';
		bTab.rows[1].cells[1].width = this.balImg.width - 30;
		bTab.style.backgroundImage = 'url('+this.balImg.src+')';
		this.msgDiv.style.height = this.balImg.height - 25;
	};


	this.hdrag = new Function('event', refVar+'.unyuu.followMouse(event);');
	this.ieMouseBuff = {'x':0, 'y':0};
	this.offsetDrag = {'x':0, 'y':0};

	this.drag = function(e, dragStart) {

		if(dragStart) {


			if(this.isIE) {
				this.chara.attachEvent('onmousemove', this.hdrag);
				this.ieMouseBuff.x = window.event.clientX;
				this.ieMouseBuff.y = window.event.clientY;
				this.offsetDrag.x = event.offsetX;
				this.offsetDrag.y = event.offsetY;

			}else {
				this.chara.addEventListener('mousemove', this.hdrag, false);
				this.offsetDrag.x = e.layerX;
				this.offsetDrag.y = e.layerY;
			}

		}else {

			this.isDragging = false;

			if(this.isIE) {
				this.chara.detachEvent('onmousemove', this.hdrag);
			}else {
				this.chara.removeEventListener('mousemove', this.hdrag, false);
			}

		}
	};


	this.followMouse = function(event) {

		if(this.isIE && !this.isDragging && (event.clientX==this.ieMouseBuff.x) && (event.clientY==this.ieMouseBuff.y)) return;
		this.isDragging = true;
		var scrollLeft = document.body.scrollLeft || document.documentElement.scrollLeft;
		var scrollTop  = document.body.scrollTop  || document.documentElement.scrollTop;
		var x = event.clientX + scrollLeft - this.offsetDrag.x;
		var y = event.clientY + scrollTop - this.offsetDrag.y;
		this.setLocation(x, y);
	};


	this.appendHTML = function(html) {

		//デフォルトバルーン
		if(this.fukidasi.style.visibility == 'hidden') this.balloon('0');
		this.msgDiv.innerHTML += html;
		this.msgDiv.scrollTop = this.msgDiv.scrollHeight;
	};

	this.innerHTML = function(html) {

		//デフォルトバルーン
		if(this.fukidasi.style.visibility == 'hidden') this.balloon('0');
		this.msgDiv.innerHTML = html;
	};

	this.setImage = function(imgSrc) {

		//キャッシュ防止
		var imageURL = imgSrc + '?' + this.ref_hontai.initParam.sufLastmod;

		if(this.isIE) {			//IE

			this.chara.style.filter = 'progid:DXImageTransform.Microsoft.AlphaImageLoader(src='+imageURL+');';
			//仮設定
			this.chara.width = 120;
			this.chara.height = 100;

		}else{				//IE以外

			this.chara.innerHTML = '<img src=\''+imageURL+'\'>';
			var charaImg = this.chara.getElementsByTagName('IMG').item(0);
			this.chara.width = charaImg.width;
			this.chara.height = charaImg.height;
		}

	};

	this.removeMascot = function() {

		document.body.removeChild(this.fukidasi);
		document.body.removeChild(this.chara);
	};

}
//サブキャラクタークラスここまで



//キャラクタークラスここから
function Character(refVar, initJson, fix) {

	this.zIndex = 1000;
	this.refVarName = refVar;

	this.fukidasi = document.createElement('DIV');
	this.fukidasi.style.position = 'absolute';
	this.fukidasi.style.zIndex = this.zIndex;
	var inner = '<TABLE border=\'0\' cellspacing=\'0\' cellpadding=\'0\'>';
	inner += '<TR><TD colspan=\'2\' align=\'right\' height=\'15\'>';
	if(fix) inner += '<IMG src=\'http://www.nekohime.org/balloon/fix.gif\' onClick=\"'+this.refVarName+'.changeArrange()\">';
	inner += '</TD></TR><TR><TD valign=\'top\'></TD><TD valign=\'top\'>';
	inner += '<div style=\'overflow:auto;width:100%;font-size:11px;word-break:break-all;font-family:\"ＭＳ ゴシック\";\' align=\'left\'></div>';
	inner += '</TD><TD></TD></TR><TR><TD colspan=\'2\' height=\'10\'></TD></TR></TABLE>';
	this.fukidasi.innerHTML = inner;
	this.fukidasi.onclick = new Function(this.refVarName+'.balloonClick();');

	this.chara = document.createElement('DIV');
	this.chara.style.position = 'absolute';
	this.chara.style.zIndex = this.zIndex;
	this.chara.style.cursor = 'move';
	this.chara.onmousedown = new Function('e', this.refVarName+'.drag(e, true);return false;');
	this.chara.onmouseup = new Function('e', this.refVarName+'.drag(e, false);return false;');
	this.chara.onclick = new Function(this.refVarName+'.charaOnClick();');
	this.chara.innerHTML = '&nbsp;';
	//複数インスタンス作成時に問題出るかも
	window.onresize = new Function(this.refVarName+'.onResize();');

	//常に画面左上が原点
	this.setLocation = function(x, y) {

		this.chara.style.left = x + 'px';
		this.chara.style.top = y + 'px';
		if(this.fukidasi.width!=null) this.fukidasi.style.left = (x - this.fukidasi.width) + 'px';
		this.fukidasi.style.top = y + 'px';
	};

	//メンバ変数の宣言
	this.balImg = null;
	this.sakuraScript = null;
	this.appendTimer = null;
	this.initParam = initJson;

	if(this.initParam.xOrigin == "center") this.initParam.defaultX = this.initParam.defaultX + document.body.clientWidth/2;

	//履歴が見つかった場合
	if(get_cookie('nh_x') != null) {

		this.initParam.defaultX = parseInt(get_cookie('nh_x'));
		this.initParam.defaultY = parseInt(get_cookie('nh_y'));
	}

	this.setLocation(this.initParam.defaultX, this.initParam.defaultY);

	this.isDragging = false;
	this.clientWidthBefore = document.body.clientWidth;
	this.tipeCycle = 50;//メッセージスピード
	this.scope = 'h';
	this.talking = false;
	this.isIE = navigator.appName.match(/Microsoft Internet Explorer/);

	document.body.appendChild(this.fukidasi);
	document.body.appendChild(this.chara);
	this.unyuu = new SubCharacter(this.initParam.defaultX - 170, this.initParam.defaultY + 110, this, refVar);

	this.balloon = function(bid) {

		if(bid == '-1') {

			this.fukidasi.style.visibility = 'hidden';
			var msgDiv = this.fukidasi.getElementsByTagName("DIV").item(0);
			msgDiv.innerHTML = '';

		}else {

			this.fukidasi.style.visibility = 'visible';

			var bTab = this.fukidasi.getElementsByTagName("TABLE").item(0);
			if(parseInt(bid)%2 == 0) {

				bTab.rows[1].cells[0].width = 10;
				bTab.rows[1].cells[2].width = 20;

			}else {

				bTab.rows[1].cells[0].width = 20;
				bTab.rows[1].cells[2].width = 10;
			}

			this.balImg = new Image();
			this.balImg.onload = new Function(this.refVarName+'.balloonOnLoad();');
			this.balImg.src = this.initParam.balURL + bid  +'.gif?' + this.initParam.balLastmod;
		}
	};


	this.balloonOnLoad = function() {

		var msgDiv = this.fukidasi.getElementsByTagName("DIV").item(0);
		var bTab = this.fukidasi.getElementsByTagName("TABLE").item(0);
		bTab.width = this.balImg.width;
		bTab.height = this.balImg.height;
		this.fukidasi.width = this.balImg.width;
		this.fukidasi.height = this.balImg.height;
		this.fukidasi.style.left = (parseInt(this.chara.style.left.substring(0, this.chara.style.left.length-2)) - this.balImg.width) + 'px';
		bTab.rows[1].cells[1].width = this.balImg.width - 30;
		bTab.style.backgroundImage = 'url('+this.balImg.src+')';
		msgDiv.style.height = this.balImg.height - 25;
	};


	this.balloonClick = function() {

		//話し終えたAND選択肢が無い
		if(!this.talking && this.fukidasi.getElementsByTagName("DIV").length==1) {

			this.balloon('-1');
			this.unyuu.balloon('-1');
		}
	};


	this.execSakuraScript = function(sakurascript) {

		this.balloon('-1');
		this.unyuu.balloon('-1');
		clearTimeout(this.appendTimer);
		this.sakuraScript = sakurascript;
		this.talking = true;
		this.InterPreter(0);
	};


	this.changeArrange = function() {

		var x = parseInt(this.chara.style.left.substring(0, this.chara.style.left.length-2));
		var y = parseInt(this.chara.style.top.substring(0, this.chara.style.top.length-2));

		if(this.initParam.xOrigin == "center") {
			x = x - document.body.clientWidth/2;
		}

		sendCommand('arrange', 'x='+x+'&y='+y);

	};


	this.hdrag = new Function('event', refVar+'.followMouse(event);');
	this.ieMouseBuff = {'x':0, 'y':0};
	this.offsetDrag = {'x':0, 'y':0};

	this.drag = function(e, dragStart) {

		if(dragStart) {

			if(this.isIE) {
				this.chara.attachEvent('onmousemove', this.hdrag);
				this.ieMouseBuff.x = window.event.clientX;
				this.ieMouseBuff.y = window.event.clientY;
				this.offsetDrag.x = event.offsetX;
				this.offsetDrag.y = event.offsetY;
			}else {
				this.chara.addEventListener('mousemove', this.hdrag, false);
				this.offsetDrag.x = e.layerX;
				this.offsetDrag.y = e.layerY;
			}

		}else {

			if(this.isIE) {
				this.chara.detachEvent('onmousemove', this.hdrag);
			}else {
				this.chara.removeEventListener('mousemove', this.hdrag, false);
			}

		}

	};


	this.onResize = function() {

		if(this.initParam.xOrigin == "center") {

			var clientWidthAfter = document.body.clientWidth;

			var x = parseInt(this.chara.style.left.substring(0, this.chara.style.left.length-2));
			var y = parseInt(this.chara.style.top.substring(0, this.chara.style.top.length-2));
			x = x - (this.clientWidthBefore/2) + (clientWidthAfter/2);
			this.setLocation(x, y);

			x = parseInt(this.unyuu.chara.style.left.substring(0, this.unyuu.chara.style.left.length-2));
			y = parseInt(this.unyuu.chara.style.top.substring(0, this.unyuu.chara.style.top.length-2));
			x = x - (this.clientWidthBefore/2) + (clientWidthAfter/2);
			this.unyuu.setLocation(x, y);

			this.clientWidthBefore = clientWidthAfter;
		}
	};


	this.charaOnClick = function() {

		if(this.isDragging) {

			this.isDragging = false;
			return;

		}else {

			sendCommand('mainmenu', '');
		}

	};


	this.followMouse = function(event) {

		if(this.isIE && !this.isDragging && (event.clientX==this.ieMouseBuff.x) && (event.clientY==this.ieMouseBuff.y)) return;
		this.isDragging = true;
		var scrollLeft = document.body.scrollLeft || document.documentElement.scrollLeft;
		var scrollTop  = document.body.scrollTop  || document.documentElement.scrollTop;
		var x = event.clientX + scrollLeft - this.offsetDrag.x;
		var y = event.clientY + scrollTop - this.offsetDrag.y;
		this.setLocation(x, y);
	};


	this.removeMascot = function() {

		set_cookie('nh_x', this.chara.style.left.substring(0, this.chara.style.left.length-2));
		set_cookie('nh_y', this.chara.style.top.substring(0, this.chara.style.top.length-2));

		clearTimeout(this.appendTimer);
		this.unyuu.removeMascot();
		document.body.removeChild(this.fukidasi);
		document.body.removeChild(this.chara);
		//自分へのハッシュを削除
		eval(this.refVarName+' = null;');
		this.refVarName = null;
	};


	this.InterPreter = function(pos) {

		var msgDiv = this.fukidasi.getElementsByTagName("DIV").item(0);
		if(this.sakuraScript.length<=pos) return;

		//'<'を表示しようとする時の処理
		while(this.sakuraScript.charAt(pos)=='<') {

			var posStart = pos;

			for(pos=pos+1; pos<this.sakuraScript.length; pos++) {
				//	'>'が見つかった
				if(this.sakuraScript.charAt(pos)=='>') break;
			}

			//最後まで'>'が見つからなかった
			if(this.sakuraScript.length<=pos) return;
			msgDiv.innerHTML += this.sakuraScript.substring(posStart, pos+1);
			pos++;
		}

		var timer = this.tipeCycle;

		if(this.sakuraScript.charAt(pos)=='\\') {

			var ssMatcher = new RegExp('[\\\\][_a-z0-9!\-]{1,2}(?:\\[.*?\\])?');
			var sakuraScript = this.sakuraScript.substring(pos, this.sakuraScript.length).match(ssMatcher)+'';

			sakuraScript.match(new RegExp('[\\\\]([_a-z0-9!\-]{1,2})'));
			var func = RegExp.$1;
			var param = '';
			//引数あり
			if((func.length+1) < sakuraScript.length) {
				sakuraScript.match(new RegExp('\\[(.*?)\\]'));
				param = RegExp.$1;
			}

			if(func == '_w') {

				timer = param;

			}else if(func.charAt(0) == 'w') {

				timer = 50*parseInt(func.charAt(1));

			}else {

				this.interpriter(func, param);
				timer = 0;
			}
			pos += sakuraScript.length-1;

		}else {

			//通常のテキスト表示
			if(this.scope == 'h') {
				this.appendHTML(this.sakuraScript.charAt(pos));
			}else if(this.scope == 'u') {
				this.unyuu.appendHTML(this.sakuraScript.charAt(pos));
			}
		}
		if(this.refVarName != null) this.appendTimer=setTimeout(this.refVarName+'.InterPreter('+(pos+1)+')', timer);

	};


	this.setImage = function(imgSrc) {

		//キャッシュ防止
		var imageURL = imgSrc + '?' +  + this.initParam.sufLastmod;

		if(this.isIE) {		//IE

			this.chara.style.filter = 'progid:DXImageTransform.Microsoft.AlphaImageLoader(src='+imageURL+');';
			//仮設定
			this.chara.width = 100;
			this.chara.height = 250;

		}else{				//IE以外

			this.chara.innerHTML = '<img src=\''+imageURL+'\'>';
			var charaImg = this.chara.getElementsByTagName('IMG').item(0);
			this.chara.width = charaImg.width;
			this.chara.height = charaImg.height;
		}

	};


	this.appendHTML = function(html) {

		if(this.fukidasi.style.visibility == 'hidden') this.balloon('0');

		var msgDiv = this.fukidasi.getElementsByTagName("DIV").item(0);
		msgDiv.innerHTML += html;
		msgDiv.scrollTop = msgDiv.scrollHeight;
	};

	this.innerHTML = function(html) {

		if(this.fukidasi.style.visibility == 'hidden') this.balloon('0');

		var msgDiv = this.fukidasi.getElementsByTagName("DIV").item(0);
		msgDiv.innerHTML = html;
	};


	this.interpriter = function(func, param) {


		switch(func) {

			case 's':
				if(this.scope == 'h') {
					this.setImage(this.initParam.sufURL + param + ".png");
				}else if(this.scope == 'u') {
					this.unyuu.setImage(this.initParam.sufURL + param + ".png");
				}
				break;

			case 'b':
				if(this.scope == 'h') {
					this.balloon(param);
				}else if(this.scope == 'u') {
					this.unyuu.balloon(''+(parseInt(param)+1));
				}
				break;

			case 'q':
				param.match(new RegExp('(.*?)[,](.*)'));
				selecter = '<div onClick=\"onClickQ(\''+RegExp.$2+'\')\" onmouseover=\"hiLight(this, true)\" onmouseout=\"hiLight(this, false)\" style=\"cursor:pointer;\"><img src=\"http://www.nekohime.org/balloon/dot.gif\">&nbsp;'+RegExp.$1+'</div>';
				if(this.scope == 'h') {
					this.appendHTML(selecter);
				}else if(this.scope == 'u') {
					this.unyuu.appendHTML(selecter);
				}
				break;

			case 'n':
				if(this.scope == 'h') {
					this.appendHTML('<br>');
				}else if(this.scope == 'u') {
					this.unyuu.appendHTML('<br>');
				}
				break;

			case 'c':
				if(this.scope == 'h') {
					this.innerHTML('');
				}else if(this.scope == 'u') {
					this.unyuu.innerHTML('');
				}
				break;
/*
			case '!':
				param.match(new RegExp('(.*?)[,](.*?)[,](.*)'));
				if(RegExp.$1 == 'open' && RegExp.$2 == 'browser') {

					window.open(RegExp.$3, null);

				}else if(RegExp.$1 == 'youtube' && RegExp.$2 == 'play') {

					var bTab = this.fukidasi.getElementsByTagName("TABLE").item(0);
					bTab.rows[2].cells[0].innerHTML = '<iframe src=\"http://www.nekohime.org/yt.jsp?video_id='+RegExp.$3+'\" width=\"142\" height=\"117\" hspace=\"0\" marginwidth=\"0\" vspace=\"0\" marginheight=\"0\" scrolling=\"no\">';

				}

				break;
*/
			case 'h':
				this.scope = 'h'
				break;

			case 'u':
				this.scope = 'u'
				break;

			case 'e':
				this.scope = 'h'
				clearTimeout(this.appendTimer);
				this.talking = false;
				break;

			case '-':
				this.removeMascot();
				break;
		}

	};


}
//キャラクタークラスここまで

//クッキーへの書き込み用関数
//setCookie(クッキー名,値)
function set_cookie(key,val){
	tmp = key+"="+escape(val)+";";
	tmp += "expires=Fri, 31-Dec-2030 23:59:59;";
	document.cookie = tmp;
}

//クッキーからの読み込み用関数
//getCookie(クッキー名);
function get_cookie(key){

	tmp = document.cookie+";";
	tmp1 = tmp.indexOf(key,0);
	if(tmp1 != -1){
		tmp = tmp.substring(tmp1,tmp.length);
		start = tmp.indexOf("=",0);
		end = tmp.indexOf(";",start);
		return(unescape(tmp.substring(start+1,end)));
	}
	return null;
}

//初回実行コマンド（コールバック）
sendCommand('init', '');