import { Box, Link, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { memo } from 'react';
import NextLink from 'next/link';

export default memo(function Footer() {
  const { pathname } = useRouter();

  return (
    <Box
      p={4}
      borderTop={1}
      borderColor="divider"
      display="flex"
      flexWrap="wrap"
      justifyContent="space-around"
      alignItems="center"
      gap={2}
    >
      <Typography variant="body2" color="text.secondary">
        © 2025 See Algorithms. Code licensed under{' '}
        <Link
          href="https://opensource.org/licenses/MIT"
          target="_blank"
          rel="noopener noreferrer"
          color="inherit"
          underline="hover"
        >
          MIT
        </Link>
        , content under{' '}
        <Link
          href="https://creativecommons.org/licenses/by-nc/4.0/"
          target="_blank"
          rel="noopener noreferrer"
          color="inherit"
          underline="hover"
        >
          CC BY-NC 4.0
        </Link>
      </Typography>

      <Box display="flex" gap={2} flexWrap="wrap">
        <Link variant="body2" component={NextLink} href="/about">
          About
        </Link>

        <Link variant="body2" component={NextLink} href="/contact">
          Contact Us
        </Link>

        <Link variant="body2" component={NextLink} href="/privacy">
          Privacy Policy
        </Link>

        <Link variant="body2" component={NextLink} href="/terms">
          Terms of Service
        </Link>

        {pathname === '/buy-credits' && (
          <Link variant="body2" component={NextLink} href="/refund-policy">
            Refund Policy
          </Link>
        )}

        <Link
          variant="body2"
          href="https://github.com/sponsors/akshay9136"
          target="_blank"
          rel="noopener noreferrer"
        >
          Sponsor
        </Link>
      </Box>
    </Box>
  );
});
