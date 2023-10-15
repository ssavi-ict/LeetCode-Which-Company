function checkFullOrPartialURL(url, json_response){
	const splitBySlash = url.split('/');
	let reformed_url = "";
	for(var i=0; i<splitBySlash.length; i++){
		reformed_url += splitBySlash[i];
		if(json_response[reformed_url]) break;
		reformed_url += '/';
		if(json_response[reformed_url]) break;
	}
	return reformed_url;
}

async function leetcode_company(){
	chrome.tabs.query({active: true, lastFocusedWindow: true}, async (tabs) => {
		/*document.write(`<h3>The tabs you're on are:</h3>`);
		document.write('<ul>');
		document.write(`<li>${tabs[0].url}</li>`);
		document.write('</ul>');*/
		let url = tabs[0].url;
		if (url.startsWith("http://")) {
			url = url.replace("http://", "https://");
		}

		if (url.startsWith("https://leetcode.cn/")) {
			url = url.replace("https://leetcode.cn/", "https://leetcode.com/");
		}
		
		if (url.includes("leetcode")){
			const requestURL = 'https://raw.githubusercontent.com/ssavi-ict/LC-Which-Company/main/data/company_info.json';
			const request = new Request(requestURL);
			const response = await fetch(request);
			const json_response = await response.json();

			let theReformedURL = checkFullOrPartialURL(url, json_response);
		
			if(json_response [theReformedURL]){
				const company_list_elem = json_response[theReformedURL];
				const sorted = company_list_elem.slice(1); // .sort((a, b) => a.length - b.length);
				const companies = [company_list_elem[0]].concat(sorted);
				

				let length = companies.length;
				let problem_name = ("<h3 style='text-align:center;border-bottom: 2px solid black;background-image: linear-gradient(45deg, red, orange, green, blue, indigo, violet); -webkit-background-clip: text; -webkit-text-fill-color: transparent;'>Problem Name : ");
				let text = "<center><p>";
				
				for (let i=0; i<length; i++){
					if(i === 0){
						problem_name += companies[i] + "</h3>";
					}
					else{
						text += "<p style='display: inline-block; border-radius: 2px; margin-bottom:5px;border: 1px solid; border-image: linear-gradient(to right, red, orange, yellow, green, blue, indigo, violet);border-image-slice: 1;'>&nbsp;<b>" + companies[i];
						if(i <= 5) {
							text += " <sup>&#10031;</sup>"; 
						}
						text += "&nbsp; </b></p>&nbsp;";
					}
				}
				text += "</p></center>";
				document.getElementById("main-content").innerHTML = problem_name + text;
			}
			else{
				let text = "<center><p>";
				text += "<p style='display: inline-block; border-radius: 2px; margin-bottom:5px; font-size:14px;'>&nbsp;<b>";
				text += "Could not locate any Company information for this problem.<br><br>We are looking into collecting company information.<br>We will update soon once we have it.<br><br>";
				text += "</p></center>";
				document.getElementById("main-content").innerHTML = text;
			}
		}
		else{
			let text = "<center><p>";
			text += "<p style='display: inline-block; border-radius: 2px; margin-bottom:5px; font-size:14px;'>&nbsp;<b>";
			text += "This is a Non-LeetCode Website.";
			text += "</b></p>&nbsp;";
			text += "</p></center>";
			document.getElementById("main-content").innerHTML = text;
		}
	});
}

leetcode_company();