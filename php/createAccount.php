<?php
	$mysqli = new mysqli('localhost', 'root', '', 'diy_tour');
	
	if ($mysqli->connect_error) {
		echo("Connection failed: " . $conn->connect_error);
	} 
	
	$email = $_POST['email']; 
	$uname = $_POST['uname']; 
	$psw = $_POST['psw']; 
	
	$sql = "INSERT INTO account (email, userName, password)
	VALUES ('$email', '$uname', '$psw')";
	
	if ($mysqli->query($sql) === TRUE) {
		echo "Welcome, please check your email: " .$email . " to activate your account";
	} else {
		echo "Error: " . $sql . "<br>" . $mysqli->error;
	}
	
	$mysqli->close();
	
?>