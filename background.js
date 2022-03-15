chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {

        if (request.from === "success"){
  
        navigator.mediaDevices.getUserMedia(
            { 
                audio: { echoCancellation: true } 
            }).then((e) => { sendResponse({e}) }
      )
        }
    });