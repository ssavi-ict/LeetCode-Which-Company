// Replace 'data.json' with the path to your JSON file
document.addEventListener('DOMContentLoaded', function () {
	fetch('https://raw.githubusercontent.com/ssavi-ict/LeetCode-Which-Company/main/data/contests.json')
		.then(response => response.json())
		.then(data => {
			const contestTable = document.getElementById('contestTable');
			const currentEpoch = Math.floor(Date.now() / 1000); // Get current time epoch
			
			Object.keys(data).forEach(key => {
				const contest = data[key];
				const startEpoch = contest.start_time;
				if (currentEpoch > startEpoch){
					return;
				}				
				const row = document.createElement('tr');
				const nameCell = document.createElement('td');
				const startDateCell = document.createElement('td');
				const startTimeCell = document.createElement('td');
				const durationCell = document.createElement('td');

				const nameLink = document.createElement('a');
				const contestURL = "https://leetcode.com/contest/" + key;
				nameLink.href = contestURL;
				nameLink.textContent = contest.title;
				nameLink.target = "_blank"
				nameCell.appendChild(nameLink);

				const startDate = new Date(contest.start_time * 1000);
				const startDateString = startDate.toLocaleDateString();
				startDateCell.textContent = startDateString;

				const localTimeString = getLocalTime(startDate);
				const gmtOffset = getGMTOffset(startDate);
				startTimeCell.innerHTML = `${localTimeString} <span class="gmt-offset">${gmtOffset}</span>`;

				const contestDuration = contest.contest_duration;
				const hours = Math.floor(contestDuration / 3600);
				const minutes = Math.floor((contestDuration % 3600) / 60);
				const durationString = `${hours}h ${minutes}m`;
				durationCell.textContent = durationString;

				row.appendChild(nameCell);
				row.appendChild(startDateCell);
				row.appendChild(startTimeCell);
				row.appendChild(durationCell);

				contestTable.appendChild(row);
			});

			chrome.storage.local.get('switchState', function(result) {
				const switchState = result.switchState;
			  
				const notificationCheckbox = document.getElementById('notificationCheckbox');
				const switchStatus = document.getElementById('switchStatus');
			  
				if (switchState) {
				  notificationCheckbox.checked = true;
				  switchStatus.textContent = 'Turned On';
				} else {
				  notificationCheckbox.checked = false;
				  switchStatus.textContent = 'Turned Off';
				}
			});
			  
		})
		.catch(error => console.error(error));
		
	const notificationCheckbox = document.getElementById('notificationCheckbox');
	const switchStatus = document.getElementById('switchStatus');

	notificationCheckbox.addEventListener('change', () => {
		const isChecked = notificationCheckbox.checked;
		if (isChecked) {
		  switchStatus.textContent = 'Turned On';
		  chrome.storage.local.set({ switchState: isChecked });
		} else {
		  switchStatus.textContent = 'Turned Off';
		  chrome.storage.local.set({ switchState: isChecked });
		}
	  });

	function getLocalTime(date) {
		const localOptions = {
			hour: '2-digit',
			minute: '2-digit',
			timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
		};

		return date.toLocaleTimeString([], localOptions);
	}

	function getGMTOffset(date) {
		const offset = date.getTimezoneOffset();
		const sign = offset < 0 ? "+" : "-";
		const hours = Math.floor(Math.abs(offset) / 60);
		const minutes = Math.abs(offset) % 60;

		return `GMT${sign}${padZero(hours)}:${padZero(minutes)}`;
	}

	function padZero(number) {
		return number.toString().padStart(2, '0');
	}
});