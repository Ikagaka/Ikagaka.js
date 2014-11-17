window.makeNamedObj = (function(){
	var elmScope = $("<div>")
		.addClass("scope")
		.append($("<canvas>").addClass("shell"))
		.append(
			$("<div>").addClass("balloon")
				.append($("<canvas>").addClass("blimp"))
				.append($("<div>").addClass("text"))
		)[0];
	var Constr = function(nar){
		var Named = function(){};
		Named.prototype.scope = function(){
		};
		return namedObj;
	};
	
	return Constr;
}());


var Named = function(){};
Named.prototype.scope = function(){
};