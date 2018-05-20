<?php
	
	$mysqli = new mysqli('localhost', 'root', '', 'diy_tour');
	session_start();
	
	if ($mysqli->connect_error) {
		echo("Connection failed: " . $mysqli->connect_error);
	}
	
	if (isset($_POST['callGetAccountInfo'])) {
		if(isset($_SESSION['id']) && !empty($_SESSION['id'])) {
			echo (getAccountInfo($_SESSION['id'],$mysqli));
		} else {
			echo json_encode("{}");
		}
    }

	
	if (isset($_POST['callUpdateAccount'])) {
		$inputArray = explode(':', $_POST['callUpdateAccount']);
		updateAccount($inputArray[0],$inputArray[1],$inputArray[2],$inputArray[3],$mysqli);
    }
	
	if (isset($_POST['callDeleteCurrentAccount'])) {
        deleteCurrentAccount($mysqli);
    }
	
	if (isset($_POST['callCheckAccountPassword'])) {
        checkAccountPassword($_POST['callCheckAccountPassword'],$mysqli);
    }
	
	if (isset($_POST['callChangePassword'])) {
        changePassword($_POST['callChangePassword'],$mysqli);
    }
	
	function getAccountInfo($id,$mysqli){
		$query = mysqli_query($mysqli,"SELECT * FROM account WHERE userId = ".$id);
		$queryCount = mysqli_query($mysqli,"SELECT * FROM travelguide WHERE userId = ".$id);
		$reviewCount = mysqli_query($mysqli,"SELECT * FROM review WHERE userId = ".$id);
		if(mysqli_num_rows($query)==1){
			$JSON = json_decode(json_encode(mysqli_fetch_assoc($query)),true);
			$JSON["count"] = mysqli_num_rows($queryCount);
			$JSON["rcount"] = mysqli_num_rows($reviewCount);
			return json_encode($JSON);
		}
	}
	
	
	function checkAccountPassword($currentPsw, $mysqli){
		if(isset($_SESSION['id']) && !empty($_SESSION['id'])) {
			$query = mysqli_query($mysqli,"SELECT password FROM account WHERE userId = ".$_SESSION['id']);
			if(mysqli_num_rows($query)==1){
				$originalpsw = mysqli_fetch_row($query)[0];
				$currentPsw = md5($currentPsw);

				if ($originalpsw == $currentPsw){
					echo "true";
				} else{
					echo "false";
				}
			}
		}
	}
	
	function changePassword ($newpsw, $mysqli){
		$newpsw = md5($newpsw);
		$query = mysqli_query($mysqli,"UPDATE account SET password = '$newpsw' WHERE userId =".$_SESSION['id']);
	}
	
	function updateAccount($email,$username,$country, $about,$mysqli){
		$query = mysqli_query($mysqli,"UPDATE account SET email = '$email', username = '$username',
		country = '$country', about = '$about' WHERE userId =".$_SESSION['id']);
		
		if ($query){
			// update session username details
			$_SESSION['username'] = $username;
			echo("sucess");
		}else{
			echo("failure");
		}
	}
	
	function deleteCurrentAccount ($mysqli){
		$query = mysqli_query($mysqli,"DELETE FROM account WHERE userId = ".$_SESSION['id']);
		session_destroy();
		if ($query){
			echo("sucess");
		}
	}
	
	$mysqli->close();
    
	
?>