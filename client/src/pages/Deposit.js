import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Container,
  Typography,
  Paper,
  TextField,
  CircularProgress,
  Alert,
  Divider,
  Grid,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Tooltip,
  Fade,
  Chip
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import QrCodeIcon from '@mui/icons-material/QrCode';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import RefreshIcon from '@mui/icons-material/Refresh';
import Layout from '../components/layout/Layout';
import { getDepositAddress, generateDepositAddress, deposit, checkServerHealth } from '../services/walletService';

const Deposit = () => {
  const [depositAddress, setDepositAddress] = useState('');
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [depositLoading, setDepositLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [transaction, setTransaction] = useState(null);
  const [showQR, setShowQR] = useState(false);
  const [serverFeatures, setServerFeatures] = useState({
    depositAddress: false
  });

  useEffect(() => {
    // Check server health first to see which features are available
    const checkHealth = async () => {
      try {
        const health = await checkServerHealth();
        console.log('Server health in Deposit page:', health);

        setServerFeatures({
          depositAddress: health.status && health.routes && health.routes.depositAddress
        });

        // Only try to fetch deposit address if the feature is available
        if (health.status && health.routes && health.routes.depositAddress) {
          await fetchDepositAddress();
        } else {
          console.log('Deposit address feature not available');
          setLoading(false);
        }
      } catch (err) {
        console.error('Error checking server health:', err);
        setLoading(false);
      }
    };

    checkHealth();
  }, []);

  const fetchDepositAddress = async () => {
    try {
      setLoading(true);
      console.log('Fetching deposit address from Deposit page...');
      const result = await getDepositAddress();
      console.log('Deposit address data:', result);

      if (result.status) {
        if (result.hasDepositAddress) {
          setDepositAddress(result.wallet.address);
        }
      } else {
        console.log('Failed to load deposit address: Status false');
      }

      setLoading(false);
    } catch (err) {
      console.error('Error fetching deposit address:', err);
      // Don't show error to user, just continue with empty deposit address
      setLoading(false);
    }
  };

  const handleGenerateAddress = async () => {
    try {
      setGenerating(true);
      setError('');

      console.log('Generating deposit address...');
      const result = await generateDepositAddress();
      console.log('Generate deposit address result:', result);

      if (result.status) {
        setDepositAddress(result.wallet.address);
        setSuccess('Deposit address generated successfully');
      } else {
        // If the endpoint doesn't exist, show a more user-friendly error
        if (result.message === 'Endpoint not found') {
          setError('This feature is currently unavailable. Please try again later.');
        } else {
          setError(result.message || 'Failed to generate deposit address');
        }
      }

      setGenerating(false);
    } catch (err) {
      console.error('Error generating deposit address:', err);
      setError(err.message || 'Failed to generate deposit address');
      setGenerating(false);
    }
  };

  const handleDeposit = async () => {
    try {
      setDepositLoading(true);
      setError('');

      console.log('Starting deposit process...');
      const result = await deposit();
      console.log('Deposit result:', result);

      if (result.status) {
        setTransaction(result.transaction);
        setSuccess('Deposit process started successfully');
      } else {
        // If the endpoint doesn't exist, show a more user-friendly error
        if (result.message === 'Endpoint not found') {
          setError('This feature is currently unavailable. Please try again later.');
        } else {
          setError(result.message || 'Failed to start deposit process');
        }
      }

      setDepositLoading(false);
    } catch (err) {
      console.error('Error starting deposit process:', err);
      setError(err.message || 'Failed to start deposit process');
      setDepositLoading(false);
    }
  };

  const handleCopyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setSuccess('Address copied to clipboard');
    setTimeout(() => setSuccess(''), 3000);
  };

  const toggleQRCode = () => {
    setShowQR(!showQR);
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
      <Container maxWidth="md">
        <Paper
          sx={{
            p: 4,
            mt: 3,
            borderRadius: 2,
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
          }}
        >
          <Box display="flex" alignItems="center" mb={2}>
            <AccountBalanceWalletIcon
              sx={{
                fontSize: 36,
                mr: 2,
                color: 'primary.main'
              }}
            />
            <Typography
              variant="h4"
              component="h1"
              fontWeight="500"
            >
              Deposit Funds
            </Typography>
          </Box>

          <Divider sx={{ mb: 4 }} />

          {error && (
            <Alert
              severity="error"
              sx={{
                mb: 3,
                borderRadius: 1
              }}
            >
              {error}
            </Alert>
          )}

          {success && (
            <Alert
              severity="success"
              sx={{
                mb: 3,
                borderRadius: 1
              }}
            >
              {success}
            </Alert>
          )}

          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Card
                sx={{
                  height: '100%',
                  borderRadius: 2,
                  boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="h6" fontWeight="500">
                      Your Deposit Address
                    </Typography>
                    <Tooltip title="Refresh">
                      <IconButton onClick={fetchDepositAddress} size="small">
                        <RefreshIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>

                  {!serverFeatures.depositAddress ? (
                    <Alert
                      severity="warning"
                      sx={{
                        mb: 2,
                        borderRadius: 1
                      }}
                    >
                      <Typography variant="body1" fontWeight="500">
                        Deposit Address Feature Unavailable
                      </Typography>
                      <Typography variant="body2" paragraph>
                        The deposit address feature is currently unavailable. Please contact support for assistance.
                      </Typography>
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => window.location.reload()}
                      >
                        Refresh Page
                      </Button>
                    </Alert>
                  ) : depositAddress ? (
                    <>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <TextField
                          fullWidth
                          label="USDT Deposit Address (BEP-20)"
                          value={depositAddress}
                          InputProps={{
                            readOnly: true,
                            sx: { fontFamily: 'monospace' }
                          }}
                          variant="outlined"
                          size="small"
                        />
                        <Tooltip title="Copy Address">
                          <IconButton
                            color="primary"
                            sx={{ ml: 1 }}
                            onClick={() => handleCopyToClipboard(depositAddress)}
                          >
                            <ContentCopyIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Show QR Code">
                          <IconButton
                            color="primary"
                            sx={{ ml: 0.5 }}
                            onClick={toggleQRCode}
                          >
                            <QrCodeIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>

                      <Fade in={showQR}>
                        <Box
                          sx={{
                            display: showQR ? 'flex' : 'none',
                            justifyContent: 'center',
                            mb: 2
                          }}
                        >
                          <Card
                            sx={{
                              p: 2,
                              border: '1px solid #eee',
                              borderRadius: 2
                            }}
                          >
                            <CardMedia
                              component="img"
                              sx={{ width: 180, height: 180 }}
                              image={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${depositAddress}`}
                              alt="QR Code for deposit address"
                            />
                          </Card>
                        </Box>
                      </Fade>

                      <Button
                        variant="contained"
                        fullWidth
                        onClick={handleDeposit}
                        disabled={depositLoading}
                        sx={{
                          mt: 2,
                          py: 1.2,
                          borderRadius: 1.5,
                          textTransform: 'none',
                          fontWeight: 500
                        }}
                      >
                        {depositLoading ? (
                          <>
                            <CircularProgress size={24} sx={{ mr: 1 }} />
                            Processing Deposit...
                          </>
                        ) : 'Start Deposit Process'}
                      </Button>
                    </>
                  ) : (
                    <>
                      <Alert
                        severity="info"
                        sx={{
                          mb: 2,
                          borderRadius: 1
                        }}
                      >
                        You don't have a deposit address yet. Generate one to start accepting deposits.
                      </Alert>

                      <Button
                        variant="contained"
                        fullWidth
                        onClick={handleGenerateAddress}
                        disabled={generating}
                        sx={{
                          mt: 2,
                          py: 1.2,
                          borderRadius: 1.5,
                          textTransform: 'none',
                          fontWeight: 500
                        }}
                      >
                        {generating ? (
                          <>
                            <CircularProgress size={24} sx={{ mr: 1 }} />
                            Generating...
                          </>
                        ) : 'Generate Deposit Address'}
                      </Button>
                    </>
                  )}
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card
                sx={{
                  height: '100%',
                  borderRadius: 2,
                  boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
                  bgcolor: 'rgba(25, 118, 210, 0.04)'
                }}
              >
                <CardContent>
                  <Typography variant="h6" fontWeight="500" gutterBottom>
                    Deposit Instructions
                  </Typography>

                  <Box sx={{ mb: 2 }}>
                    <Chip
                      label="USDT (BEP-20)"
                      color="primary"
                      size="small"
                      sx={{ mb: 1 }}
                    />
                    <Typography variant="body2" paragraph>
                      Send only USDT on the Binance Smart Chain (BEP-20) network to this address.
                    </Typography>
                  </Box>

                  <Typography variant="subtitle2" fontWeight="500" gutterBottom>
                    How to Deposit:
                  </Typography>

                  <ol>
                    <li>
                      <Typography variant="body2" paragraph>
                        Copy your unique deposit address or scan the QR code.
                      </Typography>
                    </li>
                    <li>
                      <Typography variant="body2" paragraph>
                        Send USDT (BEP-20) from your wallet or exchange to this address.
                      </Typography>
                    </li>
                    <li>
                      <Typography variant="body2" paragraph>
                        Click "Start Deposit Process" to begin monitoring for your deposit.
                      </Typography>
                    </li>
                    <li>
                      <Typography variant="body2" paragraph>
                        Once detected, your deposit will be automatically processed.
                      </Typography>
                    </li>
                  </ol>

                  <Alert
                    severity="warning"
                    sx={{
                      mt: 2,
                      borderRadius: 1
                    }}
                  >
                    <Typography variant="body2" fontWeight="500">
                      Important Notes:
                    </Typography>
                    <ul style={{ paddingLeft: '20px', marginTop: '8px', marginBottom: '0' }}>
                      <li>
                        <Typography variant="body2">
                          Minimum deposit: 1 USDT
                        </Typography>
                      </li>
                      <li>
                        <Typography variant="body2">
                          Sending any other token may result in permanent loss
                        </Typography>
                      </li>
                      <li>
                        <Typography variant="body2">
                          Deposits typically take 2-5 minutes to process
                        </Typography>
                      </li>
                    </ul>
                  </Alert>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {transaction && (
            <Card
              sx={{
                mt: 4,
                borderRadius: 2,
                boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
                bgcolor: 'rgba(76, 175, 80, 0.04)'
              }}
            >
              <CardContent>
                <Typography variant="h6" fontWeight="500" gutterBottom>
                  Deposit Initiated
                </Typography>

                <Alert
                  severity="success"
                  sx={{
                    mb: 3,
                    borderRadius: 1
                  }}
                >
                  Your deposit process has been initiated successfully. The system will now monitor your wallet for incoming transactions.
                </Alert>

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={3} md={2} textAlign={{ xs: 'left', sm: 'right' }}>
                    <Typography variant="body2" color="text.secondary" fontWeight="500">
                      Transaction ID:
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={9} md={10} textAlign="left">
                    <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>
                      {transaction.id}
                    </Typography>
                  </Grid>

                  <Grid item xs={12} sm={3} md={2} textAlign={{ xs: 'left', sm: 'right' }}>
                    <Typography variant="body2" color="text.secondary" fontWeight="500">
                      Status:
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={9} md={10} textAlign="left">
                    <Chip
                      label={transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                      color={transaction.status === 'pending' ? 'warning' : 'success'}
                      size="small"
                    />
                  </Grid>

                  <Grid item xs={12} sm={3} md={2} textAlign={{ xs: 'left', sm: 'right' }}>
                    <Typography variant="body2" color="text.secondary" fontWeight="500">
                      Wallet Address:
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={9} md={10} textAlign="left">
                    <Typography variant="body2" sx={{ wordBreak: 'break-all', fontFamily: 'monospace' }}>
                      {transaction.walletAddress}
                    </Typography>
                  </Grid>

                  <Grid item xs={12} sm={3} md={2} textAlign={{ xs: 'left', sm: 'right' }}>
                    <Typography variant="body2" color="text.secondary" fontWeight="500">
                      Created At:
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={9} md={10} textAlign="left">
                    <Typography variant="body2">
                      {new Date(transaction.createdAt).toLocaleString()}
                    </Typography>
                  </Grid>
                </Grid>

                <Box sx={{ mt: 3, textAlign: 'center' }}>
                  <Button
                    variant="outlined"
                    href="/transactions"
                    sx={{
                      borderRadius: 1.5,
                      textTransform: 'none',
                      fontWeight: 500
                    }}
                  >
                    View All Transactions
                  </Button>
                </Box>
              </CardContent>
            </Card>
          )}
        </Paper>
      </Container>
    </Layout>
  );
};

export default Deposit;
