<?php
	
	$mysqli = new mysqli('localhost', 'root', '', 'diy_tour');
	
	if ($mysqli->connect_error) {
		echo("Connection failed: " . $mysqli->connect_error);
	}
	
	if (isset($_POST['callGetAccountInfo'])) {
        getAccountInfo($mysqli);
    }
	
	if (isset($_POST['callUpdateAccount'])) {
		$inputArray = explode(':', $_POST['callUpdateAccount']);
		updateAccount($inputArray[0],$inputArray[1],$inputArray[2],$inputArray[3],$mysqli);
    }
	
	function getAccountInfo($mysqli){
		session_start();
		if(isset($_SESSION['id']) && !empty($_SESSION['id'])) {
			$userId =$_SESSION['id'];
			$query = mysqli_query($mysqli,"SELECT * FROM account WHERE userId = '$userId'");
			if(mysqli_num_rows($query)==1){
				echo json_encode(mysqli_fetch_assoc($query));
		}
	}
	}
	
	function updateAccount($email,$username,$country, $travelTitle,$mysqli){
		session_start();
		$userId =$_SESSION['id'];
		$query = mysqli_query($mysqli,"UPDATE account SET email = '$email', username = '$username', country = '$country', travelTitle = '$travelTitle'
		WHERE userId = '$userId'");
		
		if ($query){
			session_start();
			// update session username details
			$_SESSION['username'] = $username;
			echo("sucess");
		}else{
			echo("failure");
		}
	}
	
	$mysqli->close();
    
	
?>