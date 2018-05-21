var markersArray = [];
var geocoder = new google.maps.Geocoder();

function initMap() {
					 
                    var map = new google.maps.Map(document.getElementById('map'));
					
					
					 $.ajax({
			url: 'php/retrieveGuideInfo.php',
			type: 'post',
			data: {"callgetGuideLocation":""},
			dataType: 'json',
		success: function(data){
			console.log(data);
			for(countryCount in data.country) {
				geocodeAddress(geocoder, map,data.country[countryCount]);
			}
			},
		error: function(data){
			console.log("error");
			console.log(data);
		}
			});	
			
					
	

}
		//https://stackoverflow.com/questions/19304574/center-set-zoom-of-map-to-cover-all-visible-markers

function changeCenter(map){
	var bounds = new google.maps.LatLngBounds();
						console.log(markersArray);
						for (var i = 0; i < markersArray.length; i++) {
						 bounds.extend(markersArray[i].getPosition());
					
						}
					
					map.fitBounds(bounds)
}

function geocodeAddress(geocoder, resultsMap,address) {
   
        geocoder.geocode({'address': address}, function(results, status) {
          if (status === 'OK') {
            var marker = new google.maps.Marker({
              map: resultsMap,
			  animation: google.maps.Animation.DROP,
              position: results[0].geometry.location
            });
			markersArray.push(marker);
			changeCenter(resultsMap);
          } else {
            alert('Geocode was not successful for the following reason: ' + status);
          }
        });
      }
