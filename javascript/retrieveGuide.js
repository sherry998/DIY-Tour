var day = document.getElementById('dayContainer');
var originalDay;
var dayCount;
var reviewCount = 0;
var title;
var id;
var arr = document.getElementsByTagName('a'); 
var originalFeatureImage; 
var originalReview = document.getElementById('r0'); 
var review = document.getElementById('existingReview'); 
var modal = document.getElementById('myModal');

var reviewJson;

function updateRating(rating){
	onStar=0;
	console.log(rating);
		var stars = $("#guideRating").find('.glyphicon');
		if (rating == 0){
			for (i = 0; i <= stars.length; i++) {
				$(stars[i]).removeClass('selected');
			}
		}else{
			for (i = 0; i <= stars.length; i++) {
				$(stars[i]).removeClass('selected');
				if (i<rating){
					$(stars[i]).addClass('selected');
				}
			}
		}
}

function goBack() {
    window.history.back();
}

function loadGuide($offset,$mysqli){
	getURLParameter(window.location.href );
	title = getURLParameter('title');
	id = getURLParameter('id');
	dataSend = id + ":" + title;
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
					originalDay = document.getElementById('day0');
					showGuide(data);
				} else if (pathname.includes("editGuide")){
					originalDay = document.getElementById('day1');
					showEditGuide(data);
					
				}
				
			} else {
				console.log("no data matched");
			}
		},
		error: function(data){
			console.log("error");
			console.log(data);
			//console.log('Something went wrong', status, err);
			$( "#message" ).addClass( "messageFail" );
			document.getElementById("message").innerHTML = "Error connecting to server. Please try again later."; 
		}
	});
}

function getURLParameter(name) {
  return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [null, ''])[1].replace(/\+/g, '%20')) || null;
}

function changeLink(thisLink){ 
	console.log(thisLink);
    if(thisLink.className =='contentLink'){  
    thisLink.className ='contentLink2';  
    var name = thisLink.id;  
    var title = document.getElementsByClassName('contentLink2');  
    for(var j=0;j<title.length;j++){  
        if(title[j].id!=name){  
            title[j].className ='contentLink';  
        }  
    }     
	}   
}

