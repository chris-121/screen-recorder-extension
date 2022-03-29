let stream = null,
	audio = null,
	mixedStream = null,
	chunks = [], 
	recorder = null,
	downloadButton = null,
	recordedVideo = null,
	cookieValue=null,
	recordingStatus=null,
	user=null,
	blob=null;
	tabid=null;
	var seconds = 00; 
	var mins = 00; 
	var hours=00;
	var tabid;
	var Interval
	chrome.runtime.onMessage.addListener(
		async function(request, sender, sendResponse) {
				if (request.greeting === "start"){
					tabid=request.tabid;
					console.log("start");
					startRecording();
					
							  sendResponse({message:"start"})
				  }
				  if (request.greeting === "stop"){
					  console.log("stop");
					  recordingStatus=false;
			  
					  stopRecording();
					  sendResponse({message:"stop"})
				  }
				  if(request.greeting=="cookieValue"){
					cookieValue=request.cookieValue
					user=request.data
				  }
				  if(request.greeting=="logout"){
					  console.log("logout");
					cookieValue=null;
					user=null;
				}
				  if(request.greeting=="aws"){
					uploadToAws();
				  }
			return true
	});
	function checkUser(){
		console.log("check user");
		chrome.runtime.sendMessage({greeting: "checkUser",cookieValue,user,recordingStatus,blob,downloadButton,hours,mins,seconds,tabid}, function(response) {
			console.log(response);
		  })
	}
	async function setupStream () {
		try {
			stream = await navigator.mediaDevices.getDisplayMedia({
				video:true
			});
			audio=await navigator.mediaDevices.getUserMedia({
				audio:true
			})
        } catch (err) {	
		console.error(err)
	}
}
async function startRecording () {
	await setupStream();

	if (stream && audio) {
		mixedStream = new MediaStream([...stream.getTracks(), ...audio.getTracks()]);
		recorder = new MediaRecorder(mixedStream);
		recorder.ondataavailable = handleDataAvailable;
		recorder.onstop = handleStop;
		recorder.start(1000);
		console.log('Recording started');
		chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
			tabid=tabs[0].id;
			chrome.tabs.sendMessage(tabs[0].id, {greeting: "rec"}, function(response) {
			  console.log(response.farewell);
			});
		  });
		  recordingStatus=true;
		chrome.runtime.sendMessage({greeting: "rec"}, function(response) {
			console.log(response);
		  })
		  clearInterval(Interval);
		  Interval = setInterval(startTimer, 1000);
	} else {
		console.warn('No stream available.');
	}
}

function stopRecording () {
	recorder.stop();
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {

		chrome.tabs.sendMessage(tabid, {greeting: "stop"}, function(response) {
		  console.log(response.farewell);
		});
	  });
	chrome.runtime.sendMessage({greeting: "rec-stop"}, function(response) {
		console.log(response);
	  })
	  clearInterval(Interval);
	  seconds=0,mins=0;hours=0;
}

function handleDataAvailable (e) {
	chunks.push(e.data);
}

function handleStop (e) {
	console.log(hours,":",mins,":",seconds);
	blob = new Blob(chunks, { 'type' : 'video/mp4' });
	chunks = [];
	console.log(blob);
	downloadButton = URL.createObjectURL(blob);
  
	chrome.runtime.sendMessage({greeting: "save",downloadButton}, function(response) {
		console.log(response);
	  })

	stream.getTracks().forEach((track) => track.stop());
	audio.getTracks().forEach((track) => track.stop());

	console.log('Recording stopped');
}
function uploadToAws(){
	var fd = new FormData();
	fd.append('video', blob, 'video.mp4');
	// Example POST method implementation:
async function postData(url = '', data) {
	// Default options are marked with *
	console.log("post data");
	const response = await fetch(url, {
	  method: 'POST', // *GET, POST, PUT, DELETE, etc.
	  headers: {
		  'auth':cookieValue
	  },
	  redirect: 'follow', // manual, *follow, error
	  referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
	  body: data // body data type must match "Content-Type" header
	});
	return response.json(); // parses JSON response into native JavaScript objects
  }
  
  postData('https://videorecorderbackend.herokuapp.com/uploadVideo',fd)
	.then(data => {
	  console.log(data); // JSON data parsed by `data.json()` call
			chrome.runtime.sendMessage({greeting: "link",data}, function(response) {
			console.log(response);
		  })
	});
}
function startTimer () {
    seconds++;  
    if (seconds > 59) {
      console.log("seconds");
      seconds = 0;
	  mins++
    }
	if(mins>59){
		mins=0;
		hours++;
	}
  
  }
  