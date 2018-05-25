var username;
var travelT;
var profileI;
var country;
var about;
var count;
var rcount;
var userId;
var pathname = window.location.pathname;

function loadData(){
	var pathname = window.location.pathname;	
	$.ajax({
			url: 'php/editAccount.php',
			type: 'post',
			data: {"callGetAccountInfo":""},
			dataType: 'json',
		success: function(data){
			console.log(data);
			if (data!= "{}" && data != ""){
				$("#profileDrop").css("display", "block");
				$("#logInDrop").css("display", "none");
				$(".headerUser").css("color", "#5cb85c");
				username = data.username;
				travelT = data.travelTitle;
				profileI = data.profileImage;
				country = data.country;
				about = data.about;	
				count = data.count;	
				rcount = data.rcount;
				userId = data.userId;
				
				loadDropDown();
				
				if ($('#sideNav').length != 0 && !pathname.includes("specificGuide")&& !pathname.includes("searchGuide")){

					loadSideNav();
				}
				if(pathname.includes("specificGuide")){
				console.log(profileI);
				document.getElementById("review-img").src=profileI;
			}
			} else {
				if ($('#sideNav').length != 0){
					window.location.href = "login.html";
				}
				$("#reviewForm").remove();
				$("#review-img").remove();
			}
				
			
			
	},
		error: function(data){
			console.log("error");
			console.log(data);
		}
	
	});
}


function loadDropDown(){
		$("#profileDrop").css("display", "block");
		$("#logInDrop").css("display", "none");
		document.getElementById("username").innerHTML = username;
		document.getElementById("usertitle").innerHTML = travelT;
		document.getElementById("userimg").src=profileI;
				
		if (country!= null && country!= ""){
			$("#originC").css("display", "block");
			document.getElementById("userOrigin").innerHTML = country;
		}
				
		if (about!= null && about!= ""){
			$("#summaryC").css("display", "block");
			document.getElementById("userSummary").innerHTML = about;
		}
}



function loadSideNav(){
	document.getElementById("profile-username").innerHTML = username;
	document.getElementById("profile-usertitle").innerHTML = travelT;
	document.getElementById("profile-img").src=profileI;

		
	if (country!= null && country!= ""){
		$("#profile-userRegion").css("display", "block");
		document.getElementById("userRegion").innerHTML = country;
	}
				
	if (about!= null && about!= ""){
		$("#profile-usersummary").css("display", "block");
		document.getElementById("userAbout").innerHTML = about;
	}
	
	document.getElementById("postCount").innerHTML = count;
	document.getElementById("reviewCount").innerHTML = rcount;
}
	
function checkLogin(){
	var email = $('#email').val();
	var psw= $('#password').val();
	var input = email + ":" + psw;
	
	
	if (email !== null && email !== '' && psw !== null && psw !== ''){
		$.ajax({
				url: 'php/createAccount.php',
				type: 'post',
				data: {"callCheckAccount":input},
			success: function(data){
				if (data== "correct"){
					if (pathname.includes("login")){
						window.location.href = 'profile.html';
					} else {
						location.reload();
					}
				} else{
					document.getElementById("errorLabel").innerHTML = data;
					$( "#shakeP" ).effect( "shake", {times:2}, 1000 );
					$( ".shakePw" ).effect( "shake", {times:2}, 1000 );
					
					
					
				}
			},
			error: function(data){
				document.getElementById("errorLabel").innerHTML = "Error with authentication system. Please try again later";
			}
		});
	}else{
		document.getElementById("errorLabel").innerHTML = "Please enter your email or password.";
		document.getElementById("errorLabel").style.color = "#922B21";
		$( "#shakeP" ).effect( "shake", {times:2}, 1000 );
		$( "#shakeE" ).effect( "shake", {times:2}, 1000 );
		$( ".shakeEa" ).effect( "shake", {times:2}, 1000 );
		$( ".shakePw" ).effect( "shake", {times:2}, 1000 );
		
	

	}
}

function logout(){
	$.ajax({
			url: 'php/createAccount.php',
			type: 'post',
			data: {"callAccountLogout":""},
		success: function(data){
			if (data!= null || data != ""){
				$("#profileDrop").css("display", "none");
				$("#logInDrop").css("display", "block");
				if ($('#sideNav').length != 0){
					window.location.href = 'index.html';
				} else {
					location.reload();
				}
			}
		},
		error: function(data){
			console.log("error");
		}
	
	});	
}

function search(){
	var search = $('#searchBar').val();
	if (search!=null && search.replace(/\s/g,"") != ""){
		window.location.href="searchGuide.html?keyword=" + search;
	} else {
		window.location.href="searchGuide.html?all=all";
	}
}

