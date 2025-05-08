import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  Divider,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip
} from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import ReceiptIcon from '@mui/icons-material/Receipt';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import SettingsIcon from '@mui/icons-material/Settings';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import Layout from '../../components/layout/Layout';
import { getDashboardStats } from '../../services/adminService';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalTransactions: 0,
    deposits: {
      count: 0,
      amount: 0
    },
    withdrawals: {
      count: 0,
      amount: 0,
      pending: 0
    },
    recentTransactions: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch dashboard statistics
        const statsData = await getDashboardStats();
        if (statsData.status) {
          setStats(statsData.stats);
        } else {
          setError('Failed to load dashboard statistics');
        }

        setLoading(false);
      } catch (err) {
        setError('Failed to load dashboard data');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
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
            Admin Dashboard
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Overview of system statistics and operations
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Statistics Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  Total Users
                </Typography>
                <Box display="flex" alignItems="center">
                  <PeopleIcon sx={{ color: 'primary.main', mr: 1 }} />
                  <Typography variant="h4" component="div">
                    {stats.totalUsers}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  Pending Withdrawals
                </Typography>
                <Box display="flex" alignItems="center">
                  <AccountBalanceWalletIcon sx={{ color: 'warning.main', mr: 1 }} />
                  <Typography variant="h4" component="div">
                    {stats.withdrawals.pending}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  Total Transactions
                </Typography>
                <Box display="flex" alignItems="center">
                  <ReceiptIcon sx={{ color: 'info.main', mr: 1 }} />
                  <Typography variant="h4" component="div">
                    {stats.totalTransactions}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  {stats.deposits.count + stats.withdrawals.count} transactions
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  Transaction Volume
                </Typography>
                <Box display="flex" alignItems="center">
                  <Typography variant="h4" component="div">
                    {formatCurrency(stats.deposits.amount + stats.withdrawals.amount)}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Deposits: {formatCurrency(stats.deposits.amount)} | Withdrawals: {formatCurrency(stats.withdrawals.amount)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Quick Actions */}
        <Paper sx={{ p: 3, mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Quick Actions
          </Typography>

          <Divider sx={{ mb: 2 }} />

          <Grid container spacing={2}>
            <Grid item>
              <Button
                component={RouterLink}
                to="/admin/users"
                variant="contained"
                startIcon={<PeopleIcon />}
              >
                Manage Users
              </Button>
            </Grid>

            <Grid item>
              <Button
                component={RouterLink}
                to="/admin/transactions"
                variant="contained"
                color="secondary"
                startIcon={<ReceiptIcon />}
              >
                Process Withdrawals
              </Button>
            </Grid>

            <Grid item>
              <Button
                component={RouterLink}
                to="/admin/settings"
                variant="contained"
                color="primary"
                startIcon={<SettingsIcon />}
              >
                Wallet Settings
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {/* Recent Transactions */}
        <Paper sx={{ p: 3, mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Recent Transactions
          </Typography>

          <Divider sx={{ mb: 2 }} />

          {stats.recentTransactions && stats.recentTransactions.length > 0 ? (
            <Box sx={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #ddd' }}>Date</th>
                    <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #ddd' }}>User</th>
                    <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #ddd' }}>Type</th>
                    <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #ddd' }}>Amount</th>
                    <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #ddd' }}>Status</th>
                    <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #ddd' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentTransactions.map((transaction) => (
                    <tr key={transaction._id}>
                      <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                        {new Date(transaction.createdAt).toLocaleString()}
                      </td>
                      <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                        {transaction.user ? transaction.user.email : 'Unknown'}
                      </td>
                      <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                        <Chip
                          size="small"
                          label={transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                          color={transaction.type === 'deposit' ? 'success' : 'primary'}
                        />
                      </td>
                      <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                        {formatCurrency(transaction.amount || 0)}
                      </td>
                      <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                        <Chip
                          size="small"
                          label={transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                          color={
                            transaction.status === 'completed'
                              ? 'success'
                              : transaction.status === 'pending'
                              ? 'warning'
                              : 'error'
                          }
                        />
                      </td>
                      <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                        <Button
                          component={RouterLink}
                          to="/admin/transactions"
                          size="small"
                          variant="outlined"
                        >
                          View
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Box>
          ) : (
            <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 3 }}>
              No recent transactions found
            </Typography>
          )}

          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              component={RouterLink}
              to="/admin/transactions"
              variant="text"
              color="primary"
              endIcon={<ArrowUpwardIcon />}
            >
              View All Transactions
            </Button>
          </Box>
        </Paper>

        {/* System Information */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            System Information
          </Typography>

          <Divider sx={{ mb: 2 }} />

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" gutterBottom>
                Server Status
              </Typography>
              <Box display="flex" alignItems="center">
                <Box
                  sx={{
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    bgcolor: 'success.main',
                    mr: 1
                  }}
                />
                <Typography variant="body1">
                  Online
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" gutterBottom>
                Blockchain Network
              </Typography>
              <Typography variant="body1">
                Binance Smart Chain (BSC)
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" gutterBottom>
                USDT Contract
              </Typography>
              <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>
                0x55d398326f99059fF775485246999027B3197955
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" gutterBottom>
                System Version
              </Typography>
              <Typography variant="body1">
                OwnPay v1.0.0
              </Typography>
            </Grid>

            <Grid item xs={12} sx={{ mt: 2 }}>
              <Button
                component={RouterLink}
                to="/admin/settings"
                variant="outlined"
                color="primary"
                startIcon={<AdminPanelSettingsIcon />}
              >
                Manage Wallet Settings
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </Layout>
  );
};

export default AdminDashboard;
