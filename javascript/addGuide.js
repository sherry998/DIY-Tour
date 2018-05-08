var originalDay = document.getElementById('day1');
var day = document.getElementById('dayContainer');
var dayList = [];
var num = 1;
var daytitleArray = [];
var dayInfoArray = [];
var inputArray = ["guideTitle", "guideLocation","guideDate", "guideType", "guideBudget", "guideSummary"];
var checkArray = ["guideTitle", "guideLocation","guideDate"];
var guideId;
	
$(document).ready(function() {
	dayList.push(originalDay.id);
});

function setNum(value){
	num = value;
	console.log(num);
	for (var i=2; i<=value; i++){
		dayList.push("day"+i);
	}
	console.log(dayList);
}

function duplicate() {
	//https://stackoverflow.com/questions/4427094/how-can-i-duplicate-a-div-onclick-with-javascript
    var clone = originalDay.cloneNode(true); // "deep" clone
    clone.id = "day" + ++num;
	dayList.push(clone.id);
    day.appendChild(clone);
	
	$('#'+clone.id).children("h3").children("b").text("Day " + num);
	// clean value
	$('#'+clone.id).children(".form-inline").children("input").val("");
	$('#'+clone.id).children(".form-inline").children("input").attr("name", "title"+num);
	$('#'+clone.id).children(".form-group").children("textarea").val("");
	$('#'+clone.id).children(".form-group").children("textarea").attr("name", "summary"+num);
	$('#'+clone.id).children(".form-inline").children(":file").attr("name", "image-upload"+num+"[]");
	$('#'+clone.id).children(".form-inline").children(":file").attr("id", "image-upload"+num);
	$('#'+clone.id).children(".form-inline").children("label").attr("for", "image-upload"+num);
	$('#'+clone.id).children(".imagePreview").attr("id", "preview"+num);
	$('#'+clone.id).children(".imagePreview").empty();
}

//https://stackoverflow.com/questions/15420558/jquery-click-event-not-working-after-append-method
//Use the .on() method to delegate the click event to (future) elements dynamically added to the DOM
$('#dayContainer').on('click', '.delete',function(){
	var deletedDay =$(this).parent().parent(); 
	dayList.splice(dayList.indexOf(deletedDay.attr('id')),1);
	deletedDay.remove();
	updateDayInfo();
});

function updateDayInfo(){
	//console.log("run");
	for (var i=0;i<dayList.length;i++){
		$('#'+dayList[i]).children("h2").text("Day " + (i+1));
		$('#'+dayList[i]).attr('id', "day"+ (i+1));
		dayList[i] = "day"+ (i+1);
	}
	num = dayList.length;
}


function updateId(id){
	guideId = id;
}

function checkGuideInput(){
	var valueArray= [];
	
	for (var i =0; i< inputArray.length; i++){
		var value = document.getElementById(inputArray[i]).value;
		if (checkArray.indexOf(inputArray[i]) !== -1){
			if(!runCheck(value,inputArray[i])){
				return;
			}
			valueArray.push(value);
		} else {
			valueArray.push(value);
		}
	}
	
	$("#editForm").attr('action', 'php/createGuide.php?numDay='+num);
	$("#editForm").submit();
	
	/*
	console.log(valueArray);
	if(createDayInfo()){
		var pathname = window.location.pathname;
		console.log(pathname);
		if (pathname.includes("createNewGuide")){
			createGuide(valueArray[0],valueArray[1],valueArray[2],valueArray[3],valueArray[4],valueArray[5]);
		} else if (pathname.includes("editGuide")){
			updateGuide(guideId, valueArray[0],valueArray[1],valueArray[2],valueArray[3],valueArray[4],valueArray[5]);
		}
	}*/
}

function runCheck(value,inputType){
	document.getElementById("message").innerHTML = ""; 
	$( "#message" ).removeClass();
	if (value != null && value !=""){
		if (inputType == "guideDate"){
			// to done later
			return checkDate(value);
			//return true;
		} else {
			return true;
		}
	} else {
		$( "#message" ).addClass( "messageFail" );
		var text = inputType.replace("guide","");
		document.getElementById("message").innerHTML = "Guide " + text + " can not be empty!!"; 
		return false;
	}
}

function checkDate(date){
	date = new Date (date);
	var now = new Date();
	
	if (date<=now) {
		return true;	
	} else {
		$( "#message" ).addClass( "messageFail" );
		document.getElementById("message").innerHTML = "Guide Date can not be a future date!!"; 
		return false;
	}
}

function createGuide(title, loc, date, people, budget, summary){
	var guideInfo = {"title":title, "location": loc, "date": date, "people" : people, "budget": budget,
	"summary" : summary,"dayTitle":daytitleArray,"dayInfo": dayInfoArray}
	var guideInfoJSON = JSON.stringify(guideInfo);
	console.log(guideInfo);
	$.ajax({
			url: 'php/createGuide.php',
			type: 'post',
			data: {"callCreateGuide":guideInfoJSON},
		success: function(data){
			document.getElementById("message").innerHTML = data; 
			console.log(data);
			if (data!=null && data !=""){
				// further styles required
				$( "#message" ).addClass( "messageSucess" );
				//document.getElementById("message").innerHTML = "Create new guide successfully"; 
				// go to the published version of the guide
				window.location.href = "specificGuide.html?id="+data+"&title="+title;
			}else{
				console.log(data);
			}
		},
		error: function(data){
			console.log("error");
		}
	
	});	
}


function updateGuide(id,title, loc, date, people, budget, summary){
	var guideInfo = {"id":id,"title":title, "location": loc, "date": date, "people" : people, "budget": budget,
	"summary" : summary,"dayTitle":daytitleArray,"dayInfo": dayInfoArray}
	var guideInfoJSON = JSON.stringify(guideInfo);
	$.ajax({
			url: 'php/createGuide.php',
			type: 'post',
			data: {"callUpdateGuide":guideInfoJSON},
		success: function(data){
			// further styles required
			$( "#message" ).addClass( "messageSucess" );
			console.log(data);
			document.getElementById("message").innerHTML = data; 
			// go to the published version of the guide
			window.location.href = "specificGuide.html?id="+id+"&title="+title;
		},
		error: function(data){
			console.log("error");
		}
	
	});	
}

function checkDay(value){
	if (value!= null && value !=""){
		return true;
	} else {
		$( "#message" ).addClass( "messageFail" );
		document.getElementById("message").innerHTML = "Day title or description cannot be empty!!"; 
		return false;
	}
}

/*
function createDayInfo(){
	for (var i=0;i<dayList.length;i++){
		var input = $('#'+dayList[i]).children(".form-inline").children("input").val();
		var textArea = $('#'+dayList[i]).children(".form-group").children("textarea").val();
		if (checkDay(input) && checkDay(textArea)){
			daytitleArray.push(input);
			dayInfoArray.push(textArea);
		} else {
			return false;
		}
	}
	return true;
	
}*/

$(document).on("change",'input[type="file"]', function(){
	div = $(this).parent().parent().children(".imagePreview");
	console.log(div.attr('id'));
	div.empty();
	console.log("run");
	if (this.files) {
            var filesAmount = this.files.length;

            for (i = 0; i < filesAmount; i++) {
	
                var reader = new FileReader();

                reader.onload = function(event) {
					$('<div class="preview"></div>').appendTo("#"+div.attr('id'))
					.css({'background-image':'url('+event.target.result+')'});
                }

                reader.readAsDataURL(this.files[i]);
            }
        }
});