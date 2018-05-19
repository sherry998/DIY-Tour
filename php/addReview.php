<?php
	
	$mysqli = new mysqli('localhost', 'root', '', 'diy_tour');
	
	if ($mysqli->connect_error) {
		echo("Connection failed: " . $mysqli->connect_error);
	}
		
	
	if(isset($_POST['callAddReview'])){
		$value = explode(":",$_POST['callAddReview']);
		addReview($value[0],$value[1],$value[2],$value[3], $mysqli);
	}
	
	function addReview($rating,$review,$guideId,$date,$mysqli){
		session_start();
		$id = $_SESSION['id'];
		$query = mysqli_query($mysqli,"INSERT INTO review (userId,rating,paragraph,date,guideID) VALUES ('$id','$rating','$review','$date','$guideId')");
		 echo "INSERT INTO review (userId,rating,paragraph,date,guideID) VALUES ('$id','$rating','$review','$date','$guideId')";
		if ($query){
			echo 'success';
		}
	}
	
	
	$mysqli->close();
?>