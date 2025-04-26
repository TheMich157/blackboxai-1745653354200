const express = require('express');
const {
  getAllInfractions,
  issueWarning,
  kickUser,
  banUser,
  getUserHistory
} = require('../controllers/moderationController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Protect all routes and restrict to staff and developer roles
router.use(protect);
router.use(authorize('staff', 'developer'));

// Moderation routes
router.get('/infractions', getAllInfractions);
router.post('/warn', issueWarning);
router.post('/kick', kickUser);
router.post('/ban', banUser);
router.get('/history/:userId', getUserHistory);

module.exports = router;
