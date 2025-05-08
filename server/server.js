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