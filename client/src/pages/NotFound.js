import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Button, Container, Typography } from '@mui/material';
import Layout from '../components/layout/Layout';

const NotFound = () => {
  return (
    <Layout>
      <Container maxWidth="md">
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '50vh',
            textAlign: 'center',
            py: 5
          }}
        >
          <Typography variant="h1" component="h1" gutterBottom>
            404
          </Typography>
          <Typography variant="h4" component="h2" gutterBottom>
            Page Not Found
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            The page you are looking for does not exist or has been moved.
          </Typography>
          <Button
            component={RouterLink}
            to="/"
            variant="contained"
            size="large"
            sx={{ mt: 2 }}
          >
            Go to Home
          </Button>
        </Box>
      </Container>
    </Layout>
  );
};

export default NotFound;
