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
	
	if (isset($_POST['callCheckAccount'])) {
		$inputArray = explode(':', $_POST['callCheckAccount']);
        checkAccount($inputArray[0],$inputArray[1],$mysqli);
    }

	
	if (isset($_POST['callAccountLogout'])) {
        accountLogout();
    }
	
	function checkEmail($email,$mysqli){
		session_start();
		
		$query = mysqli_query($mysqli,"SELECT * FROM account WHERE email = '$email'");
		$querySame = null;
		
		if(isset($_SESSION['id']) && !empty($_SESSION['id'])) {
			$id = $_SESSION['id'];
			$querySame = mysqli_query($mysqli,"SELECT * FROM account WHERE email = '$email' AND userId='$id'");
		} 
		
		if (mysqli_num_rows($query) == 0  && $querySame == null){
			echo "true";
		} else if(mysqli_num_rows($query) == 0 && mysqli_num_rows($querySame) == 0){
			echo "true";
		} else if (mysqli_num_rows($querySame) == 1){
			echo "same";
		}else{
			echo "false";
		}	
	}

	
	function createAccount($email,$uname,$psw,$mysqli){
		
		$hash = md5( rand(0,1000) );
		$psw = md5 ($psw);
		sendEmail($uname,$email,$hash);
		
		$sql = "INSERT INTO account (email, username, password, hash)
			VALUES ('$email', '$uname', '$psw', '$hash')";  
				
		if ($mysqli->query($sql) === TRUE) {
			echo "Please check your email: " .$email . " to activate your account";
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
	
	function checkAccount($email,$psw,$mysqli){
		$psw = md5 ($psw);
		$query = mysqli_query($mysqli,"SELECT * FROM account WHERE email = '$email'");
		$queryActivate = mysqli_query($mysqli,"SELECT * FROM account WHERE email = '$email' AND activated = 'true'");
		
		if(mysqli_num_rows($query) == 1 && mysqli_num_rows($queryActivate) == 1){
			$query = mysqli_query($mysqli,"SELECT * FROM account WHERE email = '$email' AND password= '$psw' ");
			if(mysqli_num_rows($query) == 1){
				$row = mysqli_fetch_array($query);
				$username = $row['username'];
				$id = $row['userId'];
		
				session_start();
                $_SESSION['username'] = $username;
				// for later use
				$_SESSION['id'] = $id;    				
                echo("correct");
			} else{
				echo "Incorrect password";
			}
		} else if (mysqli_num_rows($query) == 1 && mysqli_num_rows($queryActivate) == 0){
			echo "This account doesn't seem be activated, please check your email";
		}else {
			echo "This email doesn't seem be registered with DIY Tour";
		}	
	}
	
	// https://www.tutorialrepublic.com/php-tutorial/php-mysql-login-system.php
	function accountLogout(){
		session_start();
 
		// Unset all of the session variables
		$_SESSION = array();
 
		// Destroy the session.
		session_destroy();
	}
	
	$mysqli->close();
	
?>