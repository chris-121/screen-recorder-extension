navigator.mediaDevices.getUserMedia(
	{ 
		audio: { echoCancellation: true } 
	}).then((audio) => { 
		chrome.runtime.sendMessage({ from: 'success'},(res)=>{
			console.log(audio);
		})
	})

