const User = require('../models/User');

// @desc    Update user game stats
// @route   PUT /api/game/stats
// @access  Private
exports.updateGameStats = async (req, res, next) => {
  try {
    const { deaths, playtime } = req.body;

    const user = await User.findById(req.user.id);
    
    // Update stats
    user.gameStats.deaths += deaths || 0;
    user.gameStats.playtime += playtime || 0;
    user.gameStats.lastPlayed = Date.now();
    
    await user.save();

    res.status(200).json({
      status: 'success',
      data: user.gameStats
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get server status
// @route   GET /api/game/servers
// @access  Private
exports.getServers = async (req, res, next) => {
  try {
    // Mock server data (in production, this would come from your Roblox game servers)
    const servers = [
      {
        id: 'server1',
        region: 'US East',
        players: 12,
        maxPlayers: 30,
        performance: 95,
        uptime: '2h 30m',
        moderatorsPresent: true
      },
      {
        id: 'server2',
        region: 'Europe',
        players: 25,
        maxPlayers: 30,
        performance: 88,
        uptime: '4h 15m',
        moderatorsPresent: false
      }
    ];

    res.status(200).json({
      status: 'success',
      data: servers
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get server metrics (Developer only)
// @route   GET /api/game/servers/:serverId/metrics
// @access  Private (Developer)
exports.getServerMetrics = async (req, res, next) => {
  try {
    const { serverId } = req.params;

    // Mock server metrics (in production, this would come from your actual server monitoring)
    const metrics = {
      serverId,
      cpu: {
        usage: 45,
        cores: 4,
        temperature: 65
      },
      memory: {
        used: 2048,
        total: 4096,
        percentage: 50
      },
      network: {
        bandwidth: '150Mbps',
        latency: '25ms',
        packetLoss: '0.1%'
      },
      performance: {
        fps: 60,
        ping: 30,
        playerCount: 15
      }
    };

    res.status(200).json({
      status: 'success',
      data: metrics
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Shutdown server (Developer only)
// @route   POST /api/game/servers/:serverId/shutdown
// @access  Private (Developer)
exports.shutdownServer = async (req, res, next) => {
  try {
    const { serverId } = req.params;

    // Mock server shutdown (in production, this would actually shutdown the server)
    res.status(200).json({
      status: 'success',
      message: `Server ${serverId} has been scheduled for shutdown`
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Migrate server (Developer only)
// @route   POST /api/game/servers/:serverId/migrate
// @access  Private (Developer)
exports.migrateServer = async (req, res, next) => {
  try {
    const { serverId } = req.params;
    const { targetRegion } = req.body;

    // Mock server migration (in production, this would actually migrate the server)
    res.status(200).json({
      status: 'success',
      message: `Server ${serverId} is being migrated to ${targetRegion}`,
      estimatedTime: '5 minutes'
    });
  } catch (err) {
    next(err);
  }
};
