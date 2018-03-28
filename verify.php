<!--https://code.tutsplus.com/tutorials/how-to-implement-email-verification-for-new-members--net-3824-->
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
 
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <title>Account Activation</title>
	<link rel="stylesheet" type="text/css" href="css/modal.css" />
</head>
<body>
    <div class="modal-content">
	<h1>Just one for step...</h1>
        <!-- start PHP code -->
        <?php
         
           $mysqli = new mysqli('localhost', 'root', '', 'diy_tour');
	
			if ($mysqli->connect_error) {
				echo("Connection failed: " . $mysqli->connect_error);
			} else{
			
				if(isset($_GET['email']) && !empty($_GET['email']) AND isset($_GET['hash']) && !empty($_GET['hash'])AND isset($_GET['userName']) && !empty($_GET['userName'])){
					// Verify data
					$email = $_GET['email']; // Set email variable
					$hash = $_GET['hash']; // Set hash variable
					$usname = $_GET['userName']; // Set username variable
					
					$query = mysqli_query($mysqli,"SELECT * FROM account WHERE email = '$email' AND hash='$hash' AND activated='false'");
			
					$match  = mysqli_num_rows($query);
					
					if($match > 0){
						// We have a match, activate the account
						$query = mysqli_query($mysqli,"UPDATE account SET activated='true' WHERE email='$email' AND hash='$hash' AND activated='false'");
						echo $usname;
						echo '<p>Your account has been activated, click the button below to open your account</p>';
						echo '<button type="button">Go to my account</button>';
					}else{
						// No match -> invalid url or account has already been activated.
						  echo 'The url is either invalid or you already have activated your account.';
					}		
				}else{
					// Invalid approach
					echo 'Invalid approach, please use the link that has been send to your email.';
				}
			} 
        ?>
        <!-- stop PHP Code -->
 
         
    </div>
    <!-- end wrap div --> 
</body>
</html>