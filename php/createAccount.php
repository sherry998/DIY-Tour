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
		$query = mysqli_query($mysqli,"SELECT * FROM account WHERE email = @'$email'");
		
		if(mysqli_num_rows($query) == 0){
			echo "true";
		} else {
			echo "false";
		}	
	}

	
	function createAccount($email,$uname,$psw,$mysqli){
		
		$sql = "INSERT INTO account (email, userName, password)
			VALUES (@'$email', @'$uname', @'$psw')";
			
		if ($mysqli->query($sql) === TRUE) {
			echo "Welcome, please check your email: " .$email . " to activate your account";
		} else {
			echo "Error: " . $sql . "<br>" . $mysqli->error;
		}
	}
	
	$mysqli->close();
	
?>