import React, { useState, useEffect } from 'react';
import { Snackbar, Alert, Button, Box, Typography, Link } from '@mui/material';
import { Cookie, Close } from '@mui/icons-material';

export default function CookieConsent() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Check if user has already consented
    const hasConsented = localStorage.getItem('cookieConsent');
    if (!hasConsented) {
      setOpen(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    setOpen(false);
  };

  const handleDecline = () => {
    localStorage.setItem('cookieConsent', 'declined');
    setOpen(false);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Snackbar
      open={open}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      sx={{
        '& .MuiSnackbarContent-root': {
          maxWidth: '600px',
          width: '100%',
        },
      }}
    >
      <Alert
        severity="info"
        icon={<Cookie />}
        action={
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <Button
              color="inherit"
              size="small"
              onClick={handleDecline}
              sx={{ minWidth: 'auto', px: 1 }}
            >
              Decline
            </Button>
            <Button
              color="inherit"
              size="small"
              onClick={handleAccept}
              variant="contained"
              sx={{ minWidth: 'auto', px: 2 }}
            >
              Accept
            </Button>
            <Button
              color="inherit"
              size="small"
              onClick={handleClose}
              sx={{ minWidth: 'auto', px: 1 }}
            >
              <Close fontSize="small" />
            </Button>
          </Box>
        }
        sx={{
          width: '100%',
          '& .MuiAlert-message': {
            width: '100%',
          },
        }}
      >
        <Box>
          <Typography variant="body2" fontWeight={600} gutterBottom>
            We use cookies to enhance your experience
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            This website uses cookies to display relevant ads through Google
            AdSense. By continuing to use this site, you consent to our use of
            cookies.
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Learn more in our{' '}
            <Link href="/privacy" color="inherit" underline="hover">
              Privacy Policy
            </Link>{' '}
            and{' '}
            <Link href="/terms" color="inherit" underline="hover">
              Terms of Service
            </Link>
            .
          </Typography>
        </Box>
      </Alert>
    </Snackbar>
  );
}
