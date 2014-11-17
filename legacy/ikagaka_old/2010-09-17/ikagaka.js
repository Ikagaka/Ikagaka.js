(function(){

window.named = function() {

	var namedObj = {};

	namedObj.PID = Math.floor(Math.random() * 100000000);

	namedObj.curShell = "master";

	var isObject = function( obj ) {
		return toString.call(obj) === "[object Object]";
	};

	var isFunction = function( obj ) {
		return toString.call(obj) === "[object Function]";
	};

	var isArray = function( obj ) {
		return toString.call(obj) === "[object Array]";
	};

	var isImage = function( obj ) {
		return toString.call(obj) === "[object HTMLImageElement]";
	};

	var isCanvas = function( obj ) {
		return toString.call(obj) === "[object HTMLCanvasElement]";
	};

	var isNumber = function( obj ) {
		return typeof obj === "number" && isFinite(obj);
	};

	var isUndefined = function( obj ) {
		return typeof obj === "undefined";
	};

	var isEmptyObject = function( obj ) {
		for ( var name in obj ) {
			return false;
		}
		return true;
	};

	var asyncOrderApply = function() {
		var flag = 0;
		var funcList = [];
		var objList = [];
		var aryList = [];
		var taskObj = {};
		taskObj.todo = function( func, obj, ary ){
			if ( isFunction(func) ) {
				flag += 1;
				funcList.push(func);
				objList.push( ( isObject(obj) ) ? obj : {} );
				aryList.push( ( isArray(ary) ) ? ary : [] );
			} else {
				throw {
					name: "TypeError"
					,message: "values is not right"
				};
			}
		};
		taskObj.trydo = function(){
			flag -= 1;
			if ( flag === 0 ){
				for ( var i = 0; i < funcList.length; i++ ) {
					funcList[i].apply(objList[i], aryList[i]);
				}
				funcList = objList = aryList = [];
			}
		};
		return taskObj;
	};

	var img2canvas = function( img, bool ) {
		if ( ! isImage(img) ) {
			throw {
				name: "TypeError"
				,message: "values is not right"
			};
		}
		var canvas = $("<canvas></canvas>").attr("width", img.width).attr("height", img.height)[0];
		var ctx = canvas.getContext('2d');
		ctx.drawImage(img, 0, 0);
		if (  typeof bool !== "undefined" ) {
			var imgdata = ctx.getImageData(0, 0, img.width, img.height);
			var r = imgdata.data[0];
			var g = imgdata.data[1];
			var b = imgdata.data[2];
			for ( var i = 0; i < imgdata.data.length; i++ ) {
				if ( r === imgdata.data[i] && g === imgdata.data[i+1] && b === imgdata.data[i+2] ) {
					imgdata.data[i+3] = 0;
				}
				i += 3;
			}
			ctx.putImageData(imgdata, 0, 0);
		}
		return canvas;
	};

	var paintCanvas = function( target, canvas, type, x, y) {
		if ( isCanvas(target) || isCanvas(canvas) ) {
			throw {
				name: "TypeError"
				,message: "values is not right"
			};
		}
		var ctx = target.getContext('2d');
		ctx.globalCompositeOperation = ( isUndefined(type) ) ? "source-over" : type;
		try {
			if(typeof x === "undefined" && typeof y === "undefined"){
				ctx.drawImage(surface,0,0);
			} else {
				ctx.drawImage(surface,x,y);
			}
		} catch (e) { }


		return target;
	};
	
	namedObj.scope = (function(){}
		var scopeList =[];
		var curScope = 0;
		var scopeObj = new  (function(){
			this.curScope = curScope;
			this.
			this.
			this.
			this.
		})();
		scopeObj.
		return function(){
			
		};
	)();

	return namedObj;

};


/////////////////////////////////////////////////////////////////
})();





































