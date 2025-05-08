import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Container,
  Typography,
  Paper,
  TextField,
  Grid,
  Alert,
  CircularProgress,
  Divider,
  Card,
  CardContent,
  IconButton,
  InputAdornment,
  Tooltip,
  Snackbar
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import SaveIcon from '@mui/icons-material/Save';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import Layout from '../../components/layout/Layout';
import { getSettings, updateSettings } from '../../services/adminService';

const AdminSettings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPrivateKeys, setShowPrivateKeys] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const [settings, setSettings] = useState({
    usdtReceiveWallet: '',
    gasWallet: '',
    gasPrivateKey: '',
    withdrawalAdminPrivateKey: ''
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const result = await getSettings();

      if (result.status) {
        setSettings(result.settings);
      } else {
        setError('Failed to load wallet settings');
      }

      setLoading(false);
    } catch (err) {
      setError('Failed to load wallet settings');
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings(prevSettings => ({
      ...prevSettings,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError('');

      const result = await updateSettings(settings);

      if (result.status) {
        setSuccess('Wallet settings updated successfully');
        setTimeout(() => setSuccess(''), 5000);
      } else {
        setError(result.message || 'Failed to update wallet settings');
      }

      setSaving(false);
    } catch (err) {
      setError(err.message || 'Failed to update wallet settings');
      setSaving(false);
    }
  };

  const handleCopyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setSnackbarMessage('Copied to clipboard');
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const toggleShowPrivateKeys = () => {
    setShowPrivateKeys(!showPrivateKeys);
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
          <Typography variant="h4" component="h1" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            <AdminPanelSettingsIcon sx={{ mr: 1, fontSize: 35 }} />
            Wallet Settings
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Configure system wallet settings for deposits and withdrawals
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

        <Paper sx={{ p: 4, mb: 4, borderRadius: 2 }}>
          <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">
              Wallet Configuration
            </Typography>
            <Button
              variant="outlined"
              color="primary"
              onClick={toggleShowPrivateKeys}
              startIcon={showPrivateKeys ? <VisibilityOffIcon /> : <VisibilityIcon />}
            >
              {showPrivateKeys ? 'Hide Private Keys' : 'Show Private Keys'}
            </Button>
          </Box>

          <Divider sx={{ mb: 3 }} />

          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Card sx={{ mb: 3, borderRadius: 2 }}>
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom fontWeight="500">
                    USDT Receive Wallet
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    This wallet will receive all USDT deposits from users.
                  </Typography>

                  <TextField
                    fullWidth
                    label="USDT Receive Wallet Address"
                    name="usdtReceiveWallet"
                    value={settings.usdtReceiveWallet}
                    onChange={handleChange}
                    variant="outlined"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <Tooltip title="Copy Address">
                            <IconButton
                              edge="end"
                              onClick={() => handleCopyToClipboard(settings.usdtReceiveWallet)}
                            >
                              <ContentCopyIcon />
                            </IconButton>
                          </Tooltip>
                        </InputAdornment>
                      ),
                    }}
                  />
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card sx={{ height: '100%', borderRadius: 2 }}>
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom fontWeight="500">
                    Gas Wallet
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    This wallet provides gas for transactions.
                  </Typography>

                  <TextField
                    fullWidth
                    label="Gas Wallet Address"
                    name="gasWallet"
                    value={settings.gasWallet}
                    onChange={handleChange}
                    variant="outlined"
                    sx={{ mb: 2 }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <Tooltip title="Copy Address">
                            <IconButton
                              edge="end"
                              onClick={() => handleCopyToClipboard(settings.gasWallet)}
                            >
                              <ContentCopyIcon />
                            </IconButton>
                          </Tooltip>
                        </InputAdornment>
                      ),
                    }}
                  />

                  <TextField
                    fullWidth
                    label="Gas Wallet Private Key"
                    name="gasPrivateKey"
                    value={settings.gasPrivateKey}
                    onChange={handleChange}
                    variant="outlined"
                    type={showPrivateKeys ? 'text' : 'password'}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <Tooltip title="Copy Private Key">
                            <IconButton
                              edge="end"
                              onClick={() => handleCopyToClipboard(settings.gasPrivateKey)}
                            >
                              <ContentCopyIcon />
                            </IconButton>
                          </Tooltip>
                        </InputAdornment>
                      ),
                    }}
                  />
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card sx={{ height: '100%', borderRadius: 2 }}>
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom fontWeight="500">
                    Withdrawal Admin Wallet
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    This private key is used to sign withdrawal transactions.
                  </Typography>

                  <TextField
                    fullWidth
                    label="Withdrawal Admin Private Key"
                    name="withdrawalAdminPrivateKey"
                    value={settings.withdrawalAdminPrivateKey}
                    onChange={handleChange}
                    variant="outlined"
                    type={showPrivateKeys ? 'text' : 'password'}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <Tooltip title="Copy Private Key">
                            <IconButton
                              edge="end"
                              onClick={() => handleCopyToClipboard(settings.withdrawalAdminPrivateKey)}
                            >
                              <ContentCopyIcon />
                            </IconButton>
                          </Tooltip>
                        </InputAdornment>
                      ),
                    }}
                  />
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={handleSave}
              disabled={saving}
              startIcon={saving ? <CircularProgress size={20} /> : <SaveIcon />}
            >
              {saving ? 'Saving...' : 'Save Settings'}
            </Button>
          </Box>
        </Paper>

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={handleCloseSnackbar}
          message={snackbarMessage}
        />
      </Container>
    </Layout>
  );
};

export default AdminSettings;
