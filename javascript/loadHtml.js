$(document).ready(function(){ 
	
  $.get("header.html", function(data) {
	  if ( $("#header")){
		$("#header").html(data);
	  }
  });
  
  $.get("footer.html", function(data) {
	  if ($("#footer")){
		$("#footer").html(data);
	  }
  });
  
  $.get("copyright.html", function(data) {
	  if ($("#copyright")){
		$("#copyright").html(data);
	  }
  });
  
  $.get("sideNav.html", function(data) {
	  if ($("#sideNav")){
		$("#sideNav").html(data);
		loadData();
	  }
  });
  

});


