var originalDay = document.getElementById('day1');
var day = document.getElementById('dayContainer');
var dayList = [];
var num = 1;
var daytitleArray = [];
var dayInfoArray = [];
var inputArray = ["guideTitle", "guideLocation","guideDate", "guideType", "guideBudget", "guideSummary"];
var checkArray = ["guideTitle", "guideLocation","guideDate"];
	
$(document).ready(function() {
	dayList.push(originalDay.id);
});

function duplicate() {
	//https://stackoverflow.com/questions/4427094/how-can-i-duplicate-a-div-onclick-with-javascript
    var clone = originalDay.cloneNode(true); // "deep" clone
    clone.id = "day" + ++num;
	dayList.push(clone.id);
    day.appendChild(clone);
	$('#'+clone.id).children("h3").children("b").text("Day " + num);
	// clean value
	$('#'+clone.id).children(".form-inline").children("input").val("");
	$('#'+clone.id).children(".form-group").children("textarea").val("");
}

//https://stackoverflow.com/questions/15420558/jquery-click-event-not-working-after-append-method
//Use the .on() method to delegate the click event to (future) elements dynamically added to the DOM
$('#dayContainer').on('click', '.delete',function(){
	var deletedDay =$(this).parent(); 
	dayList.splice(dayList.indexOf(deletedDay.attr('id')),1);
	deletedDay.remove();
	updateDayInfo();
});

function updateDayInfo(){
	//console.log("run");
	for (var i=0;i<dayList.length;i++){
		$('#'+dayList[i]).children("h3").text("Day " + (i+1));
		$('#'+dayList[i]).attr('id', "day"+ (i+1));
		dayList[i] = "day"+ (i+1);
	}
	num = dayList.length;
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
	
	console.log(valueArray);
	if(createDayInfo()){
		createGuide(valueArray[0],valueArray[1],valueArray[2],valueArray[3],valueArray[4],valueArray[5]);
	}
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
	$.ajax({
			url: 'php/createGuide.php',
			type: 'post',
			data: {"callCreateGuide":guideInfoJSON},
		success: function(data){
			// further styles required
			$( "#message" ).addClass( "messageSucess" );
			document.getElementById("message").innerHTML = "Create new guide successfully"; 
			// go to the published version of the guide
			window.location.href = "specificGuide.html?id="+data+"&title="+title;
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

function createDayInfo(){
	for (var i=0;i<dayList.length;i++){
		var input = $('#'+dayList[i]).children("input").val();
		var textArea = $('#'+dayList[i]).children("textarea").val();
		if (checkDay(input) && checkDay(textArea)){
			daytitleArray.push(input);
			dayInfoArray.push(textArea);
		} else {
			return false;
		}
	}
	return true;
	
}