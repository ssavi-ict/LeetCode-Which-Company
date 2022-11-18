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


chrome.tabs.query({active: true, lastFocusedWindow: true}, async (tabs) => {
	/*document.write(`<h3>The tabs you're on are:</h3>`);
	document.write('<ul>');
	document.write(`<li>${tabs[0].url}</li>`);
	document.write('</ul>');*/
	let url = tabs[0].url;
	if (url.includes("leetcode")){
		const requestURL = 'https://gist.githubusercontent.com/ssavi-ict/83113f27f45dd4c31c173e0c23952397/raw/469e3632dc06be36d96bd66f4c1b6c54d5004fdf/lc_data.json';
		const request = new Request(requestURL);
		const response = await fetch(request);
		const json_response = await response.json();

		let theReformedURL = checkFullOrPartialURL(url, json_response);
	
		if(json_response [theReformedURL]){
			const companies = json_response[theReformedURL];
			let length = companies.length;
			let problem_name = ("<h3 style='text-align:center;padding-bottom: 10px;border-bottom: 2px solid black;'>Problem Name : ");
			let text = "<ul style='list-style-type: none;margin-left: -40px;'>";
			for (let i=0; i<length; i++){
				if(i === 0){
					problem_name += companies[i] + "</h3>";
				}
				else{
					text += "<li style='display: inline-block;'> &nbsp;" + companies[i];
					if(i < length-1) text += ",";
					text += "</li>";
				}
			}
			text += "</ul><br><br>";
			document.write(problem_name);
			document.write(text);
		}
		else{ 
			document.write(`<h3 style='margin-top: 50px; text-align: center;'>Sorry! Information Not Found.</h3>`);
		}
	}
	else{
		document.write(`<h3 style='margin-top: 50px; text-align: center;'>Sorry! I can only parse LeetCode site.</h3>`);
	}
});


/*async function leetcode_company(){
	
}

leetcode_company();*/