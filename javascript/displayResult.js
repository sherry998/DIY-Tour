var originalResult = document.getElementById('result');
var results = document.getElementById('resultContainer');
var offset =0;
var keyword;
var country;
var filterArray = [];
var divClone = $("#resultContainer").clone();

$(document).ready(function() {
	getURLParameter(window.location.href);
	keyword = getURLParameter('keyword');
	country = getURLParameter('country');
	$('#searchTitle').append(keyword);
	loadSearchResult(offset,"");
});

function loadSearchResult(offset,filter){
	if (keyword!="" && keyword!=null){
	$.ajax({
			url: 'php/retrieveGuideInfo.php',
			type: 'post',
			data: {"callsearchGuide":keyword+":"+offset+":"+filter},
			dataType: 'json',
		success: function(data){
			console.log(data);
			if (String(data) == "noMore"){
				$("#moreGuide").css("display","none");
				$('#searchMessage').append( "<b>"+keyword+"</b>" );
			}
			else if (data!= null || data != ""){
				if (data.end == true){
					$("#moreGuide").css("display","none");
				}else{
					$("#moreGuide").css("display","block");
				}
				createResult(data);
			} 
		},
		error: function(data){
			console.log(data);
			$('#searchMessage').append( "<b>"+keyword+"</b>" );
		}
	
	});	
	} else if (country!="" && country!=null){
		$.ajax({
			url: 'php/retrieveGuideInfo.php',
			type: 'post',
			data: {"callsearchCountryGuide":country+":"+offset+":"+filter},
			dataType: 'json',
		success: function(data){
			console.log(data);
			if (String(data) == "noMore"){
				$("#moreGuide").css("display","none");
				$('#searchMessage').append( "<b>"+keyword+"</b>" );
			}
			else if (data!= null || data != ""){
				if (data.end == true){
					$("#moreGuide").css("display","none");
				}else{
					$("#moreGuide").css("display","block");
				}
				createResult(data);
			} 
		},
		error: function(data){
			console.log(data);
			$('#searchMessage').append( "<b>"+keyword+"</b>" );
		}
	
	});
	}
}

function getURLParameter(name) {
  return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [null, ''])[1].replace(/\+/g, '%20')) || null;
}

function createResult(data){
	$("#noResult").css("display","none");
	for(result in data) {
		if (result != "end"){
			console.log(data[result].guideName);
			var clone = originalResult.cloneNode(true);		
			clone.id = data[result].guideId;
			$(clone).css("display","block");
			results.appendChild(clone);
			$("#"+clone.id).find(".writer").text(data[result].username);
			$("#"+clone.id).find(".country").text(data[result].country);
			$("#"+clone.id).find(".type").text(data[result].people);
			$("#"+clone.id).find(".date").text(data[result].date);
			$("#"+clone.id).find(".rating").text(data[result].rating);
			$("#"+clone.id).find("h3").children("b").text(data[result].guideName);
			$("#"+clone.id).children(".col-md-9").children("a").attr("href", "specificGuide.html?id="+data[result].guideId+"&title="+data[result].guideName);
			$("#"+clone.id).find(".summary").text(truncateText(data[result].overview, 80));
			$("#"+clone.id).find("img").attr("src",data[result].featureImage);
		}
	}
}

function truncateText(selector, maxLength) {
    if (selector.length > maxLength) {
        selector = selector.substr(0,maxLength) + '...';
    }
    return selector;
}

function loadMore(){
	offset+=5;
	loadSearchResult(offset);
}

function removeStar(){
		var stars = $('#rating').children('.ratingStar');
        for (i = 0; i < stars.length; i++) {
      $(stars[i]).removeClass('selected');
    }
	onStar=0;
}

function addFilter(){
	console.log(onStar);
	offset =0;
	var stringFilter = "rating|"+onStar;
	$('input[type=checkbox]').each(function () {
   if (this.checked){
	   stringFilter += "+" + $(this).attr("name");
   }
  
   
});
console.log(stringFilter);
 var cntnt = document.getElementById("resultContainer");
 while (cntnt.lastChild.id !== 'result') {
    cntnt.removeChild(cntnt.lastChild);
}
	loadSearchResult(offset,stringFilter);
}