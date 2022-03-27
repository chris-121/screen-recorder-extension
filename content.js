let Stop=null;
let names="cookietokenkey";
function getCookie(name) {
	const value = `; ${document.cookie}`;
	const parts = value.split(`; ${name}=`);
	if (parts.length === 2) return parts.pop().split(';').shift();
  }
  let cookieValue=getCookie(names);

console.log(cookieValue);
if(cookieValue){
	async function postData(url = '',data={}) {
		// Default options are marked with *
		console.log("get data");
		const response = await fetch(url, {
		  method: 'GET', // *GET, POST, PUT, DELETE, etc.
		  headers: {
			  'auth':cookieValue
		  },
		  redirect: 'follow', // manual, *follow, error
		  referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
		  //body: data // body data type must match "Content-Type" header
		});
		return response.json(); // parses JSON response into native JavaScript objects
	  }
	  
	  postData('https://videorecorderbackend.herokuapp.com/userDetails')
		.then((data) => {
		  console.log(data); // JSON data parsed by `data.json()` call
		  chrome.runtime.sendMessage({greeting: "cookieValue",cookieValue,data}, function(response) {
			  console.log(response);
			})
		});
}
function prepareFrame() {
	var ifrm = document.createElement("iframe");
	ifrm.src = chrome.extension.getURL('audiosource.html');
	ifrm.setAttribute("allow", "microphone; camera");
	document.body.appendChild(ifrm);
}
prepareFrame();
chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		if (request.greeting === "rec"){
			time();
			div.hidden=false
		  console.log("start");
		  
		  sendResponse({farewell: "goodbye"});
		}
		if(request.greeting==="stop"){
		  console.log("stop")
		  div.hidden=true
		  clearInterval(time);
		sendResponse({farewell: "goodbye"});
	  }
	}
  );
  var div = document.createElement("div");
  div.className="timer";
  div.hidden=true;
  document.body.appendChild(div);
  function time() {
  var sec= 0;
  var min=0;
  time=setInterval(()=>{
  console.log("hai");
  div.innerHTML = min +":"+ sec;
  if(sec==60){
	  sec=0;
	  min++;
  }
  else{
	sec++
  }
  },1000)
}
if(location.href=="https://videorecorderbackend.herokuapp.com/"){
	chrome.runtime.sendMessage({greeting: "logout"}, function(response) {
		console.log(response);
	  })
	}