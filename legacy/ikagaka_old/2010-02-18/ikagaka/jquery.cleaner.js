(function(){
	jQuery.fn.cleaner = function(config){
		config = jQuery.extend({},config);
		this

		.css("margin","0px")
		.css("padding","0px")
		.css("border","0px")
//		.css("border","1px solid #ffff00")

		.css("background-color","transparent")

		.css("overflow","visible")
		.css("visibility","inherit")
		;

		return this;
	};
})(jQuery);