// Get the notification ID from the query string parameters
const urlParams = new URLSearchParams(window.location.search);
const notificationId = urlParams.get("id");

// Display the notification ID in the popup
const notificationIdElement = document.getElementById("notificationId");
notificationIdElement.textContent = `Clicked notification ID: ${notificationId}`;