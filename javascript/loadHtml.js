var onStar = 0;

$(document).ready(function(){ 
	
  var headerLoad = $.get("header.html", function(data) {
	  if ( $("#header").length != 0){
		$("#header").html(data);
	  }
  });
  
  var footerLoad =  $.get("footer.html", function(data) {
	  if ($("#footer").length != 0){
		$("#footer").html(data);
	  }
  });
  
  var copyrightLoad =  $.get("copyright.html", function(data) {
	  if ($("#copyright").length != 0){
		$("#copyright").html(data);
	  }
  });
  
  var sideLoad = $.get("sideNav.html", function(data) {
	  if ($("#sideNav").length != 0){
		$("#sideNav").html(data);
	  }
  });
  
  $.when(headerLoad, footerLoad,copyrightLoad,sideLoad ).done(function() {
    loadData();
	
	var pathname = window.location.pathname;
	console.log(pathname.includes("editGuide"));
	if(pathname.includes("specificGuide")||pathname.includes("editGuide")){
		loadGuide();
		if (pathname.includes("editGuide")||pathname.includes("newGuide")){
			activatePlaceSearch();
		}
	}else if (pathname.includes("profile")){
		loadProfileGuideResult();
	}
	});
	
	
	
	
	  //https://codepen.io/depy/pen/vEWWdw
  /* 1. Visualizing things on Hover - See next part for action on click */
  $('.ratingStar').on('mouseover', function(){
	  
    onStar = parseInt($(this).data('value'), 10); // The star currently mouse on
   
    // Now highlight all the stars that's not after the current hovered star
    $(this).parent().children('.ratingStar').each(function(e){
      if (e < onStar) {
        $(this).addClass('star');
      }
      else {
        $(this).removeClass('star');
      }
    });
    
  }).on('mouseout', function(){
    $(this).parent().children('.ratingStar').each(function(e){
      $(this).removeClass('star');
    });
  });
  
  
  /* 2. Action to perform on click */
  $('.ratingStar').on('click', function(){
    onStar = parseInt($(this).data('value'), 10); // The star currently selected
    var stars = $(this).parent().children('.ratingStar');
    for (i = 0; i < stars.length; i++) {
      $(stars[i]).removeClass('selected');
    }
    
    for (i = 0; i < onStar; i++) {
      $(stars[i]).addClass('selected');
    }
    
  });
  
         

});


