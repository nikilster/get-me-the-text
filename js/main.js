$(document).ready(function(){
	
	var FILE_FIELD_SELECTOR = "#uploadField"
	var FORM_SELECTOR = "#fileUploadForm";


	//On File Selection
	$(FILE_FIELD_SELECTOR).change(function(e){

		$(FORM_SELECTOR).ajaxSubmit(function(data) {
			console.log("Submitted!");
			console.log(data);
		})
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