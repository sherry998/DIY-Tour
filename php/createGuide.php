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
	
	$mysqli = new mysqli('localhost', 'root', '', 'diy_tour');
	
	if ($mysqli->connect_error) {
		echo("Connection failed: " . $mysqli->connect_error);
	}
		
	if(isset($_GET['numDay'])){
		createGuide ($_GET['numDay'], $mysqli);
	}
	
	if (isset($_POST['callUpdateGuide'])) {
       updateGuide($_POST['callUpdateGuide'],$mysqli);
    }
	
	function createGuide($num,$mysqli){
		$title= $_POST['title'];
		$loc = $_POST['location'];
		$date = $_POST['bday'];
		$people= $_POST['type'];
		$budget= $_POST['budget'];
		$summary= $_POST['overview'];
		
		session_start();
		$id = $_SESSION['id'];

		$sqlInsertGuide = "INSERT INTO travelguide (userId, guideName, country, date, people, budget, overview)".
		"VALUES (?,?,?,?,?,?,?)";
	
		$stmt = $mysqli->prepare($sqlInsertGuide); 
		$stmt->bind_param("issssis", $id, $title,$loc,$date, $people, $budget, $summary);
		
		if ($stmt->execute()) {
			$guideId = mysqli_insert_id($mysqli);
			//echo ($guideId);
		}else{
			echo ( mysqli_error($mysqli));
			break;
		}
		
		$featureimage =  $_FILES['main-upload'];
		if ($_FILES['main-upload']['size'] != 0){
			createFeatureImage($featureimage,$mysqli,$guideId);
		}
		
		for ($i = 1; $i <= $num; $i++) {
			$dtitle = $_POST['title'.$i];
			$dinfo =  $_POST['summary'.$i];
			
			$sql = "INSERT INTO day (guideId, title, description,dayNum) VALUES (?,?,?,?)";
			$stmt = $mysqli->prepare($sql);
			$stmt->bind_param("issi", $guideId, $dtitle,$dinfo,$i);
			
			if ($stmt->execute()) {
				$dayId = mysqli_insert_id($mysqli);
				$countfiles = count((array_filter($_FILES['image-upload'.$i]['name']))); 
				echo $countfiles;
				for($j=0; $j<$countfiles; $j++){
					$image =  $_FILES['image-upload'.$i];
					
					if (!addImage ($image,$dayId,$j,$mysqli)){
						return;
					}
				}
				header('Location: ../specificGuide.html?id='.$guideId.'&title='.$title);
			}else{
				echo ( mysqli_error($mysqli));
				break;
			}
			

		}
	}
	
	function createFeatureImage($image,$mysqli,$guideId){
		$target_dir = "../guide_Image/";
		$target_file = $target_dir . basename($image["name"]);
		$imageFileType = strtolower(pathinfo($target_file,PATHINFO_EXTENSION));
		
	
		$target_loc = "guide_Image/"."GuideID".$guideId.".".$imageFileType;
		$query = mysqli_query($mysqli,"UPDATE travelGuide SET featureImage = '$target_loc'
		WHERE guideId =".$guideId);
		
		if ($query){
			if (move_uploaded_file($image["tmp_name"], "../".$target_loc)) {
				echo $target_loc;
			} else {
				echo "Sorry, there was an error uploading your file.";
			}
		}
	}
	
	function addImage($image,$id,$count,$mysqli){
		$target_dir = "../guide_Image/";
		$target_file = $target_dir . basename($image["name"][$count]);
		
		$imageFileType = strtolower(pathinfo($target_file,PATHINFO_EXTENSION));
	
		$target_loc = "guide_Image/"."DayID".$id."_".$count.".".$imageFileType;
		$query = mysqli_query($mysqli,"INSERT INTO image (imageLink,dayId) VALUES ('$target_loc','$id')");
		
		if ($query){
			if (move_uploaded_file($image["tmp_name"][$count], "../".$target_loc)) {
				return true;
			} else {
				echo "Sorry, there was an error uploading your file.";
				return false;
			}
		}
	}
	
	function updateGuide ($json,$mysqli){
		$guide= json_decode($json);
		$title= $guide->title;
		$loc = $guide->location;
		$date = $guide->date;
		$people= $guide->people;
		$budget= $guide->budget;
		$summary= $guide->summary;
		$dayTitle= $guide->dayTitle;
		$dayInfo= $guide->dayInfo;
		$guideId= $guide->id;
		
		session_start();
		$id = $_SESSION['id'];
		
		$query = mysqli_query($mysqli,"UPDATE travelguide SET guideName = '$title'
		,country = '$loc', date = '$date', people ='$people'
		,budget = '$budget', overview = '$summary'
		WHERE guideId = '$guideId' AND userId = '$id'");
		
		echo ("UPDATE travelguide SET guideName = '$title'
		,country = '$loc', date = '$date', people ='$people'
		,budget = '$budget', overview = '$summary'
		WHERE guideId = '$guideId' AND userId = '$id'");
		if ($query){
			updateDay ($dayTitle,$dayInfo,$guideId,$mysqli);
		}
	}
	
	function updateDay($dayTitle,$dayInfo,$id,$mysqli){
		$dayNum;
		for ($i = 0; $i < count($dayTitle); $i++) {
			$dayNum = $i+1;
			$title = $dayTitle[$i];
			$info =  $dayInfo[$i];
			$query = mysqli_query($mysqli,"UPDATE day SET Title = '$title'
			,description = '$info' WHERE dayNum = '$dayNum' AND guideId = '$id'");
			$querySelect = mysqli_query($mysqli,"SELECT * FROM day WHERE dayNum = '$dayNum' AND guideId = '$id'");
			if (mysqli_num_rows($querySelect)<1) {
				echo $dayNum;
				echo "add new";
				$sql = "INSERT INTO day (guideId, title, description,dayNum) VALUES ('$id','$title','$info','$dayNum')";
				if ($mysqli->query($sql) === FALSE) {
					echo "Error update your guide. Please try again later.";
					break;
				}
			}
		}
		deleteDay ($dayNum,$id,$mysqli);
		echo "Guide updated successfully";
	}
	
	function deleteDay ($dayNum,$id,$mysqli){
		$query = mysqli_query($mysqli,"DELETE FROM day WHERE guideId = '$id' AND dayNum >'$dayNum'");
		if (!$query){
			echo "Error creating new guide. Please try again later.";
		}
		
	}
	
	function createDay($dayTitle,$dayInfo,$id,$mysqli){
		for ($i = 0; $i < count($dayTitle); $i++) {
			$dayNum = $i+1;
			$title = $dayTitle[$i];
			$info =  $dayInfo[$i];
			$sql = "INSERT INTO day (guideId, title, description,dayNum) VALUES ('$id','$title','$info','$dayNum')";
			if ($mysqli->query($sql) === FALSE) {
				echo "Error creating new guide. Please try again later.";
				break;
			}
		}
	}
	
	$mysqli->close();
?>