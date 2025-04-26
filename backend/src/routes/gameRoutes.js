const express = require('express');
const {
  updateGameStats,
  getServers,
  getServerMetrics,
  shutdownServer,
  migrateServer
} = require('../controllers/gameController');
const { protect, authorize, checkAccountStatus } = require('../middleware/auth');

const router = express.Router();

// Protect all routes
router.use(protect);
router.use(checkAccountStatus);

// Regular user routes
router.put('/stats', updateGameStats);
router.get('/servers', getServers);

// Developer only routes
router.get(
  '/servers/:serverId/metrics',
  authorize('developer'),
  getServerMetrics
);

router.post(
  '/servers/:serverId/shutdown',
  authorize('developer'),
  shutdownServer
);

router.post(
  '/servers/:serverId/migrate',
  authorize('developer'),
  migrateServer
);

module.exports = router;
