(function(){
	jQuery.fn.cleaner = function(config){
		config = jQuery.extend({},config);
		this
		.css("margin","0px")
		.css("padding","0px")
		.css("border","0px")
		.css("border","1px solid #ff00ff")
		.css("right","0px")
		.css("bottom","0px")
		.css("width","100%")
		.css("height","100%")
		.css("text-align","left")
		.css("line-height","100%")
		.css("background-color","transparent")
		.css("overflow","visible")
		.css("position","absolute")
		.css("visibility","visible")
		.css("z-index","0");
		return this;
	};
})(jQuery);