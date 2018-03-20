$(document).ready(function() {
	$('input[type="text"], input[type="password"]').on('keyup', function() {
		var name = $(this).attr("name");
		var value = document.getElementsByName(name)[0].value;
		// remove all white space
		value = value.replace(/\s/g, '');
		var labelName = name+'Label';
		
		if (value !== null && value !== ''){
			// call function base on the current input
			var functionName = "check"+name;
			var labelText = window[functionName](value);
			document.getElementById(labelName).innerHTML = labelText;
		}else{
			document.getElementById(labelName).innerHTML = name+" is missing";
		}
		$.ajax({
			url: 'php/processInput.php',
			success: function(){
				// If successful run updataDisplay
				//console.log("success");
			},
		error: function(){
			console.log("error");
		}
		});
	});
});

function checkEmail(email){
	//https://stackoverflow.com/questions/46155/how-to-validate-an-email-address-in-javascript
	var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	var label='';
	if (!re.test(email)){
		label = "Invaild email address"
	}
	return(label);
}

function checkUsername(){
	return("");
}

function checkPassword(psw){
	// https://martech.zone/javascript-password-strength/
	var strongRegex = new RegExp("(?=.{8,})(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*\\W).*$", "g");
	var mediumRegex = new RegExp("(?=.{8,})(((?=.*[A-Z])(?=.*[a-z]))|((?=.*[A-Z])(?=.*[0-9]))|((?=.*[a-z])(?=.*[0-9]))).*$", "g");
	var enoughRegex = new RegExp("(?=.{8,}).*", "g");
	
	if (false == enoughRegex.test(psw)) {
		return("Your password must contain 8 characters");
	} else if (strongRegex.test(psw)) {
		return("Strong!");
	} else if (mediumRegex.test(psw)) {
		return("Medium!");
	} else {
		return("Weak!");
	}
}