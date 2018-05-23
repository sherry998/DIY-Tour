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
	
	include 'uploadImage.php';

	$mysqli = new mysqli('localhost', 'root', '', 'diy_tour');
	//$mysqli = new mysqli('localhost', 'root', 'db5a0d0b13ca1d4d', 'diy_tour');
	
	if ($mysqli->connect_error) {
		echo("Connection failed: " . $mysqli->connect_error);
	}
	
	if(isset($_POST['numDay'])&& !isset($_POST['id'])){
		createGuide ($_POST['numDay'], $mysqli);
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
			
			if (createDay($dtitle,$dinfo,$guideId,$mysqli,$i)->execute()) {
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
		$imageFileType = getImageType("../guide_Image/",$image["name"]);
		
		$target_loc = "guide_Image/"."GuideID".$guideId.".".$imageFileType;

		$sql = "UPDATE travelGuide SET featureImage = ? WHERE guideId = ?";
		$stmt = $mysqli->prepare($sql);
		$stmt->bind_param("si", $target_loc, $guideId);
		
		uploadImage($target_loc,$image["tmp_name"],$stmt);
	}
	
	function addImage($image,$id,$count,$mysqli){
		$imageFileType = getImageType("../guide_Image/",$image["name"][$count]);

		$target_loc = "guide_Image/"."DayID".$id."_".$count.".".$imageFileType;

		$sql = "INSERT INTO image (imageLink,dayId) VALUES (?,?)";
		$stmt = $mysqli->prepare($sql);
		$stmt->bind_param("si", $target_loc, $id);
		
		return uploadImage($target_loc,$image["tmp_name"][$count],$stmt);
	}
	
	function createDay($dayTitle,$dayInfo,$id,$mysqli,$dayNum){
			$sqlNewDay = "INSERT INTO day (guideId, Title, description,dayNum) VALUES (?,?,?,?)";
			echo "INSERT INTO day ('$id' '$dayTitle', '$dayInfo','$dayNum') VALUES (?,?,?,?)";
			$stmtNewDay = $mysqli->prepare($sqlNewDay);
			$stmtNewDay->bind_param("issi", $id,$dayTitle, $dayInfo,$dayNum);
			
			return $stmtNewDay;
	}
	
	$mysqli->close();
?>