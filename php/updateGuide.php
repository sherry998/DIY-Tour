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
	
	include 'createGuide.php';

	$mysqli = new mysqli('localhost', 'root', '', 'diy_tour');
	
	if ($mysqli->connect_error) {
		echo("Connection failed: " . $mysqli->connect_error);
	}
		
	
	if(isset($_POST['numDay'])&& isset($_POST['id'])){
		updateGuide ($_POST['numDay'],$_POST['id'], $mysqli);
	}
	
	
	function changeFeatureImage($image,$mysqli,$guideId){

		if(isset($_POST['feaureImageDelete'])&& $_POST['feaureImageDelete']!=null){
			$sql = "UPDATE travelGuide SET featureImage = 'guide_Image/NoPicAvailable.png'
			WHERE guideId = ?";
			$stmt = $mysqli->prepare($sql);
			$stmt->bind_param("i", $guideId);
			$stmt->execute();
			
			$image = "../". (string)$_POST['feaureImageDelete'];
			if (file_exists($image)) 
               {
                 unlink($image);
                  echo "File Successfully Delete."; 
              }
              else
              {
               echo "File does not exists"; 
              }
		}else if ($_FILES['main-upload']['size'] != 0){
			$imageFileType = getImageType("../guide_Image/",$image["name"]);
			$target_loc = "guide_Image/"."GuideID".$guideId.".".$imageFileType;
			
			$sql = "UPDATE travelGuide SET featureImage = ? WHERE guideId = ?";
			$stmt = $mysqli->prepare($sql);
			$stmt->bind_param("si", $target_loc,$guideId);
			
			uploadImage($target_loc,$image["tmp_name"],$stmt);
		}
	}
	
	
	function deleteImage($guideId, $mysqli){
		$num = 0;
		while (isset($_POST['image'.$num]) && $_POST['image'.$num]!="" && $_POST['image'.$num]!=null){
			echo($_POST['image'.$num]);

			$sql = "DELETE FROM image WHERE imageLink = ?";
			$stmt = $mysqli->prepare($sql);
			$stmt->bind_param("s", $_POST['image'.$num]);
			
			if ($stmt->execute()){
				$image = "../".(string)$_POST['image'.$num];
				unlink($image);
			}
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
		
		$id = $_SESSION['id'];
		
		$sql = "UPDATE travelguide SET guideName = ?,country = ?, date = ?, people = ?
		,budget = ?, overview = ? WHERE guideId = ? AND userId = ?";
		$stmt = $mysqli->prepare($sql);
		$stmt->bind_param("ssssisii", $title,$loc,$date,$people,$budget,$summary,$guideId,$id );
		
		if ($stmt->execute()){
			$featureimage =  $_FILES['main-upload'];
			changeFeatureImage($featureimage,$mysqli,$guideId);

			deleteImage($guideId, $mysqli);
			
			updateDay($num,$guideId,$title,$mysqli);
		}
	}

	function updateDay($num,$guideId,$title,$mysqli){
		for ($i = 1; $i <= $num; $i++) {
			$dtitle = $_POST['title'.$i];
			$dinfo =  $_POST['summary'.$i];
			

			$sql = "UPDATE day SET Title = ?,description = ? WHERE dayNum = ? AND guideId = ?";
			
			$stmt = $mysqli->prepare($sql);
			$stmt->bind_param("ssii", $dtitle,$dinfo,$i,$guideId);
			
			$daySql = "SELECT dayId FROM day WHERE dayNum = ? AND guideId = ?";
			$dayStmt = $mysqli->prepare($daySql);
			$dayStmt->bind_param("ii", $i,$guideId);
			$dayStmt->execute();
			$result = $dayStmt->get_result();
			$dayId=mysqli_fetch_row($result)[0];
			
			if (mysqli_num_rows($result)<1) {
				echo "add new";
				$newStmt = createDay($dtitle,$dinfo,$guideId,$mysqli,$i);
				
				if ($newStmt->execute()) {
					echo "Error update your guide. Please try again later.";
					break;
				}
				$dayId = mysqli_insert_id($mysqli);
			}
			
			if ($stmt->execute()) {
				$countfiles = count((array_filter($_FILES['image-upload'.$i]['name']))); 

				$countSql = "SELECT count(*) as total FROM image WHERE dayId = ?";
				$countStmt = $mysqli->prepare($countSql);
				$countStmt->bind_param("i", $dayId);
				$countStmt->execute();
				$countResult = $countStmt->get_result();

				$data=mysqli_fetch_assoc($countResult);
				echo $i;
				for($j=0; $j<$countfiles; $j++){
					$image =  $_FILES['image-upload'.$i];
					
					if (isset($image) && $image!="" && $image!=null){
						if (!appendImage ($image,$dayId,$j,$data['total']+1,$mysqli)){
							return;
						}
					}
				}
			}else{
				echo ( mysqli_error($mysqli));
				break;
			}
			
		}
		deleteDay ($num,$guideId,$mysqli);
		header('Location: ../specificGuide.html?id='.$guideId.'&title='.$title);
	}
	
	function appendImage($image,$id,$count,$increase,$mysqli){
		$imageFileType = getImageType("../guide_Image/",$image["name"][$count]);

		$target_loc = "guide_Image/"."DayID".$id."_".($count+$increase).".".$imageFileType;
	
		$sql = "INSERT INTO image (imageLink,dayId) VALUES (?,?)";
		$stmt = $mysqli->prepare($sql);
		$stmt->bind_param("si", $target_loc, $id);
		
		return uploadImage($target_loc,$image["tmp_name"][$count],$stmt);
	}
	
	function deleteDay ($dayNum,$id,$mysqli){
		$sql = "DELETE FROM day WHERE guideId = ? AND dayNum > ?";
		$stmt = $mysqli->prepare($sql);
		$stmt->bind_param("ii", $id,$dayNum);
		if (!$stmt->execute()){
			echo "Error creating new guide. Please try again later.?";
		}
		
	}
	
	$mysqli->close();
?>