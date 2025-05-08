import api from '../utils/api';

// Check if the server is running and which features are available
export const checkServerHealth = async () => {
  try {
    console.log('Checking server health...');
    const res = await api.get('/api/health');
    console.log('Server health:', res.data);
    return res.data;
  } catch (err) {
    console.error('Error checking server health:', err);
    return {
      status: false,
      message: 'Server is not responding',
      routes: {
        auth: false,
        wallet: false,
        admin: false,
        depositAddress: false
      }
    };
  }
};

// Generate a new wallet
export const generateWallet = async (label = 'My Wallet') => {
  try {
    const res = await api.post('/api/wallet/generate', { label });
    return res.data;
  } catch (err) {
    throw err.response ? err.response.data : { status: false, message: 'Server error' };
  }
};

// Get all wallets
export const getWallets = async () => {
  try {
    const res = await api.get('/api/wallet');
    return res.data;
  } catch (err) {
    throw err.response ? err.response.data : { status: false, message: 'Server error' };
  }
};

// Generate deposit address (only one per user)
export const generateDepositAddress = async () => {
  try {
    console.log('Calling generateDepositAddress API');
    const res = await api.post('/api/wallet/deposit-address');
    console.log('generateDepositAddress API response:', res.data);
    return res.data;
  } catch (err) {
    console.error('Error in generateDepositAddress:', err);
    if (err.response && err.response.status === 404) {
      // Return a default response if the endpoint doesn't exist
      return { status: false, message: 'Endpoint not found' };
    }
    throw err.response ? err.response.data : { status: false, message: 'Server error' };
  }
};

// Get user's deposit address
export const getDepositAddress = async () => {
  try {
    console.log('Calling getDepositAddress API');
    const res = await api.get('/api/wallet/deposit-address');
    console.log('getDepositAddress API response:', res.data);
    return res.data;
  } catch (err) {
    console.error('Error in getDepositAddress:', err);
    if (err.response && err.response.status === 404) {
      // Return a default response if the endpoint doesn't exist
      return { status: false, hasDepositAddress: false };
    }
    throw err.response ? err.response.data : { status: false, message: 'Server error' };
  }
};

// Deposit funds
export const deposit = async () => {
  try {
    console.log('Calling deposit API');
    const res = await api.post('/api/wallet/deposit');
    console.log('deposit API response:', res.data);
    return res.data;
  } catch (err) {
    console.error('Error in deposit:', err);
    if (err.response && err.response.status === 404) {
      // Return a default response if the endpoint doesn't exist
      return { status: false, message: 'Endpoint not found' };
    }
    throw err.response ? err.response.data : { status: false, message: 'Server error' };
  }
};

// Request withdrawal
export const requestWithdrawal = async (amount, walletAddress) => {
  try {
    const res = await api.post('/api/wallet/withdraw', { amount, walletAddress });
    return res.data;
  } catch (err) {
    throw err.response ? err.response.data : { status: false, message: 'Server error' };
  }
};

// Get all transactions
export const getTransactions = async () => {
  try {
    const res = await api.get('/api/wallet/transactions');
    return res.data;
  } catch (err) {
    throw err.response ? err.response.data : { status: false, message: 'Server error' };
  }
};
