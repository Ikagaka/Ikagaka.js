$(function(){
	$("body").append("<br />");
});

var Named = function(){};
Named.prototype.scope = (function(){
	var o = {};
	var scope = [];
	var curScope = 0;
	o.curScope = function(num){// \p[0]
		if(typeof num === undefined) return curScope;
		if(!isNaN(Number(num)) && 0 <= Number(num)) curScopeNum = Number(num);

		}
		if(typeof scopeList[curScopeNum] === undefined){
			scopeList[curScopeNum] = {
				curSafaceNum: 0,
				curBlimpNum: 0,
				curBlimpAspect: "left",
				curBlimpText: ""
			};
			$("<div></div>")
				.addClass("scope" + curScopeNum)
				.addClass("scope")
				.append(
					$("<canvas></canvas>")
						.attr("width",1)
						.attr("height",1)
				)
				.append(
					$("<div></div>")
						.addClass("blimp")
						.append(
							$("<canvas></canvas>")
								.attr("width",1)
								.attr("height",1)
						)
						.append(
							$("<div></div>")
								.addClass("text")
						)
				)
				.appendTo("");// TODO!!!!
		}
		return scopeObj;
	};
	return o;
})();


