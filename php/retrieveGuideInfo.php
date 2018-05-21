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
		$data = explode(":",$_POST['callsearchGuide']);
        searchGuide($data[0],$data[1],$data[2],$mysqli);
    }
	
	if (isset($_POST['callgetGuideLocation'])) {
		$id = $_SESSION['id'];
        getGuideLocation($id,$mysqli);
    }
	
	function getGuideLocation($id,$mysqli){
		$query = mysqli_query($mysqli,"SELECT country FROM travelguide WHERE  userId =".$id);
		$json;
		if(mysqli_num_rows($query)>=1){
			$count=1;
			while($row = $query->fetch_assoc()) {
			$json["country"][$count] = $row["country"];
			$count++;
			}
		echo json_encode($json);
		} else{
			echo json_encode("");
		}
	}
	
	function getGuideInfo($id, $title, $mysqli){
		$guideQuery = mysqli_query($mysqli,"SELECT * FROM travelguide WHERE  guideName = '$title' AND guideId =".$id);
		$dayQuery = mysqli_query($mysqli,"SELECT * FROM day WHERE guideId = ".$id);
		$reviewQuery = mysqli_query($mysqli,"SELECT * FROM review WHERE guideID = ".$id);
		
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
			
			$count=1;
			$reviewQuery = mysqli_query($mysqli,"SELECT * FROM review WHERE guideID = ".$id);
			while($reviewRow = $reviewQuery->fetch_assoc()) {
				$userInfo = json_decode(getAccountInfo($reviewRow["userId"],$mysqli),true);
				$guideJson["review"][$count] = array (
					'reviewId' => $reviewRow['reviewId'],
					'reviewerId' => $userInfo['userId'],
					'reviewer' => $userInfo['username'],
					'date' => $reviewRow["date"],
					'rating' => $reviewRow["rating"],
					'paragraph' => $reviewRow["paragraph"]);
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

	
	function searchGuide ($keyword,$offset,$filter, $mysqli){
		$string="";
		if ($filter!=""){
			$string = getFilter($filter);
		}
		$searchResult = array();
		$query = mysqli_query($mysqli,"SELECT * FROM travelguide WHERE  (guideName LIKE '%".$keyword."%' OR country LIKE '%".$keyword."%' OR EXISTS 
		( SELECT * FROM account WHERE travelguide.userId = account.userId AND username LIKE '%".$keyword."%')) ".$string." LIMIT 5 OFFSET ".$offset);
		
		/*echo "SELECT * FROM travelguide WHERE  guideName LIKE '%".$keyword."%' OR country LIKE '%".$keyword."%' OR EXISTS 
		( SELECT * FROM account WHERE travelguide.userId = account.userId AND username LIKE '%".$keyword."%') ".$string." LIMIT 5 OFFSET ".$offset;
		*/
		if(mysqli_num_rows($query)>=1){
			 while($row = $query->fetch_assoc()) {
				$userInfo = json_decode(getAccountInfo($row["userId"],$mysqli),true);
				$row ["username"] = $userInfo['username'];
				array_push($searchResult, $row);
			 }
			 if (mysqli_num_rows($query)<5){
				 $searchResult ["end"] = true;
			 } else {
				 $searchResult ["end"] = false;
			 }
			echo json_encode($searchResult);
		} else {
			echo json_encode("noMore");
		}
	}
	
	function searchCountryGuide ($country,$offset,$filter, $mysqli){
		$string="";
		if ($filter!=""){
			$string = getFilter($filter);
		}
		$searchResult = array();
		$query = mysqli_query($mysqli,"SELECT * FROM travelguide WHERE  country LIKE '%".$country."%' LIMIT 5 OFFSET ".$offset);
		
		if(mysqli_num_rows($query)>=1){
			 while($row = $query->fetch_assoc()) {
				$userInfo = json_decode(getAccountInfo($row["userId"],$mysqli),true);
				$row ["username"] = $userInfo['username'];
				array_push($searchResult, $row);
			 }
			 if (mysqli_num_rows($query)<5){
				 $searchResult ["end"] = true;
			 } else {
				 $searchResult ["end"] = false;
			 }
			echo json_encode($searchResult);
		} else {
			echo json_encode("noMore");
		}
	}
	
	function getFilter($filter){
			$monthDict = array();
	$monthDict['Jan-Mar'] = " AND 1<=MONTH(date)<=3";
	$monthDict['Apr-Jun'] = " AND 4<=MONTH(date)<=6";
	$monthDict['Jul-Sep'] = " AND 7<=MONTH(date)<=9";
	$monthDict['Oct-Dec'] = " AND 10<=MONTH(date)<=12";

		$filterArrary = explode("+",$_POST['callsearchGuide']);
		$string = "";
		foreach  ($filterArrary as $filterValue){
			$value = explode("|",$filterValue);
			if ($value[0]=="date"){
				$string .= $monthDict[$value[1]];
			}else if ($value[0]=="budget"){
				$number = explode("-",$value[1]);
				$string .= " AND ".$number[0]. "<= budget <=".$number[1];
			} else if ($value[0]=="people"){
				$string .= " AND people = ".$value[1];
			}else if ($value[0]=="rating"){
				$string .= " AND rating = ".$value[1];
			}
		}
		return 	$string;
	}
	$mysqli->close();
	
?>