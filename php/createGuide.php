<?php
	
	$mysqli = new mysqli('localhost', 'root', '', 'diy_tour');
	
	if ($mysqli->connect_error) {
		echo("Connection failed: " . $mysqli->connect_error);
	}
	
	if (isset($_POST['callCreateGuide'])) {
       createGuide($_POST['callCreateGuide'],$mysqli);
    }
	
	function createGuide($json,$mysqli){
		$guide = json_decode($json);
		$title = $guide->title;
		$loc = $guide->location;
		$date = $guide->date;
		$people = $guide->people;
		$budget = $guide->budget;
		$summary = $guide->summary;
		$dayTitle = $guide->dayTitle;
		$dayInfo = $guide->dayInfo;
		
		session_start();
		$id = $_SESSION['id'];
		$sqlInsertGuide = "INSERT INTO travelguide (userId, guideName, country, date, people, budget, overview) VALUES ('$id','$title','$loc','$date','$people','$budget','$summary')";

		if ($mysqli->query($sqlInsertGuide) === TRUE) {
			$guideId = mysqli_insert_id($mysqli);
			createDay($dayTitle,$dayInfo,$guideId,$mysqli);
			echo ($guideId);
		}else{
			echo ( mysqli_error($mysqli));
		}
		
		
	}
	
	function createDay($dayTitle,$dayInfo,$id,$mysqli){
		for ($i = 0; $i < count($dayTitle); $i++) {
			$title = $dayTitle[$i];
			$info =  $dayInfo[$i];
			$sql = "INSERT INTO day (guideId, title, description) VALUES ('$id','$title','$info')";
			if ($mysqli->query($sql) === FALSE) {
				echo "Error creating new guide. Please try again later.";
				break;
			}
		}
	}
	
	$mysqli->close();
?>