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
		
	
	if(isset($_GET['numDay'])&& isset($_GET['id'])){
		updateGuide ($_GET['numDay'],$_GET['id'], $mysqli);
	}
	
	
	function changeFeatureImage($image,$mysqli,$guideId){
		$target_dir = "../guide_Image/";
		$target_file = $target_dir . basename($image["name"]);
		$imageFileType = strtolower(pathinfo($target_file,PATHINFO_EXTENSION));
		
		if(isset($_POST['feaureImageDelete'])){
			
			$query = mysqli_query($mysqli,"UPDATE travelGuide SET featureImage = 'guide_Image/NoPicAvailable.png'
			WHERE guideId =".$guideId);
			$image = "../". (string)$_POST['feaureImageDelete'];
			echo($image);
			unlink($image);
		}else if ($_FILES['main-upload']['size'] != 0){
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
	}
	
	function addImage($image,$id,$count,$increase,$mysqli){
		$target_dir = "../guide_Image/";
		$target_file = $target_dir . basename($image["name"][$count]);
		echo $image["name"][$count];
		$imageFileType = strtolower(pathinfo($target_file,PATHINFO_EXTENSION));
	
		$target_loc = "guide_Image/"."DayID".$id."_".($count+$increase).".".$imageFileType;
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
	
	function deleteImage($guideId, $mysqli){
		$num = 0;
		while (isset($_POST['image'.$num])&& $_POST['image'.$num]!="" && $_POST['image'.$num]!=null){
			echo($_POST['image'.$num]);
			$query = mysqli_query($mysqli,"DELETE FROM image WHERE imageLink ='".$_POST['image'.$num]."'");
			echo "DELETE FROM image WHERE imageLink =".$_POST['image'.$num];
			$image = "../".(string)$_POST['image'.$num];
			unlink($image);
			$num++;
		}
	}
	
	function updateGuide ($num,$guideId,$mysqli){
		$title= $_POST['title'];
		$loc = $_POST['location'];
		$date = $_POST['bday'];
		$people= $_POST['type'];
		$budget= $_POST['budget'];
		$summary= $_POST['summary'];
		
		session_start();
		$id = $_SESSION['id'];
		
		$query = mysqli_query($mysqli,"UPDATE travelguide SET guideName = '$title'
		,country = '$loc', date = '$date', people ='$people'
		,budget = '$budget', overview = '$summary'
		WHERE guideId = '$guideId' AND userId = '$id'");
		
		$featureimage =  $_FILES['main-upload'];
		changeFeatureImage($featureimage,$mysqli,$guideId);

		deleteImage($guideId, $mysqli);
		
		for ($i = 1; $i <= $num; $i++) {
			$dtitle = $_POST['title'.$i];
			$dinfo =  $_POST['summary'.$i];
			
			$sql = "UPDATE day SET Title = '$dtitle'
			,description = '$dinfo' WHERE dayNum = '$i' AND guideId = '$guideId'";
			$querySelect = mysqli_query($mysqli,"SELECT dayId FROM day WHERE dayNum = '$i' AND guideId = '$guideId'");
			$dayId=mysqli_fetch_row($querySelect)[0];
echo mysqli_num_rows($querySelect);
			if (mysqli_num_rows($querySelect)<1) {
				echo "add new";
				$sqlInsert = "INSERT INTO day (guideId, title, description,dayNum) VALUES ('$guideId','$dtitle','$dinfo','$i')";
				$dayId = mysqli_insert_id($mysqli);
				if ($mysqli->query($sqlInsert) === FALSE) {
					echo "Error update your guide. Please try again later.";
					break;
				}
			}
			deleteDay ($i,$guideId,$mysqli);
			if ($mysqli->query($sql) === TRUE) {
				$countfiles = count((array_filter($_FILES['image-upload'.$i]['name']))); 
				$result=mysqli_query($mysqli,"SELECT count(*) as total from image WHERE dayId = ".$dayId);
				$data=mysqli_fetch_assoc($result);
				echo $data['total'];
				echo $countfiles;
				for($j=0; $j<$countfiles; $j++){
					$image =  $_FILES['image-upload'.$i];
					

					if (!addImage ($image,$dayId,$j,$data['total'],$mysqli)){
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
		echo "DELETE FROM day WHERE guideId = '$id' AND dayNum >'$dayNum'";
		if (!$query){
			echo "Error creating new guide. Please try again later.?";
		}
		
	}
	
	
	$mysqli->close();
?>