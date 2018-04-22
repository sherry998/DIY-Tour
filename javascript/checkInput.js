var dict = {
	"Email": false,
	"Password": false,
	"Username": false,
	"EmailEdit": true,
	"UsernameEdit": true,
	"Current_password": false,
	"New_password": false,
	"Typed_password": false,
};

var label='';
var id;

$(document).ready(function() {
	$('.checkInput').on('keyup', function() {

		id = $(this).attr('id');
		var idWithoutEdit =id.replace("Edit", '');

		var value = document.getElementById(id).value;
		// remove all white space
		value = value.replace(/\s/g, '');
		if (value !== null && value !== ''){
			// call function base on current input
			var functionName = "check"+idWithoutEdit;
			console.log(functionName);
			var labelText = window[functionName](value);
		}else{
			for (var key in dict) {
				if (id == key){
					dict[key] = false;
					console.log("find");
					break;
				}
			}
			var labelName = idWithoutEdit+'Label';
			var label = idWithoutEdit.replace("_"," ");
			document.getElementById(labelName).innerHTML = label+" is missing";
			document.getElementById(labelName).style.color = "#fd786e";
		}
		}); 
		
	});
	
function checkInput(){
	console.log(dict["Email"]);
	console.log(dict["Password"]);
	console.log(dict["Username"]);
	if (dict["Email"]==true && dict["Password"]==true && dict["Username"]==true){
		var email = $('#Email').val();
		var username = $('#Username').val();
		var psw = $('#Password').val();
		var input = email + ":" + username + ":" + psw;
		$.ajax({
			url: 'php/createAccount.php',
			type: 'post',
			data: {"callCreateAccount":input},
		success: function(data){
			console.log(data);
			var modal = document.getElementById('myModal');
			document.getElementById("modalText").innerHTML = "Welcome, please check your email: " + email;
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

function checkEditInput(){;
	if (dict["EmailEdit"]==true && dict["UsernameEdit"]==true){
		//console.log("run");
		changeInfo();
	}
}

function changeInfo(){
	var emailInput = document.getElementById("EmailEdit").value;
	var usernameInput = document.getElementById("UsernameEdit").value;
	var countryInput = document.getElementById("CountryEdit").value;
	var travelTInput = document.getElementById("TravelTitleEdit").value;
	
	var changeInput = emailInput + ":" + usernameInput + ":" + countryInput  + ":" + travelTInput;
	
	$.ajax({
		url: 'php/editAccount.php',
		type: 'post',
		data: {"callUpdateAccount":changeInput},
		success: function(data){
			document.getElementById("username").innerHTML = usernameInput;
			$( "#message" ).addClass( "messageSucess" );
			document.getElementById("message").innerHTML = "Update profile successfully."; 
		},
		error: function(data){
			$( "#message" ).addClass( "messageFail" );
			document.getElementById("message").innerHTML = "Error connecting to server. Please try again later."; 
		}
		});
}

function checkCorrectPassword(){
	var currentPassword = document.getElementById("Current_password").value;
	
	$.ajax({
			url: 'php/editAccount.php',
			type: 'post',
			data: {"callCheckAccountPassword":currentPassword},
		success: function(data){
			console.log(data);
			if (data== "true"){
					changePassword(currentPassword);
			} else {
				document.getElementById("Current_passwordLabel").innerHTML = "Incorrect password";
			}
		},
		error: function(data){
			console.log(data);
			$( "#message" ).addClass( "messageFail" );
			document.getElementById("message").innerHTML = "Error connecting to server. Please try again later."; 
		}
	
	});	
}

function changePassword(currentPassword){
	console.log(dict["Current_password"]);
	console.log(dict["New_password"]);
	console.log(dict["Typed_password"]);
	if (dict["Current_password"] == true && dict["New_password"] == true && dict["Typed_password"] == true){
		var newPassword = document.getElementById("New_password").value;
		$.ajax({
			url: 'php/editAccount.php',
			type: 'post',
			data: {"callChangePassword":newPassword},
		success: function(data){
			$( "#message" ).addClass( "messageSucess" );
			document.getElementById("message").innerHTML = "Password changed successfully."; 
		},
		error: function(data){
			$( "#message" ).addClass( "messageFail" );
			document.getElementById("message").innerHTML = "Error connecting to server. Please try again later."; 
		}
	});
	}
	
}


function checkEmail(email){
	//https://stackoverflow.com/questions/46155/how-to-validate-an-email-address-in-javascript
	var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	if (!re.test(email)){
		dict[id] = false;
		document.getElementById("EmailLabel").innerHTML = "Invaild email address!";
		document.getElementById("EmailLabel").style.color = "#fd786e";
	} else {
		// ajax asynchronous return, therefore label is changed within it
		$.ajax({
		url: 'php/createAccount.php',
		type: 'post',
		data: {"callCheckEmail":email},
		success: function(data){
			console.log(data);
			document.getElementById("EmailLabel").innerHTML = "";
			if (data=="true"){
				dict[id] = true;
			} else if (data=="same"){
				dict[id] = true;
			}else {
				dict[id] = false;
				document.getElementById("EmailLabel").innerHTML = "Email already exists";
				document.getElementById("EmailLabel").style.color = "#fd786e";
				$( "#Shake1" ).effect( "shake", {times:2}, 1000 );
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
	dict["UsernameEdit"] = true;
	dict["Username"]=true;
	document.getElementById("UsernameLabel").innerHTML = "";
}

function checkPassword(psw){
	label = checkStrengthPassword(psw);
	document.getElementById("PasswordLabel").innerHTML = label;
}

function checkCurrent_password (){
	document.getElementById("Current_passwordLabel").innerHTML = "";
	dict["Current_password"] = true;
}

function checkNew_password (psw){
	label = checkStrengthPassword(psw);
	document.getElementById("New_passwordLabel").innerHTML = label;
	
}

function checkTyped_password (psw){
	checkSamePassword(psw);
}

function checkStrengthPassword(psw){
	// https://martech.zone/javascript-password-strength/
	var strongRegex = new RegExp("(?=.{8,})(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*\\W).*$", "g");
	var mediumRegex = new RegExp("(?=.{8,})(((?=.*[A-Z])(?=.*[a-z]))|((?=.*[A-Z])(?=.*[0-9]))|((?=.*[a-z])(?=.*[0-9]))).*$", "g");
	var enoughRegex = new RegExp("(?=.{8,}).*", "g");
	label = "";
	dict["Password"] = true;
	dict["New_password"] = true;
	if (false == enoughRegex.test(psw)) {
		dict["Password"] = false;
		dict["New_password"] = false;
		return '<font color="#fd786e">Your password must contain 8 characters</font>';
	} else if (strongRegex.test(psw)) {
		return '<font color="#b4ea15">Strong!</font>';
	} else if (mediumRegex.test(psw)) {
		return '<font color="#fdbf6e">Medium!</font>';
	} else {
		return '<font color="#fd786e">Weak!</font>';
		$( "#Shake3" ).effect( "shake", {times:2}, 1000 );
	}
}

function checkSamePassword(psw){
	var newpsw = $('#New_password').val();
	if (psw != newpsw){
		document.getElementById("Typed_passwordLabel").innerHTML = "Different";
		dict["Typed_password"] = false;
	} else {
		document.getElementById("Typed_passwordLabel").innerHTML = "";
		dict["Typed_password"] = true;
	}
}
