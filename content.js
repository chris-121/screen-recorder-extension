function prepareFrame() {
	var ifrm = document.createElement("iframe");
	ifrm.src = chrome.extension.getURL('audiosource.html');
	ifrm.setAttribute("allow", "microphone; camera");
	document.body.appendChild(ifrm);
}
prepareFrame();