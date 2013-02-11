$(document).ready(function(){
	
	/*
		Set up Drag and Drop
		Learned from: http://html5demos.com/dnd-upload
	*/
	
	var DROP_TARGET_ID = "fileUpload";
	var DROP_TARGET_SELECTOR = "#" + DROP_TARGET_ID;
	var DROP_TARGET_HOVER_CLASS = "hover";
	var PREVIEW_IMAGE_CLASS = "previewImage";
	var FORM_DATA_KEY = 'image';
	var TRANSLATION_DIV_SELECTOR = ".paper-main_translation textarea";

	var browserTests = {
		filereader: typeof FileReader != 'undefined',
		dnd: 'draggable' in document.createElement('span'),
		formdata: !!window.FormData,
		progress: "upload" in new XMLHttpRequest
	};
	

	//Tests
	if(!browserTests.formdata) alert("Please use the latest Chrome or Firefox!");

	//If browser supports drag and drop
	if(browserTests.dnd) {

		//The div
		//Get the dom object
		//var dropTarget = $(DROP_TARGET_SELECTOR)[0];
		var dropTarget = document.getElementById(DROP_TARGET_ID);

		//When dragging over div
		dropTarget.ondragover = function() {
		
			//Visual Indication
			$(DROP_TARGET_SELECTOR).addClass(DROP_TARGET_HOVER_CLASS);

			//Prevent Default?
			return false;
		};

		//Drag Stopped
		dropTarget.ondragleave = function () {

			//Remove Hover
			$(DROP_TARGET_SELECTOR).removeClass(DROP_TARGET_HOVER_CLASS);

			return false;
		};

		//Dropped!
		dropTarget.ondrop = function(e) {
			
			//Remove Hover
			$(DROP_TARGET_SELECTOR).removeClass(DROP_TARGET_HOVER_CLASS);

			//Don't allow default - redirect browser / open
			e.preventDefault();

			//Process file
			handleFile(e.dataTransfer.files);
		};
		
	}

	/* Handle Files! */
	function handleFile(files) {

		//TODO: Handle multiple files? 
		//Only use the first file for now
		var firstFile = files[0];

		//Make sure we a valid image file
		//if(!validFileType(firstFile)) return;

		//We know they have form data here!
		//Create new formdata
		var formData = new FormData();
		formData.append(FORM_DATA_KEY, firstFile);

		//Show preview
		showPreview(firstFile);

		//Submit
		analyze(formData);
	}

	/*
		Show Preview
	*/
	function showPreview(file) {

		var reader = new FileReader();
		
		reader.onload = function(event) {
			createPreview(event.target.result);
		};

		reader.readAsDataURL(file);
	}

	/*
		Set up preview
	*/
	function createPreview(imageSrc)
	{

		//Create Image
		var image = $('<img/>', {
			src: imageSrc,
			"class": PREVIEW_IMAGE_CLASS
		});

		//Add
		var dropTarget = $(DROP_TARGET_SELECTOR);
		dropTarget.after(image);

		//Hide fileuplaod
		dropTarget.hide();
	}


	function analyze(formData)
	{
		console.log(formData);

		var xhr = new XMLHttpRequest();
		//http://dev.opera.com/articles/view/xhr2/
		xhr.addEventListener('load', function(e) {
			
			var response = event.target.response;
			console.log(response);

			handleReponse(response);
		}, false);
		
		//Run
		xhr.open('POST', 'processImage.php');
		xhr.send(formData);


		/*
		$.post("processImage.php", [formData], function(data, textStatus, jqXHR) {
			console.log("Success!");
			console.log(data);
			console.log(textStatus);
			console.log(jqXHR);
		});*/
		/*
		$.ajax({
			url: "processImage.php",
			type: "POST",
			data: formData,
			processData: false, // tell jQuery not to process the data
			contentType: false,  // tell jQuery not to set the content Type
			success: function(data) {
				console.log("Success!");
				console.log(data);
			}
		});*/
	}

	function handleReponse(response) {

		$(TRANSLATION_DIV_SELECTOR).html(response);
	}

	var FILE_FIELD_SELECTOR = "#uploadField";
	var FORM_SELECTOR = "#fileUploadForm";


	//On File Selection
	$(FILE_FIELD_SELECTOR).change(function(e){

		$(FORM_SELECTOR).ajaxSubmit(function(data) {
			console.log("Submitted!");
			console.log(data);
		});
		/*
		var formData = new FormData($(FORM_SELECTOR));
	
		$.ajax({
			url: "processImage.php",
			type: "POST",
			data: formData,
			processData: false, // tell jQuery not to process the data
			contentType: false,  // tell jQuery not to set the content Type
			success: function(data) {
				console.log("Success!");
				console.log(data);
			}
		});
		*/
	})
});