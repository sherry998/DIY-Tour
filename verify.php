<!--https://code.tutsplus.com/tutorials/how-to-implement-email-verification-for-new-members--net-3824-->
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
 
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <title>Account Activation</title>
	<link rel="stylesheet" type="text/css" href="css/modal.css">
	<link href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">
</head>
<body>
    <div class="modal-content">
		<div class="m-header">
			<div align="center">
                <img src="https://i.imgur.com/UBpNYtU.png" width="300" height="80" alt="My Logo">
            </div>
		</div>	
		<div class="m-title">
            <h1><b>Just one for step...</b></h1> 
		</div>
		<div class="modal-text">
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
						echo '<p style="
						margin-top: 20px; color=">Your account has been activated, click the button below to open your account</p>';
						echo '<button type="button" class="btn btn-success" style="
						margin-top: 20px;">Go to my account</button>';
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
		
		<div class="modal-footer">
            <div class="modal-copyright">
				<div class="row text-center">
                    <p>Copyright © 2018 All rights reserved</p>
                </div>
                                            
                                                    
            </div>

        </div>
 
         
    </div>
    <!-- end wrap div --> 
</body>
</html>