<?php

	//Constants
	$DEBUG = false;
	
	$IMAGE_FOLDER = "images/";
	$TEXT_FOLDER = "text/";
	$TESSERACT_BASE_COMMAND = "/usr/local/bin/tesseract ";
	
	$FILE_INPUT_NAME = "image";
	$FILE_INFO = $_FILES[$FILE_INPUT_NAME];

	//Process the Image
	processFile();

	//Main Function
	function processFile()
	{
		list($filename, $filepath) = saveFile();
		$text = getImageText($filename, $filepath);
		returnText($text);
	}

	//Save the file
	function saveFile()
	{
		//Global Constants
		global $IMAGE_FOLDER, $FILE_INFO;

		//Give it a random name
		list($originalFilename, $extension) = getOriginalFilenameAndExtension();

		//New Filename
		//Hash to differentiate
		//image/form-oaihfowiefhawe.png
		$filename = $originalFilename . "-" . md5(strval(time())) . "." . $extension;
		$filepath = $IMAGE_FOLDER . $filename;

		//Save the file
		$tempPictureFile = $FILE_INFO['tmp_name'];
		$moveResult = move_uploaded_file($tempPictureFile, $filepath);

		return array($filename, $filepath);

	}


	//Get the original filename and extension
	function getOriginalFilenameAndExtension()
	{
		global $FILE_INFO;
		$filenameAndExtension = $FILE_INFO['name'];
		$filePieces = explode(".", $filenameAndExtension);

		//Extension is the last piece
		$extension = end($filePieces);

		//Filename is the rest of it
		array_pop($filePieces);
		$filename = join(".", $filePieces);

		//Return Both
		return array($filename, $extension);
	}

	//Process the file and get the text
	function getImageText($inputFilename, $inputFilepath)
	{
		//Global
		global $DEBUG, $TEXT_FOLDER, $TESSERACT_BASE_COMMAND;

		//Output
		//Filename is the name without the path
		$OUTPUT_BASE = $TEXT_FOLDER . $inputFilename;
		$OUTPUT_FILE = $OUTPUT_BASE . ".txt";
		
		//Start Timer
		$timeBefore = microtime(true);
	

		//Run Image Processing!
		//Quotes to handle filenames with spaces
		//TODO: remove any single or double quotes in the name
		$command = "$TESSERACT_BASE_COMMAND '$inputFilepath' '$OUTPUT_BASE'";
		exec($command, $output, $ret);

		//Prints!
		if($DEBUG) {
			print_r($output);
			print_r("<br/><br/>");
			print_r($ret);
		}

		$timeAfter = microtime(true);
		$totalTime = $timeAfter - $timeBefore;

		if($DEBUG)
			echo "<br/><br/>Took $totalTime seconds!";

		$text = file_get_contents($OUTPUT_FILE);

		return $text;
	}

	//Print
	function returnText($text)
	{
		echo $text;
		//echo nl2br($text);
	}
?>