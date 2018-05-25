<?php
	
	include 'error.php';
	
	//$mysqli = new mysqli('localhost', 'root', '', 'diy_tour');
	$mysqli = new mysqli('localhost', 'root', 'db5a0d0b13ca1d4d', 'diy_tour');
	
	if ($mysqli->connect_error) {
		echo("Connection failed: " . $mysqli->connect_error);
	}
		
	
	if(isset($_POST['callAddReview'])){
		$value = explode(":",$_POST['callAddReview']);
		addReview($value[0],$value[1],$value[2],$value[3], $mysqli);
	}
	
	if(isset($_POST['callDeleteReview'])){
		$value = explode(":",$_POST['callDeleteReview']);
		deleteReview($value[0],$value[1], $mysqli);
	}
	
	function addReview($rating,$review,$guideId,$date,$mysqli){
		session_start();
		$id = $_SESSION['id'];
		
		$sql = "INSERT INTO review (userId,rating,paragraph,date,guideID) VALUES (?,?,?,?,?)";
		$stmt = $mysqli->prepare($sql);
		$stmt->bind_param("iissi", $id,$rating,$review,$date,$guideId);

		if ($stmt->execute()){
			$reviewId = mysqli_insert_id($mysqli);
			echo $reviewId;
			echo ":";
			updateRating($guideId,$mysqli);
		}
		
	}
	
	function deleteReview($id,$guideId, $mysqli){
		$sql = "DELETE FROM review WHERE reviewId = ?";
		$stmt = $mysqli->prepare($sql);
		$stmt->bind_param("i", $id);
		
		if ($stmt->execute()){
			updateRating($guideId,$mysqli);
		}
		
	}
	
	function updateRating($guideId,$mysqli){
		
		$sql = "SELECT AVG(rating) AS avg FROM review WHERE guideID=?";
		$stmt = $mysqli->prepare($sql);
		$stmt->bind_param("i", $guideId);
		
		$rating=0;
		
		if ($stmt->execute()){
			$sqlResult = $stmt->get_result();
			$result = mysqli_fetch_assoc($sqlResult);
			if ($result['avg'] !=null && $result['avg'] !=""){
				$rating = round($result['avg']);
			}
		} 
		$sqlRating = "UPDATE travelguide SET rating = ? WHERE guideId= ?";
		$stmtRating = $mysqli->prepare($sqlRating);
		$stmtRating->bind_param("ii", $rating,$guideId);
		$stmtRating->execute();
		
		echo $rating;
	}

	
	$mysqli->close();
?>