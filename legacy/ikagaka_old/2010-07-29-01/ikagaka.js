$(function(){
	var img = new Image();
	img.src = "../mobilemaster/shell/master/surface0.png";
	img.onload=function(){
		var canvas = $("#ikagaka>.named0>.scope0>canvas")[0];
		var ctx = canvas.getContext('2d');
		$(canvas.parentElement)
			.width(img.width)
			.height(img.height);
		$(canvas)
			.attr("width",img.width)
			.attr("height",img.height);
		ctx.drawImage(img,0,0);
		var imgdata = ctx.getImageData(0, 0, img.width, img.height);
		var r = imgdata.data[0];
		var g = imgdata.data[1];
		var b = imgdata.data[2];
		for(var i = 0; i < imgdata.data.length; i++){
			if(
				r === imgdata.data[i] &&
				g === imgdata.data[i+1] &&
				b === imgdata.data[i+2]
			){
				imgdata.data[i+3] = 0;
			}
			i+=3;
		}
		ctx.putImageData(imgdata,0,0);
		$("body").append(arguments.callee+"<br>");
	};
});
imgTransparent = function(canvas,src,callback){
	var img = new Image();
	img.src = src;
	img.onload = function(){
		var ctx = canvas.getContext('2d');
		$(canvas).attr("width",img.width).attr("height",img.height);
		//$(canvas.parentElement).width(img.width).height(img.height);
		ctx.drawImage(img,0,0);
		var imgdata = ctx.getImageData(0, 0, img.width, img.height);
		var r = imgdata.data[0];
		var g = imgdata.data[1];
		var b = imgdata.data[2];
		for(var i = 0; i < imgdata.data.length; i++){
			if(r === imgdata.data[i] && g === imgdata.data[i+1] && b === imgdata.data[i+2]) imgdata.data[i+3] = 0;
			i+=3;
		}
		callback(imgdata);
	};
};

var animation = function(){
	//アニメーションの再生
	this.pattern = [];
	this.pattern[0] = [61,5,"overlay",85,100];
	this.pattern[1] = [60,5,"overlay",85,100];
	this.pattern[2] = [-1,6,"overlay",0,0];
	for(var i = 0; i < pattern.length; i++){
		$("#ikagaka>.named0>.scope0>canvas").queue(
			function(){
				//リフレッシュ
				var canvas = this[0];
				var ctx = canvas.getContext('2d');
				var img = new Image();
				img.src = "../mobilemaster/shell/master/surface0.png";
				$("#ikagaka>.named0>.scope0")
					.width(img.width)
					.height(img.height);
				$("#ikagaka>.named0>.scope0>canvas")
					.attr("width",img.width)
					.attr("height",img.height);
				img.onload=function(){
					pattern[i][0];
					ctx.drawImage(img,0,0);
					var imgdata = ctx.getImageData(0, 0, canvas.width, canvas.height);
					var transparentColor = imgdata.data.slice(0,4);
					for(var i = 0; i <= imgdata.data.length; i+4){
						var color = imgdata.data.slice(i,i+4);
						if(transparentColor === color){
							imgdata.data[i] = 0;
							imgdata.data[i+1] = 0;
							imgdata.data[i+2] = 0;
							imgdata.data[i+3] = 0;
						}
					}
					ctx.putImageData(imgdata,0, 0);
				};
				$(this).dequeue();
			}
		).delay();
	}
	settimeout(arguments.callee,100);
}






