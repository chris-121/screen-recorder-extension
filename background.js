let stream = null,
	audio = null,
	mixedStream = null,
	chunks = [], 
	recorder = null,
	downloadButton = null,
	recordedVideo = null;
	chrome.runtime.onMessage.addListener(
		async function(request, sender, sendResponse) {
				if (request.greeting === "start"){
					console.log("start");
							startRecording();
							  sendResponse({message:"start"})
				  }
				  if (request.greeting === "stop"){
					  console.log("stop");
			  
					  stopRecording();
					  sendResponse({message:"stop"})
				  }
			return true
	});
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
	console.log("start recording");
	await setupStream();

	if (stream && audio) {
		mixedStream = new MediaStream([...stream.getTracks(), ...audio.getTracks()]);
		recorder = new MediaRecorder(mixedStream);
		recorder.ondataavailable = handleDataAvailable;
		recorder.onstop = handleStop;
		recorder.start(1000);
	
		console.log('Recording started');
	} else {
		console.warn('No stream available.');
	}
}

function stopRecording () {
	recorder.stop();
}

function handleDataAvailable (e) {
	chunks.push(e.data);
}

function handleStop (e) {
	const blob = new Blob(chunks, { 'type' : 'video/mp4' });
	chunks = [];

	downloadButton = URL.createObjectURL(blob);
	chrome.runtime.sendMessage({greeting: "save",downloadButton}, function(response) {
		console.log(response);
	  })

	stream.getTracks().forEach((track) => track.stop());
	audio.getTracks().forEach((track) => track.stop());

	console.log('Recording stopped');
}