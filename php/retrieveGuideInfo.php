<?php
	
	include 'editAccount.php';
	include 'APIkey.php';
	include 'error.php';
	
	//$mysqli = new mysqli('localhost', 'root', '', 'diy_tour');
	$mysqli = new mysqli('localhost', 'root', 'db5a0d0b13ca1d4d', 'diy_tour');

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
	
	if (isset($_POST['callallGuide'])) {
		
		$data = explode(":",$_POST['callallGuide']);
        allGuide($data[1],$data[2],$mysqli);
    }
	
	if (isset($_POST['callsearchCountryGuide'])) {
		$data = explode(":",$_POST['callsearchCountryGuide']);
        searchCountryGuide($data[0],$data[1],$data[2],$mysqli);
    }
	
	if (isset($_POST['callGetProfileGuide'])) {
        getProfileGuide($_POST['callGetProfileGuide'],$mysqli);
    }
	
	if (isset($_POST['callgetKey'])) {
        getKey();
    }
	
	function getGuideLocation($id,$mysqli){
		$json;
		
		$sql = "SELECT country FROM travelguide WHERE  userId = ? LIMIT 10";
		$stmt = $mysqli->prepare($sql);
		$stmt->bind_param("i", $id);
		$stmt->execute();
		$result = $stmt->get_result();

		if(mysqli_num_rows($result)>=1){
			$count=1;
			while($row = $result ->fetch_assoc()) {
			$json["country"][$count] = $row["country"];
			$count++;
			}
		echo json_encode($json);
		} else{
			echo json_encode("");
		}
	}
	
	function getGuideInfo($id, $title, $mysqli){
		$guideSql = "SELECT * FROM travelguide WHERE  guideName = ? AND guideId = ?";
		$guideStmt = $mysqli->prepare($guideSql);
		$guideStmt->bind_param("si", $title, $id);
		$guideStmt->execute();
		$guideResult = $guideStmt->get_result();
		
		$daySql = "SELECT * FROM day WHERE guideId = ?";
		$dayStmt = $mysqli->prepare($daySql);
		$dayStmt->bind_param("i", $id);
		$dayStmt->execute();
		$dayResult = $dayStmt->get_result();
		
		if(mysqli_num_rows($guideResult)==1 && mysqli_num_rows($dayResult)>=1){
			$row = $guideResult->fetch_assoc();
			$guideJson = json_decode(json_encode($row),true);
			$userId = $row["userId"];
			$count=1;
			while($dayRow = $dayResult->fetch_assoc()) {
				$imageArray = loadImage($mysqli,$dayRow,$guideJson,$count);
				$guideJson["day"][$count] = array (
					'title' => $dayRow["Title"],
					'description' => $dayRow["description"],
					'image' => $imageArray);
				$count++;
			}
			
			$guideJson = loadReview($id,$guideJson,$mysqli);
			
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
	
	function loadImage($mysqli,$dayRow,$count){
		$dayId = $dayRow["dayId"];
				
		$imageSql = "SELECT * FROM image WHERE dayId = ?";
		$imageStmt = $mysqli->prepare($imageSql);
		$imageStmt->bind_param("i", $dayId);
		$imageStmt->execute();
		$imageResult = $imageStmt->get_result();

		$imageArray = array ();
		while($imageRow = $imageResult->fetch_assoc()) {
			array_push($imageArray,$imageRow["imageLink"]);
		}
		return $imageArray;		
	}
	
	function loadReview($id,$guideJson,$mysqli){
		$count=1;
		
			$reviewSql = "SELECT * FROM review WHERE guideID = ?";
			$reviewStmt = $mysqli->prepare($reviewSql);
			$reviewStmt->bind_param("i", $id);
			$reviewStmt->execute();
			$reviewResult = $reviewStmt->get_result();
			while($reviewRow = $reviewResult->fetch_assoc()) {
				$userInfo = json_decode(getAccountInfo($reviewRow["userId"],$mysqli),true);
				$guideJson["review"][$count] = array (
					'reviewId' => $reviewRow['reviewId'],
					'reviewerId' => $userInfo['userId'],
					'reviewer' => $userInfo['username'],
					'date' => $reviewRow["date"],
					'rating' => $reviewRow["rating"],
					'paragraph' => $reviewRow["paragraph"],
					'reviewerImage' => $userInfo["profileImage"]);
				$count++;
			}
		return $guideJson;
	}

	function getProfileGuide ($offset,$mysqli){
		$id = $_SESSION['id'];
		
		$sql = "SELECT * FROM travelguide WHERE  userId = ? ORDER BY date DESC, guideName ASC LIMIT 5 OFFSET ? ";
		$stmt = $mysqli->prepare($sql); 
		$stmt->bind_param("ii", $id, $offset);
		$stmt->execute();
		$result = $stmt->get_result();
		
		returnSearchResult($result,$mysqli);
		
	}
	
	function searchGuide ($keyword,$offset,$filter, $mysqli){
		$string = getFilter($filter);

		$keyword = "%{$keyword}%";
		
		$sql = 'SELECT * FROM travelguide WHERE  (guideName LIKE ? OR country LIKE ? OR EXISTS 
		( SELECT * FROM account WHERE travelguide.userId = account.userId AND username LIKE ?))'.$string.' LIMIT 5 OFFSET ?';
		$stmt = $mysqli->prepare($sql); 
		$stmt->bind_param("sssi", $keyword,$keyword,$keyword,$offset);
		$stmt->execute();
		$result = $stmt->get_result();
		
		returnSearchResult($result,$mysqli);
	}
	
	function searchCountryGuide ($country,$offset,$filter, $mysqli){
		$string = getFilter($filter);
		
		$country = "%{$country}%";
		
		$sql = 'SELECT * FROM travelguide WHERE  ( country LIKE ?)'.$string.'LIMIT 5 OFFSET ?';
		$stmt = $mysqli->prepare($sql); 
		$stmt->bind_param("si", $country,$offset);
		$stmt->execute();
		$result = $stmt->get_result();
		
		returnSearchResult($result,$mysqli);
	}
	
	function allGuide ($offset,$filter,$mysqli){
		$string = getFilter($filter);
		$sql = 'SELECT * FROM travelguide LIMIT 5 OFFSET ?';
		
		if ($string!=""&&$string!=null){
			$string = substr($string,3);
			$sql = 'SELECT * FROM travelguide WHERE '.$string.' LIMIT 5 OFFSET ?';
		}
		
		$stmt = $mysqli->prepare($sql); 
		$stmt->bind_param("i",$offset);
		$stmt->execute();
		$result = $stmt->get_result();
		
		returnSearchResult($result,$mysqli);
	}
	
	function returnSearchResult($query,$mysqli){
		$searchResult = array();
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
		if ($filter=="" && $filter==null){
			return "";
		}
		
		$join = " ";
		$previousValue = null;

		$monthDict = array();
		$monthDict['Jan-Mar'] = " ( MONTH(date)>=1 AND MONTH(date) <=3)";
		$monthDict['Apr-Jun'] = " ( MONTH(date)>=4 AND MONTH(date) <=5)";
		$monthDict['Jul-Sep'] = " ( MONTH(date)>=7 AND MONTH(date) <=9)";
		$monthDict['Oct-Dec'] = " ( MONTH(date)>=10 AND MONTH(date) <=12)";

		$filterArrary = explode("+",$filter);
		$string = "AND ((";
		foreach  ($filterArrary as $filterValue){
			$value = explode("|",$filterValue);
			
			if ($previousValue == " "){
				$join = " ";
			}
			else if ($value[0] == $previousValue){
				$join="OR ";
			} else if ($previousValue!=null){
				$string.=")";
				$join="AND (";
			} 
			
			if ($value[0]=="date"){
				$string .= ($join. $monthDict[$value[1]]);
			}else if ($value[0]=="budget"){
				$number = explode("-",$value[1]);
				// for budget between two numbers
				if ( isset($number[1])){
					$string .= $join."( budget>=".$number[0]. " AND budget <=".$number[1].")";
				} else {
					$string .= $join."( budget>=".$number[0].")";
				}
			} else if ($value[0]=="people"){
				$string .= $join."people = '".$value[1]."'";
			}else if ($value[0]=="rating"){
				$string .= $join."rating = ".$value[1];
			}
			$previousValue = $value[0];
		}
		if($string!="AND (("){
			return 	$string."))";
		} else {
			return "";
		}
		
	}
	$mysqli->close();
	
?>