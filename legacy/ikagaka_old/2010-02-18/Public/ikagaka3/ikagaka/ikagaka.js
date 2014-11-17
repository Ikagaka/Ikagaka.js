var Ikagaka = function(){
	$("body").append("new ikagaka<br />");

	this.named = new Array();

	$("body").prepend(
		$("<div>")
		.attr("id","Ikagaka")
		.append("ikagaka")
		.cleaner()
		.css("border","1px solid #ff0000")
	);

	return this;
};