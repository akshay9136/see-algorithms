import { memo } from 'react';
import { useRouter } from 'next/router';
import { Box, Typography } from '@mui/material';
import Link from 'next/link';

export default memo(function Footer() {
  const { pathname } = useRouter();

  return (
    <Box
      p={3}
      borderTop={1}
      borderColor="divider"
      display="flex"
      flexWrap="wrap"
      justifyContent="space-around"
      alignItems="center"
      gap={2}
    >
      <Typography variant="body2" color="text.secondary" lineHeight={1.6}>
        © 2025 See Algorithms. Code licensed under{' '}
        <Link
          href="https://opensource.org/licenses/MIT"
          target="_blank"
          rel="noopener noreferrer"
        >
          MIT
        </Link>
        , content under{' '}
        <Link
          href="https://creativecommons.org/licenses/by-nc/4.0/"
          target="_blank"
          rel="noopener noreferrer"
        >
          CC BY-NC 4.0
        </Link>
      </Typography>

      <Box display="flex" gap={2} flexWrap="wrap">
        <Typography
          variant="body2"
          color="text.primary"
          component={Link}
          href="/contact"
        >
          Contact Us
        </Typography>

        <Typography
          variant="body2"
          color="text.primary"
          component={Link}
          href="/privacy"
        >
          Privacy Policy
        </Typography>

        <Typography
          variant="body2"
          color="text.primary"
          component={Link}
          href="/terms"
        >
          Terms of Service
        </Typography>

        {pathname === '/buy-credits' && (
          <Typography
            variant="body2"
            color="text.primary"
            component={Link}
            href="/refund-policy"
          >
            Refund Policy
          </Typography>
        )}

        <Typography
          variant="body2"
          component={Link}
          color="text.primary"
          href="https://github.com/sponsors/akshay9136"
          target="_blank"
          rel="noopener noreferrer"
        >
          Sponsor
        </Typography>
      </Box>
    </Box>
  );
});
