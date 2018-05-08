var modal = document.getElementById('myModal');
var originalImage;

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
					$('#AboutEdit').attr('value', data.about);
					document.getElementById("editImage").src=data.profileImage;
					originalImage = data.profileImage;
				}
		},
		error: function(data){
			console.log(data);
			$( "#message" ).addClass( "messageFail" );
			document.getElementById("message").innerHTML = "Error connecting to server. Please try again later."; 
		}
	
	});	
}

});

function revertImage(){
	document.getElementById("editImage").src=originalImage;
	document.getElementById("uploadPhoto").value = "";
}

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

$("#uploadPhoto").change(function(){
	
	if ($("#uploadPhoto").val()!=null && $("#uploadPhoto").val()!=""){
		// https://stackoverflow.com/questions/16207575/how-to-preview-a-image-before-and-after-upload
		var reader = new FileReader();

		reader.onload = function (e) {
			// get loaded data and render thumbnail.
			document.getElementById("editImage").src = e.target.result;
		};

		// read the image file as a data URL.
		reader.readAsDataURL(this.files[0]);
	}
});

$('#imageForm').submit(function(e){
	console.log("uploading");
    e.preventDefault();
	var formData = new FormData(this);
	if ($("#uploadPhoto").val()==null || $("#uploadPhoto").val()==""){
		$("#message").removeClass();
		$( "#message" ).addClass( "messageFail" );
		document.getElementById("message").innerHTML = "No image uploaded"; 
		return;
	}
		$.ajax({
				url: 'php/uploadImage.php',
				type: 'post',
				cache:false,
				contentType: false,
				processData: false,
				data: formData,
			success: function(data){
				console.log("sucess");
				console.log(data);
				document.getElementById("editImage").src=data;
				$("#message").removeClass();
				$( "#message" ).addClass("messageSucess");
				document.getElementById("message").innerHTML = "Profile image changed successfully!"; 
			},
			error: function(data){
				console.log("error");
				console.log(data);
				$("#message").removeClass();
				$( "#message" ).addClass( "messageFail" );
				document.getElementById("message").innerHTML = "Error changing profile image, please try again later."; 
			}
		
		});	
});
	

