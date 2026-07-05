import { useState } from 'react';
import { useRouter } from 'next/router';
import { signIn } from 'next-auth/react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Chip,
  Stack,
  Divider,
} from '@mui/material';
import {
  GitHub,
  Google,
  ArrowBack,
  AutoAwesomeOutlined,
  SaveOutlined,
} from '@mui/icons-material';
import { Spinner } from '@/components/common';
import { NextSeo } from 'next-seo';
import Image from 'next/image';
import Link from 'next/link';

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

export default function SignIn() {
  const router = useRouter();
  const [loading, setLoading] = useState('');
  const { callbackUrl = '/' } = router.query;

  const handleSignIn = (providerId) => {
    setLoading(providerId);
    signIn(providerId, { callbackUrl }).catch(() => {
      setLoading('');
    });
  };

  return (
    <>
      <NextSeo
        title="Sign In — See Algorithms"
        description="Sign in to See Algorithms to save your progress and track your learning."
        noindex
      />
      <Spinner spinning={!!loading} />

      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: '#f8fbff',
          padding: 4,
        }}
      >
        <Box sx={{ width: '100%', maxWidth: 440 }}>
          <Button
            color="inherit"
            sx={{ textTransform: 'none', mb: 1 }}
            onClick={() => router.push(callbackUrl)}
          >
            <ArrowBack fontSize="small" sx={{ mr: 1 }} />
            Back
          </Button>

          <Card elevation={3} sx={{ borderRadius: 2 }}>
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
                  component="h1"
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
                  variant="outlined"
                  onClick={() => handleSignIn('google')}
                >
                  <Google /> Continue with Google
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
                >
                  <GitHub /> Continue with GitHub
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
          </Card>
        </Box>
      </Box>
    </>
  );
}

SignIn.noLayout = true;
