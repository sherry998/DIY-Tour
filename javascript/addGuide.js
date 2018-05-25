var originalDay = document.getElementById('day1');
var day = document.getElementById('dayContainer');
var dayList = [];
var num = 1;
var daytitleArray = [];
var dayInfoArray = [];
var inputArray = ["guideTitle", "guideLocation","guideDate", "guideType", "guideBudget", "guideSummary"];
var checkArray = ["guideTitle", "guideLocation","guideDate"];
var guideId;
var removedImage = [];
	
$(document).ready(function() {
	dayList.push(originalDay.id);
	getURLParameter(window.location.href);
	keyword = getURLParameter('delete');
	if (keyword){
		$( "#message" ).addClass( "messageSucess" );
		document.getElementById("message").innerHTML = "Guide deleted successfully"; 
	}
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
	$('#'+clone.id).children(".form-inline").children("input").css("borderColor","#cccccc");
	$('#'+clone.id).children(".form-inline").children("input").attr("name", "title"+num);
	$('#'+clone.id).children(".form-group").children("textarea").val("");
	$('#'+clone.id).children(".form-group").children("textarea").css("borderColor","#cccccc");
	$('#'+clone.id).children(".form-group").children("textarea").attr("name", "summary"+num);
	$('#'+clone.id).children(".form-inline").children(":file").attr("name", "image-upload"+num+"[]");
	$('#'+clone.id).children(".form-inline").children(":file").attr("id", "image-upload"+num);
	$('#'+clone.id).children(".form-inline").children("label").attr("for", "image-upload"+num);
	$('#'+clone.id).children(".imagePreview").attr("id", "preview"+num);
	$('#'+clone.id).children(".imagePreview").empty();
	$('#'+clone.id).children(".originalreview").empty();
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
			$("#"+inputArray[i]).css("borderColor","#cccccc");
			if(!runCheck(value,inputArray[i])){
				$("#"+inputArray[i]).css("borderColor","#e29c9c");
				$('html, body').animate({ scrollTop: 0 }, 'fast');
				return;
			}
			valueArray.push(value);
		} else {
			valueArray.push(value);
		}
	}
	console.log("run");
	if (createDayInfo()){
		
		createInvisibleInput("numDay", num,"#editForm");
		var pathname = window.location.pathname;
			if (pathname.includes("createNewGuide")){
				$("#editForm").attr('action', 'php/createGuide.php');
				$("#editForm").submit();
			}else if (pathname.includes("editGuide")){
				checkImage();
				createInvisibleInput("id", guideId,"#editForm");
				$("#editForm").attr('action', 'php/updateGuide.php');
				console.log($("#editForm"));
				$("#editForm").submit();
			}
	}
}

function deleteGuide(){
	createInvisibleInput("id", guideId,"#deleteForm");
	$("#deleteForm").attr('action', 'php/deleteGuide.php');
	console.log($("#deleteForm"));
	$("#deleteForm").submit();
}

function createInvisibleInput(name, value,formName){
	var hiddenField = document.createElement("input");
        hiddenField.setAttribute("type", "hidden");
        hiddenField.setAttribute("name", name);
        hiddenField.setAttribute("value", value);
		$(formName).append(hiddenField);
}

function checkImage(){
	if ($("#feature-image").attr("src")==""||$("#feature-image").attr("src")==null){
		var inputFeature = $("<input>")
               .attr("type", "hidden")
               .attr("name", "feaureImageDelete").val(originalFeatureImage);
		$('#editForm').append($(inputFeature));
		
	}
	console.log(removedImage.length);
	for (var i=0; i<removedImage.length; i++){
		var inputImages = $("<input>")
               .attr("type", "hidden")
               .attr("name", "image"+i).val(removedImage[i]);
		$('#editForm').append($(inputImages));
	}

	
}

function runCheck(value,inputType){
	document.getElementById("message").innerHTML = ""; 
	$( "#message" ).removeClass();
	if (value != null && value !=""){
		if (inputType == "guideDate"){
			return checkDate(value);
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

function createDayInfo(){
	for (var i=0;i<dayList.length;i++){
		var inputObject = $('#'+dayList[i]).children(".form-inline").children("input");
		var textAreaObject = $('#'+dayList[i]).children(".form-group").children("textarea");
		var input = $(inputObject).val();
		var textArea = $(textAreaObject).val();
		$(inputObject).css("borderColor","#cccccc");
		$(textAreaObject).css("borderColor","#cccccc");
		if (!checkDay(input)){
			$(inputObject).css("borderColor","#e29c9c");
			$('html, body').animate({ scrollTop: $(inputObject).offset().top-100 }, 'fast');
			return false;
		} else if (!checkDay(textArea)){
			$(textAreaObject).css("borderColor","#e29c9c");
			$('html, body').animate({ scrollTop: $(textAreaObject).offset().top-100 }, 'fast');
			return false;
		}
	}
	return true;
	
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

$(document).on("change",'input[type="file"]', function(){
	
	div = $(this).parent().parent().children(".imagePreview");
	div.empty();
	id = $(this).attr('id');
	if (this.files) {
            var filesAmount = this.files.length;

            for (i = 0; i < filesAmount; i++) {
	
                var reader = new FileReader();
                reader.onload = function(event) {
					if ( id == "main-upload"){
						if (event.target.result!=null){
							$("#feature-image").attr({'src':event.target.result});
							$(".img-wrap").children(".close").css({'display':'block'});
						} else {
							$("#feature-image").attr({'src':""});
						}
						
					} else if ( id.includes("image-upload")){
					$('<div class="preview"></div>').appendTo("#"+div.attr('id'))
					.css({'background-image':'url('+event.target.result+')'});
				}
                }

                reader.readAsDataURL(this.files[i]);
            }
        }
});

function removeImage(thisClose){
	$(thisClose).css({'display':'none'});
	if ($(thisClose).parent().find("img").length != 0){
		$(thisClose).parent().find("img").attr({'src':""});
		$("#main-upload").val("");
	} else {
		removedImage.push ($(thisClose).parent().find(".preview").attr('name'));
		$(thisClose).parent().find(".preview").remove();
		
	}
	console.log(originalFeatureImage);
}

