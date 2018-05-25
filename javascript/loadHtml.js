var onStar = 0;

$(document).ready(function(){ 
	
  var headerLoad = $.get("header.html", function(data) {
	  if ( $("#header").length != 0){
		$("#header").html(data);
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
  
  $.when(headerLoad,copyrightLoad,sideLoad ).done(function() {
	var pathname = window.location.pathname;

	if(!pathname.includes("register")&&!pathname.includes("login")){
		loadData();
	}
	
	
	console.log(pathname.includes("editGuide"));
	
	if(pathname.includes("specificGuide")||pathname.includes("editGuide")){
		loadGuide();
		
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


function removeStar(){
		var stars = $('#rating').children('.ratingStar');
        for (i = 0; i < stars.length; i++) {
      $(stars[i]).removeClass('selected');
    }
	onStar=0;
}

function loadScript(library,functionToRun) {
	$.ajax({
		url: 'php/retrieveGuideInfo.php',
		type: 'post',
		data: {"callgetKey":""},
		success: function(data){
			var script = document.createElement('script');
			  script.type = 'text/javascript';
			  script.src = 'https://maps.googleapis.com/maps/api/js?v=3' +
				  '&key=' + data + library + '&callback='+functionToRun; 
					document.body.appendChild(script);

			},
			error: function(data){
				console.log("error");
				console.log(data);
			}
		});	
  
}

// https://developers.google.com/maps/documentation/javascript/examples/places-autocomplete
function activatePlaceSearch(){
	var pathname = window.location.pathname;
	var input = document.getElementById('guideLocation');
	if(pathname.includes("editProfile")){
		input = document.getElementById('CountryEdit');
	}
	var autocomplete = new google.maps.places.Autocomplete(input);
}

function getURLParameter(name) {
  return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [null, ''])[1].replace(/\+/g, '%20')) || null;
}



