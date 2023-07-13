// // Example event listener for when a new tab is opened or when the user visits leetcode.com
// chrome.tabs.onCreated.addListener(checkNotification);
// chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
//   if (changeInfo.status === 'complete' && tab.url.includes('leetcode.com')) {
//     checkNotification(tab);
//   }
// });

// function checkNotification(tab) {
//   // Check if the last notification was sent more than 24 hours ago
//   chrome.storage.local.get('lastNotificationSent', result => {
//     let lastNotificationSent = result.lastNotificationSent;
//     lastNotificationSent = false;
//     console.log(lastNotificationSent);

//     // Check if the last notification exists and if it is older than 24 hours
//     // if (!lastNotificationSent || (Date.now() - lastNotificationSent) >= 24 * 60 * 60 * 1000) {
//     // if (!lastNotificationSent) {
//       // Check if the user is on leetcode.com
//       // if (tab.url.includes('leetcode.com')) {
//         // Fetch the JSON data and send the notification
//         fetch('https://raw.githubusercontent.com/ssavi-ict/LeetCode-Which-Company/main/data/contests.json')
//           .then(response => response.json())
//           .then(data => {
//             const jsonData = JSON.stringify(data);
//             chrome.notifications.create('notificationId', {
//               type: 'basic',
//               title: 'Notification Title',
//               message: jsonData,
//               iconUrl: 'res/notify_icon.png'
//             });
//             chrome.storage.local.set({ lastNotificationSent: Date.now() });
//           })
//           .catch(error => {
//             // Handle any errors that occurred during the fetch request
//             console.log('Error Occured');
//           });
//       // }
//     // }
//   });
// }

// Function to show the notification
function showNotification(title, message) {
  const options = {
    type: "basic",
    iconUrl: "res/notify_icon.png",
    title: title,
    message: message || "No Contest Available"
  };

  chrome.notifications.create("", options);
}

// Helper function to convert epoch to date string
function convertEpochToDateString(epoch) {
  const date = new Date(epoch * 1000);
  const options = { timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone };
  const dateTimeString = date.toLocaleString(undefined, options);
  return dateTimeString;
}

// Helper function to convert duration in seconds to hours and minutes string
function convertDurationToString(durationInSeconds) {
  const hours = Math.floor(durationInSeconds / 3600);
  const minutes = Math.floor((durationInSeconds % 3600) / 60);

  let durationString = '';
  if (hours > 0) {
    durationString += `${hours}:`;
  }
  if (minutes > 0) {
    durationString += `${hours > 0 ? '' : ''}${minutes}`;
  }

  return durationString;
}

function fetchNotificationContent() {
  fetch("https://raw.githubusercontent.com/ssavi-ict/LeetCode-Which-Company/main/data/contests.json")
    .then(response => response.json())
    .then(data => {
      // const message = JSON.stringify(data);
      // console.log(message);
      // showNotification(message);

      const contestCount = Object.keys(data).length; // Count the number of key-value pairs

      let notificationMessage = '';
      let title = `Upcoming Leetcode Contest - ${contestCount}\n`;

      Object.entries(data).forEach(([key, value], index) => {
        const { title, start_time, contest_duration } = value;
        const startTimeString = convertEpochToDateString(start_time);
        const durationString = convertDurationToString(contest_duration);

        notificationMessage += `${index + 1}. ${title} - ${startTimeString} for ${durationString} hr.\n`;
      });

      showNotification(title, notificationMessage);
    })
    .catch(error => {
      console.error("Error fetching notification content:", error);
      showNotification(); // Show the notification with default values in case of an error
    });
}

// Variable to track the first notification
let firstNotificationScheduled = false;

// Event listener for the browser startup
chrome.runtime.onStartup.addListener(function () {
  scheduleFirstNotification();
});

// Event listener for the browser installation/upgrade
chrome.runtime.onInstalled.addListener(function () {
  scheduleFirstNotification();
});

// Function to schedule the first notification
function scheduleFirstNotification() {
  if (!firstNotificationScheduled) {
    chrome.alarms.create("firstNotificationAlarm", { delayInMinutes: 2 });
    firstNotificationScheduled = true;
  }
}

// chrome.tabs.onCreated.addListener(function(tab) {
//   fetchNotificationContent();
// });

// Event listener for the alarm trigger
chrome.alarms.onAlarm.addListener(function (alarm) {
  if (alarm.name === "firstNotificationAlarm") {
    fetchNotificationContent();
    scheduleSecondNotification();
  } else if (alarm.name === "secondNotificationAlarm") {
    fetchNotificationContent();
  }
});

// Function to schedule the second notification
function scheduleSecondNotification() {
  chrome.alarms.create("secondNotificationAlarm", { delayInMinutes: 18 });
}
