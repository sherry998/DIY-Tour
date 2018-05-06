$(document).ready(function(){ 
	
  $.get("header.html", function(data) {
    $("#header").html(data);
  });
  
  $.get("footer.html", function(data) {
    $("#footer").html(data);
  });
  
  $.get("copyright.html", function(data) {
    $("#copyright").html(data);
  });
  
  $.get("sideNav.html", function(data) {
    $("#sideNav").html(data);
  });
  
  loadData();
});


