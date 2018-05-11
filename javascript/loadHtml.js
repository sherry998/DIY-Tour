$(document).ready(function(){ 
	
  $.get("header.html", function(data) {
	  if ( $("#header").length != 0){
		$("#header").html(data);
	  }
  });
  
  $.get("footer.html", function(data) {
	  if ($("#footer").length != 0){
		$("#footer").html(data);
	  }
  });
  
  $.get("copyright.html", function(data) {
	  if ($("#copyright").length != 0){
		$("#copyright").html(data);
	  }
  });
  
  $.get("sideNav.html", function(data) {
	  if ($("#sideNav").length != 0){
		$("#sideNav").html(data);
	  }
  });
  
  loadData();

});


