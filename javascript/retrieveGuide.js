var day = document.getElementById('dayContainer');
var originalDay = document.getElementById('day1');
var dayCount;

$(document).ready(function() {
	getURLParameter(window.location.href );
	title = getURLParameter('title');
	id = getURLParameter('id');
	dataSend = id + ":" + title;
	console.log(title);
	console.log(id);
	
	$.ajax({
			url: 'php/retrieveGuideInfo.php',
			type: 'post',
			data: {"callGetGuideInfo":dataSend},
			dataType: 'json',
		success: function(data){
			console.log(data);
			if (data!== null && data !== ""){
				$("#title").text(data.guideName);
				$("#location").append(data.country);
				$("#date").append(data.date);
				$("#people").append(data.people);
				$("#budget").append(data.budget);
				$("#summary").text(data.overview);
				$(".profile-username").text(data.username);
				
				for(dayCount in data.day) {
					if ($("#day"+dayCount).length == 0){
						var clone = originalDay.cloneNode(true); 
						clone.id = "day" + dayCount;
						 day.appendChild(clone);
					}
					$("#day"+dayCount).children("h2").text("Day " + dayCount + ": " + data.day[dayCount].title);
					$("#day"+dayCount).children("p").text(data.day[dayCount].description);
					
				}
				createSideDayLink(dayCount);
			}
		},
		error: function(data){
			console.log("error");
			console.log(data);
			$( "#message" ).addClass( "messageFail" );
			document.getElementById("message").innerHTML = "Error connecting to server. Please try again later."; 
		}
	});

});

function getURLParameter(name) {
  return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [null, ''])[1].replace(/\+/g, '%20')) || null;
}

function createSideDayLink (count){
	for (var i=1; i<=count; i++){
		$('#link').append(
		$('<li>').append(
			$('<a>').attr('href','#day'+i).append("Day " + i)
		));  
	}
}

function showCreatorInfo(name){
	
}
