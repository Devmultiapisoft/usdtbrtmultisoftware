const User = require('../models/User');
const Transaction = require('../models/Transaction');
const { WalletGenerator, WalletMonitor } = require('../own_pay');

// @desc    Generate a new wallet for the user
// @route   POST /api/wallet/generate
// @access  Private
exports.generateWallet = async (req, res) => {
  try {
    const generator = new WalletGenerator();
    const wallet = generator.generateWallet();

    // Add wallet to user's wallets
    const user = await User.findById(req.user.id);

    // Optional label for the wallet
    const label = req.body.label || 'My Wallet';

    user.wallets.push({
      address: wallet.address,
      walletPrivateKey: wallet.privateKey,
      label
    });

    await user.save();

    return res.status(200).json({
      status: true,
      wallet: {
        address: wallet.address,
        label
      },
      message: 'Wallet generated successfully'
    });
  } catch (error) {
    console.error('Error in generateWallet:', error);
    return res.status(500).json({
      status: false,
      message: 'Failed to generate wallet: ' + error.message
    });
  }
};

// @desc    Generate a deposit address for the user (only one per user)
// @route   POST /api/wallet/deposit-address
// @access  Private
exports.generateDepositAddress = async (req, res) => {
  console.log('generateDepositAddress called');
  try {
    // Find the user
    const user = await User.findById(req.user.id);

    // Check if user already has a deposit wallet
    if (user.depositWallet && user.depositWallet.address) {
      return res.status(200).json({
        status: true,
        wallet: {
          address: user.depositWallet.address,
          createdAt: user.depositWallet.createdAt
        },
        message: 'Deposit address already exists'
      });
    }

    // Generate a new wallet
    const generator = new WalletGenerator();
    const wallet = generator.generateWallet();

    // Set as user's deposit wallet
    user.depositWallet = {
      address: wallet.address,
      privateKey: wallet.privateKey, // This is fine as it's not in the wallets array
      createdAt: Date.now()
    };

    await user.save();

    return res.status(201).json({
      status: true,
      wallet: {
        address: wallet.address,
        createdAt: user.depositWallet.createdAt
      },
      message: 'Deposit address generated successfully'
    });
  } catch (error) {
    console.error('Error in generateDepositAddress:', error);
    return res.status(500).json({
      status: false,
      message: 'Failed to generate deposit address: ' + error.message
    });
  }
};

// @desc    Get all wallets for the user
// @route   GET /api/wallet
// @access  Private
exports.getWallets = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    const wallets = user.wallets.map(wallet => ({
      address: wallet.address,
      label: wallet.label,
      createdAt: wallet.createdAt
    }));

    return res.status(200).json({
      status: true,
      wallets
    });
  } catch (error) {
    console.error('Error in getWallets:', error);
    return res.status(500).json({
      status: false,
      message: 'Failed to get wallets: ' + error.message
    });
  }
};

