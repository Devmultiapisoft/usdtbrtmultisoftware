const express = require('express');
const {
  getUsers,
  getTransactions,
  processWithdrawal,
  getSettings,
  updateSettings,
  getStats
} = require('../controllers/admin');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);
router.use(authorize('admin')); // All admin routes require admin role

// User routes
router.get('/users', getUsers);

// Transaction routes
router.get('/transactions', getTransactions);
router.post('/process-withdrawal/:id', processWithdrawal);

// Settings routes
router.get('/settings', getSettings);
router.put('/settings', updateSettings);

// Dashboard stats
router.get('/stats', getStats);

module.exports = router;
