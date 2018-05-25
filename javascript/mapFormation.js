var markersArray = [];
var geocoder;

var GOOGLE_MAP_KEY = "AIzaSyDD136-luRsb0FaoghQnQLCSF_nZXhzrhE";

function loadScript() {
	$.ajax({
		url: 'php/retrieveGuideInfo.php',
		type: 'post',
		data: {"callgetKey":""},
		success: function(data){
			console.log(data);
			var script = document.createElement('script');
			  script.type = 'text/javascript';
			  script.src = 'https://maps.googleapis.com/maps/api/js?v=3' +
				  '&key=' + data +'&callback=initMap'; //& needed
			  document.body.appendChild(script);
			},
			error: function(data){
				console.log("error");
				console.log(data);
			}
		});	
  
}

function initMap() {
	geocoder =  new google.maps.Geocoder();
	var locationRio = {lat: -22.915, lng: -43.197};
				var map = new google.maps.Map(document.getElementById('map'), {
				zoom: 1,
				center: locationRio,
				});

	$.ajax({
		url: 'php/retrieveGuideInfo.php',
		type: 'post',
		data: {"callgetGuideLocation":""},
		dataType: 'json',
		success: function(data){
			if (!jQuery.isEmptyObject(data)){
				for(countryCount in data.country) {
					geocodeAddress(geocoder, map,data.country[countryCount]);
				}
			}
			},
			error: function(data){
				console.log("error");
				console.log(data);
			}
		});	

}
function geocodeAddress(geocoder, resultsMap,address) {
   
        geocoder.geocode({'address': address}, function(results, status) {
          if (status === 'OK') {
            var marker = new google.maps.Marker({
              map: resultsMap,
			  zoom: 1,
			  animation: google.maps.Animation.DROP,
              position: results[0].geometry.location
            });
			markersArray.push(marker);
          } else {
            alert('Geocode was not successful for the following reason: ' + status);
          }
        });
      }
