const mongoose = require('mongoose');

const SettingsSchema = new mongoose.Schema({
  usdtReceiveWallet: {
    type: String,
    required: [true, 'USDT receive wallet address is required'],
    match: [/^0x[a-fA-F0-9]{40}$/, 'Please add a valid wallet address']
  },
  gasWallet: {
    type: String,
    required: [true, 'Gas wallet address is required'],
    match: [/^0x[a-fA-F0-9]{40}$/, 'Please add a valid wallet address']
  },
  gasPrivateKey: {
    type: String,
    required: [true, 'Gas wallet private key is required'],
    select: false // Hide by default for security
  },
  withdrawalAdminPrivateKey: {
    type: String,
    required: [true, 'Withdrawal admin private key is required'],
    select: false // Hide by default for security
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
SettingsSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Settings', SettingsSchema);
