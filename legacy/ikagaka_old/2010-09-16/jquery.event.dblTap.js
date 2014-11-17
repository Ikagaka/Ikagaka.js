/*--------------------------------------------------------------------------*
 *  
 *  binding dblTap event for jQuery
 *  
 *  MIT-style license. 
 *  
 *  2010 Kazuma Nishihata 
 *  http://blog.webcreativepark.net/2010/09/08-204058.html
 *  
 *--------------------------------------------------------------------------*/
jQuery.event.special.dblTap = {
	setup : (function(){
		var flag = false;
		return function(){
			$(this).click(function(){
				if(flag){
					$(this).trigger("dblTap");
					flag = false;
				}else{
					flag = true;
				}
				setTimeout(function(){
					flag = false;
				},jQuery.event.special.dblTap.delay);
			})
		}
	})() , 
	delay : 700
}