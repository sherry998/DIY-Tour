<?php
	
	$mysqli = new mysqli('localhost', 'root', '', 'diy_tour');
	
	if ($mysqli->connect_error) {
		echo("Connection failed: " . $mysqli->connect_error);
	}
	
	if (isset($_POST['callCheckEmail'])) {
        checkEmail($_POST['callCheckEmail'],$mysqli);
    }
	
	if (isset($_POST['callCreateAccount'])) {
		$inputArray = explode(':', $_POST['callCreateAccount']);
        createAccount($inputArray[0],$inputArray[1],$inputArray[2],$mysqli);
    }
	
	
	function checkEmail($email,$mysqli){
		$query = mysqli_query($mysqli,"SELECT * FROM account WHERE email = '$email'");
		
		if(mysqli_num_rows($query) == 0){
			echo "true";
		} else {
			echo "false";
		}	
	}

	
	function createAccount($email,$uname,$psw,$mysqli){
		
		$hash = md5( rand(0,1000) );
		$psw = md5 ($psw);
		sendEmail($uname,$email,$hash);
		
		$sql = "INSERT INTO account (email, userName, password, hash)
			VALUES ('$email', '$uname', '$psw', '$hash')";
			 	
		if ($mysqli->query($sql) === TRUE) {
			echo "Welcome, please check your email: " .$email . " to activate your account";
			sendEmail($uname,$email,$hash);
		} else {
			echo "Error: " . $sql . "<br>" . $mysqli->error;
		}
	}
	
	// needed to be changed when upload to uq server
	function sendEmail($uname,$email,$hash){
		$to      = $email; // Send email to our user
		$subject = 'Signup | Verification'; // Give the email a subject 
		$message = '
 
		Hi '.$uname.'. Thanks for signing up!
		Your account has been created, you can login with the following credentials after you have activated your account by pressing the url below.
		 
		Please click this link to activate your account:
		http://localhost/DIY%20TOUR/verify.php?email='.$email.'&hash='.$hash.'&userName='.$uname.'
		 
		'; // Our message above including the link
		
	
		$headers = 'From:email@diytour.com' . "\r\n"; // Set from headers
		mail($to, $subject, $message, $headers); // Send our email
	}
	
	$mysqli->close();
	
?>