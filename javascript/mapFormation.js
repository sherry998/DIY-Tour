var markersArray = [];
var geocoder;

// The code snippet below has been sourced from https://developers.google.com/maps/documentation/javascript/examples/map-simple
function initMap() {
	geocoder =  new google.maps.Geocoder();
	var map = new google.maps.Map(document.getElementById('map'), {
		zoom: 1,
		center: {lat: -22.915, lng: -43.197},
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
			console.log('Geocode was not successful for the following reason: ' + status);
		}
    });
}
