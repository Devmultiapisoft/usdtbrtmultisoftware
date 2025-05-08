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
              variant="contained"
              size="large"
              startIcon={<PaymentsIcon />}
            >
              Make a Deposit
            </Button>
            <Button
              component={RouterLink}
              to="/transactions"
              variant="contained"
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
          variant="contained"
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
          pt: { xs: 6, sm: 8, md: 12, lg: 14 },
          pb: { xs: 8, sm: 10, md: 14, lg: 16 },
          position: 'relative',
          overflow: 'hidden',
          minHeight: { xs: 'auto', sm: '80vh', md: '85vh', lg: '90vh' },
          display: 'flex',
          alignItems: 'center',
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
            maxWidth: { xs: '120px', sm: '150px', md: '180px' },
            maxHeight: '180px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)',
            animation: 'pulse 12s infinite',
            animationDelay: '2s',
            zIndex: 0
          }}
        />

        <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 2, height: '100%' }}>
          <Grid container spacing={{ xs: 2, sm: 3, md: 4, lg: 6 }} alignItems="center" sx={{ height: '100%' }}>
            <Grid item xs={12} md={6} lg={7} sx={{
              textAlign: { xs: 'center', md: 'left' },
              mb: { xs: 4, md: 0 }
            }}>
              <Typography
                component="h1"
                variant="h2"
                fontWeight="bold"
                gutterBottom
                sx={{
                  fontSize: { xs: '2.2rem', sm: '2.8rem', md: '3.2rem', lg: '4rem' },
                  textShadow: '0 2px 10px rgba(0,0,0,0.2)',
                  mb: { xs: 2, md: 3 },
                  letterSpacing: '-0.02em',
                  lineHeight: { xs: 1.2, md: 1.1 }
                }}
              >
                OwnPay Payment Gateway
              </Typography>
              <Typography
                variant="h5"
                paragraph
                sx={{
                  mb: { xs: 3, md: 4 },
                  opacity: 0.9,
                  fontSize: { xs: '1rem', sm: '1.1rem', md: '1.2rem', lg: '1.4rem' },
                  lineHeight: { xs: 1.5, md: 1.6 },
                  maxWidth: { xs: '100%', md: '90%', lg: '80%' },
                  mx: { xs: 'auto', md: 0 }
                }}
              >
                A secure, fast, and reliable blockchain payment solution for your business.
                Accept USDT payments with ease and manage your transactions in one place.
              </Typography>

              <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: { xs: 'center', md: 'flex-start' }
              }}>
                {renderAuthContent()}

                <Box sx={{
                  mt: { xs: 3, md: 4 },
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: { xs: 1, sm: 1.5, md: 2 },
                  justifyContent: { xs: 'center', md: 'flex-start' }
                }}>
                  <Chip
                    icon={<CheckCircleIcon />}
                    label="Secure"
                    sx={{
                      bgcolor: 'rgba(255,255,255,0.15)',
                      color: 'white',
                      px: { xs: 1, md: 1.5 },
                      py: { xs: 0.5, md: 0.75 },
                      fontSize: { xs: '0.8rem', md: '0.9rem' },
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
                      px: { xs: 1, md: 1.5 },
                      py: { xs: 0.5, md: 0.75 },
                      fontSize: { xs: '0.8rem', md: '0.9rem' },
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
                      px: { xs: 1, md: 1.5 },
                      py: { xs: 0.5, md: 0.75 },
                      fontSize: { xs: '0.8rem', md: '0.9rem' },
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
                      px: { xs: 1, md: 1.5 },
                      py: { xs: 0.5, md: 0.75 },
                      fontSize: { xs: '0.8rem', md: '0.9rem' },
                      backdropFilter: 'blur(5px)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        bgcolor: 'rgba(255,255,255,0.25)',
                        transform: 'translateY(-3px)'
                      }
                    }}
                  />
                </Box>
              </Box>
            </Grid>

            {/* Hero image - visible on all screen sizes with different styling */}
            <Grid item xs={12} md={6} lg={5} sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              <Box sx={{
                position: 'relative',
                width: '100%',
                maxWidth: { xs: '85%', sm: '75%', md: '100%' },
                aspectRatio: '4/3',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: { xs: '-5%', md: '-8%' },
                  left: { xs: '-5%', md: '-8%' },
                  width: { xs: '40%', md: '50%' },
                  height: { xs: '40%', md: '50%' },
                  borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%',
                  background: 'rgba(255,255,255,0.1)',
                  zIndex: -1
                },
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: { xs: '-5%', md: '-8%' },
                  right: { xs: '-5%', md: '-8%' },
                  width: { xs: '40%', md: '50%' },
                  height: { xs: '40%', md: '50%' },
                  borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%',
                  background: 'rgba(255,255,255,0.1)',
                  zIndex: -1
                }
              }}>
                <Box
                  component="img"
                  src="https://images.unsplash.com/photo-1621416894569-0f39ed31d247?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1039&q=80"
                  alt="Cryptocurrency"
                  sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    borderRadius: { xs: 3, sm: 4, md: 5 },
                    boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
                    transform: {
                      xs: 'none',
                      md: 'perspective(1000px) rotateY(-10deg)'
                    },
                    display: 'block',
                    transition: 'all 0.5s ease-in-out',
                    '&:hover': {
                      transform: {
                        xs: 'scale(1.03)',
                        md: 'perspective(1000px) rotateY(-5deg) scale(1.03)'
                      },
                      boxShadow: '0 25px 50px rgba(0,0,0,0.25)'
                    }
                  }}
                />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Box
        sx={{
          py: { xs: 8, sm: 10, md: 12, lg: 16 },
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: { xs: '10%', md: '5%' },
            right: { xs: '-10%', md: '-5%' },
            width: { xs: '200px', sm: '250px', md: '300px', lg: '350px' },
            height: { xs: '200px', sm: '250px', md: '300px', lg: '350px' },
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(25, 118, 210, 0.05) 0%, rgba(25, 118, 210, 0) 70%)',
            zIndex: 0
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: { xs: '10%', md: '5%' },
            left: { xs: '-10%', md: '-5%' },
            width: { xs: '180px', sm: '220px', md: '250px', lg: '300px' },
            height: { xs: '180px', sm: '220px', md: '250px', lg: '300px' },
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(25, 118, 210, 0.05) 0%, rgba(25, 118, 210, 0) 70%)',
            zIndex: 0
          }
        }}
      >
        <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 2 }}>
          <Box sx={{ textAlign: 'center', mb: { xs: 6, sm: 7, md: 8, lg: 10 } }}>
            <Typography
              variant="h3"
              fontWeight="bold"
              gutterBottom
              sx={{
                fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem', lg: '3.5rem' },
                background: 'linear-gradient(90deg, #1976d2 0%, #0d47a1 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                display: 'inline-block',
                mb: { xs: 2, md: 3 }
              }}
            >
              Why Choose OwnPay?
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              paragraph
              sx={{
                mb: 2,
                maxWidth: { xs: '95%', sm: 800, lg: 900 },
                mx: 'auto',
                fontSize: { xs: '0.95rem', sm: '1rem', md: '1.1rem', lg: '1.2rem' },
                lineHeight: 1.6
              }}
            >
              Our payment gateway offers the best features for businesses looking to accept cryptocurrency payments.
            </Typography>
            <Divider sx={{
              width: { xs: '60px', md: '80px', lg: '100px' },
              mx: 'auto',
              borderColor: 'primary.main',
              borderWidth: { xs: 1.5, md: 2, lg: 3 },
              mb: { xs: 4, md: 6, lg: 8 }
            }} />
          </Box>

          <Grid container spacing={{ xs: 2, sm: 3, md: 4, lg: 5 }} justifyContent="center">
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={3} key={index} sx={{
                display: 'flex'
              }}>
                <Card
                  sx={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: { xs: 2, sm: 3, md: 4 },
                    transition: 'all 0.4s ease',
                    overflow: 'hidden',
                    border: '1px solid rgba(0,0,0,0.05)',
                    '&:hover': {
                      transform: 'translateY(-10px)',
                      boxShadow: '0 15px 30px rgba(0,0,0,0.1)',
                      '& .feature-icon': {
                        transform: 'scale(1.1) rotate(5deg)'
                      }
                    }
                  }}
                  elevation={1}
                >
                  <CardContent sx={{
                    flexGrow: 1,
                    textAlign: 'center',
                    p: { xs: 3, sm: 3, md: 4 },
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Box
                      className="feature-icon"
                      sx={{
                        mb: { xs: 2, md: 3 },
                        p: { xs: 1.5, md: 2 },
                        borderRadius: '50%',
                        background: 'rgba(25, 118, 210, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'transform 0.4s ease',
                        width: { xs: '60px', sm: '70px', md: '80px', lg: '90px' },
                        height: { xs: '60px', sm: '70px', md: '80px', lg: '90px' }
                      }}
                    >
                      {React.cloneElement(feature.icon, {
                        sx: {
                          fontSize: { xs: 30, sm: 35, md: 40, lg: 50 },
                          color: 'primary.main'
                        }
                      })}
                    </Box>
                    <Typography
                      gutterBottom
                      variant="h5"
                      component="h2"
                      fontWeight="bold"
                      sx={{
                        mb: { xs: 1, md: 1.5 },
                        fontSize: { xs: '1.2rem', sm: '1.3rem', md: '1.4rem', lg: '1.6rem' }
                      }}
                    >
                      {feature.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        lineHeight: 1.6,
                        fontSize: { xs: '0.85rem', sm: '0.875rem', md: '0.9rem', lg: '1rem' }
                      }}
                    >
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Benefits Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
          py: { xs: 8, sm: 10, md: 12, lg: 16 },
          position: 'relative',
          overflow: 'hidden',
          clipPath: {
            xs: 'polygon(0 2%, 100% 0, 100% 98%, 0 100%)',
            sm: 'polygon(0 3%, 100% 0, 100% 97%, 0 100%)',
            md: 'polygon(0 5%, 100% 0, 100% 95%, 0 100%)'
          }
        }}
      >
        {/* Background pattern */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.03,
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%231976d2' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            zIndex: 0
          }}
        />

        <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
          <Grid container spacing={{ xs: 4, sm: 5, md: 6, lg: 8 }} alignItems="center">
            <Grid item xs={12} md={6} sx={{
              order: { xs: 2, md: 1 }
            }}>
              <Box sx={{
                position: 'relative',
                zIndex: 2,
                p: { xs: 2, sm: 3, md: 4, lg: 5 }
              }}>
                <Typography
                  variant="h3"
                  fontWeight="bold"
                  gutterBottom
                  sx={{
                    fontSize: { xs: '1.8rem', sm: '2.2rem', md: '2.5rem', lg: '3rem' },
                    position: 'relative',
                    display: 'inline-block',
                    mb: { xs: 2, md: 3 },
                    textAlign: { xs: 'center', md: 'left' },
                    width: { xs: '100%', md: 'auto' },
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      bottom: -10,
                      left: { xs: '50%', md: 0 },
                      transform: { xs: 'translateX(-50%)', md: 'none' },
                      width: { xs: '50px', sm: '60px', md: '70px', lg: '80px' },
                      height: { xs: '3px', md: '4px', lg: '5px' },
                      backgroundColor: 'primary.main',
                      borderRadius: '2px'
                    }
                  }}
                >
                  Benefits for Your Business
                </Typography>
                <Typography
                  variant="body1"
                  paragraph
                  color="text.secondary"
                  sx={{
                    mb: { xs: 3, md: 4 },
                    fontSize: { xs: '0.95rem', sm: '1rem', md: '1.1rem', lg: '1.2rem' },
                    lineHeight: 1.6,
                    textAlign: { xs: 'center', md: 'left' }
                  }}
                >
                  Integrate our payment gateway and start accepting cryptocurrency payments today.
                  Expand your customer base and increase your revenue.
                </Typography>

                <List sx={{
                  mb: { xs: 3, md: 4 },
                  mx: { xs: 'auto', md: 0 },
                  maxWidth: { xs: '90%', md: '100%' }
                }}>
                  {benefits.map((benefit, index) => (
                    <ListItem
                      key={index}
                      sx={{
                        py: { xs: 0.75, sm: 1, md: 1.25 },
                        px: 0,
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          transform: 'translateX(5px)',
                          backgroundColor: 'rgba(25, 118, 210, 0.03)',
                          borderRadius: 2
                        }
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: { xs: 36, md: 42 } }}>
                        <CheckCircleIcon
                          color="primary"
                          sx={{
                            fontSize: { xs: 20, sm: 22, md: 24, lg: 28 },
                            filter: 'drop-shadow(0 2px 3px rgba(0,0,0,0.1))'
                          }}
                        />
                      </ListItemIcon>
                      <ListItemText
                        primary={benefit}
                        primaryTypographyProps={{
                          fontWeight: 500,
                          fontSize: { xs: '0.9rem', sm: '0.95rem', md: '1rem', lg: '1.1rem' }
                        }}
                      />
                    </ListItem>
                  ))}
                </List>

                <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                  {!isAuthenticated && (
                    <Button
                      component={RouterLink}
                      to="/register"
                      variant="contained"
                      size="large"
                      endIcon={<ArrowForwardIcon />}
                      sx={{
                        mt: { xs: 1, md: 2 },
                        px: { xs: 3, sm: 4, md: 5 },
                        py: { xs: 1, sm: 1.2, md: 1.5 },
                        fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
                        borderRadius: { xs: 1.5, md: 2 },
                        boxShadow: '0 8px 20px rgba(25, 118, 210, 0.3)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-3px)',
                          boxShadow: '0 12px 25px rgba(25, 118, 210, 0.4)'
                        }
                      }}
                    >
                      Start Accepting Payments
                    </Button>
                  )}
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12} md={6} sx={{
              order: { xs: 1, md: 2 },
              mb: { xs: 2, md: 0 }
            }}>
              <Box sx={{
                position: 'relative',
                maxWidth: { xs: '90%', sm: '85%', md: '100%' },
                mx: 'auto'
              }}>
                {/* Decorative elements */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: { xs: -15, sm: -20, md: -30, lg: -40 },
                    left: { xs: -15, sm: -20, md: -30, lg: -40 },
                    width: { xs: 40, sm: 50, md: 70, lg: 90 },
                    height: { xs: 40, sm: 50, md: 70, lg: 90 },
                    borderRadius: { xs: '8px', md: '12px', lg: '16px' },
                    background: 'rgba(25, 118, 210, 0.1)',
                    transform: 'rotate(30deg)',
                    zIndex: 0,
                    animation: 'float 6s ease-in-out infinite',
                    '@keyframes float': {
                      '0%': { transform: 'rotate(30deg) translate(0, 0)' },
                      '50%': { transform: 'rotate(35deg) translate(-10px, -10px)' },
                      '100%': { transform: 'rotate(30deg) translate(0, 0)' }
                    }
                  }}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: { xs: -15, sm: -20, md: -30, lg: -40 },
                    right: { xs: -15, sm: -20, md: -30, lg: -40 },
                    width: { xs: 35, sm: 45, md: 60, lg: 80 },
                    height: { xs: 35, sm: 45, md: 60, lg: 80 },
                    borderRadius: { xs: '8px', md: '12px', lg: '16px' },
                    background: 'rgba(25, 118, 210, 0.1)',
                    transform: 'rotate(-20deg)',
                    zIndex: 0,
                    animation: 'float2 8s ease-in-out infinite',
                    '@keyframes float2': {
                      '0%': { transform: 'rotate(-20deg) translate(0, 0)' },
                      '50%': { transform: 'rotate(-25deg) translate(10px, 10px)' },
                      '100%': { transform: 'rotate(-20deg) translate(0, 0)' }
                    }
                  }}
                />

                {/* Main image with frame */}
                <Box sx={{
                  position: 'relative',
                  padding: { xs: 2, sm: 3, md: 4 },
                  background: 'white',
                  borderRadius: { xs: 3, sm: 4, md: 5 },
                  boxShadow: '0 15px 35px rgba(0,0,0,0.1)',
                  transform: { md: 'rotate(-2deg)' },
                  transition: 'all 0.5s ease',
                  '&:hover': {
                    transform: { md: 'rotate(0deg) scale(1.02)' },
                    boxShadow: '0 20px 40px rgba(0,0,0,0.15)'
                  }
                }}>
                  <Box
                    component="img"
                    src="https://images.unsplash.com/photo-1620321023374-d1a68fbc720d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80"
                    alt="Cryptocurrency payments"
                    sx={{
                      width: '100%',
                      height: 'auto',
                      borderRadius: { xs: 2, sm: 3, md: 4 },
                      display: 'block'
                    }}
                  />
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box sx={{
        py: { xs: 8, sm: 10, md: 12, lg: 16 },
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'100\' height=\'100\' viewBox=\'0 0 100 100\'%3E%3Cg fill-rule=\'evenodd\'%3E%3Cg fill=\'%231976d2\' fill-opacity=\'0.03\'%3E%3Cpath opacity=\'.5\' d=\'M96 95h4v1h-4v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9zm-1 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9z\'/%3E%3Cpath d=\'M6 5V0H5v5H0v1h5v94h1V6h94V5H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          opacity: 0.8
        }
      }}>
        <Container maxWidth="xl" sx={{ position: 'relative' }}>
          <Paper
            sx={{
              p: { xs: 4, sm: 5, md: 6, lg: 8 },
              borderRadius: { xs: 3, sm: 4, md: 5 },
              background: 'linear-gradient(135deg, #1976d2 0%, #0d47a1 100%)',
              boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
              textAlign: 'center',
              color: 'white',
              overflow: 'hidden',
              position: 'relative',
              maxWidth: { sm: '90%', md: '85%', lg: '80%' },
              mx: 'auto',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'radial-gradient(circle at top right, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 60%)',
                zIndex: 1
              }
            }}
          >
            {/* Decorative elements */}
            <Box
              sx={{
                position: 'absolute',
                top: { xs: -20, sm: -25, md: -30, lg: -40 },
                right: { xs: -20, sm: -25, md: -30, lg: -40 },
                width: { xs: 80, sm: 100, md: 120, lg: 150 },
                height: { xs: 80, sm: 100, md: 120, lg: 150 },
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.1)',
                zIndex: 0
              }}
            />
            <Box
              sx={{
                position: 'absolute',
                bottom: { xs: -30, sm: -35, md: -40, lg: -50 },
                left: { xs: -30, sm: -35, md: -40, lg: -50 },
                width: { xs: 100, sm: 120, md: 150, lg: 180 },
                height: { xs: 100, sm: 120, md: 150, lg: 180 },
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.1)',
                zIndex: 0
              }}
            />

            {/* Floating shapes */}
            <Box
              sx={{
                position: 'absolute',
                top: '15%',
                right: '10%',
                width: { xs: 20, sm: 25, md: 30 },
                height: { xs: 20, sm: 25, md: 30 },
                borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%',
                background: 'rgba(255,255,255,0.2)',
                zIndex: 0,
                animation: 'floatShape 8s ease-in-out infinite',
                '@keyframes floatShape': {
                  '0%': { transform: 'translate(0, 0) rotate(0deg)' },
                  '50%': { transform: 'translate(-15px, -15px) rotate(10deg)' },
                  '100%': { transform: 'translate(0, 0) rotate(0deg)' }
                }
              }}
            />
            <Box
              sx={{
                position: 'absolute',
                bottom: '20%',
                left: '15%',
                width: { xs: 15, sm: 20, md: 25 },
                height: { xs: 15, sm: 20, md: 25 },
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.15)',
                zIndex: 0,
                animation: 'floatShape2 6s ease-in-out infinite',
                '@keyframes floatShape2': {
                  '0%': { transform: 'translate(0, 0)' },
                  '50%': { transform: 'translate(10px, -10px)' },
                  '100%': { transform: 'translate(0, 0)' }
                }
              }}
            />

            <Box sx={{ position: 'relative', zIndex: 2 }}>
              <Typography
                variant="h3"
                fontWeight="bold"
                gutterBottom
                sx={{
                  fontSize: { xs: '1.8rem', sm: '2.2rem', md: '2.8rem', lg: '3.2rem' },
                  textShadow: '0 2px 10px rgba(0,0,0,0.2)',
                  mb: { xs: 1.5, sm: 2, md: 2.5 },
                  letterSpacing: { xs: '-0.01em', md: '-0.02em' }
                }}
              >
                Ready to Get Started?
              </Typography>
              <Typography
                variant="h6"
                paragraph
                sx={{
                  mb: { xs: 3, sm: 4, md: 5 },
                  maxWidth: { xs: '100%', sm: 550, md: 600, lg: 650 },
                  mx: 'auto',
                  opacity: 0.9,
                  fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem', lg: '1.2rem' },
                  lineHeight: 1.6
                }}
              >
                Join thousands of businesses using OwnPay for their payment needs.
                Set up your account in minutes and start accepting payments today.
              </Typography>

              {!isAuthenticated ? (
                <Stack
                  direction={{ xs: 'column', sm: 'row' }}
                  spacing={{ xs: 2, sm: 2.5, md: 3 }}
                  justifyContent="center"
                  sx={{
                    maxWidth: { xs: '100%', sm: '90%', md: '80%' },
                    mx: 'auto'
                  }}
                >
                  <Button
                    component={RouterLink}
                    to="/register"
                    variant="contained"
                    size="large"
                    sx={{
                      px: { xs: 3, sm: 4, md: 5 },
                      py: { xs: 1.2, sm: 1.5, md: 1.8 },
                      fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
                      bgcolor: 'white',
                      color: 'primary.dark',
                      fontWeight: 600,
                      borderRadius: { xs: 1.5, md: 2 },
                      boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        bgcolor: 'rgba(255,255,255,0.9)',
                        transform: 'translateY(-3px)',
                        boxShadow: '0 12px 25px rgba(0,0,0,0.2)'
                      }
                    }}
                  >
                    Create Account
                  </Button>
                  <Button
                    component={RouterLink}
                    to="/login"
                    variant="contained"
                    size="large"
                    sx={{
                      px: { xs: 3, sm: 4, md: 5 },
                      py: { xs: 1.2, sm: 1.5, md: 1.8 },
                      fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
                      borderColor: 'white',
                      borderWidth: 2,
                      color: 'white',
                      borderRadius: { xs: 1.5, md: 2 },
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        borderColor: 'white',
                        bgcolor: 'rgba(255,255,255,0.1)',
                        transform: 'translateY(-3px)'
                      }
                    }}
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
                  startIcon={<DashboardIcon sx={{ fontSize: { xs: 20, md: 24 } }} />}
                  sx={{
                    px: { xs: 3, sm: 4, md: 5 },
                    py: { xs: 1.2, sm: 1.5, md: 1.8 },
                    fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
                    bgcolor: 'white',
                    color: 'primary.dark',
                    fontWeight: 600,
                    borderRadius: { xs: 1.5, md: 2 },
                    boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      bgcolor: 'rgba(255,255,255,0.9)',
                      transform: 'translateY(-3px)',
                      boxShadow: '0 12px 25px rgba(0,0,0,0.2)'
                    }
                  }}
                >
                  Go to Dashboard
                </Button>
              )}
            </Box>
          </Paper>
        </Container>
      </Box>
    </Layout>
  );
};

export default Home;
