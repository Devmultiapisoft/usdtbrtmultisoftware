import React, { useState, useEffect } from 'react';
import {
  Box,
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
  Divider
} from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import Layout from '../components/layout/Layout';
import { getTransactions } from '../services/walletService';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        const result = await getTransactions();
        
        if (result.status) {
          setTransactions(result.transactions);
        } else {
          setError('Failed to load transactions');
        }
        
        setLoading(false);
      } catch (err) {
        setError('Failed to load transactions');
        setLoading(false);
      }
    };
    
    fetchTransactions();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
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
        <Typography variant="h4" component="h1" gutterBottom>
          Transaction History
        </Typography>
        
        <Divider sx={{ mb: 4 }} />
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        {transactions.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="body1" color="text.secondary">
              No transactions found.
            </Typography>
          </Paper>
        ) : (
          <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            <TableContainer sx={{ maxHeight: 600 }}>
              <Table stickyHeader aria-label="transactions table">
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Wallet Address</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Transaction Hash</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {transactions
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((transaction) => (
                      <TableRow hover key={transaction._id}>
                        <TableCell>
                          {new Date(transaction.createdAt).toLocaleString()}
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
                          {transaction.transactionHash ? (
                            <Typography
                              sx={{
                                maxWidth: 150,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                              }}
                            >
                              <a
                                href={`https://bscscan.com/tx/${transaction.transactionHash}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ textDecoration: 'none' }}
                              >
                                {transaction.transactionHash}
                              </a>
                            </Typography>
                          ) : (
                            <Typography color="text.secondary" variant="body2">
                              Pending
                            </Typography>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={transactions.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
        )}
      </Container>
    </Layout>
  );
};

export default Transactions;
