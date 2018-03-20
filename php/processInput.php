<?php
	$mysqli = new mysqli('localhost', 'root', '', 'diy_tour');
	
	if ($mysqli->connect_error) {
		echo("Connection failed: " . $conn->connect_error);
	} 
	
	$mysqli->close();
	
?>