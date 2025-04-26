// Controller for notifications system

const notifications = [];

// Add a new notification
exports.addNotification = (type, message, userId) => {
  const notification = {
    id: Date.now(),
    type,
    message,
    userId,
    timestamp: new Date()
  };
  notifications.push(notification);
  return notification;
};

// Get notifications for a user
exports.getNotifications = (userId) => {
  return notifications.filter(n => n.userId === userId);
};

// Clear notifications for a user
exports.clearNotifications = (userId) => {
  for (let i = notifications.length - 1; i >= 0; i--) {
    if (notifications[i].userId === userId) {
      notifications.splice(i, 1);
    }
  }
};
