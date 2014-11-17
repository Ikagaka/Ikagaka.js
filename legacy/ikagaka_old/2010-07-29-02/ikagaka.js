$(function(){
	imgTransparent("../mobilemaster/shell/master/surface0.png",function(_canvas){
		var canvas = $("#ikagaka>.named0>.scope0>canvas")
			.attr("width",_canvas.width)
			.attr("height",_canvas.height)[0];
		$(canvas.parentElement)
			.width(_canvas.width)
			.height(_canvas.height);
		var ctx = canvas.getContext('2d');
		ctx.drawImage(_canvas,0,0);
		imgTransparent("../mobilemaster/shell/master/element0003body.png",function(_canvas){
			//ctx.globalCompositeOperation="destination-in";
			ctx.drawImage(_canvas,38,142);
		});
	});
});

imgTransparent = function(src,callback){
	var img = new Image();
	img.src = src;
	img.onload = function(){
		var canvas = $("<canvas></canvas>")
			.attr("width",img.width)
			.attr("height",img.height)[0];
		var ctx = canvas.getContext('2d');
		ctx.drawImage(img,0,0);
		var imgdata = ctx.getImageData(0,0,img.width,img.height);
		var r = imgdata.data[0];
		var g = imgdata.data[1];
		var b = imgdata.data[2];
		for(var i = 0; i < imgdata.data.length; i++){
			if(r === imgdata.data[i] && g === imgdata.data[i+1] && b === imgdata.data[i+2]) imgdata.data[i+3] = 0;
			i += 3;
		}
		ctx.putImageData(imgdata,0,0);
		callback(canvas);
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
imgTransparent("../mobilemaster/shell/master/surface0.png",function(_canvas){
		var canvas = $("#ikagaka>.named0>.scope0>canvas")
			.attr("width",_canvas.width)
			.attr("height",_canvas.height)[0];
		$(canvas.parentElement)
			.width(_canvas.width)
			.height(_canvas.height);
		var ctx = canvas.getContext('2d');
		ctx.drawImage(_canvas,0,0);
		imgTransparent("../mobilemaster/shell/master/element0003body.png",function(_canvas){
			//ctx.globalCompositeOperation="destination-in";
			ctx.drawImage(_canvas,38,142);
		});
	});
				$(this).dequeue();
			}
		).delay();
	}
	settimeout(arguments.callee,100);
}






