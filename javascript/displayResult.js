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
			if (data!= null || data != ""){
				console.log(data);
				createResult(data);
			} else {
				$('#searchMessage').append( "<b>"+keyword+"</b>" );
			}
		},
		error: function(data){
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
		$("#"+clone.id).children("p").children(".writer").text(data[result].username);
		$("#"+clone.id).children("p").children(".country").text(data[result].country);
		$("#"+clone.id).children("p").children(".type").text(data[result].people);
		$("#"+clone.id).children("p").children(".date").text(data[result].date);
		$("#"+clone.id).children("a").children("h1").text(data[result].guideName);
		$("#"+clone.id).children("a").attr("href", "specificGuide.html?id="+data[result].guideId+"&title="+data[result].guideName);
		$("#"+clone.id).children(".summary").text(data[result].overview);
	}
}