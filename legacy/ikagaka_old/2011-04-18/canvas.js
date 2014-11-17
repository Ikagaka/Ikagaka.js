function loadImageToCanvas(url, callback){
	var img = new Image();
	img.src = url;
	img.onload = function(){
		var canvas = $("<canvas>").attr("width", this.width).attr("height", this.height)[0],
			ctx = canvas.getContext("2d").drawImage(this, 0, 0),
			imgData = ctx.getImageData(0, 0, this.width, this.height),
			rgba = [],
			i;
		rgba[0] = imgData.data[0];
		rgba[1] = imgData.data[1];
		rgba[2] = imgData.data[2];
		for(i = 0; i < imgData.data.length; i += 4){
			if(imgData.data[i] == rgba[0] && imgData.data[i + 1] == rgba[1] && imgData.data[i + 2] == rgba[2]){
				imgData.data[i + 3] = 0;
			}
		}
		ctx.putImageData(imgData, 0, 0);
		callback(canvas);
	};
}

function loadShell(shellObj){
	var loading = 0,
		i = 0,
		j;
	function compoundElements(surfaceObj){
		var ctx = surfaceObj.canvas.getContext("2d"),
			i;
		if(surfaceObj.element){
			for(i = 0; i < shellObj.surface[i].element.length; i++){
				ctx.drawImage(surfaceObj.element[i].canvas, surfaceObj.element[i][2], surfaceObj.element[i][3]);
			}
		}
	}
	function next(){
		setTimeout(function(){
			if(shellObj.surface[i].src && i < shellObj.surface.length){
				loadImageToCanvas(shellObj.surface[i].src, (funciton(surfaceObj){
					loading += 1;
					return function(canvas){
						surfaceObj.canvas = canvas;
						surfaceObj.src = canvas.toDataURL();
						loading -= 1;
						if(loading <= 0){
							compoundElements(surfaceObj);
							next();
						}
					};
				}(shellObj.surface[i])));
			}
			if(shellObj.surface[i].element){
				for(j = 0; j < shellObj.surface[i].element.length; j++){
					loadImageToCanvas(shellObj.surface[i].element[j][2], (funciton(surfaceObj, elementObj){
						loading += 1;
						return function(canvas){
							elementObj.canvas = canvas;
							elementObj[2] = canvas.toDataURL();
							loading -= 1;
							if(loading <= 0){
								compoundElements(surfaceObj);
								next();
							}
						};
					}(shellObj.surface[i], shellObj.surface[i].element[j])));
				}
			}
			i += 1;
		}, 25);
	}
	next();
}