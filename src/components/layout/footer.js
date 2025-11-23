import { Box, Typography } from '@mui/material';
import Link from 'next/link';

function Footer() {
  return (
    <Box p={2} borderTop={1} borderColor="divider">
      <Typography variant="body2" color="text.secondary" textAlign="center">
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
        .
      </Typography>
    </Box>
  );
}

export default Footer;
