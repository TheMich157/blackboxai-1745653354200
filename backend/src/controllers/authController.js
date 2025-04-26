const User = require('../models/User');

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({
        status: 'error',
        message: 'User with this email or username already exists'
      });
    }

    // Create user
    const user = await User.create({
      username,
      email,
      password
    });

    // Generate token
    const token = user.getSignedJwtToken();

    res.status(201).json({
      status: 'success',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        accountType: user.accountType,
        accountStanding: user.accountStanding
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide email and password'
      });
    }

    // Check for user
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid credentials'
      });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid credentials'
      });
    }

    // Update last login
    user.lastLogin = Date.now();
    await user.save();

    // Generate token
    const token = user.getSignedJwtToken();

    res.status(200).json({
      status: 'success',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        accountType: user.accountType,
        accountStanding: user.accountStanding
      }
    });
  } catch (err) {
    next(err);
  }
};

const { isUserInGroup } = require('../services/robloxService');
const STAFF_GROUP_ID = 123456; // Replace with actual Roblox group ID
const DEVELOPER_RANK = 255; // Replace with actual developer rank in the group
const STAFF_RANK = 100; // Replace with actual staff rank in the group

// @desc    Link Roblox account
// @route   POST /api/auth/link-roblox
// @access  Private
exports.linkRobloxAccount = async (req, res, next) => {
  try {
    const { robloxId } = req.body;

    // Check if roblox ID is already linked to another account
    const existingUser = await User.findOne({ robloxId });
    if (existingUser) {
      return res.status(400).json({
        status: 'error',
        message: 'This Roblox account is already linked to another user'
      });
    }

    // Verify group membership and assign role
    let accountType = 'regular';
    if (await isUserInGroup(robloxId, STAFF_GROUP_ID, DEVELOPER_RANK)) {
      accountType = 'developer';
    } else if (await isUserInGroup(robloxId, STAFF_GROUP_ID, STAFF_RANK)) {
      accountType = 'staff';
    }

    // Update user's Roblox ID and account type
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { robloxId, accountType },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      status: 'success',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        robloxId: user.robloxId,
        accountType: user.accountType,
        accountStanding: user.accountStanding
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      status: 'success',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        robloxId: user.robloxId,
        accountType: user.accountType,
        accountStanding: user.accountStanding,
        gameStats: user.gameStats
      }
    });
  } catch (err) {
    next(err);
  }
};
