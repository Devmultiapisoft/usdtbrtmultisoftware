import React, { useContext } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  Typography,
  Paper,
  Stack,
  Divider,
  useTheme,
  useMediaQuery,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip
} from '@mui/material';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import SecurityIcon from '@mui/icons-material/Security';
import SpeedIcon from '@mui/icons-material/Speed';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import PaymentsIcon from '@mui/icons-material/Payments';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ReceiptIcon from '@mui/icons-material/Receipt';
import Layout from '../components/layout/Layout';
import AuthContext from '../context/AuthContext';

// Hero section background
const heroBg = 'linear-gradient(135deg, #1976d2 0%, #0d47a1 100%)';

const Home = () => {
  const { isAuthenticated, user } = useContext(AuthContext);
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Features data
  const features = [
    {
      icon: <SecurityIcon sx={{ fontSize: 50, color: 'primary.main' }} />,
      title: 'Secure Transactions',
      description: 'Enterprise-grade security with blockchain technology ensuring your funds are always protected.'
    },
    {
      icon: <SpeedIcon sx={{ fontSize: 50, color: 'primary.main' }} />,
      title: 'Lightning Fast',
      description: 'Instant deposits and quick withdrawals with real-time transaction monitoring.'
    },
    {
      icon: <AccountBalanceWalletIcon sx={{ fontSize: 50, color: 'primary.main' }} />,
      title: 'Easy Management',
      description: 'User-friendly dashboard to manage your wallets, deposits, and withdrawals with ease.'
    },
    {
      icon: <SupportAgentIcon sx={{ fontSize: 50, color: 'primary.main' }} />,
      title: '24/7 Support',
      description: 'Our dedicated support team is always available to help you with any questions.'
    }
  ];

  // Benefits list
  const benefits = [
    'Accept USDT payments globally',
    'Low transaction fees',
    'No chargebacks',
    'Instant settlement',
    'Detailed transaction reports',
    'Secure wallet management'
  ];

  // Render different content based on authentication status
  const renderAuthContent = () => {
    if (isAuthenticated && user) {
      return (
        <Box sx={{ textAlign: 'center', my: 4 }}>
          <Typography variant="h4" gutterBottom>
            Welcome back, {user.name}!
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Continue managing your payments and transactions.
          </Typography>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            justifyContent="center"
            sx={{ mt: 3 }}
          >
            <Button
              component={RouterLink}
              to="/dashboard"
              variant="contained"
              size="large"
              startIcon={<DashboardIcon />}
            >
              Go to Dashboard
            </Button>
            <Button
              component={RouterLink}
              to="/deposit"
              variant="outlined"
              size="large"
              startIcon={<PaymentsIcon />}
            >
              Make a Deposit
            </Button>
            <Button
              component={RouterLink}
              to="/transactions"
              variant="outlined"
              size="large"
              startIcon={<ReceiptIcon />}
            >
              View Transactions
            </Button>
          </Stack>
        </Box>
      );
    }

    return (
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        justifyContent="center"
        sx={{ mt: 4 }}
      >
        <Button
          component={RouterLink}
          to="/register"
          variant="contained"
          size="large"
          sx={{ px: 4, py: 1.5, fontSize: '1.1rem' }}
        >
          Get Started
        </Button>
        <Button
          component={RouterLink}
          to="/login"
          variant="outlined"
          size="large"
          sx={{ px: 4, py: 1.5, fontSize: '1.1rem' }}
        >
          Login
        </Button>
      </Stack>
    );
  };

  return (
    <Layout>
      {/* Hero Section */}
      <Box
        sx={{
          background: heroBg,
          color: 'white',
          pt: { xs: 8, md: 12 },
          pb: { xs: 10, md: 14 },
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            right: 0,
            width: '100%',
            height: '100%',
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z" fill="%23ffffff" fill-opacity="0.05" fill-rule="evenodd"/%3E%3C/svg%3E")',
            backgroundSize: 'cover',
            opacity: 0.3,
            zIndex: 0
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            height: '30%',
            background: 'linear-gradient(to top, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 100%)',
            zIndex: 1
          }
        }}
      >
        {/* Animated circles in background */}
        <Box
          sx={{
            position: 'absolute',
            top: '10%',
            left: '5%',
            width: '12vw',
            height: '12vw',
            maxWidth: '150px',
            maxHeight: '150px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)',
            animation: 'pulse 8s infinite',
            '@keyframes pulse': {
              '0%': { transform: 'scale(1)', opacity: 0.3 },
              '50%': { transform: 'scale(1.2)', opacity: 0.5 },
              '100%': { transform: 'scale(1)', opacity: 0.3 }
            },
            zIndex: 0
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: '20%',
            right: '10%',
            width: '15vw',
            height: '15vw',
            maxWidth: '180px',
            maxHeight: '180px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)',
            animation: 'pulse 12s infinite',
            animationDelay: '2s',
            zIndex: 0
          }}
        />

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
          <Grid container spacing={{ xs: 2, md: 4 }} alignItems="center">
            <Grid item xs={12} md={7}>
              <Typography
                component="h1"
                variant="h2"
                fontWeight="bold"
                gutterBottom
                sx={{
                  fontSize: { xs: '2.5rem', sm: '3rem', md: '3.5rem' },
                  textShadow: '0 2px 10px rgba(0,0,0,0.2)',
                  mb: { xs: 2, md: 3 }
                }}
              >
                OwnPay Payment Gateway
              </Typography>
              <Typography
                variant="h5"
                paragraph
                sx={{
                  mb: 4,
                  opacity: 0.9,
                  fontSize: { xs: '1.1rem', md: '1.3rem' },
                  lineHeight: 1.5,
                  maxWidth: '90%'
                }}
              >
                A secure, fast, and reliable blockchain payment solution for your business.
                Accept USDT payments with ease and manage your transactions in one place.
              </Typography>

              {renderAuthContent()}

              <Box sx={{
                mt: 4,
                display: 'flex',
                flexWrap: 'wrap',
                gap: { xs: 1, md: 1.5 },
                justifyContent: { xs: 'center', md: 'flex-start' }
              }}>
                <Chip
                  icon={<CheckCircleIcon />}
                  label="Secure"
                  sx={{
                    bgcolor: 'rgba(255,255,255,0.15)',
                    color: 'white',
                    px: 1,
                    backdropFilter: 'blur(5px)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      bgcolor: 'rgba(255,255,255,0.25)',
                      transform: 'translateY(-3px)'
                    }
                  }}
                />
                <Chip
                  icon={<CheckCircleIcon />}
                  label="Fast"
                  sx={{
                    bgcolor: 'rgba(255,255,255,0.15)',
                    color: 'white',
                    px: 1,
                    backdropFilter: 'blur(5px)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      bgcolor: 'rgba(255,255,255,0.25)',
                      transform: 'translateY(-3px)'
                    }
                  }}
                />
                <Chip
                  icon={<CheckCircleIcon />}
                  label="Low Fees"
                  sx={{
                    bgcolor: 'rgba(255,255,255,0.15)',
                    color: 'white',
                    px: 1,
                    backdropFilter: 'blur(5px)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      bgcolor: 'rgba(255,255,255,0.25)',
                      transform: 'translateY(-3px)'
                    }
                  }}
                />
                <Chip
                  icon={<CheckCircleIcon />}
                  label="24/7 Support"
                  sx={{
                    bgcolor: 'rgba(255,255,255,0.15)',
                    color: 'white',
                    px: 1,
                    backdropFilter: 'blur(5px)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      bgcolor: 'rgba(255,255,255,0.25)',
                      transform: 'translateY(-3px)'
                    }
                  }}
                />
              </Box>
            </Grid>

            {/* Hero image - visible on all screen sizes with different styling */}
            <Grid item xs={12} md={5} sx={{ mt: { xs: 4, md: 0 } }}>
              <Box
                component="img"
                src="https://images.unsplash.com/photo-1621416894569-0f39ed31d247?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1039&q=80"
                alt="Cryptocurrency"
                sx={{
                  width: '100%',
                  maxWidth: { xs: '80%', md: '100%' },
                  borderRadius: { xs: 3, md: 4 },
                  boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
                  transform: {
                    xs: 'none',
                    md: 'perspective(1000px) rotateY(-10deg)'
                  },
                  mx: { xs: 'auto', md: 0 },
                  display: 'block',
                  transition: 'transform 0.5s ease-in-out',
                  '&:hover': {
                    transform: {
                      xs: 'scale(1.03)',
                      md: 'perspective(1000px) rotateY(-5deg) scale(1.03)'
                    },
                  }
                }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Container sx={{ py: { xs: 6, md: 10 } }} maxWidth="lg">
        <Typography variant="h3" align="center" fontWeight="bold" gutterBottom>
          Why Choose OwnPay?
        </Typography>
        <Typography variant="h6" align="center" color="text.secondary" paragraph sx={{ mb: 6, maxWidth: 800, mx: 'auto' }}>
          Our payment gateway offers the best features for businesses looking to accept cryptocurrency payments.
        </Typography>

        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: 3,
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
                  }
                }}
                elevation={2}
              >
                <CardContent sx={{ flexGrow: 1, textAlign: 'center', p: 3 }}>
                  <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                  <Typography gutterBottom variant="h5" component="h2" fontWeight="bold">
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Benefits Section */}
      <Box sx={{ bgcolor: 'grey.50', py: { xs: 6, md: 10 } }}>
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h3" fontWeight="bold" gutterBottom>
                Benefits for Your Business
              </Typography>
              <Typography variant="body1" paragraph color="text.secondary" sx={{ mb: 4 }}>
                Integrate our payment gateway and start accepting cryptocurrency payments today.
                Expand your customer base and increase your revenue.
              </Typography>

              <List>
                {benefits.map((benefit, index) => (
                  <ListItem key={index} sx={{ py: 1 }}>
                    <ListItemIcon>
                      <CheckCircleIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText primary={benefit} />
                  </ListItem>
                ))}
              </List>

              {!isAuthenticated && (
                <Button
                  component={RouterLink}
                  to="/register"
                  variant="contained"
                  size="large"
                  endIcon={<ArrowForwardIcon />}
                  sx={{ mt: 2 }}
                >
                  Start Accepting Payments
                </Button>
              )}
            </Grid>

            <Grid item xs={12} md={6}>
              <Box
                component="img"
                src="https://images.unsplash.com/photo-1620321023374-d1a68fbc720d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80"
                alt="Cryptocurrency payments"
                sx={{
                  width: '100%',
                  borderRadius: 4,
                  boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Container maxWidth="md" sx={{ py: { xs: 6, md: 10 } }}>
        <Paper
          sx={{
            p: { xs: 4, md: 6 },
            borderRadius: 4,
            background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%)',
            boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
            textAlign: 'center',
          }}
        >
          <Typography variant="h3" fontWeight="bold" gutterBottom>
            Ready to Get Started?
          </Typography>
          <Typography variant="h6" color="text.secondary" paragraph sx={{ mb: 4, maxWidth: 600, mx: 'auto' }}>
            Join thousands of businesses using OwnPay for their payment needs.
            Set up your account in minutes and start accepting payments today.
          </Typography>

          {!isAuthenticated ? (
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              justifyContent="center"
            >
              <Button
                component={RouterLink}
                to="/register"
                variant="contained"
                size="large"
                sx={{ px: 4, py: 1.5 }}
              >
                Create Account
              </Button>
              <Button
                component={RouterLink}
                to="/login"
                variant="outlined"
                size="large"
                sx={{ px: 4, py: 1.5 }}
              >
                Sign In
              </Button>
            </Stack>
          ) : (
            <Button
              component={RouterLink}
              to="/dashboard"
              variant="contained"
              size="large"
              startIcon={<DashboardIcon />}
              sx={{ px: 4, py: 1.5 }}
            >
              Go to Dashboard
            </Button>
          )}
        </Paper>
      </Container>
    </Layout>
  );
};

export default Home;
