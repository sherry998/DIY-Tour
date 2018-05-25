var originalResult = document.getElementById('result');
var results = document.getElementById('resultContainer');
var profileGuide = document.getElementById('myGuideContainer');
var originalprofileGuide = document.getElementById('g0');
var offset =0;
var keyword;
var countryLink;
var all;
var filterArray = [];
var divClone = $("#resultContainer").clone();
var filter = "";

$(document).ready(function() {
	getURLParameter(window.location.href);
	keyword = getURLParameter('keyword');
	countryLink = getURLParameter('country');
	console.log(countryLink);
	all = getURLParameter('all');
	
	loadSearchResult();
});

function loadSearchResult(){
	if (keyword!="" && keyword!=null){
		$('#searchTitle').text("Search Results for: "+keyword);
		loadDisplay("callsearchGuide",keyword);
	} else if (countryLink!="" && countryLink!=null){
		$('#searchTitle').text("Search Results for: "+countryLink);
		loadDisplay("callsearchCountryGuide",countryLink);
	}else if(all=="all"){
		$('#searchTitle').text("Search Results for: ALL guides");
		loadDisplay("callallGuide","a");	
	} else {
		loadProfileGuideResult();
	}
}

function loadProfileGuideResult(){
	$.ajax({
			url: 'php/retrieveGuideInfo.php',
			type: 'post',
			data: {"callGetProfileGuide":offset},
			dataType: 'json',
		success: function(data){
			console.log(data);
			if (String(data) == "noMore"){
				$("#moreGuide").css("display","none");
			}
			else if (data!= null || data != ""){
				$("#notice").css("display","none");
				if (data.end == true){
					$("#moreGuide").css("display","none");
				}else{
					$("#moreGuide").css("display","block");
				}
				for(result in data) {
					if (result != "end"){
						var clone = originalprofileGuide.cloneNode(true);		
						clone.id = data[result].guideId;
						$(clone).css("display","block");
						profileGuide.appendChild(clone);
						$("#"+clone.id).find(".myDate").text(data[result].date);
						$("#"+clone.id).find(".myTitle").text(data[result].guideName);
						$("#"+clone.id).find("a").attr("href", "specificGuide.html?id="+data[result].guideId+"&title="+data[result].guideName);
						$("#"+clone.id).find("img").attr("src",data[result].featureImage);
					}
			} 
			}
		},
		error: function(data){
			console.log("error");
			console.log(data);
		} 
	
	});
}

function loadDisplay(functionName,value){
	var fulldata = value+":"+offset+":"+filter;
	console.log(fulldata);
	var dataObj = {};

	dataObj[functionName]=fulldata;

	$.ajax({
			url: 'php/retrieveGuideInfo.php',
			type: 'post',
			data: dataObj,
			dataType: 'json',
		success: function(data){
			console.log(data);
			if (String(data) == "noMore"){
				$("#moreGuide").css("display","none");
				// show only if there is no search result
				if ($(".searchResult").length <=1){
					$('#nofilter').css("display","block");
				}
			}
			else if (data!= null || data != ""){
				$('#nofilter').css("display","none");
				if (data.end == true){
					$("#moreGuide").css("display","none");
				}else{
					$("#moreGuide").css("display","block");
				}
				createResult(data);
			} 
		},
		error: function(data){
			console.log("error");
			console.log(data);
			$('#searchMessage').append( "<b>"+keyword+"</b>" );
		} 
	
	});
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
			$("#"+clone.id).find(".summary").text(truncateText(data[result].overview, 60));
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
	loadSearchResult();
}


function addFilter(){
	console.log(onStar);
	offset =0;
	filter=" ";
	if (onStar!=0){
		filter = "rating|"+onStar;
	}
	$('input[type=checkbox]').each(function () {
   if (this.checked){
	   filter += "+" + $(this).attr("name");
   }
  
   
});

 var cntnt = document.getElementById("resultContainer");
 while (cntnt.lastChild.id !== 'result') {
    cntnt.removeChild(cntnt.lastChild);
}
	loadSearchResult();
}