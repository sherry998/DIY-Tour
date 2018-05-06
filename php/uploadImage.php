<?php
	
	$mysqli = new mysqli('localhost', 'root', '', 'diy_tour');
	session_start();
	
	if ($mysqli->connect_error) {
		echo("Connection failed: " . $mysqli->connect_error);
	}
	
	if(isset($_FILES['uploadPhoto'] ['name'])){
		changeProfileImage ($_FILES['uploadPhoto'],$mysqli);
	}
	
	//https://www.w3schools.com/php/php_file_upload.asp
	function changeProfileImage($image,$mysqli){
		$target_dir = "../profile_Image/";
		$target_file = $target_dir . basename($image["name"]);
		$imageFileType = strtolower(pathinfo($target_file,PATHINFO_EXTENSION));
		
	
		$target_loc = "profile_Image/"."profileImage".$_SESSION['id'].".".$imageFileType;
		$query = mysqli_query($mysqli,"UPDATE account SET profileImage = '$target_loc'
		WHERE userId =".$_SESSION['id']);
		
		if ($query){
			if (move_uploaded_file($image["tmp_name"], "../".$target_loc)) {
				echo $target_loc;
			} else {
				echo "Sorry, there was an error uploading your file.";
			}
		}
	}
	


?>