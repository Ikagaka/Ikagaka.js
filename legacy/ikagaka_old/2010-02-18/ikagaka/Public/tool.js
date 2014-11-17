function GET(_){
	log("GET "+_);
	var Text = jQuery.ajax({url: _,async: false}).responseText;
	Text = Text.replace(/\r\n/g,"\n");
	Text = Text.replace(/\r/g,"\n");
	log("OK");
	return Text.split("\n");
}