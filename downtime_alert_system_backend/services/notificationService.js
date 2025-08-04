// services/notificationService.js

export function sendAlertNotification(alert) {
  // Example logic for sending a notification
  // Replace this with your actual notification logic (email, SMS, push, whatever)

  console.log("ALERT NOTIFICATION SENT:");
  console.log(`Type: ${alert.type}`);
  console.log(`Message: ${alert.message}`);
  // You can add more stuff here like sending emails, push notifications, etc.
}
