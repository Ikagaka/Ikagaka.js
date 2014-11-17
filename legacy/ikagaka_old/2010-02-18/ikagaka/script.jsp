


	var ghost = null;
	var headTag = document.getElementsByTagName('head')[0];
	var isIE = navigator.appName.match(/Microsoft Internet Explorer/);

	if(isIE) {
		window.attachEvent('onload', init);
	}else {
		window.addEventListener('load', init, false);
	}

	function init() {

		var libraly = document.createElement('SCRIPT');
		libraly.type = 'text/javascript';
		libraly.charset = 'utf-8';
		//見ちゃらめぇぇぇぇぇ！
		libraly.src = 'http://www.nekohime.org/nekohime.js';
//		libraly.src = 'http://mint.blogchat.jp:8088/nekohime.js';
		headTag.appendChild(libraly);
	}


//sendCommand('表示する画面', '引数')
	function sendCommand(menu, param) {

		var data = 'menu=' + menu;
		if(param != '') data += '&' + param;

		var jsonP = document.createElement('SCRIPT');
		jsonP.type = 'text/javascript';
		jsonP.charset = 'utf-8';
		jsonP.src = 'http://www.nekohime.org/doll?cb=callback&id=null&' + data + '&nocache=' + Math.random();
//		jsonP.src = 'http://mint.blogchat.jp:8088/doll?cb=callback&id=null&' + data + '&nocache=' + Math.random();
		headTag.appendChild(jsonP);

	}


	function callback_init(initJson) {

		if(ghost == null) {

		//Javaコード
		ghost = new Character('ghost', initJson, false);

			window.onunload = new Function('if(ghost!=null) ghost.removeMascot();');
		}

		//Javaコード
		
	}

	function callback(sakurascript) {


		try {

			ghost.execSakuraScript(sakurascript);

		}catch(e) {
			window.alert(e.description);
		}

	}


	function hiLight(targetDiv, isDraw) {

		if(isDraw) {

			targetDiv.style.color='white';
			targetDiv.style.backgroundColor='#66CDAA';
			targetDiv.style.textDecoration='underline';

		}else {

			targetDiv.style.color='';
			targetDiv.style.backgroundColor='';
			targetDiv.style.textDecoration='';
		}
	}


	function onClickQ(param) {

		var id = null;
		var ref = null;
		var cPos = param.indexOf(',', 0);

		if(cPos == -1) {

			id = param;
			ref = '';

		}else {

			id = param.substring(0, cPos);
			ref = param.substring(cPos+1, param.length);
		}

		if(id=='rssmenu' || id=='myvideo') {

			sendCommand(id, ref);

		}else if(id=='form') {

			sendCommand(id, 'type='+encodeURIComponent(ref));

		}else if(id=='talk') {

			sendCommand(id, 'group='+encodeURIComponent(ref));

		}else if(id=='ytplay') {

			sendCommand(id, 'video_id='+encodeURIComponent(ref));

		}else if(id=='rss') {

			sendCommand(id, 'rss='+encodeURIComponent(ref));

		}else if(id=='post') {

			var msgDiv = ghost.fukidasi.getElementsByTagName("DIV").item(0);
			var objText = msgDiv.getElementsByTagName("INPUT");

			var query = 'type='+ref;
			for(i=0; i<objText.length; i++) query += '&msg'+i+'='+encodeURIComponent(objText.item(i).value);
			sendCommand(id, query);

		}else if(id.substring(0, 7) == 'http://') {

			window.open(id, '_blank');

		}else {

			//上記以外のIDは、talkのパラメータとして処理する（略記形式）
			sendCommand('talk', 'group='+encodeURIComponent(id));
		}

	}
