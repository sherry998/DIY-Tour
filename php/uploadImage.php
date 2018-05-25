<?php
	include 'error.php';
	//$mysqli = new mysqli('localhost', 'root', '', 'diy_tour');
	$mysqli = new mysqli('localhost', 'root', 'db5a0d0b13ca1d4d', 'diy_tour');
	
	session_start();
	
	if ($mysqli->connect_error) {
		echo("Connection failed: " . $mysqli->connect_error);
	}
	
	if(isset($_FILES['uploadPhoto'] ['name'])){
		changeProfileImage ($_FILES['uploadPhoto'],$mysqli);
	}
	
	//https://www.w3schools.com/php/php_file_upload.asp
	function changeProfileImage($image,$mysqli){
		$imageFileType = getImageType("../profile_Image/",$image["name"]);

		$target_loc = "profile_Image/"."profileImage".$_SESSION['id'].".".$imageFileType;

		$sql = "UPDATE account SET profileImage = ? WHERE userId =?";
		$stmt = $mysqli->prepare($sql);
		$stmt->bind_param("si", $target_loc, $_SESSION['id']);
		
		uploadImage ($target_loc,$image["tmp_name"],$stmt);
	}
	
	function getImageType($target_dir,$image){
		$target_file = $target_dir . basename($image);
		$imageFileType = strtolower(pathinfo($target_file,PATHINFO_EXTENSION));
		return $imageFileType;
	}

	function uploadImage($target_loc,$image,$stmt){
		if ($stmt->execute()){
			if (move_uploaded_file($image, "../".$target_loc)) {
				echo $target_loc;
				return true;
			} else {
				echo "Not uploaded because of error #".$_FILES["file"]["error"];
				echo "Sorry, there was an error uploading your file.";
				return false;
			}
		}
	}
	


?>