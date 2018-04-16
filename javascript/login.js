$(document).ready(function() {
	$.ajax({
			url: 'php/createAccount.php',
			type: 'post',
			data: {"callGetUsername":""},
		success: function(data){
			if (data!== null && data !== ""){
				$("#profileDrop").css("display", "block");
				$("#logInDrop").css("display", "none");
				document.getElementById("username").innerHTML = data;
			}
		},
		error: function(data){
			console.log("error");
		}
	
	});	
});
	
function checkLogin(){
	var email = $('#email').val();
	var psw= $('#password').val();
	var input = email + ":" + psw;
	
	
	if (email !== null && email !== '' && psw !== null && psw !== ''){
		$.ajax({
				url: 'php/createAccount.php',
				type: 'post',
				data: {"callCheckAccount":input},
			success: function(data){
				if (data== "correct"){
					window.location.href = 'profile.html';
				} else{
					document.getElementById("errorLabel").innerHTML = data;
				}
			},
			error: function(data){
				document.getElementById("errorLabel").innerHTML = "Error with authentication system. Please try again later";
			}
		});
	}else{
		document.getElementById("errorLabel").innerHTML = "Please enter your email or password.";

	}
}

function logout(){
	$.ajax({
			url: 'php/createAccount.php',
			type: 'post',
			data: {"callAccountLogout":""},
		success: function(data){
			if (data!= null || data != ""){
				$("#profileDrop").css("display", "none");
				$("#logInDrop").css("display", "block");
				window.location.href = 'index.html';
			}
		},
		error: function(data){
			console.log("error");
		}
	
	});	
}