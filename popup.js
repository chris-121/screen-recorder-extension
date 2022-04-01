var bgpage = chrome.extension.getBackgroundPage();
var Interval;
var seconds=0,mins=0,hours=0;
var tabid;
window.addEventListener('load', () => {
	signUpBtn =document.querySelector(".sign-up");
	homeBtn=document.querySelector(".home");
	awsBtn=document.querySelector(".aws");
	funcDiv=document.getElementById("func-div");
	link=document.getElementById("link")
	load();
//	let value=localStorage.getItem("user")
//	if(value){
//		document.getElementById('user').innerHTML="Hey "+value
//		document.getElementById('user').hidden=false
//		logoutBtn.hidden=false
//		signUpBtn.hidden=true
//		funcDiv.hidden=false;
//	}
	startButton = document.querySelector('.start-recording');
	stopButton = document.querySelector('.stop-recording');
	downloadButton = document.querySelector('.download-video');
	recordedVideo = document.querySelector('.recorded-video');
	let linkDiv=document.getElementById("link-div")
	function load(){
		console.log("function called");
		bgpage.checkUser();
	}
	  
	signUpBtn.addEventListener('click',()=>{
		chrome.tabs.create({ url: "https://videorecorderbackend.herokuapp.com" });
	})
	homeBtn.addEventListener('click',()=>{
		chrome.tabs.create({ url: "https://videorecorderbackend.herokuapp.com" });
//detele token from storage and change status
	})
	startButton.addEventListener('click',()=>{
		linkDiv.hidden=true;
		document.getElementById('aws-text').hidden=true;
		chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
			tabid=tabs[0].id;
			chrome.tabs.sendMessage(tabs[0].id, {greeting: "start-content",tabid}, function(response) {
			  console.log(response.farewell);
			});
		  });
	}
	)	
	stopButton.addEventListener('click',()=>{
		console.log(tabid);
		chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
			chrome.tabs.sendMessage(tabid, {greeting: "stopss"}, function(response) {
			  console.log(response.farewell);
			});
		  });
	});
	awsBtn.addEventListener('click',()=>{
		//let cookieValue=localStorage.getItem('cookie')
		document.getElementById('save-rec').hidden=true;
		document.getElementById('stop-rec').hidden=true;
		document.getElementById('aws-text').innerHTML="Uploading";
		document.getElementById('aws-text').hidden=false
		chrome.runtime.sendMessage({greeting: "aws"}, function(response) {
			console.log(response);
		  })
	})
	downloadButton.addEventListener('click',()=>{
		document.getElementById("timer").hidden=true;
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
				link.innerText=request.awsLink
				link.href=request.awsLink
				linkDiv.hidden=false;
				console.log("link working");
				document.getElementById("timer").hidden=true;
				document.getElementById("stop-rec").hidden=true;
				document.getElementById("save-rec").hidden=true;
				document.getElementById('aws-text').innerHTML="Uploaded to AWS";
				document.getElementById('aws-text').hidden=false
				document.getElementById('progress-bar').hidden=false;
			}
			if(request.greeting==="uploadPercentage"){
				console.log(request.percent_completed);
				var percentage=Math.round(request.percent_completed)
				document.getElementById('progress-bar').hidden=false;
				document.getElementById('progress').style.width=percentage+"%"
				document.getElementById('progress').innerHTML=percentage+"% completed"
			}
	//		if(request.greeting=="cookieValue"){
	//			console.log(request);
	//			var email = request.data.email;
	//			var name = email.substring(0, email. lastIndexOf("@"));
	//			localStorage.setItem('user',name)
	//			localStorage.setItem('cookie',request.cookieValue)
	//			value=localStorage.getItem('user')
	//			document.getElementById('user').innerHTML="Hey "+value
	//			document.getElementById('user').hidden=false
	//			logoutBtn.hidden=false
	//			signUpBtn.hidden=true
	//			funcDiv.hidden=false;
	//			document.getElementById('login-success').hidden=false;
//
//				setTimeout(()=>{
///					document.getElementById('login-success').hidden=true;
	//			},3000)
	//		}
			if(request.greeting=="rec"){
				clearInterval(Interval);
				Interval=setInterval(startTimer,1000);
				startButton.disabled=true;
				stopButton.disabled=false;
				document.getElementById("timer").hidden=false;
				document.getElementById('aws-text').hidden=true;
				document.getElementById("save-rec").hidden=true;
				document.getElementById("stop-rec").hidden=true;
			}
			if(request.greeting=="rec-stop"){
				clearInterval(Interval);
				seconds=0,mins=0,hours=0;
				startButton.disabled=false;
				stopButton.disabled=true;
				document.getElementById("timer").hidden=true;
				document.getElementById('aws-text').hidden=true;
				document.getElementById("save-rec").hidden=true;
				document.getElementById("stop-rec").hidden=false;
			}
			if(request.greeting=="checkUser"){
				console.log(request);
				if(request.cookieValue){
					console.log(request);
					tabid=request.tabid;
					var email = request.user.email;
					var name = email.substring(0, email. lastIndexOf("@"));
					document.getElementById('user').innerHTML="Hey "+name
					document.getElementById('user').hidden=false
					homeBtn.hidden=false
					signUpBtn.hidden=true
					funcDiv.hidden=false;
					if(request.recordingStatus){
						startButton.disabled=true;
						stopButton.disabled=false;	
						seconds=request.seconds;
						mins=request.mins;
						hours=request.hours;
						startTimer();
						clearInterval(Interval);
						Interval=setInterval(startTimer,1000);
						document.getElementById("timer").hidden=false;
					}else
					stopButton.disabled=true;
					if(request.isUploading){
						document.getElementById('aws-text').hidden=false
						document.getElementById('aws-text').innerHTML="Uploading";
						document.getElementById('progress-bar').hidden=false;
					}
					if(request.awsLink){
						link.innerText=request.awsLink
						link.href=request.awsLink
						linkDiv.hidden=false;
						document.getElementById('aws-text').hidden=false
						document.getElementById('aws-text').innerHTML="Uploaded to AWS";
					}
					if(request.blob){
						awsBtn.disabled=false;
						if(request.isUploaded){
							awsBtn.disabled=true;
						}
					}
					if(request.downloadButton){
						downloadButton.href=request.downloadButton;
						downloadButton.download = 'video.mp4';
						downloadButton.disabled = false;
						downloadButton.classList.remove("disabled")
					}
				}
			}
		}
	  );
	  function startTimer () {
		seconds++; 
		
		if(seconds <= 9){
		  document.getElementById('seconds').innerHTML = "0" + seconds;
		}
		
		if (seconds > 9){
			document.getElementById('seconds').innerHTML = seconds;
		  
		} 
		
		if (seconds > 59) {
		  console.log("seconds");
		  mins++;
		  document.getElementById('mins').innerHTML = "0" + mins;
		  seconds = 0;
		  document.getElementById('seconds').innerHTML = "0" + 0;
		}
		
		if (mins > 9){
			document.getElementById('mins').innerHTML = mins;
		}
		if(mins>59){
			hours++;
			document.getElementById('hours').innerHTML = "0" + hours;
			mins = 0;
			document.getElementById('mins').innerHTML = "0" + 0;
		}
		if (hours > 9){
			document.getElementById('hours').innerHTML = mins;
		}
	  
	  }
	  

})