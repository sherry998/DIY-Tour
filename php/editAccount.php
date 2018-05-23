<?php
	
	$mysqli = new mysqli('localhost', 'root', '', 'diy_tour');
	//$mysqli = new mysqli('localhost', 'root', 'db5a0d0b13ca1d4d', 'diy_tour');
	
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
		
		$query = prepareSql("SELECT * FROM account WHERE userId = ?",$mysqli,$id);
		$queryCount = prepareSql("SELECT * FROM travelguide WHERE userId = ?",$mysqli,$id);
		$reviewCount = prepareSql("SELECT * FROM review WHERE userId = ? ",$mysqli,$id);
		if(mysqli_num_rows($query)==1){
			$JSON = json_decode(json_encode(mysqli_fetch_assoc($query)),true);
			$JSON["count"] = mysqli_num_rows($queryCount);
			$JSON["rcount"] = mysqli_num_rows($reviewCount);
			return json_encode($JSON);
		}
	}
	
	function prepareSql($sql,$mysqli,$id){
		$stmt = $mysqli->prepare($sql);
		$stmt->bind_param("i", $id );
		if ($stmt->execute()){
			$result = $stmt->get_result();
			return $result;
		}
		return false;
	}
	
	function checkAccountPassword($currentPsw, $mysqli){
		if(isset($_SESSION['id']) && !empty($_SESSION['id'])) {
			$query = prepareSql("SELECT password FROM account WHERE userId = ? ",$mysqli,$_SESSION['id']);
			if(mysqli_num_rows($query)==1){
				$originalpsw = mysqli_fetch_row($query)[0];

				if (password_verify($currentPsw,$originalpsw)){
					echo "true";
				} else{
					echo "false";
				}
			}
		}
	}
	
	function changePassword ($newpsw, $mysqli){
		$newpsw = password_hash($newpsw, PASSWORD_BCRYPT );
		$sql = "UPDATE account SET password = ? WHERE userId = ?";
		$stmt = $mysqli->prepare($sql);
		$stmt->bind_param("si", $newpsw, $_SESSION['id'] );
		$stmt->execute();
	}
	
	function updateAccount($email,$username,$country, $about,$mysqli){
		$sql = "UPDATE account SET email = ?, username = ?,
		country = ?, about = ? WHERE userId = ?";
		$stmt = $mysqli->prepare($sql);
		$stmt->bind_param("ssssi", $email, $username,$country,$about,$_SESSION['id'] );
		
		if ($stmt->execute()){
			echo("sucess");
		}else{
			echo("failure");
		}
	}
	
	function deleteCurrentAccount ($mysqli){
		$stmt = prepareSql("DELETE FROM account WHERE userId = ?",$mysqli,$_SESSION['id']);
		if (!$stmt){
			echo "sucess";
		}
		session_destroy();
	}
	
	$mysqli->close();
    
	
?>