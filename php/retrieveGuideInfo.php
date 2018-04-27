<?php
	
	include 'editAccount.php';
	 
	$mysqli = new mysqli('localhost', 'root', '', 'diy_tour');
	
	if ($mysqli->connect_error) {
		echo("Connection failed: " . $mysqli->connect_error);
	}
	
	if (isset($_POST['callGetGuideInfo'])) {
		$data = explode(":",$_POST['callGetGuideInfo']);
        getGuideInfo($data[0],$data[1],$mysqli);
    }
	
	function getGuideInfo($id, $title, $mysqli){
		$guideQuery = mysqli_query($mysqli,"SELECT * FROM travelguide WHERE  guideName = '$title' AND guideId =" . $id);
		$dayQuery = mysqli_query($mysqli,"SELECT * FROM day WHERE guideId = ".$id);
		
		if(mysqli_num_rows($guideQuery)==1 && mysqli_num_rows($dayQuery)>=1){
			$row = $guideQuery->fetch_assoc();
			$guideJson = json_decode(json_encode($row),true);
			$userId = $row["userId"];
			$count=1;
			while($dayRow = $dayQuery->fetch_assoc()) {
				$guideJson["day"][$count] = array (
					'title' => $dayRow["Title"],
					'description' => $dayRow["description"]);
				$count++;
			}
			
			$userInfo = json_decode(getAccountInfo($userId,$mysqli),true);
			$guideJson["username"] = $userInfo['username'];
			echo json_encode($guideJson);
		}
	}
	
	$mysqli->close();
	
?>