function createSideDayLink (count){
	for (var i=1; i<=count; i++){
		$('#link').append(
			$('<li>').append(
				$('<a class="contentLink">').attr({'href':'#day'+i,'id':i, 'onclick':'changeLink(this)'}).append("Day " + i)
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
	if (data.featureImage!="guide_Image/NoPicAvailable.png"){
	document.getElementById("feature-img").src=data.featureImage;
	}
	
	if (data.pcountry!= null && data.pcountry!= ""){
		$("#profile-userRegion").css("display", "block");
		document.getElementById("userRegion").innerHTML = data.pcountry;
	}
				
	if (data.about!= null && data.about!= ""){
		$("#profile-usersummary").css("display", "block");
		document.getElementById("userSummary").innerHTML = data.about;
	}
	
	updateRating(data.rating);
	
	for(dayCount in data.day) {
			var clone = originalDay.cloneNode(true); 
			clone.id = "day" + dayCount;
			day.appendChild(clone);
			clone.style.display = "block";

			var slick = $("#day"+dayCount).find(".imgContainer");
			console.log($("#day"+dayCount).find(".imgContainer"));
			sliderInit(slick);
			$("#day"+dayCount).children(".subTitle").text("Day " + dayCount + ": " + data.day[dayCount].title);
			$("#day"+dayCount).children("p").text(data.day[dayCount].description);
			$("#day"+dayCount).children(".dayImages").empty();
			
			for(imageCount in data.day[dayCount].image){
				$("#day"+dayCount).find(".imgContainer").slick('slickAdd','<div><img src="'+data.day[dayCount].image[imageCount]+'" class="sliderImage"/> </div>');
				
			}
					
	}
	console.log(data.review);
	
	reviewJson = data.review;
	
	for(reviewNum in data.review) {
			var owner = false;
			console.log(data.review[reviewNum].reviewerId);
			console.log(userId);
		if (userId == data.review[reviewNum].reviewerId){
			owner = true;
		}
		createReview(data.review[reviewNum].reviewer,data.review[reviewNum].reviewId,data.review[reviewNum].date,data.review[reviewNum].rating,
		data.review[reviewNum].paragraph,owner)
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
	
	if (data.featureImage!="guide_Image/NoPicAvailable.png"){
		$("#featureclose").css({'display':'block'});
		document.getElementById("feature-image").src=data.featureImage;
		originalFeatureImage = data.featureImage;
		console.log (originalFeatureImage);
	}

	for(dayCount in data.day){
		if ($("#day"+dayCount).length == 0){
			var clone = originalDay.cloneNode(true); 
			clone.id = "day" + dayCount;
			day.appendChild(clone);
		}
		
		
			$("#day"+dayCount).children("h3").children("b").text("Day "+ dayCount);
			$("#day"+dayCount).children(".form-inline").children("input[type=text]").val(data.day[dayCount].title);
			$("#day"+dayCount).children(".form-inline").children("input[type=text]").attr("name", "title"+dayCount);
			$("#day"+dayCount).children(".form-group").children("textarea").val(data.day[dayCount].description);
			$("#day"+dayCount).children(".form-group").children("textarea").attr("name", "summary"+dayCount);
			$("#day"+dayCount).children(".form-inline").children(":file").attr("name", "image-upload"+dayCount+"[]");
			$("#day"+dayCount).children(".form-inline").children(":file").attr("id", "image-upload"+dayCount);
			$("#day"+dayCount).children(".form-inline").children("label").attr("for", "image-upload"+dayCount);
			$("#day"+dayCount).children(".imagePreview").attr("id", "preview"+dayCount);
			$("#day"+dayCount).children(".imagePreview").empty();
			$("#day"+dayCount).children(".originalreview").attr("id", "original"+dayCount);
			$("#day"+dayCount).children(".originalreview").empty();
			
			for(imageCount in data.day[dayCount].image){
				var parentContainer = $('<div class="img-wrap" > </div>');
				var close = $('<span class="close" onclick="removeImage(this)">&times;</span>').css({'display':'block'});
				var imageContainer = $('<div class="preview"></div>');
				parentContainer.appendTo($("#day"+dayCount).find(".originalreview"));
				close.appendTo(parentContainer);
				imageContainer.appendTo(parentContainer).css({'background-image':'url('+data.day[dayCount].image[imageCount]+')'});
				imageContainer.attr({'name':data.day[dayCount].image[imageCount]});
				
			}
					
	}
	
	updateId(id);
	setNum($("#dayContainer").children('div[id^=day]').length);
}

	
function sliderInit(slick){
	slick.slick({
		arrows: true,
	  dots: true,
	  infinite: false,
	  speed: 300,
	  slidesToShow: 2,
	  slidesToScroll: 2,
	
	});
}

function submitReview(){
	var reviewText = $("#review").val();
	var date = new Date().toJSON().slice(0,10).replace(/-/g,'/');

	var dataSend=onStar+":"+reviewText+":"+id+":"+date;
	
	if (onStar!=0){
		$("#ratingMessage").css("display","none");
		$.ajax({
				url: 'php/addReview.php',
				type: 'post',
				data: {"callAddReview":dataSend},
			success: function(data){
				var value = data.split(":");
				console.log(data);
				createReview(username,value[0],date,onStar,reviewText,true);
				updateRating(value[1]);
				$("#review").val("");
				removeStar();
			},
			error: function(req, status, err){
				console.log("error");
				//console.log(data);
				console.log('Something went wrong', status, err);
				$( "#message" ).addClass( "messageFail" );
				document.getElementById("message").innerHTML = "Error connecting to server. Please try again later."; 
			}
		});
	} else {
		$("#ratingMessage").css("display","block");
	}
}

function createReview(username,reviewId,date,rating,reviewText,isOwner){
	var clone = originalReview.cloneNode(true);
			
			var reviewId = 	"r" + (reviewId);
			clone.id = reviewId;

			review.insertBefore(clone,review.firstChild);
			
			var stars = $("#"+reviewId).find('.ratingStar');
			for (i = 0; i < rating; i++) {
				$(stars[i]).addClass('selected');
			}
	
			$("#"+reviewId).children("div").css("display","block");
			$("#"+reviewId).find(".reviewer").text(username + " on " + date);
			$("#"+reviewId).find(".rating").text(rating);
			$("#"+reviewId).find(".text").text(reviewText);
			$("#"+reviewId).find(".img-responsive").attr("src",profileI);
			if (isOwner){
				$("#"+reviewId).find(".deleteR").css("display", "block");
			} else {
				$("#"+reviewId).find(".deleteR").css("display", "none");
			}
			
			clone.style.display = "block";
			
}

function deleteRe(thisR){
	var reviewId = String($(thisR).parent().parent().parent().attr("id"));
	
	$.ajax({
			url: 'php/addReview.php',
			type: 'post',
			data: {"callDeleteReview":	reviewId.slice(1)+":"+id},
		success: function(data){
			console.log(data);
			updateRating(data);
			$(thisR).parent().parent().parent().remove();
		},
		error: function(req, status, err){
			console.log("error");
			console.log(data);
			console.log('Something went wrong', status, err);
			$( "#message" ).addClass( "messageFail" );
			document.getElementById("message").innerHTML = "Error connecting to server. Please try again later."; 
		}
	});
}

function openModal(){
	modal.style.display = "block";
}

function back(){
	modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

