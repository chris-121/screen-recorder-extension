chrome.runtime.onMessage.addListener(
    async function(request, sender, sendResponse) {
        if(request.greeting==="audiosource"){
            var tabid=request.tabid

            navigator.mediaDevices.getUserMedia({
                 audio:true
             }).then((res)=>{
                 console.log(res);
                 chrome.runtime.sendMessage({greeting: "start",tabid}, function(response) {
                     console.log(response);
                   })
             })
             sendResponse({message:"hai"})
        }
    });
