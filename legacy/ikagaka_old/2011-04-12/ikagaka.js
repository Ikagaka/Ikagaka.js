window.iKagaka = (function(){
	var aryNamed = {},
		elmScope = $("<div>").addClass("scope")
			.append($("<canvas>").addClass("shell").attr("width",0).attr("height",0))
			.append($("<div>").addClass("balloon")
				.append($("<canvas>").addClass("blimp").attr("width",0).attr("height",0))
				.append($("<div>").addClass("text"))
			)[0];
	return function(nar){
		var nar = nar || {
			homeurl: null,
			shell: null
		},
			namedObj = {};
		return namedObj;
	};
}());


$(function(){
	iKagaka(exice_z);
});