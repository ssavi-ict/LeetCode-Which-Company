// Function to show the notification
function showNotification(title, message) {
  const options = {
    type: "basic",
    iconUrl: "res/notify_icon.png",
    title: title,
    message: message || "No Contest Available",
    buttons: [
      { title: "Turn Off Notification" },
      { title: "Visit Leetcode" }
    ]
  };

  // chrome.notifications.create("", options);
  // Generate a unique notification ID
  const notificationId = `cracktech_notification_${Date.now()}`;
  chrome.notifications.create(notificationId, options);
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
      const title = `CrackTech Contest Notification`;
      let contestCount = Object.keys(data).length; // Count the number of key-value pairs
      const currentTime = Date.now() / 1000; // Current time in seconds

      Object.entries(data).forEach(([key, value]) => {
        const start_time = value.start_time;

        if (start_time < currentTime) {
          contestCount--;
        }
      });
      if (contestCount > 0){
        const notificationMessage = `You have ${contestCount} contest(s) coming up soon. Get ready!!`;
        showNotification(title, notificationMessage);
      }
      else{
        const notificationMessage = `No Upcoming Contest(s).`;
        showNotification(title, notificationMessage);
      }
    })
    .catch(error => {
      console.log("Error fetching notification content:", error);
      // showNotification(); // Show the notification with default values in case of an error
    });
}

// Variable to track the first notification
let firstNotificationScheduled = false;

// Event listener for the browser startup
chrome.runtime.onStartup.addListener(function () {
  scheduleFirstNotification();
});

// Event listener for the browser installation/upgrade
chrome.runtime.onInstalled.addListener(function (details) {
  scheduleFirstNotification();
  if (details.reason === "update") {
    chrome.tabs.create({ url: "about.html" });
  }
});



// Function to schedule the first notification
function scheduleFirstNotification() {
  chrome.storage.local.get("switchState", function (result) {
    const switchState = result.switchState;
    console.log('Hello'); console.log(switchState);
    if (switchState) {
      // fetchNotificationContent();
      chrome.alarms.create("firstNotificationAlarm", { delayInMinutes: 1 }); // Trigger every day
      firstNotificationScheduled = true;
    }
  });
}


// Event listener for the alarm trigger
chrome.alarms.onAlarm.addListener(function (alarm) {
  if (alarm.name === "firstNotificationAlarm") {
    fetchNotificationContent();
    scheduleSecondNotification();
    // firstNotificationScheduled = false; // Set the flag to false after the first notification
  } else if (alarm.name === "secondNotificationAlarm") {
    fetchNotificationContent();
  }
});

// Function to schedule the second notification
function scheduleSecondNotification() {
  chrome.alarms.create("secondNotificationAlarm", { delayInMinutes: 15 });
}

// Event listener for notification button clicks
chrome.notifications.onButtonClicked.addListener(function (notificationId, buttonIndex) {
  if (notificationId.startsWith("cracktech_notification_")) {
    if (buttonIndex === 0) {
      chrome.storage.local.set({ switchState: false });
    } else if (buttonIndex === 1) {
      chrome.tabs.create({ url: "https://leetcode.com/contest/" });
    }
  }
});
