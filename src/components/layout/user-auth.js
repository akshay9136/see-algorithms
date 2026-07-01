import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useState } from 'react';
import {
  Typography,
  Menu,
  MenuItem,
  Avatar,
  Button,
  Divider,
} from '@mui/material';
import { Login, Logout, AccountBalanceWallet } from '@mui/icons-material';
import useCredits from '@/hooks/useCredits';

export default function UserAuth() {
  const { data: session } = useSession();
  const { credits } = useCredits();
  const [anchorEl, setAnchorEl] = useState(null);
  const userMenuOpen = Boolean(anchorEl);
  const router = useRouter();

  if (session?.user) {
    return (
      <>
        <Button
          sx={{ minWidth: 50 }}
          id="user-button"
          onClick={(e) => setAnchorEl(e.currentTarget)}
          color="warning"
          aria-controls={userMenuOpen ? 'user-menu' : undefined}
          aria-expanded={userMenuOpen ? 'true' : undefined}
          aria-haspopup="true"
        >
          <Avatar
            src={session.user.image}
            alt={session.user.name || 'User'}
            sx={{ width: 32, height: 32 }}
          />
        </Button>
        <Menu
          id="user-menu"
          anchorEl={anchorEl}
          open={userMenuOpen}
          onClose={() => setAnchorEl(null)}
          MenuListProps={{ 'aria-labelledby': 'user-button' }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <MenuItem sx={{ pointerEvents: 'none' }}>
            <Typography fontWeight="bold" color="text.secondary">
              {session.user.name}
            </Typography>
          </MenuItem>

          <Divider />

          <MenuItem
            onClick={() => {
              router.push('/buy-credits');
              setAnchorEl(null);
            }}
          >
            <AccountBalanceWallet sx={{ mr: 1 }} color="primary" />
            <Typography>
              AI Credits: <b>{credits !== null ? credits : '...'}</b>
            </Typography>
          </MenuItem>

          <Divider />

          <MenuItem
            onClick={() => {
              signOut({ callbackUrl: '/' });
              setAnchorEl(null);
            }}
          >
            &nbsp;
            <Logout sx={{ mr: 1 }} fontSize="small" />
            Sign out
          </MenuItem>
        </Menu>
      </>
    );
  }

  return (
    <Button
      sx={{ textTransform: 'none', px: 1 }}
      id="signin-button"
      onClick={() => router.push('/auth/signin')}
      variant="outlined"
      color="warning"
    >
      <Login fontSize="small" sx={{ mr: 1 }} />
      <Typography fontWeight="bold">Sign in</Typography>
    </Button>
  );
}
