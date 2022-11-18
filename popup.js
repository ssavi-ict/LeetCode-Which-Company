chrome.tabs.query({windowId: chrome.windows.WINDOW_ID_CURRENT}, (tabs) => {
	document.write(`<h3>The tabs you're on are:</h3>`);
	document.write('<ul>');
	for (let i = 0; i < tabs.length; i++) {
	  document.write(`<li>${tabs[i].url}</li>`);
	}
	document.write('</ul>');
  });