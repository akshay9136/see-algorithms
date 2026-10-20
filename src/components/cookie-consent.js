import { useState, useEffect } from 'react';
import { setAnalyticsConsent } from '@/common/analytics';
import {
  Alert,
  Box,
  Button,
  IconButton,
  Snackbar,
  Typography,
} from '@mui/material';
import { Cookie, Close } from '@mui/icons-material';

export default function CookieConsent() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let hasConsented;
    try {
      hasConsented = localStorage.getItem('analyticsConsent');
    } catch {
      /* Storage is unavailable. */
    }
    if (!hasConsented) setOpen(true);

    const reopen = () => setOpen(true);
    window.addEventListener('open-analytics-settings', reopen);
    return () => {
      window.removeEventListener('open-analytics-settings', reopen);
    };
  }, []);

  const handleAccept = () => {
    setAnalyticsConsent(true);
    setOpen(false);
  };

  const handleDecline = () => {
    setAnalyticsConsent(false);
    setOpen(false);
  };

  const handleClose = () => setOpen(false);

  return (
    <Snackbar
      open={open}
      sx={{ width: '100%', maxWidth: 500, left: 0, bottom: 0 }}
    >
      <Alert
        severity="success"
        icon={<Cookie fontSize="small" />}
        sx={{
          padding: 1.5,
          '& .MuiAlert-icon': { m: 0.5 },
          '& .MuiAlert-message': { p: 1 },
        }}
      >
        <Box display="flex" alignItems="start" gap={1}>
          <Box>
            <Typography variant="body2" fontWeight={600} gutterBottom>
              We use cookies to enhance your experience
            </Typography>
            <Typography variant="body2">
              Allow Google Analytics to measure how visualizations and learning
              features are used. Declining keeps optional analytics disabled.
            </Typography>
          </Box>
          <IconButton
            aria-label="Dismiss analytics notice"
            size="small"
            onClick={handleClose}
            sx={{ p: 0 }}
          >
            <Close fontSize="small" />
          </IconButton>
        </Box>
        <Box display="flex" justifyContent="flex-end" gap={1} mt={2}>
          <Button
            size="small"
            color="inherit"
            onClick={handleDecline}
            sx={{ px: 2, textTransform: 'none' }}
          >
            Decline
          </Button>
          <Button
            variant="contained"
            size="small"
            color="success"
            onClick={handleAccept}
            sx={{ px: 2, textTransform: 'none' }}
          >
            Accept
          </Button>
        </Box>
      </Alert>
    </Snackbar>
  );
}
