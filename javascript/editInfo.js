$(document).ready(function() {
	$.ajax({
			url: 'php/editAccount.php',
			type: 'post',
			data: {"callGetAccountInfo":""},
			dataType: 'json',
		success: function(data){
			if (data!== null && data !== ""){
				// for debug purpose
				//document.getElementById("error").innerHTML = data; 
				$('#EmailEdit').attr('value', data.email);
				$('#UsernameEdit').attr('value', data.username);
				$('#CountryEdit').attr('value', data.country);
				$('#TravelTitleEdit').attr('value', data.travelTitle);
			}
		},
		error: function(data){
			console.log("error");
		}
	
	});	

});
