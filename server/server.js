// server.js - Express server for OwnPay API
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');
const ownPay = require('./own_pay');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

// Initialize settings in the database if they don't exist
const Settings = require('./models/Settings');
const initializeSettings = async () => {
  try {
    // Check if settings exist
    const existingSettings = await Settings.findOne();

    if (!existingSettings) {
      console.log('No settings found in database. Creating default settings...');

      // Create default settings
      await Settings.create({
        usdtReceiveWallet: '',
        gasWallet: '',
        gasPrivateKey: '',
        withdrawalAdminPrivateKey: ''
      });

      console.log('Default settings created. Please configure wallet settings in the admin panel.');
    } else {
      console.log('Settings found in database.');
    }
  } catch (error) {
    console.error('Error initializing settings:', error);
  }
};

// Call the initialization function
initializeSettings();

// Route files
const authRoutes = require('./routes/auth');
const walletRoutes = require('./routes/wallet');
const adminRoutes = require('./routes/admin');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to OwnPay API',
        status: true
    });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: true,
        message: 'Server is running',
        timestamp: new Date().toISOString(),
        routes: {
            auth: true,
            wallet: true,
            admin: true,
            depositAddress: true
        }
    });
});

// Mount routers first (higher priority)
console.log('Registering routes...');
app.use('/api/auth', authRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/admin', adminRoutes);
console.log('Routes registered successfully');

// Legacy API endpoints (for backward compatibility)
app.post('/api/generate-wallet', ownPay.generateNewWallet);
app.post('/api/save-wallet', ownPay.savewallet);
app.post('/api/deposit', ownPay.startMonitoring);
app.post('/api/request-withdrawal', ownPay.requestWithdrawal);
app.post('/api/process-withdrawal', ownPay.processWithdrawal);

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
    // Set static folder
    app.use(express.static('client/build'));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
}

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});