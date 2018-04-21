var originalDay = document.getElementById('day1');
var day = document.getElementById('dayContainer');
var dayList = [];
var num = 1;
	
$(document).ready(function() {
	dayList.push(originalDay.id);
});

function duplicate() {
	//https://stackoverflow.com/questions/4427094/how-can-i-duplicate-a-div-onclick-with-javascript
    var clone = originalDay.cloneNode(true); // "deep" clone
    clone.id = "day" + ++num;
	dayList.push(clone.id);
    day.appendChild(clone);
	$('#'+clone.id).children("h2").text("Day " + num);
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
	console.log("run");
	for (var i=0;i<dayList.length;i++){
		$('#'+dayList[i]).children("h2").text("Day " + (i+1));
		$('#'+dayList[i]).attr('id', "day"+ (i+1));
		dayList[i] = "day"+ (i+1);
	}
	num = dayList.length;
}