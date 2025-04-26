const User = require('../models/User');

// @desc    Get all infractions
// @route   GET /api/moderation/infractions
// @access  Private (Staff & Developer)
exports.getAllInfractions = async (req, res, next) => {
  try {
    // Mock infractions data (in production, this would come from a separate Infractions model)
    const infractions = [
      {
        id: 'inf1',
        userId: 'user123',
        username: 'Player1',
        type: 'warning',
        reason: 'Inappropriate language',
        staffId: 'mod456',
        staffName: 'Moderator1',
        timestamp: new Date('2024-04-25T10:00:00Z'),
        status: 'active'
      },
      {
        id: 'inf2',
        userId: 'user456',
        username: 'Player2',
        type: 'kick',
        reason: 'Disruptive behavior',
        staffId: 'mod789',
        staffName: 'Moderator2',
        timestamp: new Date('2024-04-25T11:30:00Z'),
        status: 'expired'
      }
    ];

    res.status(200).json({
      status: 'success',
      data: infractions
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Issue warning
// @route   POST /api/moderation/warn
// @access  Private (Staff & Developer)
exports.issueWarning = async (req, res, next) => {
  try {
    const { userId, reason } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    // Mock warning creation (in production, save to Infractions collection)
    const warning = {
      id: 'warn' + Date.now(),
      userId: user._id,
      username: user.username,
      type: 'warning',
      reason,
      staffId: req.user.id,
      staffName: req.user.username,
      timestamp: new Date(),
      status: 'active'
    };

    res.status(201).json({
      status: 'success',
      data: warning
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Kick user
// @route   POST /api/moderation/kick
// @access  Private (Staff & Developer)
exports.kickUser = async (req, res, next) => {
  try {
    const { userId, reason } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    // Mock kick record (in production, save to Infractions collection)
    const kick = {
      id: 'kick' + Date.now(),
      userId: user._id,
      username: user.username,
      type: 'kick',
      reason,
      staffId: req.user.id,
      staffName: req.user.username,
      timestamp: new Date(),
      status: 'active'
    };

    res.status(200).json({
      status: 'success',
      data: kick
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Ban user
// @route   POST /api/moderation/ban
// @access  Private (Staff & Developer)
exports.banUser = async (req, res, next) => {
  try {
    const { userId, reason, duration } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    // Update user's account standing
    user.accountStanding = 'suspended';
    await user.save();

    // Mock ban record (in production, save to Infractions collection)
    const ban = {
      id: 'ban' + Date.now(),
      userId: user._id,
      username: user.username,
      type: 'ban',
      reason,
      duration,
      staffId: req.user.id,
      staffName: req.user.username,
      timestamp: new Date(),
      status: 'active'
    };

    res.status(200).json({
      status: 'success',
      data: ban
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get user moderation history
// @route   GET /api/moderation/history/:userId
// @access  Private (Staff & Developer)
exports.getUserHistory = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    // Mock user history (in production, query Infractions collection)
    const history = [
      {
        type: 'warning',
        reason: 'Inappropriate language',
        timestamp: new Date('2024-04-20T15:00:00Z'),
        staffName: 'Moderator1',
        status: 'expired'
      },
      {
        type: 'kick',
        reason: 'Disruptive behavior',
        timestamp: new Date('2024-04-22T18:30:00Z'),
        staffName: 'Moderator2',
        status: 'expired'
      }
    ];

    res.status(200).json({
      status: 'success',
      data: {
        user: {
          id: user._id,
          username: user.username,
          accountStanding: user.accountStanding
        },
        history
      }
    });
  } catch (err) {
    next(err);
  }
};
