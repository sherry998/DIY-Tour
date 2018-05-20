<?php
	
	$mysqli = new mysqli('localhost', 'root', '', 'diy_tour');
	
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
		$query = mysqli_query($mysqli,"INSERT INTO review (userId,rating,paragraph,date,guideID) VALUES ('$id','$rating','$review','$date','$guideId')");
		$reviewId = mysqli_insert_id($mysqli);
		if ($query){
			echo $reviewId;
			echo ":";
			updateRating($guideId,$mysqli);
		}
		
	}
	
	function deleteReview($id,$guideId, $mysqli){
		$query = mysqli_query($mysqli,"DELETE FROM review WHERE reviewId = '$id'");
		if ($query){
			updateRating($guideId,$mysqli);
		}
		
	}
	
	function updateRating($guideId,$mysqli){
		$query = mysqli_query($mysqli,"SELECT AVG(rating) AS avg FROM review WHERE guideID='$guideId'");
		$rating = 0;
		if ($query){
			$result = mysqli_fetch_assoc($query);
			$rating = $result['avg'];
			
		} 
		$query = mysqli_query($mysqli,"UPDATE travelguide SET rating = '$rating' WHERE guideID='$guideId'");
			echo $rating;
	}

	
	$mysqli->close();
?>