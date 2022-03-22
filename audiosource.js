chrome.runtime.onMessage.addListener(
    async function(request, sender, sendResponse) {
        if(request.greeting==="starts"){

            navigator.mediaDevices.getUserMedia({
                 audio:true
             }).then((res)=>{
                 console.log(res);
                 chrome.runtime.sendMessage({greeting: "start"}, function(response) {
                     console.log(response);
                   })
             })
             sendResponse({message:"hai"})
        }
    });
