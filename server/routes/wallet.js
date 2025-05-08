const express = require('express');
const {
  generateWallet,
  getWallets,
  deposit,
  requestWithdrawal,
  getTransactions,
  generateDepositAddress,
  getDepositAddress
} = require('../controllers/wallet');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect); // All wallet routes are protected

router.post('/generate', generateWallet);
router.get('/', getWallets);
router.post('/deposit', deposit);
router.post('/withdraw', requestWithdrawal);
router.get('/transactions', getTransactions);
// Log the deposit address routes
console.log('Registering deposit address routes');
router.post('/deposit-address', generateDepositAddress);
router.get('/deposit-address', getDepositAddress);
console.log('Deposit address routes registered');

module.exports = router;
