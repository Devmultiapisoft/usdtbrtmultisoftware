const User = require('../models/User');
const Transaction = require('../models/Transaction');
const Settings = require('../models/Settings');
const Web3 = require('web3');
const dotenv = require('dotenv');
dotenv.config();

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
exports.getUsers = async (req, res) => {
  try {
    // Only select specific fields to avoid path collision issues
    const users = await User.find().select('name email role createdAt');

    return res.status(200).json({
      status: true,
      count: users.length,
      users
    });
  } catch (error) {
    console.error('Error in getUsers:', error);
    return res.status(500).json({
      status: false,
      message: 'Failed to get users: ' + error.message
    });
  }
};

// @desc    Get all transactions
// @route   GET /api/admin/transactions
// @access  Private/Admin
exports.getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      status: true,
      count: transactions.length,
      transactions
    });
  } catch (error) {
    console.error('Error in getTransactions:', error);
    return res.status(500).json({
      status: false,
      message: 'Failed to get transactions: ' + error.message
    });
  }
};

// @desc    Get wallet settings
// @route   GET /api/admin/settings
// @access  Private/Admin
exports.getSettings = async (req, res) => {
  try {
    // Try to find existing settings
    let settings = await Settings.findOne().select('+gasPrivateKey +withdrawalAdminPrivateKey');

    // If no settings exist, create default settings from .env
    if (!settings) {
      settings = await Settings.create({
        usdtReceiveWallet: process.env.USDT_RECEIVE_WALLET || '',
        gasWallet: process.env.GAS_WALLET || '',
        gasPrivateKey: process.env.GAS_PRIVATE_KEY || '',
        withdrawalAdminPrivateKey: process.env.WITHDRAWAL_ADMIN_PRIVATE_KEY || ''
      });
    }

    return res.status(200).json({
      status: true,
      settings
    });
  } catch (error) {
    console.error('Error in getSettings:', error);
    return res.status(500).json({
      status: false,
      message: 'Failed to get settings: ' + error.message
    });
  }
};

// @desc    Update wallet settings
// @route   PUT /api/admin/settings
// @access  Private/Admin
exports.updateSettings = async (req, res) => {
  try {
    const { usdtReceiveWallet, gasWallet, gasPrivateKey, withdrawalAdminPrivateKey } = req.body;

    // Validate required fields
    if (!usdtReceiveWallet || !gasWallet || !gasPrivateKey || !withdrawalAdminPrivateKey) {
      return res.status(400).json({
        status: false,
        message: 'All fields are required'
      });
    }

    // Validate wallet addresses
    if (!/^0x[a-fA-F0-9]{40}$/.test(usdtReceiveWallet) || !/^0x[a-fA-F0-9]{40}$/.test(gasWallet)) {
      return res.status(400).json({
        status: false,
        message: 'Invalid wallet address format'
      });
    }

    // Find existing settings or create new ones
    let settings = await Settings.findOne();

    if (settings) {
      settings.usdtReceiveWallet = usdtReceiveWallet;
      settings.gasWallet = gasWallet;
      settings.gasPrivateKey = gasPrivateKey;
      settings.withdrawalAdminPrivateKey = withdrawalAdminPrivateKey;
      settings.updatedAt = Date.now();
      await settings.save();
    } else {
      settings = await Settings.create({
        usdtReceiveWallet,
        gasWallet,
        gasPrivateKey,
        withdrawalAdminPrivateKey
      });
    }

    // Update environment variables in memory
    process.env.USDT_RECEIVE_WALLET = usdtReceiveWallet;
    process.env.GAS_WALLET = gasWallet;
    process.env.GAS_PRIVATE_KEY = gasPrivateKey;
    process.env.WITHDRAWAL_ADMIN_PRIVATE_KEY = withdrawalAdminPrivateKey;

    return res.status(200).json({
      status: true,
      message: 'Settings updated successfully'
    });
  } catch (error) {
    console.error('Error in updateSettings:', error);
    return res.status(500).json({
      status: false,
      message: 'Failed to update settings: ' + error.message
    });
  }
};

