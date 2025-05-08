import React, { useState } from 'react';
import {
  Box,
  Button,
  Container,
  Typography,
  Paper,
  Stepper,
  Step,
  StepLabel,
  TextField,
  CircularProgress,
  Alert,
  Divider,
  Grid,
  Card,
  CardContent,
  InputAdornment
} from '@mui/material';
import Layout from '../components/layout/Layout';
import { requestWithdrawal } from '../services/walletService';

const steps = ['Enter Details', 'Confirm Withdrawal', 'Completion'];

const Withdraw = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [amount, setAmount] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [transaction, setTransaction] = useState(null);

  const handleNext = () => {
    if (activeStep === 0) {
      // Validate form
      if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
        setError('Please enter a valid amount');
        return;
      }
      
      if (!walletAddress || !/^0x[a-fA-F0-9]{40}$/.test(walletAddress)) {
        setError('Please enter a valid wallet address');
        return;
      }
    }
    
    if (activeStep === 1) {
      handleWithdrawal();
      return;
    }
    
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setError('');
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
    setError('');
  };

  const handleWithdrawal = async () => {
    try {
      setLoading(true);
      setError('');
      
      const result = await requestWithdrawal(amount, walletAddress);
      
      if (result.status) {
        setTransaction(result.transaction);
        setSuccess('Withdrawal request submitted successfully');
        setActiveStep(2);
      } else {
        setError(result.message || 'Failed to submit withdrawal request');
      }
      
      setLoading(false);
    } catch (err) {
      setError(err.message || 'Failed to submit withdrawal request');
      setLoading(false);
    }
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Withdrawal Details
            </Typography>
            
            <TextField
              fullWidth
              label="Amount (USDT)"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              type="number"
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
              }}
              sx={{ mb: 3 }}
            />
            
            <TextField
              fullWidth
              label="Recipient Wallet Address"
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
              placeholder="0x..."
              sx={{ mb: 3 }}
            />
            
            <Alert severity="info" sx={{ mb: 3 }}>
              <Typography variant="body2">
                Please double-check the recipient wallet address before proceeding. Transactions on the blockchain are irreversible.
              </Typography>
            </Alert>
            
            <Typography variant="subtitle2" color="text.secondary">
              Important Notes:
            </Typography>
            <ul>
              <li>
                <Typography variant="body2" color="text.secondary">
                  Withdrawals are processed manually by our administrators.
                </Typography>
              </li>
              <li>
                <Typography variant="body2" color="text.secondary">
                  Processing time may take up to 24 hours.
                </Typography>
              </li>
              <li>
                <Typography variant="body2" color="text.secondary">
                  Minimum withdrawal amount: 10 USDT
                </Typography>
              </li>
            </ul>
          </Box>
        );
      case 1:
        return (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Confirm Withdrawal
            </Typography>
            
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={4} textAlign="right">
                    <Typography variant="body2" color="text.secondary">
                      Amount:
                    </Typography>
                  </Grid>
                  <Grid item xs={8} textAlign="left">
                    <Typography variant="body1" fontWeight="bold">
                      {amount} USDT
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={4} textAlign="right">
                    <Typography variant="body2" color="text.secondary">
                      Recipient Address:
                    </Typography>
                  </Grid>
                  <Grid item xs={8} textAlign="left">
                    <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>
                      {walletAddress}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
            
            <Alert severity="warning" sx={{ mb: 3 }}>
              <Typography variant="body1" gutterBottom>
                Please verify all details before confirming.
              </Typography>
              <Typography variant="body2">
                Once submitted, withdrawal requests cannot be cancelled.
              </Typography>
            </Alert>
          </Box>
        );
      case 2:
        return (
          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>
              Withdrawal Request Submitted
            </Typography>
            
            <Alert severity="success" sx={{ mb: 3 }}>
              Your withdrawal request has been submitted successfully and is pending approval.
            </Alert>
            
            {transaction && (
              <Paper sx={{ p: 3, mt: 3 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Transaction Details:
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={4} textAlign="right">
                    <Typography variant="body2" color="text.secondary">
                      Transaction ID:
                    </Typography>
                  </Grid>
                  <Grid item xs={8} textAlign="left">
                    <Typography variant="body2">
                      {transaction.id}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={4} textAlign="right">
                    <Typography variant="body2" color="text.secondary">
                      Amount:
                    </Typography>
                  </Grid>
                  <Grid item xs={8} textAlign="left">
                    <Typography variant="body2">
                      {transaction.amount} {transaction.currency || 'USDT'}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={4} textAlign="right">
                    <Typography variant="body2" color="text.secondary">
                      Status:
                    </Typography>
                  </Grid>
                  <Grid item xs={8} textAlign="left">
                    <Typography variant="body2">
                      {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={4} textAlign="right">
                    <Typography variant="body2" color="text.secondary">
                      Wallet Address:
                    </Typography>
                  </Grid>
                  <Grid item xs={8} textAlign="left">
                    <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>
                      {transaction.walletAddress}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={4} textAlign="right">
                    <Typography variant="body2" color="text.secondary">
                      Created At:
                    </Typography>
                  </Grid>
                  <Grid item xs={8} textAlign="left">
                    <Typography variant="body2">
                      {new Date(transaction.createdAt).toLocaleString()}
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>
            )}
            
            <Typography variant="body2" color="text.secondary" sx={{ mt: 3 }}>
              You can check the status of your withdrawal in the Transactions page.
            </Typography>
          </Box>
        );
      default:
        return 'Unknown step';
    }
  };

  return (
    <Layout>
      <Container maxWidth="md">
        <Paper sx={{ p: 4, mt: 3 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Withdraw Funds
          </Typography>
          
          <Divider sx={{ mb: 4 }} />
          
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
          
          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          
          {getStepContent(activeStep)}
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
            <Button
              variant="outlined"
              disabled={activeStep === 0 || activeStep === steps.length - 1}
              onClick={handleBack}
            >
              Back
            </Button>
            
            {activeStep === steps.length - 1 ? (
              <Button
                variant="contained"
                component="a"
                href="/transactions"
              >
                View Transactions
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={handleNext}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <CircularProgress size={24} sx={{ mr: 1 }} />
                    Processing...
                  </>
                ) : activeStep === steps.length - 2 ? 'Submit Withdrawal' : 'Next'}
              </Button>
            )}
          </Box>
        </Paper>
      </Container>
    </Layout>
  );
};

export default Withdraw;
