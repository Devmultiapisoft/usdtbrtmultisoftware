import api from '../utils/api';

// Get all users
export const getUsers = async () => {
  try {
    const res = await api.get('/api/admin/users');
    return res.data;
  } catch (err) {
    throw err.response ? err.response.data : { status: false, message: 'Server error' };
  }
};

// Get all transactions
export const getTransactions = async () => {
  try {
    const res = await api.get('/api/admin/transactions');
    return res.data;
  } catch (err) {
    throw err.response ? err.response.data : { status: false, message: 'Server error' };
  }
};

// Process a withdrawal
export const processWithdrawal = async (id) => {
  try {
    const res = await api.post(`/api/admin/process-withdrawal/${id}`);
    return res.data;
  } catch (err) {
    throw err.response ? err.response.data : { status: false, message: 'Server error' };
  }
};

// Get wallet settings
export const getSettings = async () => {
  try {
    const res = await api.get('/api/admin/settings');
    return res.data;
  } catch (err) {
    throw err.response ? err.response.data : { status: false, message: 'Server error' };
  }
};

// Update wallet settings
export const updateSettings = async (settings) => {
  try {
    const res = await api.put('/api/admin/settings', settings);
    return res.data;
  } catch (err) {
    throw err.response ? err.response.data : { status: false, message: 'Server error' };
  }
};

// Get dashboard statistics
export const getDashboardStats = async () => {
  try {
    const res = await api.get('/api/admin/stats');
    return res.data;
  } catch (err) {
    throw err.response ? err.response.data : { status: false, message: 'Server error' };
  }
};
