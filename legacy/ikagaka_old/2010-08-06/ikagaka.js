$(function(){
	var text = " surface 0 \
	, surface 1 \
	{ \
		hoge \
	} \
	surface 10 \
	, surface 11 \
	{ \
		hoge \
	} \
	surface 0-9 , 12-15 \
	{ \
		hoge \
	} \
	";
	var parse_surfaces = /(?:(.*?)\{(.*?)\})/gi;
	var result;
	while(result = parse_surfaces.exec(text)){
		$("body").append("サーフィス定義のマッチ" + "<br>");
		for(i = 0; i < result.length; i += 1){
			$("body").append(i + ":" + result[i] + "<br>");
		}
		var parse_head = /(?:surface\s*?(\d+)\s*?\,*)/gi;
		var result2;
		while(result2 = parse_head.exec(result[1])){
			$("body").append("ヘッダのマッチ" + "<br>");
			for(i = 0; i < result2.length; i += 1){
				$("body").append(i + ":" + result2[i] + "<br>");
			}
		}
		var parse_head = /(?:(\d+\s*?-\s*?\d+)\s*?\,*)/gi;
		var result2;
		while(result2 = parse_head.exec(result[1])){
			$("body").append("ヘッダのマッチ2" + "<br>");
			for(i = 0; i < result2.length; i += 1){
				$("body").append(i + ":" + result2[i] + "<br>");
			}
		}
	}
});

