import { useState } from 'react';
import { getProviders, signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Chip,
  Stack,
  Divider,
  CircularProgress,
} from '@mui/material';
import {
  GitHub,
  Google,
  ArrowBack,
  AutoAwesomeOutlined,
  SaveOutlined,
} from '@mui/icons-material';
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

export default function SignIn({ providers }) {
  const router = useRouter();
  const [loading, setLoading] = useState(null);
  const callbackUrl = router.query.callbackUrl || '/';

  const handleSignIn = (providerId) => {
    setLoading(providerId);
    signIn(providerId, { callbackUrl });
  };

  return (
    <>
      <NextSeo
        title="Sign In — See Algorithms"
        description="Sign in to See Algorithms to save your progress and track your learning."
        noindex
      />

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
            onClick={() => router.push('/')}
          >
            <ArrowBack fontSize="small" sx={{ mr: 1 }} />
            Back to home
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
                {providers?.google && (
                  <Button
                    variant="outlined"
                    onClick={() => handleSignIn('google')}
                    disabled={!!loading}
                    sx={{ textTransform: 'none', gap: 1 }}
                  >
                    <Google sx={{ fontSize: 20 }} />
                    Continue with Google
                    {loading === 'google' && (
                      <CircularProgress size={16} />
                    )}
                  </Button>
                )}

                <Divider>
                  <Typography
                    variant="caption"
                    sx={{ color: 'text.disabled', fontWeight: 600 }}
                  >
                    OR
                  </Typography>
                </Divider>

                {providers?.github && (
                  <Button
                    variant="outlined"
                    color="inherit"
                    onClick={() => handleSignIn('github')}
                    disabled={!!loading}
                    sx={{ textTransform: 'none', gap: 1 }}
                  >
                    <GitHub sx={{ fontSize: 20 }} />
                    Continue with GitHub
                    {loading === 'github' && (
                      <CircularProgress size={16} />
                    )}
                  </Button>
                )}
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

SignIn.getLayout = (page) => page;

export async function getServerSideProps() {
  const providers = await getProviders();
  return {
    props: { providers },
  };
}
