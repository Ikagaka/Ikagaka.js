$(function(){
	animation();
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

var Animation = function(){
	//アニメーションの再生
	this.pattern = [];
	this.pattern[0]={};
	this.pattern[0].surfaceNum = "100";
	this.pattern[0].wait = "50";
	this.pattern[0].compositeType = "overlay";
	this.pattern[0].x = "65";
	this.pattern[0].y = "100";
	this.pattern[1]={};
	this.pattern[1].surfaceNum = "101";
	this.pattern[1].wait = "50";
	this.pattern[1].compositeType = "overlay";
	this.pattern[1].x = "65";
	this.pattern[1].y = "100";
	this.pattern[2]={};
	this.pattern[2].surfaceNum = "100";
	this.pattern[2].wait = "50";
	this.pattern[2].compositeType = "overlay";
	this.pattern[2].x = "65";
	this.pattern[2].y = "100";
	this.pattern[3]={};
	this.pattern[3].surfaceNum = "-1";
	this.pattern[3].wait = "50";
	this.pattern[3].compositeType = "overlay";
	this.pattern[3].x = "65";
	this.pattern[3].y = "100";
	var that = this;
	for(var i=0;i<pattern.length;i++){
		$("#ikagaka>.named0>.scope0>canvas").queue(function(){
			var j = i;
			var thaat = that;
			imgTransparent("../mobilemaster/shell/master/surface0.png",function(_canvas){
				var k = j;
				var thaaat = thaat;
				var canvas = $("#ikagaka>.named0>.scope0>canvas")
					.attr("width",_canvas.width)
					.attr("height",_canvas.height)[0];
				$(canvas.parentElement)
					.width(_canvas.width)
					.height(_canvas.height);
				var ctx = canvas.getContext('2d');
				ctx.drawImage(_canvas,0,0);
				imgTransparent("../mobilemaster/shell/master/surface"+thaat.pattern[k].surfaceNum+".png",function(_canvas){
					//ctx.globalCompositeOperation="destination-in";
					ctx.drawImage(_canvas,pattern[k].x,pattern[k].y);
				});
			});
			$(this).dequeue();
		}).delay(this.pattern[i].wait);//SERIKOのウエイト
	}
	setTimeout(arguments.callee,1000);//再生のタイミング
}






