var modal = document.getElementById('myModal');


$(document).ready(function() {
	var pathname = window.location.pathname;
	if(pathname.includes("editProfile")){
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
			$( "#message" ).addClass( "messageFail" );
			document.getElementById("message").innerHTML = "Error connecting to server. Please try again later."; 
		}
	
	});	
}

});

function deleteAccount(){
	$.ajax({
			url: 'php/editAccount.php',
			type: 'post',
			data: {"callDeleteCurrentAccount":""},
		success: function(data){
			document.getElementById("error").innerHTML = data; 
			if (data == "sucess"){
				// for debug purpose
				//document.getElementById("error").innerHTML = data; 
				window.location.href = 'index.html';
				
			}
		},
		error: function(data){
			$( "#message" ).addClass( "messageFail" );
			document.getElementById("message").innerHTML = "Error connecting to server. Please try again later."; 
		}
	
	});	
}

function openModal(){
	modal.style.display = "block";
}

function back(){
	modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}