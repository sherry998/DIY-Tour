<?php
	//https://github.com/PHPMailer/PHPMailer
	use PHPMailer\PHPMailer\PHPMailer;
	use PHPMailer\PHPMailer\Exception;

	require 'Exception.php';
	require 'PHPMailer.php';
	require 'SMTP.php';
	include 'error.php';
	
	$mysqli = new mysqli('localhost', 'root', '', 'diy_tour');
	//$mysqli = new mysqli('localhost', 'root', 'db5a0d0b13ca1d4d', 'diy_tour');
	
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
		
		$sql = "SELECT * FROM account WHERE email = ?";
		$stmt = $mysqli->prepare($sql);
		$stmt->bind_param("s", $email );
		$stmt->execute();
		$query = $stmt->get_result();

		$querySame = 0;
		
		if(isset($_SESSION['id']) && !empty($_SESSION['id'])) {
			$id = $_SESSION['id'];
			$sameSql = "SELECT * FROM account WHERE email = ? AND userId= ?";
			$sameStmt = $mysqli->prepare($sameSql);
			$sameStmt->bind_param("si", $email,$id );
			$sameStmt->execute();
			$querySame = $sameStmt->get_result();
		} 
		
		if (mysqli_num_rows($query) == 0  && $querySame == null){
			echo "true";
		} else if($querySame != null){
			if(mysqli_num_rows($query) == 0 && mysqli_num_rows($querySame) == 0){
				echo "true";
			} else if (mysqli_num_rows($querySame) == 1){
				echo "same";
			}
		}else{
			echo "false";
		}	
	}

	
	function createAccount($email,$uname,$psw,$mysqli){
		
		//hash for email, simple md5
		$hash = md5( rand(0,1000) );
		//https://www.sitepoint.com/hashing-passwords-php-5-5-password-hashing-api/
		$psw = password_hash($psw, PASSWORD_BCRYPT );
		$sql = "INSERT INTO account (email, username, password, hash)
			VALUES (?, ?, ?, ?)";
		$stmt = $mysqli->prepare($sql);
		$stmt->bind_param("ssss", $email,$uname,$psw,$hash );
				
		if ($stmt->execute()) {
			echo "Please check your email: " .$email . " to activate your account";
			sendEmail($uname,$email,$hash);
		} else {
			echo "Error: " . $sql . "<br>" . $mysqli->error;
		}
		
	}
	
	// needed to be changed when upload to uq server
	function sendEmail($uname,$email,$hash){
		$mail = new PHPMailer(true); 
		try {
			//Server settings
			$mail->SMTPDebug = 2;                                 // Enable verbose debug output
			$mail->isSMTP();                                      // Set mailer to use SMTP
			$mail->Host = 'mailhub.eait.uq.edu.au';  // Specify main and backup SMTP servers
			$mail->SMTPAuth = false;                               // Enable SMTP authentication
			$mail->SMTPSecure = 'tls';                            // Enable TLS encryption, `ssl` also accepted
			$mail->Port = 25;                                    // TCP port to connect to

			//Recipients
			$mail->setFrom('t.yao@uq.net.au', 'DIY Tour');
			$mail->addAddress($email, $uname);     // Add a recipient

			//Content
			$mail->isHTML(true);                                  // Set email format to HTML
			$mail->Subject = 'Signup | Verification';
			$mail->Body    = '<p>Hi '.$uname.'. Thanks for signing up!</p>
		<p>Your account has been created, you can login with the following credentials after you have activated your account by pressing the url below.</p>
		<p>Please click this link to activate your account:</p>
		<a href="https://infs3202-6416f226.uqcloud.net/verify.php?email='.$email.'&hash='.$hash.'&userName='.$uname.'">https://infs3202-6416f226.uqcloud.net/verify.php?email='.$email.'&hash='.$hash.'&userName='.$uname.'</a>';
			$mail->AltBody = 'Hi '.$uname.'. Thanks for signing up!
		Your account has been created, you can login with the following credentials after you have activated your account by pressing the url below.	
		Please click this link to activate your account:
		http://localhost/DIY%20TOUR/verify.php?email='.$email.'&hash='.$hash.'&userName='.$uname;

			$mail->send();
			echo 'Message has been sent';
		} catch (Exception $e) {
			echo 'Message could not be sent. Mailer Error: ', $mail->ErrorInfo;
		}
	}
	
	function checkAccount($email,$psw,$mysqli){

		$sql = "SELECT * FROM account WHERE email = ?";
		$stmt = $mysqli->prepare($sql);
		$stmt->bind_param("s", $email );
		$stmt->execute();
		$result = $stmt->get_result();

		$activateSql = "SELECT * FROM account WHERE email = ? AND activated = 'true'";
		$activateStmt = $mysqli->prepare($activateSql);
		$activateStmt->bind_param("s", $email );
		$activateStmt->execute();
		$activateResult = $activateStmt->get_result();
		
		if(mysqli_num_rows($result) == 1 && mysqli_num_rows($activateResult) == 1){
			$row = mysqli_fetch_array($result);
			if(password_verify($psw, $row['password'])){
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
		} else if (mysqli_num_rows($result) == 1 && mysqli_num_rows($activateResult) == 0){
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