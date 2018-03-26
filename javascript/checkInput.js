var emailState = false;
var passwordState = false;
var usernameState = false;
var label='';

$(document).ready(function() {

	$('input[type="text"], input[type="password"]').on('keyup', function() {

		var id = $(this).attr('id');
		var value = document.getElementById(id).value;
		// remove all white space
		value = value.replace(/\s/g, '');
		var labelName = id+'Label';
		
		if (value !== null && value !== ''){
			// call function base on current input
			var functionName = "check"+id;
			var labelText = window[functionName](value);
		}else{
			document.getElementById(labelName).innerHTML = id+" is missing";
		}
		});
		
	});
	
function checkInput(){
	console.log(emailState);
	console.log(passwordState);
	console.log(usernameState);
	if (emailState==true && passwordState==true && usernameState==true){
		var email = $('#Email').val();
		var username = $('#Username').val();
		var psw = $('#Password').val();
		var input = email + ":" + username + ":" + psw;
		$.ajax({
			url: 'php/createAccount.php',
			type: 'post',
			data: {"callCreateAccount":input},
		success: function(data){
			var modal = document.getElementById('myModal');
			document.getElementById("modalText").innerHTML = "Welcome, please check your email: " + email+" to activate your account";
			modal.style.display = "block";
		},
		error: function(data){
			console.log("error");
		}
		});
		
	} else {
		// css effects to be added onto the label
		console.log('incorrect');
	}
}	

function checkEmail(email){
	//https://stackoverflow.com/questions/46155/how-to-validate-an-email-address-in-javascript
	var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	if (!re.test(email)){
		emailState = false;
		document.getElementById("EmailLabel").innerHTML = "Invaild email address!";
	} else {
		// ajax asynchronous return, therefore label is changed within it
		$.ajax({
		url: 'php/createAccount.php',
		type: 'post',
		data: {"callCheckEmail":email},
		success: function(data){
			console.log(data);
			if (data=="true"){
				emailState = true;
				document.getElementById("EmailLabel").innerHTML = "";
			} else {
				emailState = false;
				document.getElementById("EmailLabel").innerHTML = "Email already exists";
				console.log(label);
			}
		},
		error: function(data){
			console.log("Error connecting to database");
		}
		});
	}
	
}

function checkUsername(uname){
	usernameState=true;
	document.getElementById("UsernameLabel").innerHTML = "";
}

function checkPassword(psw){
	// https://martech.zone/javascript-password-strength/
	var strongRegex = new RegExp("(?=.{8,})(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*\\W).*$", "g");
	var mediumRegex = new RegExp("(?=.{8,})(((?=.*[A-Z])(?=.*[a-z]))|((?=.*[A-Z])(?=.*[0-9]))|((?=.*[a-z])(?=.*[0-9]))).*$", "g");
	var enoughRegex = new RegExp("(?=.{8,}).*", "g");
	var label = "";
	passwordState= true;
	
	if (false == enoughRegex.test(psw)) {
		passwordState= false;
		label ="Your password must contain 8 characters";
	} else if (strongRegex.test(psw)) {
		label ="Strong!";
	} else if (mediumRegex.test(psw)) {
		label = "Medium!";
	} else {
		label = "Weak!";
	}
	document.getElementById("PasswordLabel").innerHTML = label;
}
