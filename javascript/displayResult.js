var originalResult = document.getElementById('result');
var results = document.getElementById('resultContainer');

$(document).ready(function() {
	getURLParameter(window.location.href);
	var keyword = getURLParameter('keyword');
	$('#searchTitle').append(keyword);
	
	if (keyword!="" && keyword!=null){
	$.ajax({
			url: 'php/retrieveGuideInfo.php',
			type: 'post',
			data: {"callsearchGuide":keyword},
			dataType: 'json',
		success: function(data){
			console.log(data);
			if (data!= null || data != ""){
				createResult(data);
			} else {
				$('#searchMessage').append( "<b>"+keyword+"</b>" );
			}
		},
		error: function(data){
			console.log(data);
			$('#searchMessage').append( "<b>"+keyword+"</b>" );
		}
	
	});	
	}
});

function getURLParameter(name) {
  return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [null, ''])[1].replace(/\+/g, '%20')) || null;
}

function createResult(data){
	$("#noResult").css("display","none");
	for(result in data) {
		console.log(data[result].guideName);
		var clone = originalResult.cloneNode(true);		
		clone.id = data[result].guideId;
		$(clone).css("display","block");
		results.appendChild(clone);
		$("#"+clone.id).find(".writer").text(data[result].username);
		$("#"+clone.id).find(".country").text(data[result].country);
		$("#"+clone.id).find(".type").text(data[result].people);
		$("#"+clone.id).find(".date").text(data[result].date);
		$("#"+clone.id).find("h3").children("b").text(data[result].guideName);
		$("#"+clone.id).children(".col-md-9").children("a").attr("href", "specificGuide.html?id="+data[result].guideId+"&title="+data[result].guideName);
		$("#"+clone.id).children(".summary").text(data[result].overview);
		$("#"+clone.id).find("img").attr("src",data[result].featureImage);
	}
}