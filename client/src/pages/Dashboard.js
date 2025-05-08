import React, { useState, useEffect, useContext } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  Typography,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Alert,
  TextField,
  IconButton,
  Tooltip,
  Chip
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import HistoryIcon from '@mui/icons-material/History';
import Layout from '../components/layout/Layout';
import AuthContext from '../context/AuthContext';
import { getWallets, getTransactions, generateWallet, getDepositAddress, checkServerHealth } from '../services/walletService';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [wallets, setWallets] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [walletLoading, setWalletLoading] = useState(false);
  const [depositAddress, setDepositAddress] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Check server health first
        console.log('Checking server health from Dashboard...');
        const health = await checkServerHealth();
        console.log('Server health in Dashboard:', health);

        // Fetch wallets
        const walletsData = await getWallets();
        if (walletsData.status) {
          setWallets(walletsData.wallets);
        }

        // Fetch recent transactions
        const transactionsData = await getTransactions();
        if (transactionsData.status) {
          // Get only the 5 most recent transactions
          setTransactions(transactionsData.transactions.slice(0, 5));
        }

        // Fetch deposit address only if the feature is available
        if (health.status && health.routes && health.routes.depositAddress) {
          try {
            console.log('Fetching deposit address from Dashboard...');
            const depositAddressData = await getDepositAddress();
            console.log('Deposit address data:', depositAddressData);
            if (depositAddressData.status && depositAddressData.hasDepositAddress) {
              setDepositAddress(depositAddressData.wallet.address);
            }
          } catch (err) {
            console.error('Error fetching deposit address:', err);
            // Continue without deposit address, don't show error to user
          }
        } else {
          console.log('Deposit address feature not available');
        }

        setLoading(false);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // We've removed the deposit address section from the Dashboard
  // so we don't need these functions anymore

  const handleGenerateWallet = async () => {
    try {
      setWalletLoading(true);
      const result = await generateWallet('My Wallet');

      if (result.status) {
        // Add the new wallet to the list
        setWallets([...wallets, result.wallet]);
        setError('');
      } else {
        setError(result.message || 'Failed to generate wallet');
      }

      setWalletLoading(false);
    } catch (err) {
      setError(err.message || 'Failed to generate wallet');
      setWalletLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
          <CircularProgress />
        </Box>
      </Layout>
    );
  }

  return (
    <Layout>
      <Container maxWidth="lg">
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Dashboard
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Welcome back, {user ? user.name : 'User'}!
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            {success}
          </Alert>
        )}

        <Grid container spacing={3}>
          {/* Quick Actions - Always show this section */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3, mb: 4, borderRadius: 2, boxShadow: '0 2px 10px rgba(0,0,0,0.08)' }}>
              <Typography variant="h6" component="h2" mb={2}>
                Quick Actions
              </Typography>

              <Divider sx={{ mb: 3 }} />

              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={4}>
                  <Card sx={{ height: '100%', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                    <CardContent sx={{ textAlign: 'center' }}>
                      <ArrowDownwardIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                      <Typography variant="h6" gutterBottom>
                        Deposit
                      </Typography>
                      <Typography variant="body2" color="text.secondary" mb={2}>
                        Add funds to your wallet
                      </Typography>
                      <Button
                        component={RouterLink}
                        to="/deposit"
                        variant="contained"
                        fullWidth
                      >
                        Deposit
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <Card sx={{ height: '100%', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                    <CardContent sx={{ textAlign: 'center' }}>
                      <ArrowUpwardIcon sx={{ fontSize: 40, color: 'secondary.main', mb: 1 }} />
                      <Typography variant="h6" gutterBottom>
                        Withdraw
                      </Typography>
                      <Typography variant="body2" color="text.secondary" mb={2}>
                        Withdraw funds to external wallet
                      </Typography>
                      <Button
                        component={RouterLink}
                        to="/withdraw"
                        variant="contained"
                        color="secondary"
                        fullWidth
                      >
                        Withdraw
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <Card sx={{ height: '100%', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                    <CardContent sx={{ textAlign: 'center' }}>
                      <HistoryIcon sx={{ fontSize: 40, color: 'info.main', mb: 1 }} />
                      <Typography variant="h6" gutterBottom>
                        Transactions
                      </Typography>
                      <Typography variant="body2" color="text.secondary" mb={2}>
                        View your transaction history
                      </Typography>
                      <Button
                        component={RouterLink}
                        to="/transactions"
                        variant="contained"
                        color="info"
                        fullWidth
                      >
                        View History
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>

                {/* <Grid item xs={12} sm={6} md={3}>
                  <Card sx={{ height: '100%', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                    <CardContent sx={{ textAlign: 'center' }}>
                      <AccountBalanceWalletIcon sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
                      <Typography variant="h6" gutterBottom>
                        Wallets
                      </Typography>
                      <Typography variant="body2" color="text.secondary" mb={2}>
                        Manage your wallets
                      </Typography>
                      <Button
                        variant="contained"
                        color="success"
                        fullWidth
                        onClick={handleGenerateWallet}
                        disabled={walletLoading}
                      >
                        {walletLoading ? 'Creating...' : 'New Wallet'}
                      </Button>
                    </CardContent>
                  </Card>
                </Grid> */}
              </Grid>
            </Paper>
          </Grid>

          {/* Wallets Section */}
          <Grid item xs={12} md={12}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6" component="h2">
                  <AccountBalanceWalletIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                  My Wallets
                </Typography>
              
              </Box>

              <Divider sx={{ mb: 2 }} />

              {wallets.length === 0 ? (
                <Box textAlign="center" py={3}>
                  <Typography variant="body1" color="text.secondary">
                    You don't have any wallets yet.
                  </Typography>
                  <Button
                    variant="outlined"
                    sx={{ mt: 2 }}
                    startIcon={<AddIcon />}
                    onClick={handleGenerateWallet}
                    disabled={walletLoading}
                  >
                    Generate Your First Wallet
                  </Button>
                </Box>
              ) : (
                <List>
                  {wallets.map((wallet, index) => (
                    <ListItem key={wallet.address} divider={index < wallets.length - 1}>
                      <ListItemText
                        primary={wallet.label}
                        secondary={
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            {wallet.address}
                          </Typography>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </Paper>
          </Grid>

          {/* Recent Transactions */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6" component="h2">
                  <HistoryIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Recent Transactions
                </Typography>
                <Button
                  component={RouterLink}
                  to="/transactions"
                  variant="outlined"
                  size="small"
                >
                  View All
                </Button>
              </Box>

              <Divider sx={{ mb: 2 }} />

              {transactions.length === 0 ? (
                <Box textAlign="center" py={3}>
                  <Typography variant="body1" color="text.secondary">
                    No transactions yet.
                  </Typography>
                </Box>
              ) : (
                <List>
                  {transactions.map((transaction, index) => (
                    <ListItem key={transaction._id} divider={index < transactions.length - 1}>
                      <ListItemText
                        primary={
                          <Box display="flex" justifyContent="space-between">
                            <Typography variant="body1">
                              {transaction.type === 'deposit' ? 'Deposit' : 'Withdrawal'}
                            </Typography>
                            <Typography
                              variant="body1"
                              color={transaction.type === 'deposit' ? 'success.main' : 'secondary.main'}
                            >
                              {transaction.type === 'deposit' ? '+' : '-'}{transaction.amount} {transaction.currency}
                            </Typography>
                          </Box>
                        }
                        secondary={
                          <Box display="flex" justifyContent="space-between">
                            <Typography variant="body2" color="text.secondary">
                              {new Date(transaction.createdAt).toLocaleDateString()}
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{
                                color:
                                  transaction.status === 'completed' ? 'success.main' :
                                  transaction.status === 'pending' ? 'warning.main' :
                                  'error.main'
                              }}
                            >
                              {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Layout>
  );
};

export default Dashboard;
