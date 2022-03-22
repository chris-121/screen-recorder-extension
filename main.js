window.addEventListener('load', () => {
	startButton = document.querySelector('.start-recording');
	stopButton = document.querySelector('.stop-recording');
	downloadButton = document.querySelector('.download-video');
	recordedVideo = document.querySelector('.recorded-video');
	startButton.addEventListener('click',()=>{

		chrome.runtime.sendMessage({greeting: "starts"}, function(response) {
			console.log(response);
		  })
	}
	)	
	stopButton.addEventListener('click',()=>{
		chrome.runtime.sendMessage({greeting: "stop"}, function(response) {
			console.log(response);
		  })
	});
	chrome.runtime.onMessage.addListener(
		function(request, sender, sendResponse) {
		  if (request.greeting === "save"){
			downloadButton.href=request.downloadButton
			downloadButton.download = 'video.mp4';
			downloadButton.disabled = false;
			downloadButton.classList.remove("disabled")
		  }
			sendResponse({farewell: "goodbye"});
		}
	  );
})