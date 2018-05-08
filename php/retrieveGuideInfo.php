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
	
	if (isset($_POST['callsearchGuide'])) {
        searchGuide($_POST['callsearchGuide'],$mysqli);
    }
	
	function getGuideInfo($id, $title, $mysqli){
		$guideQuery = mysqli_query($mysqli,"SELECT * FROM travelguide WHERE  guideName = '$title' AND guideId =".$id);
		$dayQuery = mysqli_query($mysqli,"SELECT * FROM day WHERE guideId = ".$id);
		
		if(mysqli_num_rows($guideQuery)==1 && mysqli_num_rows($dayQuery)>=1){
			$row = $guideQuery->fetch_assoc();
			$guideJson = json_decode(json_encode($row),true);
			$userId = $row["userId"];
			$count=1;
			while($dayRow = $dayQuery->fetch_assoc()) {
				$dayId = $dayRow["dayId"];
				$imageQuery = mysqli_query($mysqli,"SELECT * FROM image WHERE dayId = ".$dayId);
				$imageArray = array ();
				while($imageRow = $imageQuery->fetch_assoc()) {
					array_push($imageArray,$imageRow["imageLink"]);
				}
				$guideJson["day"][$count] = array (
					'title' => $dayRow["Title"],
					'description' => $dayRow["description"],
					'image' => $imageArray);
				$count++;
			}
			
			$userInfo = json_decode(getAccountInfo($userId,$mysqli),true);
			$guideJson["username"] = $userInfo['username'];
			$guideJson["pImage"] = $userInfo['profileImage'];
			$guideJson["about"] = $userInfo['about'];
			$guideJson["pcountry"] = $userInfo['country'];
			echo json_encode($guideJson);
		} else {
			echo json_encode("");
		}
	}

	
	function searchGuide ($keyword, $mysqli){
		$searchResult = array();
		$query = mysqli_query($mysqli,"SELECT * FROM travelguide WHERE guideName LIKE '%".$keyword."%' OR country LIKE '%".$keyword."%' OR EXISTS 
		( SELECT * FROM account WHERE travelguide.userId = account.userId AND username LIKE '%".$keyword."%')");
		if(mysqli_num_rows($query)>=1){
			 while($row = $query->fetch_assoc()) {
				$userInfo = json_decode(getAccountInfo($row["userId"],$mysqli),true);
				$row ["username"] = $userInfo['username'];
				array_push($searchResult, $row);
			 }
			echo json_encode($searchResult);
		} else {
			echo "?";
		}
	}
	
	$mysqli->close();
	
?>