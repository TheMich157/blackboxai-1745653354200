const express = require('express');
const { getNotifications, clearNotifications } = require('../controllers/notificationController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Protect all routes
router.use(protect);

// Get notifications for current user
router.get('/', (req, res) => {
  const notifications = getNotifications(req.user.id);
  res.json({ status: 'success', data: notifications });
});

// Clear notifications for current user
router.delete('/', (req, res) => {
  clearNotifications(req.user.id);
  res.json({ status: 'success', message: 'Notifications cleared' });
});

module.exports = router;
