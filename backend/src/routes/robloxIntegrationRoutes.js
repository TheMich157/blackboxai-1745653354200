const express = require('express');
const { handleModerationWebhook, handleServerEventWebhook } = require('../controllers/robloxWebhookController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Webhook endpoints for Roblox game integration
router.post('/webhook/moderation', protect, authorize('staff', 'developer'), handleModerationWebhook);
router.post('/webhook/server-event', protect, authorize('developer'), handleServerEventWebhook);

// Polling endpoints can be added here as needed

module.exports = router;
