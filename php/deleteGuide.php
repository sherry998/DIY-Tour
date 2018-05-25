<!DOCTYPE html>
<html>
<body>
<img src="../img/Round Animated Loading Gif.gif" style=" width:20%; position: fixed;
  top: 45%;
  left: 53%;
  transform: translate(-45%, -53%);"/>
</body>
</html>

<?php
	include 'error.php';
	$mysqli = new mysqli('localhost', 'root', '', 'diy_tour');
	//$mysqli = new mysqli('localhost', 'root', 'db5a0d0b13ca1d4d', 'diy_tour');
	
	if ($mysqli->connect_error) {
		echo("Connection failed: " . $mysqli->connect_error);
	}
		
	echo $_POST['id'];
	if(isset($_POST['id'])){
		deleteGuide ($_POST['id'], $mysqli);
	}
	
	function getstmt($sql,$mysqli,$guideId){
		$stmt = $mysqli->prepare($sql);
		$stmt->bind_param("i", $guideId);
		return $stmt;
	}

	function deleteGuide($guideId,$mysqli){
		$stmt = getstmt("SELECT imageLink FROM image WHERE EXISTS 
		( SELECT * FROM day WHERE image.dayId = day.dayId AND guideId = ?)",$mysqli,$guideId);
			$stmt->execute();
			$result=$stmt->get_result();
			
			while($imageRow = $result->fetch_assoc()) {
				deleteImage($imageRow["imageLink"]);
			}
			
			$stmtDelete = getstmt("DELETE FROM image WHERE EXISTS 
		( SELECT * FROM day WHERE image.dayId = day.dayId AND guideId = ?)",$mysqli,$guideId);
			if ($stmtDelete->execute()){
				$stmtDeleteDay = getstmt("DELETE FROM day WHERE guideId = ?",$mysqli,$guideId);
				if ($stmtDeleteDay->execute()){
					$stmtReviewDay = getstmt("DELETE FROM review WHERE guideId = ?",$mysqli,$guideId);
					if ($stmtReviewDay->execute()){
						deletefImage($guideId,$mysqli);
					$stmtDeleteGuide = getstmt("DELETE FROM travelguide WHERE guideId = ?",$mysqli,$guideId);
						if ($stmtDeleteGuide->execute()){
							header('Location: ../createNewGuide.html?delete=true');
						}
					}
				}
			}
		
	}
	
	function deletefImage($guideId,$mysqli){
		$getFimagestmt = getstmt("SELECT featureImage FROM travelguide WHERE guideId = ?",$mysqli,$guideId);
		$getFimagestmt->execute();
		$result=$getFimagestmt->get_result();
			$imageRow = $result->fetch_assoc();
			echo $imageRow["featureImage"];
			deleteImage($imageRow["featureImage"]);
	}
	
	function deleteImage($image){
		$image = "../". $image;
		
		if (file_exists($image)) 
				   {
					 unlink($image);
					 return true;
				  }
				  else
				  {
				   return false;
				  }
	}
	
	
	$mysqli->close();
?>