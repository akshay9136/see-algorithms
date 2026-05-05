import { useState } from 'react';
import { useRouter } from 'next/router';
import { useSession, signOut } from 'next-auth/react';
import { Typography, Menu, MenuItem, Avatar, Button } from '@mui/material';
import { Bolt, Login, Logout } from '@mui/icons-material';

export default function UserAuth() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [userAnchorEl, setUserAnchorEl] = useState(null);
  const userMenuOpen = Boolean(userAnchorEl);
  console.log(session);

  const openUserMenu = (event) => {
    setUserAnchorEl(event.currentTarget);
  };

  const closeUserMenu = () => {
    setUserAnchorEl(null);
  };

  if (status === 'authenticated' && session?.user) {
    return (
      <>
        <Button
          id="user-button"
          onClick={openUserMenu}
          color="warning"
          aria-controls={userMenuOpen ? 'user-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={userMenuOpen ? 'true' : undefined}
        >
          <Avatar
            src={session.user.image}
            alt={session.user.name || 'User'}
            sx={{ width: 32, height: 32, mr: 0.5 }}
          />
          <Bolt /> <Typography fontWeight="bold">1000</Typography>
        </Button>
        <Menu
          id="user-menu"
          anchorEl={userAnchorEl}
          open={userMenuOpen}
          onClose={closeUserMenu}
          MenuListProps={{ 'aria-labelledby': 'user-button' }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <MenuItem sx={{ pointerEvents: 'none', opacity: 0.7 }}>
            <Typography fontWeight="bold">
              {session.user.name}
            </Typography>
          </MenuItem>
          <MenuItem
            onClick={() => {
              signOut({ callbackUrl: '/' });
              closeUserMenu();
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
        id="signin-button"
        onClick={() => router.push('/auth/signin')}
        variant="outlined"
        color="warning"
        sx={{ textTransform: 'none', px: 1 }}
      >
        <Login fontSize="small" sx={{ mr: 1 }} />
        <Typography fontWeight="bold">Sign in</Typography>
      </Button>
    );
  }

  return null;
}
