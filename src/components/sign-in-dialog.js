import { useState, useContext } from 'react';
import {
  Dialog,
  DialogContent,
  CardContent,
  Typography,
  Box,
  Button,
  Chip,
  Stack,
  Divider,
  CircularProgress,
  IconButton,
} from '@mui/material';
import {
  GitHub,
  Google,
  Close,
  AutoAwesomeOutlined,
  SaveOutlined,
} from '@mui/icons-material';
import { signIn } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import AppContext from '@/common/context';

const benefits = [
  {
    icon: <SaveOutlined sx={{ fontSize: 16 }} color="primary" />,
    label: 'Save progress',
  },
  {
    icon: <AutoAwesomeOutlined sx={{ fontSize: 16 }} color="primary" />,
    label: 'AI summaries',
  },
];

export default function SignInDialog() {
  const { signInOpen, callbackUrl, setContext } = useContext(AppContext);
  const [loading, setLoading] = useState('');

  const handleClose = () => {
    if (document.activeElement instanceof HTMLElement)
      document.activeElement.blur();

    setContext({ signInOpen: false, callbackUrl: '/' });
  };

  const handleSignIn = (providerId) => {
    setLoading(providerId);
    signIn(providerId, { callbackUrl }).catch(() => {
      setLoading('');
    });
  };

  return (
    <Dialog
      open={!!signInOpen}
      onClose={handleClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{ sx: { borderRadius: 2 } }}
    >
      <DialogContent sx={{ p: 0, position: 'relative' }}>
        <IconButton
          onClick={handleClose}
          size="small"
          sx={{ position: 'absolute', top: 8, right: 8, zIndex: 1 }}
          aria-label="Close sign-in dialog"
        >
          <Close fontSize="small" />
        </IconButton>

        <CardContent sx={{ p: 4 }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Image
              src="/logo.png"
              alt="See Algorithms"
              width={200}
              height={40}
              priority
            />
            <Typography
              variant="h5"
              component="h2"
              fontWeight={700}
              gutterBottom
              sx={{ mt: 2 }}
            >
              Sign in
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Deepen your intuition for complex algorithms
            </Typography>
          </Box>

          <Stack spacing={1.5}>
            <Button
              size="large"
              sx={{ textTransform: 'none', gap: 1 }}
              variant="contained"
              onClick={() => handleSignIn('google')}
              disabled={!!loading}
            >
              {loading === 'google' ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                <Google />
              )}
              Continue with Google
            </Button>

            <Divider>
              <Typography
                variant="caption"
                sx={{ color: 'text.disabled', fontWeight: 600 }}
              >
                OR
              </Typography>
            </Divider>

            <Button
              size="large"
              sx={{ textTransform: 'none', gap: 1 }}
              variant="outlined"
              color="inherit"
              onClick={() => handleSignIn('github')}
              disabled={!!loading}
            >
              {loading === 'github' ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                <GitHub />
              )}
              Continue with GitHub
            </Button>
          </Stack>

          <Box
            display="flex"
            justifyContent="center"
            flexWrap="wrap"
            gap={1}
            sx={{ mt: 4 }}
          >
            {benefits.map(({ icon, label }) => (
              <Chip
                key={label}
                icon={icon}
                label={label}
                variant="outlined"
                sx={{ px: 1 }}
              />
            ))}
          </Box>

          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography variant="caption" color="text.secondary">
              By signing in, you agree to our{' '}
              <Link href="/terms">Terms of Service</Link> and{' '}
              <Link href="/privacy">Privacy Policy</Link>
            </Typography>
          </Box>
        </CardContent>
      </DialogContent>
    </Dialog>
  );
}
