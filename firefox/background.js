function showNotification(title, message) {
    const options = {
      type: "basic",
      iconUrl: "res/notify_icon.png",
      title: title,
      message: message || "No Contest Available",
    };
  
    // Generate a unique notification ID
    const notificationId = `cracktech_notification_${Date.now()}`;
    browser.notifications.create(notificationId, options);
  }
  
  async function fetchNotificationContent() {
    try {
      const response = await fetch(
        "https://raw.githubusercontent.com/ssavi-ict/LeetCode-Which-Company/main/data/contests.json"
      );
      const data = await response.json();
      const title = `CrackTech Contest Notification`;
      let contestCount = Object.keys(data).length; // Count the number of key-value pairs
      const currentTime = Date.now() / 1000; // Current time in seconds
  
      Object.entries(data).forEach(([key, value]) => {
        const start_time = value.start_time;
  
        if (start_time < currentTime) {
          contestCount--;
        }
      });
  
      let notificationMessage;
      if (contestCount > 0) {
        notificationMessage = `You have ${contestCount} contest(s) coming up soon. Get ready!!`;
      } else {
        notificationMessage = `No Upcoming Contest(s).`;
      }
  
      // Add clickable links with HTML markup
      notificationMessage += "\n\n" +
      " 👉 Click To Turn Off The notification";
  
      showNotification(title, notificationMessage);
    } catch (error) {
      console.log("Error fetching notification content:", error);
    }
  }
  
  // Variable to track the first notification
  let firstNotificationScheduled = false;
  
  // Event listener for the browser startup
  browser.runtime.onStartup.addListener(function () {
    scheduleFirstNotification();
  });
  
  // Event listener for the browser installation/upgrade
  browser.runtime.onInstalled.addListener(function () {
    scheduleFirstNotification();
  });
  
  // Function to schedule the first notification
  function scheduleFirstNotification() {
    browser.storage.local.get("switchState", function (result) {
      const switchState = result.switchState;
      if (switchState) {
        browser.alarms.create("firstNotificationAlarm", { delayInMinutes: 1 }); // Trigger every day
        firstNotificationScheduled = true;
      }
    });
  }
  
  // Event listener for the alarm trigger
  browser.alarms.onAlarm.addListener(async function (alarm) {
    if (alarm.name === "firstNotificationAlarm") {
      await fetchNotificationContent();
      scheduleSecondNotification();
    } else if (alarm.name === "secondNotificationAlarm") {
      await fetchNotificationContent();
    }
  });
  
  // Function to schedule the second notification
  function scheduleSecondNotification() {
    browser.alarms.create("secondNotificationAlarm", { delayInMinutes: 15 });
  }
  
  
  // Event listener for notification click
  browser.notifications.onClicked.addListener(function (notificationId) {
    // Check if the clicked notification starts with "cracktech_notification_"
    if (notificationId.startsWith("cracktech_notification_")) {
      // Open the internal index.html page
      browser.tabs.create({ url: browser.runtime.getURL("leetcoder.html") });
    }
  });

  // browser.tabs.onCreated.addListener(function (tab) {
  //   fetchNotificationContent();
  // });
  