// @desc    Deposit funds to a user's deposit address
// @route   POST /api/wallet/deposit
// @access  Private
exports.deposit = async (req, res) => {
  try {
    // Find the user with their deposit wallet
    const user = await User.findById(req.user.id).select('+depositWallet.privateKey');

    // Check if user has a deposit wallet
    if (!user.depositWallet || !user.depositWallet.address) {
      return res.status(400).json({
        status: false,
        message: 'You need to generate a deposit address first'
      });
    }

    const walletAddress = user.depositWallet.address;

    // Create a transaction record
    const transaction = await Transaction.create({
      user: req.user.id,
      type: 'deposit',
      amount: 0, // Will be updated when funds are detected
      walletAddress,
      status: 'pending'
    });

    // Get wallet settings from database
    const Settings = require('../models/Settings');
    const settings = await Settings.findOne().select('+gasPrivateKey');

    if (!settings) {
      return res.status(500).json({
        status: false,
        message: 'Wallet settings not configured. Please set up wallet settings in the admin panel.'
      });
    }

    const usdtReceiveWallet = settings.usdtReceiveWallet;
    const gasWallet = settings.gasWallet;
    const gasPrivateKey = settings.gasPrivateKey;

    console.log("Using wallet settings from database:");
    console.log("USDT Receive Wallet:", usdtReceiveWallet);
    console.log("Gas Wallet:", gasWallet);

    const monitor = new WalletMonitor(usdtReceiveWallet, gasWallet, gasPrivateKey);

    const monitorWallet = {
      address: user.depositWallet.address,
      privateKey: user.depositWallet.privateKey
    };

    // Start monitoring in the background
    monitor.monitorAndTransfer(monitorWallet)
      .then(result => {
        if (result.found && result.amount) {
          // Update the transaction with the amount and status
          Transaction.findByIdAndUpdate(
            transaction._id,
            {
              amount: result.amount,
              status: 'completed',
              transactionHash: result.transactionHash
            },
            { new: true }
          ).catch(err => console.error('Error updating transaction:', err));
        } else {
          // Update the transaction status to failed
          Transaction.findByIdAndUpdate(
            transaction._id,
            { status: 'failed', notes: result.message },
            { new: true }
          ).catch(err => console.error('Error updating transaction:', err));
        }
      })
      .catch(error => {
        console.error('Error in monitoring wallet:', error);
        // Update the transaction status to failed
        Transaction.findByIdAndUpdate(
          transaction._id,
          { status: 'failed', notes: error.message },
          { new: true }
        ).catch(err => console.error('Error updating transaction:', err));
      });

    return res.status(200).json({
      status: true,
      message: 'Deposit process started',
      transaction: {
        id: transaction._id,
        type: transaction.type,
        status: transaction.status,
        walletAddress: transaction.walletAddress,
        createdAt: transaction.createdAt
      }
    });
  } catch (error) {
    console.error('Error in deposit:', error);
    return res.status(500).json({
      status: false,
      message: 'Failed to process deposit: ' + error.message
    });
  }
};

// @desc    Get user's deposit address
// @route   GET /api/wallet/deposit-address
// @access  Private
exports.getDepositAddress = async (req, res) => {
  console.log('getDepositAddress called');
  try {
    const user = await User.findById(req.user.id);

    if (!user.depositWallet || !user.depositWallet.address) {
      return res.status(200).json({
        status: true,
        hasDepositAddress: false
      });
    }

    return res.status(200).json({
      status: true,
      hasDepositAddress: true,
      wallet: {
        address: user.depositWallet.address,
        createdAt: user.depositWallet.createdAt
      }
    });
  } catch (error) {
    console.error('Error in getDepositAddress:', error);
    return res.status(500).json({
      status: false,
      message: 'Failed to get deposit address: ' + error.message
    });
  }
};

// @desc    Request a withdrawal
// @route   POST /api/wallet/withdraw
// @access  Private
exports.requestWithdrawal = async (req, res) => {
  try {
    const { amount, walletAddress } = req.body;

    if (!amount || !walletAddress) {
      return res.status(400).json({
        status: false,
        message: 'Amount and wallet address are required'
      });
    }

    // Validate wallet address format
    if (!/^0x[a-fA-F0-9]{40}$/.test(walletAddress)) {
      return res.status(400).json({
        status: false,
        message: 'Invalid wallet address format'
      });
    }

    const money = parseFloat(amount);

    // Create a transaction record
    const transaction = await Transaction.create({
      user: req.user.id,
      type: 'withdrawal',
      amount: money,
      walletAddress,
      status: 'pending'
    });

    return res.status(200).json({
      status: true,
      message: 'Withdrawal request submitted successfully',
      transaction: {
        id: transaction._id,
        type: transaction.type,
        amount: transaction.amount,
        status: transaction.status,
        walletAddress: transaction.walletAddress,
        createdAt: transaction.createdAt
      }
    });
  } catch (error) {
    console.error('Error in requestWithdrawal:', error);
    return res.status(500).json({
      status: false,
      message: 'Error processing withdrawal request: ' + error.message
    });
  }
};

// @desc    Get all transactions for the user
// @route   GET /api/wallet/transactions
// @access  Private
exports.getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user.id })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      status: true,
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
