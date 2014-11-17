$(function(){
	//基本DOM生成
	
	//基本CSS設定
	$("head").append("\
<style id=\"ikagakaCSS\">\
	#ikagaka,#ikagaka *{\
		border:0px solid black;\
		margin:0px;\
		padding:0px;\
	}\
	#ikagaka{\
		position:relative;\
		width:500px;\
		height:500px;\
		background-color:red;\
	}\
	#ikagaka>.named{\
		position:absolute;\
		width:100%;\
		height:100%;\
		background-color:green;\
	}\
	#ikagaka>.named>.scope{\
		position:absolute;\
		background-color:blue;\
	}\
	#ikagaka>.named>.scope>canvas{\
		position:absolute;\
	}\
	#ikagaka>.named>.scope>.collision{\
		position:absolute;\
		background-color:yellow;\
	}\
	#ikagaka>.named>.scope>.blimp{\
		position:absolute;\
		background-color:red;\
	}\
	#ikagaka>.named>.scope>.blimp>canvas{\
		position:absolute;\
	}\
	#ikagaka>.named>.scope>.blimp>.text{\
		position:absolute;\
		background-color:green;\
	}\
</style>\
	");
	//起動するゴーストを決める
	$("body").append("Hello World!<br />");
	//ファイルロードとか
	$.get("../mobilemaster/shell/master/surfaces.txt",function(data){
		var Text = data
		Text = Text.replace(/\r\n/g,"\n");
		Text = Text.replace(/\r/g,"\n");
		$("body").append(Text+"WOOO!<br />");
	});
	
	//起動処理
	
	var canvas = $("#ikagaka>.named0>.scope0>canvas")[0];
		var ctx = canvas.getContext('2d');
		var img = new Image();
		img.src = "../mobilemaster/shell/master/surface0.png";
		img.onload=function(){
			$("#ikagaka>.named0>.scope0")
				.width(img.width)
				.height(img.height);
			$("#ikagaka>.named0>.scope0>canvas")
				.attr("width",img.width)
				.attr("height",img.height);
			ctx.drawImage(img,0,0);
			var imgdata = ctx.getImageData(0, 0, canvas.width, canvas.height);
			var tcR = imgdata.data[0];
			var tcG = imgdata.data[1];
			var tcB = imgdata.data[2];
			var tcA = imgdata.data[3];
			//	$("body").append(imgdata.data.length+"<br />");
			for(var i=0; i<=imgdata.data.length; i++){
			//for(var i=0; i<=100; i++){
				//$("body").append(i+":R:"+imgdata.data[i]+"<br />");
				var R = imgdata.data[i];
				i++;
				//$("body").append(i+":G:"+imgdata.data[i]+"<br />");
				var G = imgdata.data[i];
				i++;
				//$("body").append(i+":B:"+imgdata.data[i]+"<br />");
				var B = imgdata.data[i];
				i++;
				//$("body").append(i+":A:"+imgdata.data[i]+"<br />");
				var A = imgdata.data[i];
				if(R===tcR&&G===tcG&&B===tcB&&A===tcA){
					//$("body").append("Woo!<br />");
					imgdata.data[i]=0;
				}
			}
			ctx.putImageData(imgdata,0, 0);
		};
		$("body").append("Hello World!<br />");
		var canvas2 = $("#ikagaka>.named0>.scope0>.blimp>canvas")[0];
		var ctx2 = canvas2.getContext('2d');
		var img2 = new Image();
		img2.src = "../mobilemaster/switch_L/balloons1.png";
		img2.onload=function(){
			$("#ikagaka>.named0>.scope0>.blimp")
				.width(img2.width)
				.height(img2.height);
			$("#ikagaka>.named0>.scope0>.blimp>canvas")
				.attr("width",img2.width)
				.attr("height",img2.height);
			ctx2.drawImage(img2,0,0);
			var imgdata = ctx2.getImageData(0, 0, canvas2.width, canvas2.height);
			var tcR = imgdata.data[0];
			var tcG = imgdata.data[1];
			var tcB = imgdata.data[2];
			var tcA = imgdata.data[3];
			for(var i=0; i<=imgdata.data.length; i++){
				var R = imgdata.data[i];
				i++;
				var G = imgdata.data[i];
				i++;
				var B = imgdata.data[i];
				i++;
				var A = imgdata.data[i];
				if(R===tcR&&G===tcG&&B===tcB&&A===tcA){
					imgdata.data[i]=0;
				}
			}
			ctx2.putImageData(imgdata,0, 0);
		};
});










