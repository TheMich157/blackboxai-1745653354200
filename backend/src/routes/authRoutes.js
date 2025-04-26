const express = require('express');
const { register, login, linkRobloxAccount, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const User = require('../models/User');

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.use(protect); // All routes after this middleware will be protected
router.get('/me', getMe);
router.post('/link-roblox', linkRobloxAccount);

// Temporary admin route for testing
router.post('/update-role', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.body.userId,
      { accountType: req.body.role },
      { new: true }
    );
    res.json({ status: 'success', user });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

module.exports = router;
