import { useState } from 'react';
import { useRouter } from 'next/router';
import { useSession, signOut } from 'next-auth/react';
import { Typography, Menu, MenuItem, Avatar, Button } from '@mui/material';
import { Login, Logout } from '@mui/icons-material';

export default function UserAuth() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [anchorEl, setAnchorEl] = useState(null);
  const userMenuOpen = Boolean(anchorEl);

  if (session?.user) {
    return (
      <>
        <Button
          sx={{ minWidth: 50 }}
          id="user-button"
          onClick={(e) => {
            setAnchorEl(e.currentTarget);
          }}
          color="warning"
          aria-controls={userMenuOpen ? 'user-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={userMenuOpen ? 'true' : undefined}
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
          <MenuItem sx={{ pointerEvents: 'none', opacity: 0.7 }}>
            <Typography fontWeight="bold">{session.user.name}</Typography>
          </MenuItem>
          <MenuItem
            onClick={() => {
              signOut({ callbackUrl: '/' });
              setAnchorEl(null);
            }}
          >
            <Logout sx={{ mr: 1 }} fontSize="small" />
            Sign out
          </MenuItem>
        </Menu>
      </>
    );
  }

  if (status !== 'loading') {
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

  return null;
}