// @desc    Get dashboard statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
exports.getStats = async (req, res) => {
  try {
    // Get total users count
    const totalUsers = await User.countDocuments();

    // Get total transactions count
    const totalTransactions = await Transaction.countDocuments();

    // Get total deposits
    const deposits = await Transaction.find({ type: 'deposit' });
    const totalDeposits = deposits.length;
    const totalDepositAmount = deposits.reduce((sum, tx) => sum + (tx.amount || 0), 0);

    // Get total withdrawals
    const withdrawals = await Transaction.find({ type: 'withdrawal' });
    const totalWithdrawals = withdrawals.length;
    const totalWithdrawalAmount = withdrawals.reduce((sum, tx) => sum + (tx.amount || 0), 0);

    // Get pending withdrawals
    const pendingWithdrawals = await Transaction.find({
      type: 'withdrawal',
      status: 'pending'
    });

    // Get recent transactions
    const recentTransactions = await Transaction.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(5);

    return res.status(200).json({
      status: true,
      stats: {
        totalUsers,
        totalTransactions,
        deposits: {
          count: totalDeposits,
          amount: totalDepositAmount
        },
        withdrawals: {
          count: totalWithdrawals,
          amount: totalWithdrawalAmount,
          pending: pendingWithdrawals.length
        },
        recentTransactions
      }
    });
  } catch (error) {
    console.error('Error in getStats:', error);
    return res.status(500).json({
      status: false,
      message: 'Failed to get statistics: ' + error.message
    });
  }
};

// @desc    Process a withdrawal
// @route   POST /api/admin/process-withdrawal/:id
// @access  Private/Admin
exports.processWithdrawal = async (req, res) => {
  try {
    const { id } = req.params;

    // Get settings from database
    const settings = await Settings.findOne().select('+withdrawalAdminPrivateKey');

    if (!settings || !settings.withdrawalAdminPrivateKey) {
      return res.status(500).json({
        status: false,
        message: 'Withdrawal admin key not configured. Please set up wallet settings in the admin panel.'
      });
    }

    const adminPrivateKey = settings.withdrawalAdminPrivateKey;

    // Find the transaction
    const transaction = await Transaction.findById(id);

    if (!transaction) {
      return res.status(404).json({
        status: false,
        message: 'Transaction not found'
      });
    }

    if (transaction.type !== 'withdrawal') {
      return res.status(400).json({
        status: false,
        message: 'Transaction is not a withdrawal'
      });
    }

    if (transaction.status !== 'pending') {
      return res.status(400).json({
        status: false,
        message: `Transaction is already ${transaction.status}`
      });
    }

    // USDT contract address on BSC
    const usdtContract = '0x55d398326f99059fF775485246999027B3197955';

    // Create a web3 instance
    const web3 = new Web3('https://bsc-dataseed.binance.org');

    // ABI for the transfer function
    const transferAbi = {
      name: 'transfer',
      type: 'function',
      inputs: [
        {
          type: 'address',
          name: 'recipient'
        },
        {
          type: 'uint256',
          name: 'amount'
        }
      ],
      outputs: [
        {
          type: 'bool',
          name: 'success'
        }
      ],
      constant: false,
      payable: false,
      stateMutability: 'nonpayable'
    };

    try {
      // Get the admin wallet address from the private key
      const account = web3.eth.accounts.privateKeyToAccount(adminPrivateKey);
      const adminWalletAddress = account.address;

      console.log(`Sending ${transaction.amount} USDT to ${transaction.walletAddress}`);

      // Encode the function call
      const transactionData = web3.eth.abi.encodeFunctionCall(transferAbi, [
        transaction.walletAddress,
        web3.utils.toWei(transaction.amount.toString(), 'ether')
      ]);

      // Get the nonce for the admin wallet
      const nonce = await web3.eth.getTransactionCount(adminWalletAddress, 'latest');

      // Prepare transaction parameters
      const txParams = {
        nonce: '0x' + nonce.toString(16),
        to: usdtContract,
        value: '0x0',
        data: transactionData,
        gas: '0x186A0', // 100000 gas
        gasPrice: '0x' + (3 * 10 ** 9).toString(16), // 3 Gwei
        chainId: 56 // BSC mainnet
      };

      // Sign the transaction
      const signedTx = await account.signTransaction(txParams);

      try {
        // Send the transaction
        console.log('Sending transaction...');
        const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
        console.log('Transaction receipt:', receipt);

        if (receipt.status) {
          // Update the transaction status
          transaction.status = 'completed';
          transaction.transactionHash = receipt.transactionHash;
          transaction.updatedAt = Date.now();
          await transaction.save();

          return res.status(200).json({
            status: true,
            message: 'Withdrawal processed successfully',
            transaction: {
              id: transaction._id,
              status: transaction.status,
              transactionHash: transaction.transactionHash
            }
          });
        } else {
          return res.status(500).json({
            status: false,
            message: 'Transaction failed'
          });
        }
      } catch (txError) {
        console.error('Transaction error:', txError);
        return res.status(500).json({
          status: false,
          message: 'Transaction error: ' + txError.message
        });
      }
    } catch (error) {
      console.error('Error in processWithdrawal:', error);
      return res.status(500).json({
        status: false,
        message: 'Error processing withdrawal: ' + error.message
      });
    }
  } catch (error) {
    console.error('Error in processWithdrawal:', error);
    return res.status(500).json({
      status: false,
      message: 'Error processing withdrawal: ' + error.message
    });
  }
};
