import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  CircularProgress,
  Alert,
  Divider,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  IconButton,
  InputAdornment
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import RefreshIcon from '@mui/icons-material/Refresh';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import Layout from '../../components/layout/Layout';
import { getTransactions, processWithdrawal } from '../../services/adminService';

const AdminTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [adminPrivateKey, setAdminPrivateKey] = useState('');
  const [processing, setProcessing] = useState(false);

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchTransactions();
  }, []);

  // Apply filters whenever filter states change
  useEffect(() => {
    applyFilters();
  }, [searchTerm, typeFilter, statusFilter, transactions]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const result = await getTransactions();

      if (result.status) {
        setTransactions(result.transactions);
        setFilteredTransactions(result.transactions);
      } else {
        setError('Failed to load transactions');
      }

      setLoading(false);
    } catch (err) {
      setError('Failed to load transactions');
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...transactions];

    // Apply search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(
        transaction =>
          (transaction.walletAddress && transaction.walletAddress.toLowerCase().includes(search)) ||
          (transaction.user && transaction.user.name && transaction.user.name.toLowerCase().includes(search)) ||
          (transaction.user && transaction.user.email && transaction.user.email.toLowerCase().includes(search)) ||
          (transaction._id && transaction._id.toLowerCase().includes(search))
      );
    }

    // Apply type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(transaction => transaction.type === typeFilter);
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(transaction => transaction.status === statusFilter);
    }

    setFilteredTransactions(filtered);
    setPage(0); // Reset to first page when filters change
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleTypeFilterChange = (event) => {
    setTypeFilter(event.target.value);
  };

  const handleStatusFilterChange = (event) => {
    setStatusFilter(event.target.value);
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setTypeFilter('all');
    setStatusFilter('all');
    setFilteredTransactions(transactions);
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenDialog = (transaction) => {
    setSelectedTransaction(transaction);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedTransaction(null);
    setAdminPrivateKey('');
    setError('');
  };

  const handleProcessWithdrawal = async () => {
    try {
      setProcessing(true);
      const result = await processWithdrawal(selectedTransaction._id);

      if (result.status) {
        setSuccess(`Withdrawal processed successfully. Transaction hash: ${result.transaction.transactionHash}`);
        handleCloseDialog();
        fetchTransactions(); // Refresh the transactions list
      } else {
        setError(result.message || 'Failed to process withdrawal');
      }

      setProcessing(false);
    } catch (err) {
      setError(err.message || 'Failed to process withdrawal');
      setProcessing(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'failed':
        return 'error';
      default:
        return 'default';
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
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4" component="h1">
            Transaction Management
          </Typography>

          <Box>
            <Button
              variant="outlined"
              startIcon={<FilterListIcon />}
              onClick={toggleFilters}
              sx={{ mr: 1 }}
            >
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </Button>

            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={fetchTransactions}
            >
              Refresh
            </Button>
          </Box>
        </Box>

        <Divider sx={{ mb: 3 }} />

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

        {/* Filters */}
        {showFilters && (
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Filter Transactions
            </Typography>

            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Search"
                  variant="outlined"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  placeholder="Search by wallet address, user, or ID"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Transaction Type</InputLabel>
                  <Select
                    value={typeFilter}
                    label="Transaction Type"
                    onChange={handleTypeFilterChange}
                  >
                    <MenuItem value="all">All Types</MenuItem>
                    <MenuItem value="deposit">Deposits</MenuItem>
                    <MenuItem value="withdrawal">Withdrawals</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={statusFilter}
                    label="Status"
                    onChange={handleStatusFilterChange}
                  >
                    <MenuItem value="all">All Statuses</MenuItem>
                    <MenuItem value="pending">Pending</MenuItem>
                    <MenuItem value="completed">Completed</MenuItem>
                    <MenuItem value="failed">Failed</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={2}>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={handleResetFilters}
                >
                  Reset Filters
                </Button>
              </Grid>
            </Grid>
          </Paper>
        )}

        {filteredTransactions.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="body1" color="text.secondary">
              {transactions.length === 0 ? 'No transactions found.' : 'No transactions match your filters.'}
            </Typography>
            {transactions.length > 0 && filteredTransactions.length === 0 && (
              <Button
                variant="outlined"
                color="primary"
                sx={{ mt: 2 }}
                onClick={handleResetFilters}
              >
                Reset Filters
              </Button>
            )}
          </Paper>
        ) : (
          <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            <TableContainer sx={{ maxHeight: 600 }}>
              <Table stickyHeader aria-label="transactions table">
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>User</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Wallet Address</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredTransactions
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((transaction) => (
                      <TableRow hover key={transaction._id}>
                        <TableCell>
                          {new Date(transaction.createdAt).toLocaleString()}
                        </TableCell>
                        <TableCell>
                          {transaction.user ? transaction.user.name : 'Unknown'}
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            {transaction.type === 'deposit' ? (
                              <ArrowDownwardIcon sx={{ color: 'success.main', mr: 1 }} />
                            ) : (
                              <ArrowUpwardIcon sx={{ color: 'secondary.main', mr: 1 }} />
                            )}
                            {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography
                            color={transaction.type === 'deposit' ? 'success.main' : 'secondary.main'}
                            fontWeight="bold"
                          >
                            {transaction.type === 'deposit' ? '+' : '-'}{transaction.amount} {transaction.currency || 'USDT'}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography
                            sx={{
                              maxWidth: 150,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            {transaction.walletAddress}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                            color={getStatusColor(transaction.status)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          {transaction.type === 'withdrawal' && transaction.status === 'pending' && (
                            <Button
                              variant="contained"
                              size="small"
                              onClick={() => handleOpenDialog(transaction)}
                            >
                              Process
                            </Button>
                          )}
                          {transaction.transactionHash && (
                            <Button
                              variant="outlined"
                              size="small"
                              href={`https://bscscan.com/tx/${transaction.transactionHash}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              sx={{ ml: transaction.type === 'withdrawal' && transaction.status === 'pending' ? 1 : 0 }}
                            >
                              View
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, 50]}
              component="div"
              count={filteredTransactions.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
        )}

        {/* Process Withdrawal Dialog */}
        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogTitle>Process Withdrawal</DialogTitle>
          <DialogContent>
            <DialogContentText>
              You are about to process a withdrawal request. Please review the details below. The transaction will be processed using the admin wallet configured in settings.
            </DialogContentText>

            {selectedTransaction && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Transaction Details:
                </Typography>
                <Typography variant="body2">
                  Amount: {selectedTransaction.amount} {selectedTransaction.currency || 'USDT'}
                </Typography>
                <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>
                  Recipient Address: {selectedTransaction.walletAddress}
                </Typography>
                <Typography variant="body2">
                  User: {selectedTransaction.user ? selectedTransaction.user.name : 'Unknown'}
                </Typography>
                <Typography variant="body2">
                  Date: {new Date(selectedTransaction.createdAt).toLocaleString()}
                </Typography>
              </Box>
            )}

            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} disabled={processing}>
              Cancel
            </Button>
            <Button
              onClick={handleProcessWithdrawal}
              variant="contained"
              disabled={processing}
            >
              {processing ? 'Processing...' : 'Process Withdrawal'}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Layout>
  );
};

export default AdminTransactions;
