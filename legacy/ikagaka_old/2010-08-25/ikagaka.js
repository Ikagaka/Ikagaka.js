$(function(){
	var emily4 = ghost("../emily4/");
});

var ghost = function(_url){
	var o = {};
	o = {
		homeurl: _url,
		shell: {},
		PID: new Date().getTime(),
		scriptTID: 0,
		eventTID: 0
	};
	$("body").append("<div class=\"ghost"+o.PID+"\"></div>");
	$.get(o.url+"updates2.dau",function(data){
		var list = data.replace(/\r\n/g,"\n").replace(/\r/g,"\n").replace(/\n\n/g,"\n").replace(/\/\/.*\n/g,"").split("\n");
		for(var i=0;i<list.length;i++){
			list[i] = list[i].split("")[0];
			$("body").append(list[i]);
		}
		o.updates2 = list;
	});
	o.scope = (function(){//コンストラクタのようなもの
		var curScope = 0;
		var scopeList = [];
		var scopeObj = {};
		scopeList[curScope] = scopeObj;
		return function(_num){//実際に呼び出されるカレントスコープ指定関数
			if(typeof _num === "number" && isFinite(_num)){//もし数字
				curScope = Number(_num);
				if(typeof scopeList[curScope] === "undefined"){
					scopeList[curScope] = scopeObj;
				}
			}
			return scopeList[curScope];//スコープオブジェクトを返す
		}
	})();
	return o;
};

