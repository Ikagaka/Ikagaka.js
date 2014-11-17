(function(){
	jQuery.fn.cleaner = function(config){
		config = jQuery.extend({},config);
		this

		.css("margin","0px")
		.css("padding","0px")
		.css("border","0px")
//		.css("border","1px solid #ff00ff")

		.css("position","absolute")

		.css("right","0px")
		.css("bottom","0px")
		.css("z-index","0")

		.css("width","100%")
		.css("height","100%")

		.css("text-align","left")
		.css("vertical-align","top")

		.css("line-height","100%")

		.css("background-color","transparent")

		.css("overflow","visible")
		.css("visibility","visible")

		;

		return this;
	};
})(jQuery);