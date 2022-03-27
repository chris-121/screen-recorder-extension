route =document.querySelector(".route");
logoutBtn=document.querySelector(".logout");
awsBtn=document.querySelector(".aws");
funcDiv=document.getElementById("func-div");
window.addEventListener('load', () => {
	let value=localStorage.getItem("user")
	if(value){
		document.getElementById('user').innerHTML="Hey "+value
		document.getElementById('user').hidden=false
		logoutBtn.hidden=false
		route.hidden=true
		funcDiv.hidden=false;
	}
	startButton = document.querySelector('.start-recording');
	stopButton = document.querySelector('.stop-recording');
	downloadButton = document.querySelector('.download-video');
	recordedVideo = document.querySelector('.recorded-video');
	let linkDiv=document.getElementById("link-div")
	  
	route.addEventListener('click',()=>{
		chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
			chrome.tabs.update(tabs[0].id,{url:"https://videorecorderbackend.herokuapp.com/loginSuccess" },()=>{
				console.log("url updated");
			})
		  });
	})
	logoutBtn.addEventListener('click',()=>{
		chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
			chrome.tabs.update(tabs[0].id,{url:"https://videorecorderbackend.herokuapp.com/logout" },()=>{
				console.log("url updated");
			})
		  });
	})
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
	awsBtn.addEventListener('click',()=>{
		let cookieValue=localStorage.getItem('cookie')
		chrome.runtime.sendMessage({greeting: "aws",cookieValue}, function(response) {
			console.log(response);
		  })
	})
	downloadButton.addEventListener('click',()=>{
		document.getElementById("recording").hidden=true;
		document.getElementById("stop-rec").hidden=true;
		document.getElementById('aws-text').hidden=true;
		document.getElementById("save-rec").hidden=false;
	})
	chrome.runtime.onMessage.addListener(
		function(request, sender, sendResponse) {
		  if (request.greeting === "save"){
			awsBtn.disabled=false;
			downloadButton.href=request.downloadButton
			downloadButton.download = 'video.mp4';
			downloadButton.disabled = false;
			downloadButton.classList.remove("disabled")
			sendResponse({farewell: "goodbye"});
		  }
			if(request.greeting==="link"){
				let link=document.getElementById("link")
				link.innerText=request.data
				link.href=request.data
				linkDiv.hidden=false;
				console.log("link working");
				document.getElementById("recording").hidden=true;
				document.getElementById("stop-rec").hidden=true;
				document.getElementById("save-rec").hidden=true;
				document.getElementById('aws-text').hidden=false;
			}
			if(request.greeting=="cookieValue"){
				console.log(request);
				var email = request.data.email;
				var name = email.substring(0, email. lastIndexOf("@"));
				localStorage.setItem('user',name)
				localStorage.setItem('cookie',request.cookieValue)
				value=localStorage.getItem('user')
				document.getElementById('user').innerHTML="Hey "+value
				document.getElementById('user').hidden=false
				logoutBtn.hidden=false
				route.hidden=true
				funcDiv.hidden=false;
				document.getElementById('login-success').hidden=false;

				setTimeout(()=>{
					document.getElementById('login-success').hidden=true;
				},3000)
			}
			if(request.greeting=="rec"){
				document.getElementById("recording").hidden=false;
				document.getElementById('aws-text').hidden=true;
				document.getElementById("save-rec").hidden=true;
				document.getElementById("stop-rec").hidden=true;
			}
			if(request.greeting=="rec-stop"){
				document.getElementById("recording").hidden=true;
				document.getElementById('aws-text').hidden=true;
				document.getElementById("save-rec").hidden=true;
				document.getElementById("stop-rec").hidden=false;
			}
			if(request.greeting=="logout"){
				localStorage.removeItem('cookie');
				localStorage.removeItem('user');
			}
		}
	  );

})