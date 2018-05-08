var day = document.getElementById('dayContainer');
var originalDay;
var dayCount;
var title;
var id;

$(document).ready(function() {
	getURLParameter(window.location.href );
	title = getURLParameter('title');
	id = getURLParameter('id');
	dataSend = id + ":" + title;
	
	originalDay = document.getElementById('day1');
	console.log(originalDay);

	$.ajax({
			url: 'php/retrieveGuideInfo.php',
			type: 'post',
			data: {"callGetGuideInfo":dataSend},
			dataType: 'json',
		success: function(data){
			console.log(data);
			if (data!== null && data !== ""){
				var pathname = window.location.pathname;
				if(pathname.includes("specificGuide")){
					showGuide(data);
				} else if (pathname.includes("editGuide")){
					showEditGuide(data);
				}
				
			} else {
				console.log("no data matched");
			}
		},
		error: function(req, status, err){
			console.log("error");
			//console.log(data);
			console.log('Something went wrong', status, err);
			$( "#message" ).addClass( "messageFail" );
			document.getElementById("message").innerHTML = "Error connecting to server. Please try again later."; 
		}
	});
	
	
	
});

function getURLParameter(name) {
  return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [null, ''])[1].replace(/\+/g, '%20')) || null;
}



function createSideDayLink (count){
	for (var i=1; i<=count; i++){
		$('#link').append(
		$('<li class="contentLink">').append(
			$('<a>').attr('href','#day'+i).append("Day " + i)
		));  
	}
}

function showGuide(data){
	$("#title").text(data.guideName);
	$("#location").append(data.country);
	$("#date").append(data.date);
	$("#people").append(data.people);
	$("#budget").append(data.budget);
	$("#summary").text(data.overview);
	$(".profile-username").text(data.username);
	document.getElementById("profile-img").src=data.pImage;
	
	if (data.pcountry!= null && data.pcountry!= ""){
		$("#profile-userRegion").css("display", "block");
		document.getElementById("userRegion").innerHTML = data.pcountry;
	}
				
	if (data.about!= null && data.about!= ""){
		$("#profile-usersummary").css("display", "block");
		document.getElementById("userSummary").innerHTML = data.about;
	}
	
	
	for(dayCount in data.day) {
		if ($("#day"+dayCount).length == 0){
			var clone = originalDay.cloneNode(true); 
			clone.id = "day" + dayCount;
			day.appendChild(clone);
		}
			
			$("#day"+dayCount).children(".subTitle").text("Day " + dayCount + ": " + data.day[dayCount].title);
			$("#day"+dayCount).children("p").text(data.day[dayCount].description);
			$("#day"+dayCount).children(".dayImages").empty();
			
			for(imageCount in data.day[dayCount].image){
				$("#day"+dayCount).children(".dayImages")
				.append('<img src="'+data.day[dayCount].image[imageCount]+'" style="width:100%; margin-bottom:20px;" />');
			}
					
	}
	createSideDayLink(dayCount);
	checkOwner(data.userId);
}

function checkOwner(userId){
	$.ajax({
			url: 'php/editAccount.php',
			type: 'post',
			data: {"callGetAccountInfo":""},
			dataType: 'json',
		success: function(data){
			console.log(data.userId);
			if (data!== null && data !== "" && userId == data.userId){
				$("#edit").css("display","block");
			} else {
				console.log("not owner");
			}
		},
		error: function(data){

			if (data != "not"){
				console.log(data);
			//console.log(data);
			$( "#message" ).addClass( "messageFail" );
			document.getElementById("message").innerHTML = "Error connecting to server. Please try again later."; 
			}
		}
	});
}

function openEdit(){
	window.location.href = "editGuide.html?id="+id+"&title="+title;
}

function showEditGuide(data){
	$("#guideTitle").val(data.guideName);
	$("#guideLocation").val(data.country);
	$("#guideDate").val(data.date);
	$("#guideType").val(data.people);
	$("#guideBudget").val(data.budget);
	$("#guideSummary").val(data.overview);
	
	for(dayCount in data.day){
		if ($("#day"+dayCount).length == 0){
			var clone = originalDay.cloneNode(true); 
			clone.id = "day" + dayCount;
			day.appendChild(clone);
		}
			$("#day"+dayCount).children("h3").children("b").text("Day "+ dayCount);
			$("#day"+dayCount).children(".form-inline").children("input").val(data.day[dayCount].title);
			$("#day"+dayCount).children(".form-group").children("textarea").val(data.day[dayCount].description);
			
					
	}
	
	updateId(id);
	setNum($("#dayContainer").children('div[id^=day]').length);
}



function showCreatorInfo(name){
	
}
